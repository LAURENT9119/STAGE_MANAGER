"use client";

import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Conditions d&apos;utilisation</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p className="mb-4">
              En accédant et en utilisant la plateforme Stage+, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. 
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
            <p className="mb-4">
              Stage+ est une plateforme de gestion des stagiaires permettant :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>La gestion des demandes de stage</li>
              <li>Le suivi des stagiaires</li>
              <li>La génération de documents administratifs</li>
              <li>La communication entre les différents acteurs</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. Comptes utilisateurs</h2>
            <p className="mb-4">
              Les utilisateurs sont responsables de :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintenir la confidentialité de leur compte</li>
              <li>Toutes les activités effectuées sous leur compte</li>
              <li>Mettre à jour leurs informations personnelles</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p className="mb-4">
              Tous les droits de propriété intellectuelle relatifs à la plateforme sont réservés.
              Les utilisateurs s&apos;engagent à ne pas copier, modifier ou distribuer le contenu sans autorisation.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Protection des données</h2>
            <p className="mb-4">
              Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité
              et aux lois en vigueur.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Modification des conditions</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les utilisateurs seront notifiés des changements importants.
            </p>

            <h2 className="text-2xl font-semibold mb-4">7. Limitation de responsabilité</h2>
            <p className="mb-4">
              Stage+ ne peut être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation
              ou de l&apos;impossibilité d&apos;utiliser la plateforme.
            </p>

            <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant ces conditions, veuillez nous contacter via notre formulaire de contact.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}