"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("intern");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // This is a mock registration for demonstration, in a real app you would use Supabase Auth
    setTimeout(() => {
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      
      router.push("/auth/login");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-blue-900">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Authentication background"
                className="h-full w-full object-cover opacity-20"
              />
            </div>
            <div className="relative z-20 flex items-center text-lg font-medium">
              <GraduationCap className="mr-2 h-6 w-6" />
              Stage+
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;Stage+ nous a permis de digitaliser tout notre processus de gestion des stagiaires et d&apos;augmenter notre efficacité de 70%.&rdquo;
                </p>
                <footer className="text-sm">Marc Dubois, Directeur de l&apos;Innovation</footer>
              </blockquote>
            </div>
          </div>
          <div className="p-8 my-auto">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Créer un compte
                </h1>
                <p className="text-sm text-muted-foreground">
                  Remplissez le formulaire ci-dessous pour créer votre compte
                </p>
              </div>
              <div className="grid gap-4">
                <form onSubmit={handleRegister}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        placeholder="Jean Dupont"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="nom@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select 
                        defaultValue="intern"
                        onValueChange={setRole}
                        disabled={loading}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Sélectionnez votre rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intern">Stagiaire</SelectItem>
                          <SelectItem value="tutor">Tuteur</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Les autres rôles sont réservés au personnel interne.
                      </p>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Création en cours..." : "Créer un compte"}
                    </Button>
                  </div>
                </form>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou
                    </span>
                  </div>
                </div>
                <div className="text-center text-sm">
                  Vous avez déjà un compte?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                    Se connecter
                  </Link>
                </div>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                En vous inscrivant, vous acceptez nos{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Conditions d&apos;utilisation
                </Link>{" "}
                et{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}