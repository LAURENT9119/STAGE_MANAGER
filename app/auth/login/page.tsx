"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { MOCK_USERS } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // This is a mock login for demonstration, in a real app you would use Supabase Auth
    setTimeout(() => {
      const user = MOCK_USERS[email.toLowerCase()];
      
      if (user && password === "password") {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        router.push(`/dashboard/${user.role}`);
      } else {
        toast({
          title: "Échec de la connexion",
          description: "Email ou mot de passe incorrect.",
          variant: "destructive",
        });
      }
      
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
                  &ldquo;Cette plateforme a transformé notre gestion des stagiaires. Nous avons gagné un temps précieux et amélioré l&apos;expérience de tous les acteurs.&rdquo;
                </p>
                <footer className="text-sm">Sophie Martin, Directrice RH</footer>
              </blockquote>
            </div>
          </div>
          <div className="p-8 my-auto">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Connexion à votre compte
                </h1>
                <p className="text-sm text-muted-foreground">
                  Entrez vos identifiants pour vous connecter à votre compte
                </p>
              </div>
              <div className="grid gap-4">
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Link
                          href="/auth/reset-password"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Mot de passe oublié?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Connexion en cours..." : "Se connecter"}
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
                  Vous n&apos;avez pas encore de compte?{" "}
                  <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                En vous connectant, vous acceptez nos{" "}
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
              
              <div className="mt-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Comptes de démonstration
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p className="mb-1">Utilisez un des emails suivants avec le mot de passe "password":</p>
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Stagiaire: intern@example.com</li>
                        <li>Tuteur: tutor@example.com</li>
                        <li>RH: hr@example.com</li>
                        <li>Finance: finance@example.com</li>
                        <li>Admin: admin@example.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}