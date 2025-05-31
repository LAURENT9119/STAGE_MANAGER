
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Politique de Confidentialité</h1>
            <p className="text-xl text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Collecte des informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous collectons les informations que vous nous fournissez directement, notamment :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Informations d'identification personnelle (nom, email, téléphone)</li>
                  <li>Informations professionnelles (université, niveau d'études, département)</li>
                  <li>Documents liés à votre stage</li>
                  <li>Données de navigation sur notre plateforme</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Utilisation des informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous utilisons vos informations pour :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Gérer votre compte utilisateur</li>
                  <li>Faciliter la communication entre stagiaires, tuteurs et RH</li>
                  <li>Traiter vos demandes et évaluations</li>
                  <li>Améliorer notre service</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Partage des informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. 
                  Nous pouvons partager vos informations uniquement dans les cas suivants :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour répondre à des obligations légales</li>
                  <li>Avec les tuteurs et responsables RH dans le cadre de votre stage</li>
                  <li>Pour protéger nos droits et notre sécurité</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Sécurité des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Chiffrement des données en transit et au repos</li>
                  <li>Authentification sécurisée</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Surveillance continue de la sécurité</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Vos droits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement (droit à l'oubli)</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit de limitation du traitement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Conservation des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous conservons vos informations personnelles aussi longtemps que nécessaire pour :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fournir nos services</li>
                  <li>Respecter nos obligations légales</li>
                  <li>Résoudre les litiges</li>
                  <li>Faire valoir nos droits</li>
                </ul>
                <p>
                  En général, nous conservons vos données pendant une durée de 5 ans après la fin de votre stage,
                  sauf obligation légale contraire.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Cookies et technologies de suivi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience. Ces cookies nous permettent de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintenir votre session de connexion</li>
                  <li>Personnaliser votre expérience</li>
                  <li>Analyser l'utilisation du site</li>
                  <li>Améliorer nos services</li>
                </ul>
                <p>
                  Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                  contactez-nous :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email : privacy@stageplus.com</li>
                  <li>Téléphone : +33 1 23 45 67 89</li>
                  <li>Adresse : 123 Rue de la Paix, 75001 Paris, France</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Modifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
                  Les modifications importantes vous seront notifiées par email ou via notre plateforme.
                  Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
