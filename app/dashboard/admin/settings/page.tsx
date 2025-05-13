"use client";

import { useState } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // General settings
  const [siteName, setSiteName] = useState("Stage+");
  const [siteDescription, setSiteDescription] = useState(
    "Plateforme de gestion des stagiaires"
  );
  const [supportEmail, setSupportEmail] = useState("support@stageplus.fr");

  // Email settings
  const [smtpHost, setSmtpHost] = useState("smtp.example.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@stageplus.fr");
  const [smtpPassword, setSmtpPassword] = useState("");

  // Security settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("3");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [allowRegistration, setAllowRegistration] = useState(true);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [requestNotifications, setRequestNotifications] = useState(true);
  const [documentNotifications, setDocumentNotifications] = useState(true);
  const [evaluationNotifications, setEvaluationNotifications] = useState(true);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate settings update
    setTimeout(() => {
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été enregistrés avec succès.",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role="admin" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="admin" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
            <p className="text-muted-foreground">
              Gérez les paramètres de la plateforme.
            </p>
          </div>

          <Tabs defaultValue="general" className="mt-8">
            <TabsList>
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSaveSettings}>
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres généraux</CardTitle>
                    <CardDescription>
                      Configurez les paramètres généraux de la plateforme.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nom du site</Label>
                      <Input
                        id="siteName"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">
                        Description du site
                      </Label>
                      <Textarea
                        id="siteDescription"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Email de support</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration email</CardTitle>
                    <CardDescription>
                      Configurez les paramètres d&apos;envoi d&apos;emails.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">Serveur SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">Port SMTP</Label>
                      <Input
                        id="smtpPort"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
                      <Input
                        id="smtpUser"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                    <CardDescription>
                      Configurez les paramètres de sécurité.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Vérification email</Label>
                        <p className="text-sm text-muted-foreground">
                          Exiger la vérification de l&apos;email lors de
                          l&apos;inscription
                        </p>
                      </div>
                      <Switch
                        checked={requireEmailVerification}
                        onCheckedChange={setRequireEmailVerification}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">
                        Tentatives de connexion max
                      </Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">
                        Timeout session (minutes)
                      </Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Inscription publique</Label>
                        <p className="text-sm text-muted-foreground">
                          Autoriser l&apos;inscription publique
                        </p>
                      </div>
                      <Switch
                        checked={allowRegistration}
                        onCheckedChange={setAllowRegistration}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Configurez les paramètres de notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications email</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer les notifications par email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications de demandes</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifier lors des changements de statut des demandes
                        </p>
                      </div>
                      <Switch
                        checked={requestNotifications}
                        onCheckedChange={setRequestNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications de documents</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifier lors de l&apos;ajout de nouveaux documents
                        </p>
                      </div>
                      <Switch
                        checked={documentNotifications}
                        onCheckedChange={setDocumentNotifications}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications d&apos;évaluations</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifier lors des nouvelles évaluations
                        </p>
                      </div>
                      <Switch
                        checked={evaluationNotifications}
                        onCheckedChange={setEvaluationNotifications}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="mt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer les paramètres"}
                </Button>
              </div>
            </form>
          </Tabs>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}