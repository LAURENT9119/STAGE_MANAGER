
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DocumentForm() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom du document</Label>
        <Input id="name" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Type de document</Label>
        <Input id="type" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="file">Fichier</Label>
        <Input id="file" type="file" required />
      </div>
    </div>
  );
}
