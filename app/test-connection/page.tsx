'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
}

export default function TestConnectionPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Configuration Supabase', status: 'loading', message: 'Vérification...' },
    { name: 'Connexion à la base de données', status: 'loading', message: 'Test en cours...' },
    { name: 'Table users', status: 'loading', message: 'Vérification...' },
    { name: 'Table requests', status: 'loading', message: 'Vérification...' },
    { name: 'Authentication', status: 'loading', message: 'Test en cours...' },
  ]);

  const updateTest = (index: number, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ));
  };

  const runTests = async () => {
    // Reset tous les tests
    setTests([
      { name: 'Configuration Supabase', status: 'loading', message: 'Vérification...' },
      { name: 'Connexion à la base de données', status: 'loading', message: 'Test en cours...' },
      { name: 'Table users', status: 'loading', message: 'Vérification...' },
      { name: 'Table requests', status: 'loading', message: 'Vérification...' },
      { name: 'Authentication', status: 'loading', message: 'Test en cours...' },
    ]);

    try {
      // Test 1: Configuration Supabase
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
          updateTest(0, 'error', 'Variables d\'environnement manquantes');
          return;
        } else {
          updateTest(0, 'success', `Configuration OK`);
        }
      } catch (error) {
        updateTest(0, 'error', 'Erreur de configuration');
        return;
      }

      const supabase = createClient();

      // Test 2: Connexion basique
      try {
        // Test simple avec une requête basic
        const { data, error } = await Promise.race([
          supabase.from('users').select('count', { count: 'exact', head: true }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ]) as any;

        if (error) {
          updateTest(1, 'error', `Erreur DB: ${error.message}`);
        } else {
          updateTest(1, 'success', 'Connexion établie');
        }
      } catch (error: any) {
        if (error.message === 'Timeout') {
          updateTest(1, 'error', 'Timeout de connexion (>10s)');
        } else {
          updateTest(1, 'error', `Erreur de connexion: ${error.message}`);
        }
      }

      // Test 3: Table profiles
      try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
          updateTest(2, 'error', `Erreur table profiles: ${error.message}`);
        } else {
          updateTest(2, 'success', `Table profiles accessible`);
        }
      } catch (error: any) {
        updateTest(2, 'error', `Erreur table profiles: ${error.message}`);
      }

      // Test 4: Table requests
      try {
        const { data, error } = await supabase.from('requests').select('count', { count: 'exact', head: true });
        if (error) {
          updateTest(3, 'error', `Erreur table requests: ${error.message}`);
        } else {
          updateTest(3, 'success', `Table requests accessible`);
        }
      } catch (error: any) {
        updateTest(3, 'error', `Erreur table requests: ${error.message}`);
      }

      // Test 5: Authentication
      try {
        const { data: { session }, error } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]) as any;

        if (error) {
          updateTest(4, 'error', `Erreur auth: ${error.message}`);
        } else {
          if (session) {
            updateTest(4, 'success', `Utilisateur connecté: ${session.user.email}`);
          } else {
            updateTest(4, 'success', 'Auth configuré (pas connecté)');
          }
        }
      } catch (error: any) {
        updateTest(4, 'error', `Erreur: ${error.message}`);
      }

    } catch (error: any) {
      console.error('Erreur générale:', error);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const allTestsComplete = tests.every(test => test.status !== 'loading');
  const allTestsSuccess = tests.every(test => test.status === 'success');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Test de Connexion</CardTitle>
              <CardDescription className="text-center">
                Vérification de la connectivité avec la base de données Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Button onClick={runTests} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Relancer les tests
                </Button>
              </div>

              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground max-w-xs truncate">{test.message}</span>
                </div>
              ))}

              {allTestsComplete && (
                <div className="mt-6 p-4 rounded-lg border">
                  {allTestsSuccess ? (
                    <div className="text-green-700 bg-green-50 p-3 rounded">
                      <p className="font-medium">✅ Tous les tests sont réussis !</p>
                      <p className="text-sm mt-1">Votre application est correctement configurée.</p>
                    </div>
                  ) : (
                    <div className="text-red-700 bg-red-50 p-3 rounded">
                      <p className="font-medium">❌ Certains tests ont échoué</p>
                      <p className="text-sm mt-1">Vérifiez votre configuration Supabase et votre connexion réseau.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Link>
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" asChild>
                    <Link href="/auth/register">S'inscrire</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/login">Se connecter</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Configuration actuelle :</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>URL Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Manquante'}</div>
                  <div>Clé Supabase: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante'}</div>
                  <div>Environment: {process.env.NODE_ENV}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}