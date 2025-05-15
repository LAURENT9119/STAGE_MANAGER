
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserForm() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Rôle</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="intern">Stagiaire</SelectItem>
            <SelectItem value="tutor">Tuteur</SelectItem>
            <SelectItem value="hr">RH</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="department">Département</Label>
        <Input id="department" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="position">Poste</Label>
        <Input id="position" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" />
      </div>
    </div>
  );
}
