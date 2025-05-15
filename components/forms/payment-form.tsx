
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create payment');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" {...register('amount', { required: true })} />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={(value) => register('status').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="period">Period</Label>
        <Input id="period" {...register('period', { required: true })} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Payment'}
      </Button>
    </form>
  );
}
