import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <GraduationCap className="h-6 w-6" />
        <span className="font-bold">Gestion Stagiaires</span>
      </Link>
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <MainNav />
      <h1>Welcome to Gestion Stagiaires</h1>
      <p>This is a sample application.</p>
    </div>
  );
}

export default HomePage;