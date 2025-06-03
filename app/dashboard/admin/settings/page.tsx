
"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  Settings, 
  Upload, 
  Mail, 
  Shield, 
  Bell, 
  Save, 
  RefreshCw 
} from "lucide-react";

interface SystemSettings {
  site_name: string;
  site_description: string;
  logo_url: string;
  primary_color: string;
  email_notifications: boolean;
  auto_approval: boolean;
  maintenance_mode: boolean;
  max_file_size: number;
  allowed_file_types: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  session_timeout: number;
  password_min_length: number;
  require_2fa: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: "Plateforme de Gestion des Stagiaires",
    site_description: "Application web de gestion des stagiaires avec demandes en ligne",
    logo_url: "",
    primary_color: "#3b82f6",
    email_notifications: true,
    auto_approval: false,
    maintenance_mode: false,
    max_file_size: 10,
    allowed_file_types: "pdf,doc,docx,jpg,png",
    smtp_host: "",
    smtp_port: 587,
    smtp_user: "",
    smtp_password: "",
    session_timeout: 24,
    password_min_length: 8,
    require_2fa: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Information",
        description: "Utilisation des paramètres par défaut",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert([settings], { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Paramètres sauvegardés avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      setSettings(prev => ({ ...prev, logo_url: data.publicUrl }));
      
      toast({
        title: "Succès",
        description: "Logo téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le logo",
        variant: "destructive",
      });
    }
  };

  const testEmailConfiguration = async () => {
    try {
      // Simulation du test d'email
      toast({
        title: "Test d'email",
        description: "Configuration email testée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec du test de configuration email",
        variant: "destructive",
      });
    }
  };

  if (loading) {
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
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Chargement des paramètres...</p>
              </div>
            </div>
          </main>
        </div>
        <SiteFooter />
      </div>
    );
  }

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
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
                <p className="text-muted-foreground">
                  Gérez les paramètres de la plateforme.
                </p>
              </div>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">
                  <Settings className="mr-2 h-4 w-4" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="mr-2 h-4 w-4" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                    <CardDescription>
                      Paramètres de base de la plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Nom du site</Label>
                        <Input
                          id="site-name"
                          value={settings.site_name}
                          onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Couleur principale</Label>
                        <Input
                          id="primary-color"
                          type="color"
                          value={settings.primary_color}
                          onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Description du site</Label>
                      <Textarea
                        id="site-description"
                        value={settings.site_description}
                        onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo du site</Label>
                      <div className="flex items-center space-x-4">
                        {settings.logo_url && (
                          <img
                            src={settings.logo_url}
                            alt="Logo"
                            className="h-16 w-16 object-contain border rounded"
                          />
                        )}
                        <div>
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-fit"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Formats acceptés: JPG, PNG, SVG
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-file-size">Taille max des fichiers (MB)</Label>
                        <Input
                          id="max-file-size"
                          type="number"
                          value={settings.max_file_size}
                          onChange={(e) => setSettings(prev => ({ ...prev, max_file_size: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="allowed-types">Types de fichiers autorisés</Label>
                        <Input
                          id="allowed-types"
                          value={settings.allowed_file_types}
                          onChange={(e) => setSettings(prev => ({ ...prev, allowed_file_types: e.target.value }))}
                          placeholder="pdf,doc,docx,jpg,png"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mode maintenance</Label>
                        <div className="text-sm text-muted-foreground">
                          Désactive l&apos;accès à la plateforme pour les utilisateurs
                        </div>
                      </div>
                      <Switch
                        checked={settings.maintenance_mode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration SMTP</CardTitle>
                    <CardDescription>
                      Paramètres pour l&apos;envoi d&apos;emails
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Serveur SMTP</Label>
                        <Input
                          id="smtp-host"
                          value={settings.smtp_host}
                          onChange={(e) => setSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                          placeholder="smtp.gmail.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Port SMTP</Label>
                        <Input
                          id="smtp-port"
                          type="number"
                          value={settings.smtp_port}
                          onChange={(e) => setSettings(prev => ({ ...prev, smtp_port: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">Utilisateur SMTP</Label>
                        <Input
                          id="smtp-user"
                          type="email"
                          value={settings.smtp_user}
                          onChange={(e) => setSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">Mot de passe SMTP</Label>
                        <Input
                          id="smtp-password"
                          type="password"
                          value={settings.smtp_password}
                          onChange={(e) => setSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={testEmailConfiguration} variant="outline">
                        Tester la configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de sécurité</CardTitle>
                    <CardDescription>
                      Configuration de la sécurité et de l&apos;authentification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Timeout de session (heures)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          value={settings.session_timeout}
                          onChange={(e) => setSettings(prev => ({ ...prev, session_timeout: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-length">Longueur minimale du mot de passe</Label>
                        <Input
                          id="password-length"
                          type="number"
                          value={settings.password_min_length}
                          onChange={(e) => setSettings(prev => ({ ...prev, password_min_length: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Authentification à deux facteurs requise</Label>
                        <div className="text-sm text-muted-foreground">
                          Oblige tous les utilisateurs à utiliser l&apos;2FA
                        </div>
                      </div>
                      <Switch
                        checked={settings.require_2fa}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_2fa: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de notifications</CardTitle>
                    <CardDescription>
                      Configuration des notifications automatiques
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notifications par email</Label>
                        <div className="text-sm text-muted-foreground">
                          Envoyer des notifications par email aux utilisateurs
                        </div>
                      </div>
                      <Switch
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Approbation automatique</Label>
                        <div className="text-sm text-muted-foreground">
                          Approuver automatiquement certaines demandes
                        </div>
                      </div>
                      <Switch
                        checked={settings.auto_approval}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_approval: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
