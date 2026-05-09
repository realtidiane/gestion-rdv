import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';

export const requestPermission = async () => {
  await notifee.requestPermission();
};

export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'rappels',
    name: 'Rappels RDV',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const scheduleRappel = async (
  id: number,
  serviceNom: string,
  dateRdv: string,
  heureRdv: string,
  minutesAvant: number = 30
) => {
  try {
    // Parser la date et l'heure séparément pour éviter les problèmes de timezone
    const [year, month, day] = dateRdv.split('-').map(Number);
    const [hour, minute] = heureRdv.split(':').map(Number);
    
    // Créer la date avec le fuseau horaire local
    const rdvDate = new Date(year, month - 1, day, hour, minute, 0, 0);
    console.log('RDV date:', rdvDate.toString());
    console.log('Now:', new Date().toString());
    
    // Soustraire les minutes de rappel
    const rappelDate = new Date(rdvDate.getTime() - minutesAvant * 60 * 1000);
    console.log('Rappel date:', rappelDate.toString());
    
    // Si le rappel est déjà passé, ne pas programmer
    if (rappelDate.getTime() <= Date.now()) {
      console.log('Rappel déjà passé, pas de notification');
      return;
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: rappelDate.getTime(),
    };

    console.log('Scheduling notification for:', new Date(trigger.timestamp).toString());

    await notifee.createTriggerNotification(
      {
        id: `rdv-${id}`,
        title: 'Rappel RDV',
        body: `Votre rendez-vous "${serviceNom}" est prévu à ${heureRdv}`,
        android: {
          channelId: 'rappels',
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
    },
    trigger
    );
    console.log('Notification scheduled!');
  } catch (e) {
    console.log('Error scheduling notification:', e);
  }
};

export const cancelRappel = async (rdvId: number) => {
  await notifee.cancelNotification(`rdv-${rdvId}`);
};

export const sendImmediateNotification = async (title: string, body: string) => {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'rappels',
      importance: AndroidImportance.HIGH,
    },
  });
};

export const initNotifications = async () => {
  await requestPermission();
  await createNotificationChannel();
};