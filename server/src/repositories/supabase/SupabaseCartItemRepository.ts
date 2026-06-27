import { CartItem } from '../../models/CartItem.js';
import type { CartItemRepository } from '../CartItemRepository.js';
import { getSupabase } from './supabaseClient.js';

interface CartItemRow {
  id: number | string;
  product_id: number | string;
  quantity: number;
}

const TABLE = 'cart_items';

const toCartItem = (row: CartItemRow): CartItem =>
  new CartItem(`${row.id}`, `${row.product_id}`, row.quantity);

export class SupabaseCartItemRepository implements CartItemRepository {
  async findAll(): Promise<CartItem[]> {
    const { data, error } = await getSupabase().from(TABLE).select('*').order('id');

    if (error) {
      throw error;
    }

    return (data as CartItemRow[]).map(toCartItem);
  }

  async findById(id: string): Promise<CartItem | null> {
    const { data, error } = await getSupabase().from(TABLE).select('*').eq('id', id).maybeSingle();

    if (error) {
      throw error;
    }

    return data ? toCartItem(data as CartItemRow) : null;
  }

  async updateQuantity(id: string, quantity: number): Promise<CartItem | null> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .update({ quantity })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? toCartItem(data as CartItemRow) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const { data, error } = await getSupabase().from(TABLE).delete().eq('id', id).select('id');

    if (error) {
      throw error;
    }

    return (data?.length ?? 0) > 0;
  }

  async deleteByProductId(productId: string): Promise<boolean> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .delete()
      .eq('product_id', productId)
      .select('id');

    if (error) {
      throw error;
    }

    return (data?.length ?? 0) > 0;
  }
}
