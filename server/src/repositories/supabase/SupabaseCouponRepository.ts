import { Coupon, type CouponType } from '../../models/Coupon.js';
import type { CouponRepository } from '../CouponRepository.js';
import { getSupabase } from './supabaseClient.js';

interface CouponRow {
  id: number | string;
  name: string;
  type: CouponType;
  expiration_date: string;
}

const TABLE = 'coupons';

const toCoupon = (row: CouponRow): Coupon =>
  new Coupon(`${row.id}`, row.name, row.type, row.expiration_date);

export class SupabaseCouponRepository implements CouponRepository {
  async findAll(): Promise<Coupon[]> {
    const { data, error } = await getSupabase().from(TABLE).select('*').order('id');

    if (error) {
      throw error;
    }

    return (data as CouponRow[]).map(toCoupon);
  }

  async findById(id: string): Promise<Coupon | null> {
    const { data, error } = await getSupabase().from(TABLE).select('*').eq('id', id).maybeSingle();

    if (error) {
      throw error;
    }

    return data ? toCoupon(data as CouponRow) : null;
  }
}
