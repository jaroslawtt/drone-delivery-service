interface IService<T = unknown> {
  find(payload: unknown): Promise<T>;
  findAll(): Promise<T[]>;
  create(payload: unknown): Promise<T>;
  update(...args: unknown[]): Promise<T>;
  delete(payload: unknown): Promise<T>;
}

export { IService };
