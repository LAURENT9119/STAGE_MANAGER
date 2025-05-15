
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function EvaluationForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create evaluation');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <Select onValueChange={(value) => register('type').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mid_term">Mid Term</SelectItem>
            <SelectItem value="final">Final</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="score">Score</Label>
        <Input id="score" type="number" min="0" max="5" step="0.5" {...register('score', { required: true })} />
      </div>
      <div>
        <Label htmlFor="comments">Comments</Label>
        <Textarea id="comments" {...register('comments')} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Evaluation'}
      </Button>
    </form>
  );
}
