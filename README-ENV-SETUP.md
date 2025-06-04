
# Configuration des Variables d'Environnement

## Étapes pour configurer Supabase

1. **Créer un projet Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Noter l'URL du projet et la clé anonyme

2. **Configurer le fichier .env.local**
   ```bash
   cp .env.example .env.local
   ```

3. **Remplir les variables dans .env.local**
   - `NEXT_PUBLIC_SUPABASE_URL`: URL de votre projet Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clé anonyme publique
   - `SUPABASE_SERVICE_ROLE_KEY`: Clé de service (pour l'admin)

4. **Exécuter le schéma de base de données**
   ```sql
   -- Copier le contenu de database/schema.sql dans l'éditeur SQL de Supabase
   ```

5. **Vérifier la configuration**
   - Redémarrer le serveur de développement
   - L'erreur "Invalid URL" devrait disparaître

## Variables requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anonyme | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service (admin) | `eyJ...` |
| `NEXT_PUBLIC_APP_URL` | URL de l'application | `http://0.0.0.0:3000` |
