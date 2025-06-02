
import { supabase } from '@/lib/supabase';

export const requestService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { error, data: null };
      }

      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  },

  async create(requestData: any) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select()
        .single();

      if (error) {
        return { error, data: null };
      }

      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  },

  async update(id: string, updateData: any) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { error, data: null };
      }

      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};
