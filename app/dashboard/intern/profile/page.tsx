'use client';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InternProfilePage() {
  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    school: 'École Supérieure',
    formation: 'Développement Web',
    startDate: '2025-01-15',
    endDate: '2025-06-15'
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mon Profil</h2>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <Input value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">École</label>
              <Input value={profile.school} onChange={(e) => setProfile({...profile, school: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Formation</label>
              <Input value={profile.formation} onChange={(e) => setProfile({...profile, formation: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Input type="date" value={profile.startDate} onChange={(e) => setProfile({...profile, startDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Input type="date" value={profile.endDate} onChange={(e) => setProfile({...profile, endDate: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Sauvegarder les modifications</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}