import { type HttpOptions } from "~/libs/packages/http/libs/types/types";

type HttpApiOptions = Omit<HttpOptions, "headers" | "payload"> & {
  payload?: HttpOptions["payload"];
  hasAuth?: boolean;
};

export { type HttpApiOptions };
