
"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/lib/string-utils";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, getCurrentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh user data
      await getCurrentUser();

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role="intern" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="intern" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Mon Profil</h2>
              <p className="text-muted-foreground">
                Gérez vos informations personnelles et vos préférences.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">Photo de profil</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cette photo sera visible par votre tuteur et l'équipe RH.
                  </p>
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={updating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={true}
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={updating}
                      placeholder="Ex: 0123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      value="Stagiaire"
                      disabled={true}
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={updating}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Mise à jour..." : "Mettre à jour le profil"}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Dernière mise à jour : {new Date(user.updated_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
