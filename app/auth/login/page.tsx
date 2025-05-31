'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth-service';
import { useAppStore } from '@/store/app-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setCurrentUser, setAuthenticated } = useAppStore();
  const testUsers = authService.getTestUsers();
  const isTestMode = process.env.NODE_ENV === 'development';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await authService.signIn(email, password);
      if (user) {
        setCurrentUser(user);
        setAuthenticated(true);
        router.push(`/dashboard/${user.role}`);
      } else {
        setError('Identifiants invalides');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleTestUserLogin = async (testEmail: string) => {
    setLoading(true);
    setError('');

    try {
      const user = await authService.switchTestUser(testEmail);
      if (user) {
        setCurrentUser(user);
        setAuthenticated(true);
        router.push(`/dashboard/${user.role}`);
      }
    } catch (err) {
      setError('Erreur lors du changement d\'utilisateur test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Connexion
            </CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace de gestion des stagiaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Votre mot de passe"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {isTestMode && testUsers.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">MODE TEST</Badge>
                  <span className="text-sm text-muted-foreground">
                    Comptes de démonstration
                  </span>
                </div>

                <div className="grid gap-2">
                  {testUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestUserLogin(user.email)}
                      disabled={loading}
                      className="flex justify-between"
                    >
                      <span>{user.full_name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {user.role}
                      </Badge>
                    </Button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  En mode développement, vous pouvez utiliser ces comptes test.
                  Mot de passe: test123
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}