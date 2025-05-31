"use client";

import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
            <p className="mb-4">
              Nous collectons les informations suivantes :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Informations d&apos;identification (nom, prénom, email)</li>
              <li>Données professionnelles (poste, service)</li>
              <li>Documents liés aux stages</li>
              <li>Données de connexion et d&apos;utilisation</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
            <p className="mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Gérer votre compte et vos accès</li>
              <li>Traiter vos demandes de stage</li>
              <li>Générer les documents administratifs</li>
              <li>Améliorer nos services</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. Protection des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance régulière de nos systèmes</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
            <p className="mb-4">
              Vos données peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Les tuteurs et responsables RH concernés</li>
              <li>Les services administratifs nécessaires</li>
              <li>Nos sous-traitants techniques (hébergement, maintenance)</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">5. Vos droits</h2>
            <p className="mb-4">
              Vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accès à vos données personnelles</li>
              <li>Rectification des données inexactes</li>
              <li>Suppression de vos données</li>
              <li>Opposition au traitement</li>
              <li>Portabilité de vos données</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p className="mb-4">
              Nous utilisons des cookies pour :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Assurer le fonctionnement technique de la plateforme</li>
              <li>Améliorer la navigation</li>
              <li>Analyser l&apos;utilisation du site</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier cette politique de confidentialité.
              Les utilisateurs seront informés des changements importants.
            </p>

            <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant vos données personnelles,
              contactez notre délégué à la protection des données via notre formulaire de contact.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}