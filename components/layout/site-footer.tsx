import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <p className="text-sm leading-loose text-muted-foreground">
            © 2025 Stage+ | Tous droits réservés
          </p>
        </div>
        <nav className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm leading-loose text-muted-foreground hover:text-foreground"
          >
            Conditions d&apos;utilisation
          </Link>
          <Link
            href="/privacy"
            className="text-sm leading-loose text-muted-foreground hover:text-foreground"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/contact"
            className="text-sm leading-loose text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}