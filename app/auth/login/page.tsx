"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/supabase"
import { useAuthStore } from "@/store/auth-store"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const setUser = useAuthStore(state => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await authService.signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Récupérer le profil utilisateur complet
        const profile = await authService.getUserProfile(data.user.id)

        if (profile) {
          setUser(profile)
          toast({
            title: "Connexion réussie",
            description: `Bienvenue ${profile.full_name}!`,
          })

          // Rediriger vers le dashboard approprié
          router.push(`/dashboard/${profile.role}`)
        } else {
          setError("Impossible de récupérer les informations du profil")
        }
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Se connecter</h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre espace
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Stage+</CardTitle>
              <CardDescription className="text-center">
                Plateforme de gestion des stagiaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>

              <div className="text-center text-sm">
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:underline"
                >
                  Pas encore de compte ? S'inscrire
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Comptes de test */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Comptes de test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div><strong>Admin:</strong> admin@test.com / password123</div>
            <div><strong>RH:</strong> hr@test.com / password123</div>
            <div><strong>Tuteur:</strong> tutor@test.com / password123</div>
            <div><strong>Stagiaire:</strong> intern@test.com / password123</div>
            <div><strong>Finance:</strong> finance@test.com / password123</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}