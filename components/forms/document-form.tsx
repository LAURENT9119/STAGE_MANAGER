
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export function DocumentForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create document');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Document Name</Label>
        <Input id="name" {...register('name', { required: true })} />
      </div>
      <div>
        <Label htmlFor="type">Document Type</Label>
        <Input id="type" {...register('type', { required: true })} />
      </div>
      <div>
        <Label htmlFor="url">Document URL</Label>
        <Input id="url" type="url" {...register('url', { required: true })} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Document'}
      </Button>
    </form>
  );
}
