
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function EvaluationForm() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type">Type d'évaluation</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mid_term">Mi-parcours</SelectItem>
            <SelectItem value="final">Finale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="score">Note</Label>
        <Input 
          id="score" 
          type="number" 
          min="0" 
          max="5" 
          step="0.5" 
          required 
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="comments">Commentaires</Label>
        <Textarea id="comments" />
      </div>
    </div>
  );
}
