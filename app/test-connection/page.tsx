
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
}

export default function TestConnectionPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Configuration Supabase', status: 'loading', message: 'Vérification...' },
    { name: 'Connexion à la base de données', status: 'loading', message: 'Test en cours...' },
    { name: 'Table profiles', status: 'loading', message: 'Vérification...' },
    { name: 'Table requests', status: 'loading', message: 'Vérification...' },
    { name: 'Authentication', status: 'loading', message: 'Test en cours...' },
  ]);

  const updateTest = (index: number, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message } : test
    ));
  };

  useEffect(() => {
    const runTests = async () => {
      const supabase = createClient();

      // Test 1: Configuration Supabase
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          updateTest(0, 'error', 'Variables d\'environnement manquantes');
        } else {
          updateTest(0, 'success', 'Configuration trouvée');
        }
      } catch (error) {
        updateTest(0, 'error', 'Erreur de configuration');
      }

      // Test 2: Connexion à la base de données
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          updateTest(1, 'error', `Erreur de connexion: ${error.message}`);
        } else {
          updateTest(1, 'success', 'Connexion réussie');
        }
      } catch (error) {
        updateTest(1, 'error', 'Impossible de se connecter');
      }

      // Test 3: Table profiles
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
          updateTest(2, 'error', `Table profiles: ${error.message}`);
        } else {
          updateTest(2, 'success', `Table profiles accessible (${data?.length || 0} enregistrements trouvés)`);
        }
      } catch (error) {
        updateTest(2, 'error', 'Table profiles inaccessible');
      }

      // Test 4: Table requests
      try {
        const { data, error } = await supabase.from('requests').select('*').limit(1);
        if (error) {
          updateTest(3, 'error', `Table requests: ${error.message}`);
        } else {
          updateTest(3, 'success', `Table requests accessible (${data?.length || 0} enregistrements trouvés)`);
        }
      } catch (error) {
        updateTest(3, 'error', 'Table requests inaccessible');
      }

      // Test 5: Authentication
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          updateTest(4, 'error', `Auth error: ${error.message}`);
        } else {
          updateTest(4, 'success', session ? 'Utilisateur connecté' : 'Auth configuré (pas connecté)');
        }
      } catch (error) {
        updateTest(4, 'error', 'Auth system inaccessible');
      }
    };

    runTests();
  }, []);

  const getIcon = (status: TestResult['status']) => {
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
  const hasErrors = tests.some(test => test.status === 'error');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Test de Connexion</h1>
          <p className="text-muted-foreground text-center">
            Vérification de la configuration et des connexions de l'application
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Résultats des Tests</CardTitle>
            <CardDescription>
              Statut de la configuration et des connexions système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <span className={`text-sm ${
                  test.status === 'success' ? 'text-green-600' :
                  test.status === 'error' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {test.message}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {allTestsComplete && (
          <Card className={`border-l-4 ${hasErrors ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold ${hasErrors ? 'text-red-800' : 'text-green-800'}`}>
                    {hasErrors ? '⚠️ Problèmes Détectés' : '✅ Tous les Tests Réussis'}
                  </h3>
                  <p className={`text-sm mt-1 ${hasErrors ? 'text-red-600' : 'text-green-600'}`}>
                    {hasErrors 
                      ? 'Des erreurs ont été détectées. Vérifiez la configuration.'
                      : 'Votre application est correctement configurée et connectée.'
                    }
                  </p>
                </div>
                <div className="space-x-2">
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    size="sm"
                  >
                    Relancer les Tests
                  </Button>
                  {!hasErrors && (
                    <Button asChild size="sm">
                      <Link href="/auth/login">Continuer</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
