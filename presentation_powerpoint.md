# PRÉSENTATION PROJET - GESTION DE RENDEZ-VOUS

---

## SLIDE 1: TITRE

# Application Mobile de Gestion de Rendez-vous
### Solution complète pour établissement sanitaire

**Développé par :** [Votre Nom]
**Date :** Mai 2026

---

## SLIDE 2: CONTEXTE ET OBJECTIFS

### Contexte du projet
- Besoin d'une solution de prise de rendez-vous pour un établissement sanitaire
- Application mobile pour les clients
- Interface d'administration pour la gestion

### Objectifs pédagogiques
- Développer une solution complète frontend + backend + API + base de données + APK Android
- Maîtriser React Native, Node.js, PostgreSQL

---

## SLIDE 3: ARCHITECTURE DU PROJET

### Structure technique

**Backend (Node.js/Express)**
- API REST avec Express.js
- Base de données PostgreSQL
- Authentification JWT

**Application Mobile (React Native)**
- Frontend React Native CLI
- Navigation React Navigation
- Notifications locales avec Notifee

---

## SLIDE 4: TECHNOS UTILISÉES

### Backend
- Node.js + Express
- PostgreSQL + pg
- JWT + bcrypt
- Swagger pour la documentation

### Mobile
- React Native CLI 0.85.3
- React Navigation 7.x
- Axios, AsyncStorage
- Notifee (notifications)

---

## SLIDE 5: BASE DE DONNÉES

### Schéma relationnel

**3 Tables principales :**
- **users** : id, nom, prenom, email, password, telephone, photo, role
- **services** : id, nom, description, duree, prix
- **rendezvous** : id, user_id, service_id, date_rdv, heure_rdv, statut, commentaire

**Statuts RDV :** en_attente → confirmé / annulé → terminé

---

## SLIDE 6: API REST - ENDPOINTS

### Routes d'authentification
- POST /api/auth/register → Inscription
- POST /api/auth/login → Connexion
- POST /api/auth/logout → Déconnexion

### Routes services
- GET /api/services → Liste services
- POST/PUT/DELETE /api/services/:id → CRUD (Admin)

---

## SLIDE 7: API REST - SUITE

### Routes utilisateurs
- GET/PUT /api/users/profile → Mon profil
- GET/PUT/DELETE /api/users/admin/users → Gestion users (Admin)

### Routes rendez-vous
- POST/GET /api/rendezvous → Créer/lister mes RDV
- PUT/DELETE /api/rendezvous/:id → Modifier/annuler RDV
- GET/PUT/DELETE /api/rendezvous/admin/* → Gestion admin

---

## SLIDE 8: FONCTIONNALITÉS CLIENT

### Application mobile client
✅ Inscription / Connexion
✅ Prise de rendez-vous
✅ Sélection service, date, heure
✅ Historique des rendez-vous
✅ Modification du profil
✅ Photo de profil
✅ Notifications de confirmation

---

## SLIDE 9: FONCTIONNALITÉS ADMIN

### Interface d'administration
✅ Gestion des services (CRUD)
✅ Validation des rendez-vous
✅ Confirmation / Annulation
✅ Gestion des utilisateurs
✅ Promotion admin
✅ Notifications immédiates
✅ Rappels 30min avant

---

## SLIDE 10: SYSTÈME DE NOTIFICATIONS

### Types de notifications

**1. Notification immédiate**
- Lors de la confirmation par l'admin
- "Votre RDV a été confirmé"

**2. Rappel programmé**
- 30 minutes avant l'heure du RDV
- Notification locale avec Notifee

**3. Annulation**
- Notification quand l'admin annule

---

## SLIDE 11: SÉCURITÉ

### Mesures de sécurité

✅ **Authentification JWT**
- Tokens signés et expirables
- Stockage sécurisé côté mobile

✅ **Hachage bcrypt**
- Mots de passe cryptés avec salt

✅ **Middleware d'autorisation**
- Vérification du rôle admin
- Protection des routes sensibles

---

## SLIDE 12: INTERFACE MOBILE

### Écrans客户端 (Client)
- Écran de connexion
- Écran d'inscription
- Liste des rendez-vous
- Nouveau rendez-vous
- Détail du RDV
- Profil utilisateur

---

## SLIDE 13: INTERFACE ADMIN

### Écrans管理员 (Admin)
- Liste des services
- Création/modification service
- Tous les rendez-vous
- Confirmation/annulation
- Gestion utilisateurs
- Promotion/rétrogradation admin

---

## SLIDE 14: DÉMO - CONNEXION

### Démonstration

[Capture d'écran de l'écran de connexion]

**Points clés :**
- Design épuré
- Champs email + mot de passe
- Lien vers inscription

---

## SLIDE 15: DÉMO - CRÉATION RDV

### Démonstration

[Capture d'écran de création de RDV]

**Points clés :**
- Liste des services médicaux
- Prix en Francs CFA
- Sélecteur date/heure
- Commentaire optionnel

---

## SLIDE 16: DÉMO - INTERFACE ADMIN

### Démonstration

[Capture d'écran de l'interface admin]

**Points clés :**
- Onglets Services / RDV / Utilisateurs
- Confirmation avec notification
- Gestion centralisée

---

## SLIDE 17: DÉPLOIEMENT

### Instructions

**Backend :**
```
cd rdv-backend
npm install
node server.js
```

**Application Mobile :**
```
cd RdvApp
npm install
npx react-native run-android
```

**APK généré :** android/app/build/outputs/apk/debug/

---

## SLIDE 18: CONCLUSION

### Résumé du projet

✅ API REST complète avec Express + PostgreSQL
✅ Application React Native fonctionnelle
✅ Système de notifications intégré
✅ Interface admin complète
✅ Documentation Swagger disponible
✅ APK Android générable

**Ce projet démontre la maîtrise de :**
- Développement backend Node.js
- Base de données relationnelle
- Application mobile React Native
- Authentification et sécurité

---

## SLIDE 19: QUESTIONS

# MERCI POUR VOTRE ATTENTION

## Des questions ?

---

## SLIDE 20: ANNEXE

### Accès à la documentation

**Swagger API :** http://localhost:5000/api-docs

**Documentation technique :** voir fichier rapport_projet.md

**Contact :** odus@gmail.com