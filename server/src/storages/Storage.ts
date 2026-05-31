export interface Storage {
  getItemById<T>(table: string, id: string): T | undefined;
  addItemById<T>(table: string, id: string, obj: T): void;
  updateItemById<T>(table: string, id: string, obj: T): void;
  deleteItemById(table: string, id: string): void;
  hasItemById(table: string, id: string): boolean;
  allItems<T>(table: string): T[];
  clearAllItems(table: string): void;
}
