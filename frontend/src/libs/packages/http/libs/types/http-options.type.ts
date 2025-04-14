import { HttpMethod } from "./http-method.type";

type HttpOptions = {
  method: HttpMethod;
  payload: BodyInit | null;
  headers: Headers;
};

export { type HttpOptions };
