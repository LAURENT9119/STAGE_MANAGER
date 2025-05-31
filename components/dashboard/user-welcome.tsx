` tags. I will pay close attention to the TypeScript typing issue and make sure the `UserWelcome` component uses the correct type.

```text
The code has been modified to import ExtendedUser type and use it for UserWelcomeProps interface.
```

<replit_final_file>
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExtendedUser } from '@/types/auth';

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

interface UserWelcomeProps {
  user: ExtendedUser;
}

export function UserWelcome({ user }: UserWelcomeProps) {
  const displayName = user.full_name || user.user_metadata?.full_name || user.email || 'Utilisateur';
  const avatarUrl = user.avatar || user.user_metadata?.avatar_url;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>
              {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Bienvenue, {displayName}</h2>
            <p className="text-muted-foreground">
              Rôle: {user.role || 'Non défini'}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}