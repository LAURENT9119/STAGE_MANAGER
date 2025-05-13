
"use client";

import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/string-utils";

export default function TutorProfilePage() {
  const mockTutor = {
    name: "Marie Laurent",
    email: "m.laurent@example.com",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    department: "IT",
    position: "Lead Developer",
    phone: "+33 6 12 34 56 78",
    interns: 3,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav role="tutor" />
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <DashboardNav role="tutor" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Mon profil</h2>
              <p className="text-muted-foreground">
                Gérez vos informations personnelles
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={mockTutor.avatar} alt={mockTutor.name} />
                      <AvatarFallback>{getInitials(mockTutor.name)}</AvatarFallback>
                    </Avatar>
                    <Button>Changer la photo</Button>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" defaultValue={mockTutor.name} />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={mockTutor.email} />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" type="tel" defaultValue={mockTutor.phone} />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="department">Service</Label>
                      <Input id="department" defaultValue={mockTutor.department} disabled />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="position">Poste</Label>
                      <Input id="position" defaultValue={mockTutor.position} disabled />
                    </div>
                    
                    <Button className="mt-4">Enregistrer les modifications</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    
                    <Button className="mt-4">Changer le mot de passe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
