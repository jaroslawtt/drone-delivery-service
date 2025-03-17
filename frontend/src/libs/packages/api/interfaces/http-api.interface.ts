import { HttpApiOptions } from "../types/http-api-options.type";

interface IHttpApi {
  load(path: string, options: HttpApiOptions): Promise<Response>;
}

export { type IHttpApi };
