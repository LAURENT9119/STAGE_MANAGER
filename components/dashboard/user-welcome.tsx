
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/string-utils";

export function UserWelcome() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function loadUser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }
    loadUser();
  }, []);

  if (!user) return null;

  const now = new Date();
  const hours = now.getHours();
  
  let greeting = "Bonjour";
  if (hours < 12) {
    greeting = "Bonjour";
  } else if (hours < 18) {
    greeting = "Bon après-midi";
  } else {
    greeting = "Bonsoir";
  }

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatar_url} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{greeting}, {user.name}</h2>
        <p className="text-muted-foreground">
          Bienvenue sur votre tableau de bord. Voici un aperçu de votre activité.
        </p>
      </div>
    </div>
  );
}
