import { Preorder } from "../Preorder";

export interface PreorderRepositoryInterface {
  save(items: Preorder["items"]): Preorder;
  findById(preorderId: string): Preorder | null;
}
