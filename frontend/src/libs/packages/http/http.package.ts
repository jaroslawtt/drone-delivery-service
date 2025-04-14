import { IHttp } from "./libs/interfaces/interfaces";
import { HttpOptions } from "./libs/types/types";

class Http implements IHttp {
  public load(path: string, options: HttpOptions): Promise<Response> {
    const { method, payload, headers } = options;

    return fetch(path, {
      method,
      headers,
      body: payload,
    });
  }
}

export { Http };
