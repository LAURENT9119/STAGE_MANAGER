
-- Désactiver temporairement les contraintes de clé étrangère
SET session_replication_role = 'replica';

-- Supprimer toutes les données des tables
TRUNCATE TABLE evaluations CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE requests CASCADE;
TRUNCATE TABLE stagiaires CASCADE;
TRUNCATE TABLE departments CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE settings CASCADE;

-- Réactiver les contraintes de clé étrangère
SET session_replication_role = 'origin';
