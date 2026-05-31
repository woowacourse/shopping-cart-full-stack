export interface Storage {
  getItemById<T>(table: string, id: string): T | undefined;
  addItemById<T>(table: string, id: string, obj: T): T;
  updateItemById<T>(table: string, id: string, obj: T): T;
  deleteItemById(table: string, id: string): void;
  hasItemById(table: string, id: string): boolean;
  allItems<T>(table: string): T[];
  clearAllItems(table: string): void;
}
