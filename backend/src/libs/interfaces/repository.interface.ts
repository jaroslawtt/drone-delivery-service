interface IRepository<T = unknown> {
  find(payload: unknown): Promise<T>;
  findAll(): Promise<T[]>;
  create(payload: unknown): Promise<T>;
  update(payload: unknown): Promise<T>;
  delete(payload: unknown): Promise<void>;
}

export { IRepository };
