
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function InternForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create intern');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="school">School</Label>
        <Input id="school" {...register('school', { required: true })} />
      </div>
      <div>
        <Label htmlFor="formation">Formation</Label>
        <Input id="formation" {...register('formation', { required: true })} />
      </div>
      <div>
        <Label htmlFor="start_date">Start Date</Label>
        <Input id="start_date" type="date" {...register('start_date', { required: true })} />
      </div>
      <div>
        <Label htmlFor="end_date">End Date</Label>
        <Input id="end_date" type="date" {...register('end_date', { required: true })} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Intern'}
      </Button>
    </form>
  );
}
