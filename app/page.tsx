import Link from "next/link";
import { GraduationCap, ArrowRight, CheckCircle, Users, FileCheck, Calendar, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-800/20 dark:text-blue-100">
                  Nouveau: Gestion simplifiée des stages
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Plateforme de gestion des stagiaires
                </h1>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Une solution complète pour centraliser et optimiser la gestion des stagiaires, du recrutement à l&apos;évaluation.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/auth/register">
                      Commencer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/auth/login">J&apos;ai déjà un compte</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex items-center justify-center">
                <div className="relative">
                  <img
                    alt="Dashboard Exemple"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center border shadow-md"
                    src="https://images.pexels.com/photos/3153204/pexels-photo-3153204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    width={550}
                    height={310}
                  />
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl animate-bounce">
                    <GraduationCap className="h-10 w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Simplifiez la gestion de vos stagiaires
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Notre plateforme offre tous les outils nécessaires pour une gestion efficace et fluide de vos stagiaires.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gestion des demandes</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Simplifiez les processus de demandes avec notre workflow intuitif et automatisé.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Suivi des stagiaires</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Gardez une vision précise sur l&apos;évolution de vos stagiaires et leurs projets.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Planification</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Organisez facilement les calendriers et plannings de vos stagiaires.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Validation rapide</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Accélérez les processus de validation grâce à des notifications en temps réel.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Reporting</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Générez facilement des rapports et statistiques sur vos programmes de stage.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Évaluations</h3>
                <p className="text-sm text-center text-muted-foreground">
                  Facilitez le processus d&apos;évaluation et de feedback pour optimiser l&apos;expérience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Prêt à améliorer votre gestion des stagiaires ?
                  </h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Commencez dès aujourd&apos;hui et découvrez comment notre plateforme peut transformer votre processus de gestion des stages.
                  </p>
                </div>
                <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Button asChild size="lg">
                    <Link href="/auth/register">
                      Démarrer maintenant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">Contactez-nous</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}