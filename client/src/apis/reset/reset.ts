import { handleResponse } from "../http";
import { BASE_URL, API_ENDPOINTS } from "../../constants/apis";

export async function resetDemoData(): Promise<void> {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.RESET}`, { method: "POST" });
  await handleResponse<void>(response);
}
