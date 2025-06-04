
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dbData, setDbData] = useState<any>(null);

  const testConnection = async () => {
    setConnectionStatus('loading');
    setErrorMessage('');
    
    try {
      const supabase = createClient();
      
      // Test simple connexion
      const { data, error } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);

      if (error) {
        throw error;
      }

      setDbData(data);
      setConnectionStatus('success');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur de connexion inconnue');
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Test de Connectivité Database</CardTitle>
            <CardDescription>
              Vérification de la connexion entre le frontend et Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Variables d'environnement</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configurée' : '✗ Manquante'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configurée' : '✗ Manquante'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test de Connexion Database</h3>
              
              {connectionStatus === 'loading' && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>Test de connexion en cours...</AlertDescription>
                </Alert>
              )}

              {connectionStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ✅ Connexion réussie à Supabase !
                    {dbData && <div className="mt-2">Données récupérées: {JSON.stringify(dbData)}</div>}
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus === 'error' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    ❌ Erreur de connexion: {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pages disponibles</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <a href="/" className="text-blue-600 hover:underline">🏠 Accueil</a>
                <a href="/auth/login" className="text-blue-600 hover:underline">🔐 Connexion</a>
                <a href="/auth/register" className="text-blue-600 hover:underline">📝 Inscription</a>
                <a href="/dashboard/intern" className="text-blue-600 hover:underline">📊 Dashboard Stagiaire</a>
                <a href="/dashboard/hr" className="text-blue-600 hover:underline">👥 Dashboard RH</a>
                <a href="/terms" className="text-blue-600 hover:underline">📋 Conditions</a>
                <a href="/privacy" className="text-blue-600 hover:underline">🔒 Confidentialité</a>
                <a href="/contact" className="text-blue-600 hover:underline">📞 Contact</a>
              </div>
            </div>

            <Button onClick={testConnection} className="w-full">
              Retester la connexion
            </Button>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
