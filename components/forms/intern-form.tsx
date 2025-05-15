
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InternForm() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="school">École</Label>
        <Input id="school" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="formation">Formation</Label>
        <Input id="formation" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="start_date">Date de début</Label>
        <Input id="start_date" type="date" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="end_date">Date de fin</Label>
        <Input id="end_date" type="date" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Statut</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
            <SelectItem value="upcoming">À venir</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
