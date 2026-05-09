import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initNotifications } from './src/services/notifications';

function App() {
  useEffect(() => {
    initNotifications().catch(e => console.log('Notif error:', e));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

export default App;
