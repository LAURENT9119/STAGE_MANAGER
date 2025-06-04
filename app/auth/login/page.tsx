'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthService } from '@/lib/auth-service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await AuthService.signIn(email, password);

      if (error) {
        setError(error.message || 'Erreur de connexion');
        return;
      }

      if (data?.user) {
        // Récupérer le profil utilisateur pour rediriger vers le bon dashboard
        const profile = await AuthService.getUserProfile(data.user.id);
        if (profile) {
          router.push(`/dashboard/${profile.role}`);
        } else {
          router.push('/dashboard/intern');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Pas de compte ? </span>
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
              S'inscrire
            </Link>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-semibold mb-2">Comptes de test :</p>
            <div className="text-xs space-y-1">
              <div>👨‍💼 Admin: admin@company.com</div>
              <div>👩‍💼 RH: hr@company.com</div>
              <div>💰 Finance: finance@company.com</div>
              <div>👩‍🏫 Tuteur: marie.laurent@company.com</div>
              <div className="mt-2 font-medium">Mot de passe: password123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}