/**
 * Simple in-memory data store using Map
 * This mocks a database for development/testing purposes
 */
export class InMemoryStore<T = any> {
  private store: Map<string, T>;
  private idCounter: number;

  constructor() {
    this.store = new Map();
    this.idCounter = 1;
  }

  /**
   * Generate a unique ID
   */
  generateId(): string {
    return String(this.idCounter++);
  }

  /**
   * Insert a record
   */
  insert(data: Omit<T, "id">): T & { id: string } {
    const id = this.generateId();
    const record = { ...data, id } as T & { id: string };
    this.store.set(id, record);
    return record;
  }

  /**
   * Find a record by ID
   */
  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  /**
   * Find records matching a condition
   */
  find(predicate: (value: T) => boolean): T[] {
    const results: T[] = [];
    for (const value of this.store.values()) {
      if (predicate(value)) {
        results.push(value);
      }
    }
    return results;
  }

  /**
   * Find first record matching a condition
   */
  findOne(predicate: (value: T) => boolean): T | undefined {
    for (const value of this.store.values()) {
      if (predicate(value)) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Update a record by ID
   */
  update(id: string, data: Partial<T>): T | undefined {
    const existing = this.store.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data };
    this.store.set(id, updated);
    return updated;
  }

  /**
   * Delete a record by ID
   */
  delete(id: string): boolean {
    return this.store.delete(id);
  }

  /**
   * Get all records
   */
  all(): T[] {
    return Array.from(this.store.values());
  }

  /**
   * Clear all records
   */
  clear(): void {
    this.store.clear();
    this.idCounter = 1;
  }

  /**
   * Count all records
   */
  count(): number {
    return this.store.size;
  }
}
