import type { QueueItem } from "../types";

export default class ModalQueue {
  private queue: QueueItem[] = [];

  enqueue(modalComponent: React.ReactNode) {
    const newItem: QueueItem = { id: this.getRandomId(), modalComponent };
    this.queue.push(newItem);
  }

  dequeue() {
    if (this.queue.length > 0) {
      return this.queue.shift();
    }
  }

  get length() {
    return this.queue.length;
  }

  get queueItems() {
    return [...this.queue];
  }

  private getRandomId() {
    return `modal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
