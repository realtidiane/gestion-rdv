# Projet Gestion de Rendez-vous

Application mobile de gestion de rendez-vous pour établissement sanitaire.

##  Application Mobile

### Technologies
- **Framework** : React Native CLI 0.85.3
- **Navigation** : React Navigation 7.x
- **HTTP Client** : Axios
- **Notifications** : Notifee
- **Stockage** : AsyncStorage

### Installation

```bash
# Installer les dépendances
cd RdvApp
npm install

# Lancer sur Android
npx react-native run-android
```

### Configuration API

Modifier `src/services/config.ts` :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.2:5000/api', // IP de votre serveur
};
```

### Architecture

```
RdvApp/
├── src/
│   ├── screens/          # Écrans de l'application
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── NewRdvScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── AdminServicesScreen.tsx
│   │   ├── AdminRdvsScreen.tsx
│   │   └── AdminUsersScreen.tsx
│   ├── navigation/       # Navigation
│   ├── context/         # Contexte Auth
│   └── services/       # API et notifications
├── App.tsx
└── index.js
```

---

## ⚙️ Backend API

### Technologies
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **Authentification** : JWT + bcrypt
- **Documentation** : Swagger

### Installation

```bash
cd rdv-backend

# Installer les dépendances
npm install

# Configuration (.env)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=rdv_db
# DB_USER=postgres
# DB_PASSWORD=***
# JWT_SECRET=supersecret
# JWT_EXPIRES=24h

# Lancer le serveur
node server.js
```

### Points d'accès API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| POST | /api/auth/logout | Déconnexion |
| GET/PUT | /api/users/profile | Profil utilisateur |
| GET/POST | /api/services | Services (CRUD admin) |
| POST | /api/rendezvous | Créer RDV |
| GET | /api/rendezvous | Liste mes RDV |
| GET/PUT/DELETE | /api/rendezvous/:id | Détail/Modifier/Supprimer |
| GET/PUT/DELETE | /api/rendezvous/admin/* | Gestion admin |
| GET/PUT/DELETE | /api/users/admin/* | Gestion utilisateurs |

### Documentation Swagger

Accessible sur : `http://localhost:5000/api-docs`

---

##  Base de données
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

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    duree INT,
    prix DECIMAL(10,2)
);

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

### Schéma

**users**
- id, nom, prenom, email, password, telephone, photo, role, created_at

**services**
- id, nom, description, duree, prix

**rendezvous**
- id, user_id, service_id, date_rdv, heure_rdv, statut, commentaire, created_at

### Statuts RDV
- `en_attente` - En attente de validation
- `confirme` - Confirmé par l'admin
- `annule` - Annulé

---

##  Génération APK

```bash
cd RdvApp/android
./gradlew assembleRelease

# APK généré dans :
# android/app/build/outputs/apk/release/app-release.apk
```

---

##  Utilisateur Admin par défaut

| Email | Mot de passe |
|-------|--------------|
| odus@gmail.com | Nimda123 |

---

## 📄 Rapport

Voir le fichier `rapport_projet.md` pour une documentation technique complète.

---

## 🛠️ Auteurs

Projet développé dans le cadre d'un projet pédagogique.
