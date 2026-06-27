/**
 * server/.env 를 process.env 로 로드한다.
 * 이 모듈은 container(=Supabase 클라이언트 환경변수)가 평가되기 전에
 * index.ts 최상단에서 가장 먼저 import 되어야 한다. (ESM 평가 순서 보장)
 *
 * .env 가 없으면 (예: 테스트/CI) 조용히 넘어가고 실제 환경변수에 의존한다.
 */
try {
  process.loadEnvFile();
} catch {
  // .env 파일 없음 → 무시
}
