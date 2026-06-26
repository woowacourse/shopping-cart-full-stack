import { resetDb } from "./reset-db.js";

// 실행 시작 시 테스트 DB를 초기화+seed한다.
export default function globalSetup() {
  resetDb();
}
