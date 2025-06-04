
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      console.log('Tentative de connexion pour:', email);
      
      // Test de connexion d'abord
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        console.error('Erreur d\'authentification:', authError);
        setError(getErrorMessage(authError.message));
        return;
      }

      if (authData.user) {
        console.log('Utilisateur connecté:', authData.user.id);
        
        // Attendre un peu pour que la session soit établie
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Récupérer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Erreur de profil:', profileError);
          // Si pas de profil, créer un profil basique
          const { error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: authData.user.email,
                full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
                role: 'intern'
              }
            ]);
          
          if (createError) {
            console.error('Erreur création profil:', createError);
          }
          
          // Rediriger avec un délai
          setTimeout(() => {
            router.push('/dashboard/intern');
            router.refresh();
          }, 500);
        } else if (profile?.role) {
          console.log('Profil trouvé, rôle:', profile.role);
          setTimeout(() => {
            router.push(`/dashboard/${profile.role}`);
            router.refresh();
          }, 500);
        } else {
          console.log('Pas de rôle défini, redirection vers intern');
          setTimeout(() => {
            router.push('/dashboard/intern');
            router.refresh();
          }, 500);
        }
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect';
    }
    if (errorMessage.includes('Email not confirmed')) {
      return 'Veuillez confirmer votre email avant de vous connecter';
    }
    if (errorMessage.includes('Too many requests')) {
      return 'Trop de tentatives de connexion. Veuillez réessayer plus tard';
    }
    if (errorMessage.includes('Failed to fetch')) {
      return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
    }
    return errorMessage;
  };

  // Fonction pour tester avec un compte prédéfini
  const loginWithTestAccount = async (testEmail: string) => {
    setEmail(testEmail);
    setPassword('password123');
    
    // Petit délai pour que l'utilisateur voie le changement
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Connexion</CardTitle>
              <CardDescription className="text-center">
                Connectez-vous à votre compte pour accéder au dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Comptes de test */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Comptes de test (cliquez pour utiliser) :</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <button 
                    type="button"
                    onClick={() => loginWithTestAccount('admin@company.com')}
                    className="block w-full text-left hover:bg-blue-100 p-1 rounded"
                    disabled={loading}
                  >
                    Admin: admin@company.com
                  </button>
                  <button 
                    type="button"
                    onClick={() => loginWithTestAccount('hr@company.com')}
                    className="block w-full text-left hover:bg-blue-100 p-1 rounded"
                    disabled={loading}
                  >
                    RH: hr@company.com
                  </button>
                  <button 
                    type="button"
                    onClick={() => loginWithTestAccount('finance@company.com')}
                    className="block w-full text-left hover:bg-blue-100 p-1 rounded"
                    disabled={loading}
                  >
                    Finance: finance@company.com
                  </button>
                  <button 
                    type="button"
                    onClick={() => loginWithTestAccount('marie.laurent@company.com')}
                    className="block w-full text-left hover:bg-blue-100 p-1 rounded"
                    disabled={loading}
                  >
                    Tuteur: marie.laurent@company.com
                  </button>
                  <button 
                    type="button"
                    onClick={() => loginWithTestAccount('jean.dupont@example.com')}
                    className="block w-full text-left hover:bg-blue-100 p-1 rounded"
                    disabled={loading}
                  >
                    Stagiaire: jean.dupont@example.com
                  </button>
                  <div className="font-medium mt-2">Mot de passe: password123</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se connecter
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Pas encore de compte ? </span>
                <Link href="/auth/register" className="font-medium text-primary hover:underline">
                  Créer un compte
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link href="/test-connection" className="text-sm text-muted-foreground hover:underline">
                  Tester la connexion à la base de données
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
