
"use client";

import { useState, useEffect } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Users,
  Save,
  Edit
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useInterns } from "@/hooks/use-interns";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/string-utils";

export default function TutorProfilePage() {
  const { user } = useAuthStore();
  const { interns } = useInterns();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    department: "",
    specialization: "",
    experience: "",
    bio: "",
    linkedin: "",
    skills: [] as string[]
  });

  const myInterns = interns.filter(intern => intern.tutor_id === user?.id);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Simuler le chargement du profil depuis la base de données
      const mockProfile = {
        full_name: user?.full_name || "Jean Dupont",
        email: user?.email || "jean.dupont@entreprise.com",
        phone: "+33 1 23 45 67 89",
        department: "Informatique",
        specialization: "Développement Web",
        experience: "5 ans",
        bio: "Développeur senior passionné par les nouvelles technologies et l'encadrement de jeunes talents.",
        linkedin: "https://linkedin.com/in/jean-dupont",
        skills: ["JavaScript", "React", "Node.js", "Python", "Encadrement"]
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simuler la sauvegarde en base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès"
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !profile.skills.includes(skill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Mon Profil</h2>
                <p className="text-muted-foreground">
                  Gérez vos informations personnelles et professionnelles
                </p>
              </div>
              <Button 
                onClick={() => editing ? handleSave() : setEditing(true)}
                disabled={loading}
              >
                {editing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Sauvegarde..." : "Sauvegarder"}
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </>
                )}
              </Button>
            </div>

            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" />
                  Informations personnelles
                </TabsTrigger>
                <TabsTrigger value="professional">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Informations professionnelles
                </TabsTrigger>
                <TabsTrigger value="interns">
                  <Users className="mr-2 h-4 w-4" />
                  Mes stagiaires
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations de contact
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar_url} alt={profile.full_name} />
                        <AvatarFallback className="text-lg">
                          {getInitials(profile.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      {editing && (
                        <Button variant="outline">
                          Changer la photo
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nom complet</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profile.linkedin}
                          onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                          disabled={!editing}
                          placeholder="https://linkedin.com/in/votre-profil"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!editing}
                        placeholder="Parlez-nous de vous..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations professionnelles</CardTitle>
                    <CardDescription>
                      Détails sur votre parcours et expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="department">Département</Label>
                        <Input
                          id="department"
                          value={profile.department}
                          onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Spécialisation</Label>
                        <Input
                          id="specialization"
                          value={profile.specialization}
                          onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                          disabled={!editing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Expérience</Label>
                        <Input
                          id="experience"
                          value={profile.experience}
                          onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                          disabled={!editing}
                          placeholder="Ex: 5 ans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Compétences</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {skill}
                            {editing && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-1 text-xs hover:text-red-500"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {editing && (
                        <Input
                          placeholder="Tapez une compétence et appuyez sur Entrée"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSkill(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interns" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes stagiaires ({myInterns.length})</CardTitle>
                    <CardDescription>
                      Liste des stagiaires sous votre tutelle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {myInterns.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        Aucun stagiaire sous votre tutelle actuellement
                      </p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {myInterns.map((intern) => (
                          <div key={intern.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <Avatar>
                              <AvatarImage src={intern.user.avatar_url} alt={intern.user.full_name} />
                              <AvatarFallback>
                                {getInitials(intern.user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{intern.user.full_name}</h4>
                              <p className="text-sm text-muted-foreground">{intern.department}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">
                                  {new Date(intern.start_date).toLocaleDateString('fr-FR')} - 
                                  {new Date(intern.end_date).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                            <Badge variant={intern.status === 'active' ? 'default' : 'secondary'}>
                              {intern.status === 'active' ? 'En cours' : 
                               intern.status === 'completed' ? 'Terminé' : 'À venir'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
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
