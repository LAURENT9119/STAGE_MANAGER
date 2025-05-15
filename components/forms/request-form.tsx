
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function RequestForm() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Type de demande</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="convention">Convention</SelectItem>
            <SelectItem value="prolongation">Prolongation</SelectItem>
            <SelectItem value="conge">Congé</SelectItem>
            <SelectItem value="attestation">Attestation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="details">Détails</Label>
        <Textarea id="details" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="start_date">Date de début</Label>
        <Input id="start_date" type="date" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="end_date">Date de fin</Label>
        <Input id="end_date" type="date" />
      </div>
    </div>
  );
}
