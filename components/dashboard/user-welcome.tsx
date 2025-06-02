
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExtendedUser } from '@/types/auth';

interface UserWelcomeProps {
  user: ExtendedUser;
}

export function UserWelcome({ user }: UserWelcomeProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'finance': return 'Finance';
      case 'tutor': return 'Tuteur';
      case 'intern': return 'Stagiaire';
      default: return 'Utilisateur';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={user.user_metadata?.avatar_url || user.avatar || ''} 
              alt={user.full_name || 'Avatar'} 
            />
            <AvatarFallback>
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {getGreeting()}, {user.full_name || 'Utilisateur'} !
            </h2>
            <p className="text-muted-foreground">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Bienvenue sur votre tableau de bord. Vous pouvez gérer vos activités depuis cette interface.
        </p>
      </CardContent>
    </Card>
  );
}
