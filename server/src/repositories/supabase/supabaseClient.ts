import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Supabase 클라이언트를 지연 생성한다.
 * import 시점이 아니라 실제 호출 시점에 환경변수를 검사하므로,
 * 인메모리 모드에서는 SUPABASE_URL 이 없어도 안전하다.
 */
export const getSupabase = (): SupabaseClient => {
  if (client) {
    return client;
  }

  const url = process.env.SUPABASE_URL;
  // 신규 publishable 키(sb_publishable_...)를 우선 사용. 레거시 anon 키는 하위호환 폴백.
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY 환경변수가 필요합니다. server/.env 를 확인하세요.');
  }

  client = createClient(url, key);
  return client;
};
