
# 🚀 Guide d'installation - Plateforme de Gestion des Stagiaires

## 📋 Prérequis

1. **Compte Supabase** : Créez un projet sur [supabase.com](https://supabase.com)
2. **Node.js 18+** installé
3. **Base de données PostgreSQL** (fournie par Supabase)

## ⚙️ Configuration

### 1. Configuration Supabase

1. Créez un nouveau projet Supabase
2. Récupérez vos clés dans Settings > API :
   - `anon/public key` 
   - `service_role key`
   - URL du projet

### 2. Variables d'environnement

Créez le fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialisation de la base de données

1. Dans Supabase > SQL Editor, exécutez le contenu de `database/schema.sql`
2. Puis exécutez `scripts/init-test-accounts.sql`

### 4. Configuration de l'authentification Supabase

Dans Supabase Dashboard :
1. Allez dans Authentication > Settings
2. Désactivez "Enable email confirmations" (pour les tests)
3. Dans Authentication > Users, ajoutez manuellement les utilisateurs de test avec le mot de passe "password123"

### 5. Installation des dépendances

```bash
npm install
```

### 6. Démarrage

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 👥 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@company.com | password123 |
| **RH** | hr@company.com | password123 |
| **Finance** | finance@company.com | password123 |
| **Tuteur IT** | marie.laurent@company.com | password123 |
| **Tuteur Marketing** | pierre.dubois@company.com | password123 |
| **Stagiaire IT** | jean.dupont@example.com | password123 |
| **Stagiaire Marketing** | sophie.martin@example.com | password123 |

## 🔧 Fonctionnalités implémentées

✅ **Backend Supabase connecté**
✅ **Authentification fonctionnelle** 
✅ **Gestion des rôles**
✅ **CRUD Stagiaires**
✅ **CRUD Demandes**
✅ **Tableaux de bord dynamiques**
✅ **Protection des routes**
✅ **Notifications en temps réel**
✅ **Filtrage et recherche avancés**

## 🏗️ Architecture

```
app/
├── auth/                 # Pages d'authentification
├── dashboard/           # Tableaux de bord par rôle
│   ├── [role]/         # Page principale du dashboard
│   ├── admin/          # Pages spécifiques admin
│   ├── hr/            # Pages spécifiques RH
│   ├── finance/       # Pages spécifiques finance
│   ├── tutor/         # Pages spécifiques tuteur
│   └── intern/        # Pages spécifiques stagiaire
components/
├── ui/                 # Composants UI réutilisables
├── layout/            # Composants de layout
└── dashboard/         # Composants spécifiques dashboard
hooks/                 # Hooks personnalisés
├── use-auth.ts       # Gestion authentification
├── use-interns.ts    # Gestion stagiaires
└── use-requests.ts   # Gestion demandes
store/                # État global (Zustand)
└── auth-store.ts     # Store d'authentification
```

## 🔒 Sécurité

- **RLS (Row Level Security)** activé sur toutes les tables sensibles
- **Authentification JWT** via Supabase Auth
- **Validation des rôles** côté client et serveur
- **Politiques d'accès** granulaires par rôle

## 📱 Pages disponibles

### Admin
- `/dashboard/admin` - Vue d'ensemble globale
- `/dashboard/admin/users` - Gestion des utilisateurs
- `/dashboard/admin/settings` - Paramètres système
- `/dashboard/admin/logs` - Logs d'activité

### RH
- `/dashboard/hr` - Tableau de bord RH
- `/dashboard/hr/interns` - Gestion des stagiaires
- `/dashboard/hr/requests` - Validation des demandes
- `/dashboard/hr/reports` - Rapports et statistiques

### Finance
- `/dashboard/finance` - Tableau de bord finance
- `/dashboard/finance/payments` - Gestion des paiements
- `/dashboard/finance/reports` - Rapports financiers

### Tuteur
- `/dashboard/tutor` - Tableau de bord tuteur
- `/dashboard/tutor/interns` - Mes stagiaires
- `/dashboard/tutor/requests` - Demandes à valider

### Stagiaire
- `/dashboard/intern` - Mon espace stagiaire
- `/dashboard/intern/requests` - Mes demandes
- `/dashboard/intern/profile` - Mon profil

## 🐛 Dépannage

### Problème de connexion
1. Vérifiez vos variables d'environnement dans `.env.local`
2. Assurez-vous que les utilisateurs sont créés dans Supabase Auth
3. Vérifiez que RLS est correctement configuré

### Données manquantes
1. Exécutez le script `scripts/init-test-accounts.sql`
2. Vérifiez les relations entre les tables
3. Consultez les logs Supabase pour les erreurs

### Erreurs de build
1. Supprimez `node_modules` et `.next`
2. Réinstallez les dépendances : `npm install`
3. Redémarrez le serveur : `npm run dev`

## 📝 Prochaines étapes à implémenter

- [ ] Génération PDF automatique
- [ ] Upload de fichiers/documents
- [ ] Export CSV/Excel
- [ ] Système de notifications push
- [ ] Interface d'administration avancée
- [ ] Tests unitaires et e2e
- [ ] Déploiement en production

## 🆘 Support

- Vérifiez que Supabase est correctement configuré
- Consultez les logs dans la console navigateur
- Vérifiez les erreurs dans l'onglet Network des DevTools
- Consultez la documentation Supabase : https://supabase.com/docs
