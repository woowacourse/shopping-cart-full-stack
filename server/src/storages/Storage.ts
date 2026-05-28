export interface Storage {
  getItem<T>(table: string, id: string): T | undefined;
  addItem<T>(table: string, id: string, obj: T): T;
  updateItem<T>(table: string, id: string, obj: T): T;
  deleteItem(table: string, id: string): void;
  allItems<T>(table: string): T[];
  clearAllItems(table: string): void;
}
