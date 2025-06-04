import { SiteFooter } from '@/components/layout/site-footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Collecte des informations</h2>
              <p className="mb-4">
                Nous collectons les informations que vous nous fournissez directement, telles que :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Informations de compte (nom, email, téléphone)</li>
                <li>Documents de stage et pièces justificatives</li>
                <li>Données de communication et de suivi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
              <p className="mb-4">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Gérer votre dossier de stage</li>
                <li>Traiter vos demandes administratives</li>
                <li>Assurer le suivi pédagogique</li>
                <li>Générer les documents officiels</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Protection des données</h2>
              <p className="mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Partage des informations</h2>
              <p className="mb-4">
                Vos informations ne sont partagées qu'avec les personnes autorisées dans le cadre de votre stage (tuteurs, RH, administration).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Droits des utilisateurs</h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la portabilité</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité, contactez-nous à l'adresse suivante : privacy@entreprise.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}