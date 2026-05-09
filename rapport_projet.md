# RAPPORT TECHNIQUE - PROJET GESTION DE RENDEZ-VOUS

## TABLE DES MATIÈRES
1. [Préambule](#préambule)
2. [Architecture du Projet](#architecture-du-projet)
3. [Backend - API REST](#backend---api-rest)
   3.1 [Documentation Swagger](#documentation-swagger)
4. [Base de Données](#base-de-données)
5. [Application Mobile React Native](#application-mobile-react-native)
6. [Fonctionnalités Implémentées](#fonctionnalités-implémentées)
7. [Gestion des Notifications](#gestion-des-notifications)
8. [Sécurité](#sécurité)
9. [Tests et Validation](#tests-et-validation)
10. [Instructions de Déploiement](#instructions-de-déploiement)

---

## 1. PRÉAMBULE

Ce projet est une solution complète de gestion de rendez-vous pour un établissement sanitaire/médical. Il comprend un backend API REST avec base de données PostgreSQL, et une application mobile React Native permettant aux clients de prendre des rendez-vous et aux administrateurs de gérer les services et rendez-vous.

### 1.1 Objectifs du Projet
- Permettre aux clients de prendre des rendez-vous pour des services médicaux
- Permettre aux administrateurs de gérer les services, utilisateurs et rendez-vous
- Envoyer des rappels automatiques avant les rendez-vous
- Gérer automatiquement les rendez-vous expirés

---

## 2. ARCHITECTURE DU PROJET

### 2.1 Structure des Dossiers

```
Devmobile/
├── rdv-backend/              # Backend API REST
│   ├── config/
│   │   ├── database.js       # Connexion PostgreSQL
│   │   └── swagger.js        # Documentation Swagger
│   ├── controllers/
│   │   ├── authController.js # Authentification
│   │   ├── userController.js # Gestion utilisateurs
│   │   ├── rdvController.js  # Gestion rendez-vous
│   │   └── serviceController.js (inclus dans routes)
│   ├── middlewares/
│   │   ├── authMiddleware.js # Vérification JWT
│   │   └── adminMiddleware.js # Vérification rôle admin
│   ├── routes/
│   │   ├── authRoutes.js     # Routes authentification
│   │   ├── userRoutes.js     # Routes utilisateurs
│   │   ├── rdvRoutes.js      # Routes rendez-vous
│   │   └── serviceRoutes.js # Routes services
│   ├── server.js             # Point d'entrée Express
│   ├── package.json
│   └── .env                  # Variables d'environnement
│
├── RdvApp/                   # Application Mobile React Native
│   ├── src/
│   │   ├── services/
│   │   │   ├── api.js        # Configuration Axios
│   │   │   └── notifications.js # Gestion notifications
│   │   ├── context/
│   │   │   └── AuthContext.js # Contexte authentification
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── NewRdvScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   ├── RdvDetailScreen.js
│   │   │   ├── AdminServicesScreen.js
│   │   │   ├── AdminRdvsScreen.js
│   │   │   └── AdminUsersScreen.js
│   │   └── navigation/
│   │       └── AppNavigator.js
│   ├── App.tsx               # Point d'entrée
│   └── package.json
│
└── rapport_projet.md         # Ce document
```

### 2.2 Technologies Utilisées

#### Backend
- **Runtime** : Node.js
- **Framework** : Express.js 5.2.1
- **Base de données** : PostgreSQL (pg 8.20.0)
- **Authentification** : JWT (jsonwebtoken 9.0.3)
- **Sécurité** : bcrypt 6.0.0
- **CORS** : cors 2.8.6
- **Documentation API** : swagger-ui-express, swagger-jsdoc

#### Mobile
- **Framework** : React Native CLI 0.85.3
- **Navigation** : React Navigation 7.x
  - @react-navigation/native
  - @react-navigation/native-stack
  - @react-navigation/bottom-tabs
- **HTTP Client** : Axios 1.16.0
- **Stockage local** : AsyncStorage 1.23.1
- **Notifications** : @notifee/react-native 9.1.0
- **Sélecteur d'images** : react-native-image-picker 7.1.0
- **Date/Time Picker** : @react-native-community/datetimepicker 9.1.0
- **Icônes** : react-native-vector-icons 10.3.0

---

## 3. BACKEND - API REST

### 3.1 Point d'Entrée (server.js)

L'application Express écoute sur le port 5000 (défaut) ou le port défini dans la variable d'environnement PORT.

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
```

### 3.2 Routes API

#### 3.2.1 Authentication (`/api/auth`)

| Méthode | Route | Description | Protection |
|--------|-------|-------------|------------|
| POST | `/register` | Inscription utilisateur | Publique |
| POST | `/login` | Connexion utilisateur | Publique |
| POST | `/logout` | Déconnexion | JWT |

**Payload Inscription :**
```json
{
  "nom": "Nom",
  "prenom": "Prénom",
  "email": "email@exemple.com",
  "password": "motdepasse",
  "telephone": "771234567"
}
```

**Payload Connexion :**
```json
{
  "email": "email@exemple.com",
  "password": "motdepasse"
}
```

**Réponse Connexion :**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "nom": "Nom",
    "prenom": "Prénom",
    "email": "email@exemple.com",
    "role": "client"
  }
}
```

#### 3.2.2 Utilisateurs (`/api/users`)

| Méthode | Route | Description | Protection |
|--------|-------|-------------|------------|
| GET | `/profile` | Obtenir profil utilisateur | JWT |
| PUT | `/profile` | Modifier profil utilisateur | JWT |
| GET | `/admin/users` | Liste tous les utilisateurs | JWT + Admin |
| PUT | `/admin/users/:id/role` | Modifier rôle utilisateur | JWT + Admin |
| DELETE | `/admin/users/:id` | Supprimer utilisateur | JWT + Admin |

#### 3.2.3 Services (`/api/services`)

| Méthode | Route | Description | Protection |
|--------|-------|-------------|------------|
| GET | `/` | Liste des services | JWT |
| POST | `/` | Créer un service | JWT + Admin |
| PUT | `/:id` | Modifier un service | JWT + Admin |
| DELETE | `/:id` | Supprimer un service | JWT + Admin |

#### 3.2.4 Rendez-vous (`/api/rendezvous`)

| Méthode | Route | Description | Protection |
|--------|-------|-------------|------------|
| POST | `/` | Créer un RDV | JWT |
| GET | `/` | Liste mes RDV | JWT |
| GET | `/:id` | Détail RDV | JWT |
| PUT | `/:id` | Modifier RDV (client) | JWT |
| DELETE | `/:id` | Supprimer RDV (client) | JWT |
| GET | `/admin/all` | Tous les RDV | JWT + Admin |
| PUT | `/admin/:id/statut` | Confirmer/annuler RDV | JWT + Admin |
| DELETE | `/admin/:id` | Supprimer RDV (admin) | JWT + Admin |

**Payload Création RDV :**
```json
{
  "service_id": 1,
  "date_rdv": "2026-05-15",
  "heure_rdv": "14:30:00",
  "commentaire": "Premier rendez-vous"
}
```

### 3.3 Middlewares

#### 3.3.1 AuthMiddleware (authMiddleware.js)
Vérifie la présence et la validité du token JWT dans les requêtes protégées.

```javascript
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
```

#### 3.3.2 AdminMiddleware (adminMiddleware.js)
Vérifie que l'utilisateur a le rôle admin.

```javascript
module.exports = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Accès refusé. Réservé aux administrateurs.",
    });
  }
  next();
};
```

### 3.4 Documentation Swagger

La documentation interactive est accessible à l'adresse : `http://localhost:5000/api-docs`

---

## 4. BASE DE DONNÉES

### 4.1 Schéma des Tables

#### 4.1.1 Table Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    photo VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.1.2 Table Services
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    duree INT,
    prix DECIMAL(10,2)
);
```

#### 4.1.3 Table Rendez-vous
```sql
CREATE TABLE rendezvous (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    service_id INT REFERENCES services(id),
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_attente',
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Statuts des Rendez-vous
- `en_attente` : En attente de confirmation par l'administrateur
- `confirme` : Confirmé par l'administrateur
- `annule` : Annulé (par admin ou automatiquement)

### 4.3 Services Sanitaires par Défaut

| ID | Service | Description | Durée (min) | Prix (Fcfa) |
|----|----------|-------------|-------------|-------------|
| 1 | Consultation médicale | Consultation générale avec un médecin | 30 | 32 800 |
| 2 | Analyse de sang | Prise de sang pour analyse sanguine | 15 | 16 400 |
| 3 | Vaccination | Injection de vaccins | 15 | 19 700 |
| 4 | Radiographie | Examens radiographiques | 30 | 52 500 |
| 5 | Consultation spécialisé | Consultation avec un spécialiste | 45 | 52 500 |
| 6 | Soins infirmiers | Pansements, injections, perfusions | 30 | 23 000 |
| 7 | Bilan de santé | Examen complet de santé | 60 | 78 700 |
| 8 | Téléconsultation | Consultation à distance | 20 | 26 200 |

### 4.4 Utilisateur Admin par Défaut

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| odus@gmail.com | Nimda123 | admin |

---

## 5. APPLICATION MOBILE REACT NATIVE

### 5.1 Configuration API (api.js)

L'application mobile communique avec le backend via Axios. L'URL de base est configurée pour l'émulateur Android (`10.0.2.2`) ou l'IP locale (`192.168.1.2`) pour les appareils réels.

```javascript
const API = axios.create({
  baseURL: 'http://192.168.1.2:5000/api',
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 5.2 Authentification (AuthContext.js)

Le contexte d'authentification gère :
- Le stockage du token JWT dans AsyncStorage
- Le stockage des informations utilisateur
- La vérification du statut de connexion au démarrage

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (token, userData) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };
};
```

### 5.3 Navigation

L'application utilise deux types de navigation :
- **Stack Navigator** : Pour la navigation entre les écrans
- **Bottom Tab Navigator** : Pour les onglets principaux

#### 5.3.1 Navigation Client
- Accueil (HomeScreen)
- Nouveau RDV (NewRdvScreen)
- Détail RDV (RdvDetailScreen)
- Profil (ProfileScreen)

#### 5.3.2 Navigation Admin
- Services (AdminServicesScreen)
- Rendez-vous (AdminRdvsScreen)
- Utilisateurs (AdminUsersScreen)
- Profil (ProfileScreen)

### 5.4 Écrans de l'Application

#### 5.4.1 LoginScreen.js
- Formulaire de connexion avec email et mot de passe
- Gestion des erreurs
- Navigation vers l'inscription

#### 5.4.2 RegisterScreen.js
- Formulaire d'inscription (nom, prénom, email, téléphone, mot de passe)
- Validation et gestion des erreurs

#### 5.4.3 HomeScreen.js
- Liste des rendez-vous de l'utilisateur
- Affichage du statut (en_attente, confirmé, terminé, annulé)
- Bouton flottant pour créer un nouveau RDV
- Navigation vers le détail du RDV

#### 5.4.4 NewRdvScreen.js
- Liste des services disponibles (avec prix en Fcfa)
- Sélecteur de date et d'heure
- Champ commentaire optionnel
- Validation avant soumission

#### 5.4.5 ProfileScreen.js
- Affichage de la photo de profil
- Informations utilisateur (nom, prénom, email, téléphone, rôle)
- Modification du profil (nom, prénom, téléphone, photo)
- Bouton de déconnexion

#### 5.4.6 RdvDetailScreen.js
- Détails complets du RDV
- Affichage du service, date, heure, statut
- Bouton pour annuler le RDV

#### 5.4.7 AdminServicesScreen.js
- Liste des services avec CRUD complet
- Modal pour créer/modifier un service (nom, description, durée, prix)
- Suppression de services

#### 5.4.8 AdminRdvsScreen.js
- Liste de tous les rendez-vous
- Affichage des informations client et service
- Boutons pour confirmer ou annuler un RDV
- Suppression de RDV
- Notifications immédiates et rappels programmés

#### 5.4.9 AdminUsersScreen.js
- Liste de tous les utilisateurs
- Promotion/rétrogradation du rôle admin
- Suppression d'utilisateurs

---

## 6. FONCTIONNALITÉS implémentées

### 6.1 Fonctionnalités Client

| Fonctionnalité | Statut | Description |
|----------------|--------|-------------|
| Inscription | ✅ | Création de compte avec nom, prénom, email, téléphone, mot de passe |
| Connexion | ✅ | Authentification avec JWT |
| Déconnexion | ✅ | Suppression du token et déconnexion |
| Prise de RDV | ✅ | Création de rendez-vous avec choix service, date, heure, commentaire |
| Liste mes RDV | ✅ | Affichage de tous les RDV de l'utilisateur |
| Détail RDV | ✅ | Consultation du détail d'un RDV |
| Annulation RDV | ✅ | Annulation par le client |
| Modification profil | ✅ | Mise à jour nom, prénom, téléphone, photo |
| Statut automatique | ✅ | Affichage "terminé" quand la date/heure est passée |

### 6.2 Fonctionnalités Admin

| Fonctionnalité | Statut | Description |
|----------------|--------|-------------|
| Gestion services | ✅ | CRUD complet des services |
| Gestion utilisateurs | ✅ | Liste, promotion admin, suppression |
| Validation RDV | ✅ | Confirmation ou annulation des RDV |
| Notification immédiate | ✅ | Notification instantanée lors de la confirmation/annulation |
| Suppression RDV | ✅ | Suppression définitive d'un RDV |
| Rappel 30min | ✅ | Programmation d'un rappel 30 minutes avant |

### 6.3 Fonctionnalités Automatiques

| Fonctionnalité | Statut | Description |
|----------------|--------|-------------|
| Auto-annulation | ✅ | Les RDV en_attente non confirmés après 1h sont automatiquement annulés |
| Calcul terminé | ✅ | Affichage automatique "terminé" pour les RDV passés |

---

## 7. GESTION DES NOTIFICATIONS

### 7.1 Bibliothèque
L'application utilise **@notifee/react-native** pour les notifications locales.

### 7.2 Configuration

```javascript
export const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'rappels',
    name: 'Rappels RDV',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};
```

### 7.3 Types de Notifications

#### 7.3.1 Notification Immédiate
Envoyée immédiatement lors de la confirmation/annulation par l'administrateur.

**Confirmation :**
```
Titre: "RDV confirmé"
Corps: "Votre rendez-vous 'Consultation médicale' a été confirmé pour le 2026-05-15 à 14:30"
```

**Annulation :**
```
Titre: "RDV annulé"
Corps: "Votre rendez-vous 'Consultation médicale' a été annulé."
```

#### 7.3.2 Rappel Programmé
Programmé 30 minutes avant l'heure du rendez-vous (uniquement pour les RDV confirmés).

```
Titre: "Rappel RDV"
Corps: "Votre rendez-vous 'Consultation médicale' est prévu à 14:30"
```

### 7.4 Permissions Android
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

---

## 8. SÉCURITÉ

### 8.1 Authentification
- **JWT (JSON Web Tokens)** : Tokens signés avec une clé secrète
- **Hachage bcrypt** : Les mots de passe sont hachés avec un salt de 10 rounds

### 8.2 Autorisation
- **Rôle utilisateur** : Two rôles (`client`, `admin`)
- **Middleware de vérification** : Vérification du token et du rôle

### 8.3 Protection des Données
- Suppression du mot de passe avant l'envoi au client
- Validation des entrées utilisateur
- Requêtes paramétrées pour éviter les injections SQL

---

## 9. TESTS ET VALIDATION

### 9.1 Tests API avec PowerShell

#### Connexion :
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"odus@gmail.com","password":"Nimda123"}'
```

#### Liste des services :
```powershell
$token = (Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"odus@gmail.com","password":"Nimda123"}').token
Invoke-RestMethod -Uri "http://localhost:5000/api/services" -Method GET -Headers @{Authorization="Bearer $token"}
```

### 9.2 Documentation Swagger
Accessible à : `http://localhost:5000/api-docs`

---

## 10. INSTRUCTIONS DE DÉPLOIEMENT

### 10.1 Prérequis

#### Backend
- Node.js (version 18+)
- PostgreSQL (version 12+)

#### Mobile
- Android Studio (pour le développement)
- JDK 17

### 10.2 Installation Backend

```bash
cd rdv-backend
npm install
# Configurer le fichier .env avec les paramètres de base de données
node server.js
```

### 10.3 Configuration .env

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rdv_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES=24h
```

### 10.4 Installation Application Mobile

```bash
cd RdvApp
npm install
# Lancer sur émulateur
npx react-native run-android

# Ou créer un APK
cd android
./gradlew assembleRelease
```

### 10.5 Pour Appareil Réel
Modifier `src/services/api.ts` avec l'IP locale du serveur :

```javascript
const API = axios.create({
  baseURL: 'http://192.168.1.2:5000/api',  // Remplacer par votre IP
});
```

---

## 11. RÉSUMÉ DES ENDPOINTS

| Méthode | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| POST | /api/auth/register | ❌ | ❌ | Inscription |
| POST | /api/auth/login | ❌ | ❌ | Connexion |
| POST | /api/auth/logout | ✅ | ❌ | Déconnexion |
| GET | /api/users/profile | ✅ | ❌ | Profil utilisateur |
| PUT | /api/users/profile | ✅ | ❌ | Modifier profil |
| GET | /api/users/admin/users | ✅ | ✅ | Liste utilisateurs |
| PUT | /api/users/admin/users/:id/role | ✅ | ✅ | Modifier rôle |
| DELETE | /api/users/admin/users/:id | ✅ | ✅ | Supprimer utilisateur |
| GET | /api/services | ✅ | ❌ | Liste services |
| POST | /api/services | ✅ | ✅ | Créer service |
| PUT | /api/services/:id | ✅ | ✅ | Modifier service |
| DELETE | /api/services/:id | ✅ | ✅ | Supprimer service |
| POST | /api/rendezvous | ✅ | ❌ | Créer RDV |
| GET | /api/rendezvous | ✅ | ❌ | Liste mes RDV |
| GET | /api/rendezvous/:id | ✅ | ❌ | Détail RDV |
| PUT | /api/rendezvous/:id | ✅ | ❌ | Modifier RDV |
| DELETE | /api/rendezvous/:id | ✅ | ❌ | Supprimer RDV |
| GET | /api/rendezvous/admin/all | ✅ | ✅ | Tous les RDV |
| PUT | /api/rendezvous/admin/:id/statut | ✅ | ✅ | Confirmer/annuler |
| DELETE | /api/rendezvous/admin/:id | ✅ | ✅ | Supprimer RDV |

---

## 12. ANNEXES

### 12.1 Variables d'Environnement Backend

| Variable | Description | Exemple |
|----------|-------------|---------|
| PORT | Port du serveur | 5000 |
| DB_HOST | Hôte PostgreSQL | localhost |
| DB_PORT | Port PostgreSQL | 5432 |
| DB_NAME | Nom de la base | rdv_db |
| DB_USER | Utilisateur PostgreSQL | postgres |
| DB_PASSWORD | Mot de passe PostgreSQL | ***** |
| JWT_SECRET | Clé secrète JWT | super_secret_key |
| JWT_EXPIRES | Expiration du token | 24h |

### 12.2 Packages NPM Backend
```json
{
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "pg": "^8.20.0",
  "swagger-ui-express": "^5.0.0",
  "swagger-jsdoc": "^6.2.0"
}
```

### 12.3 Packages NPM Mobile
```json
{
  "@notifee/react-native": "^9.1.0",
  "@react-native-async-storage/async-storage": "^1.23.1",
  "@react-native-community/datetimepicker": "^9.1.0",
  "@react-navigation/bottom-tabs": "^7.15.13",
  "@react-navigation/native": "^7.2.4",
  "@react-navigation/native-stack": "^7.14.14",
  "axios": "^1.16.0",
  "react-native-image-picker": "^7.1.0"
}
```

---

## 13. CONCLUSION

Ce projet constitue une solution complète de gestion de rendez-vous médicaux avec :

✅ Backend API REST complet avec Express et PostgreSQL
✅ Application mobile React Native pour clients et administrateurs
✅ Système d'authentification sécurisé avec JWT
✅ Gestion complète des rendez-vous (CRUD)
✅ Notifications locales pour rappels et confirmations
✅ Interface d'administration pour gérer services, utilisateurs et RDV
✅ Documentation API avec Swagger
✅ Gestion automatique des RDV expirés

Le projet est prêt pour être utilisé en production après configuration des variables d'environnement et déploiement des composants.

---

**Document généré le :** 9 mai 2026
**Version :** 1.0