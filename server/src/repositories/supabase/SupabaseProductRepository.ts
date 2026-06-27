import { Product } from '../../models/Product.js';
import type { CreateProductInput, ProductRepository } from '../ProductRepository.js';
import { getSupabase } from './supabaseClient.js';

interface ProductRow {
  id: number | string;
  name: string;
  price: number;
  image_url: string;
}

const TABLE = 'products';

const toProduct = (row: ProductRow): Product =>
  new Product(`${row.id}`, row.name, row.price, row.image_url);

export class SupabaseProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    const { data, error } = await getSupabase().from(TABLE).select('*').order('id');

    if (error) {
      throw error;
    }

    return (data as ProductRow[]).map(toProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await getSupabase().from(TABLE).select('*').eq('id', id).maybeSingle();

    if (error) {
      throw error;
    }

    return data ? toProduct(data as ProductRow) : null;
  }

  async existsByName(name: string): Promise<boolean> {
    const { data, error } = await getSupabase().from(TABLE).select('id').eq('name', name).maybeSingle();

    if (error) {
      throw error;
    }

    return data !== null;
  }

  async create({ name, price, imageUrl }: CreateProductInput): Promise<Product> {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert({ name, price, image_url: imageUrl })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return toProduct(data as ProductRow);
  }

  async deleteById(id: string): Promise<boolean> {
    const { data, error } = await getSupabase().from(TABLE).delete().eq('id', id).select('id');

    if (error) {
      throw error;
    }

    return (data?.length ?? 0) > 0;
  }
}
