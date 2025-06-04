import { configureString } from "~/libs/helpers/helpers";
import { IHttp } from "../http/libs/interfaces/interfaces";
import { IHttpApi } from "./interfaces/http-api.interface";
import { HttpApiOptions, HttpApiResponse } from "./types/types";
import { StorageKey } from "../storage/storage";

type Constructor = {
  baseUrl: string;
  path: string;
  http: IHttp;
};

class HttpApi implements IHttpApi {
  private baseUrl: string;

  private path: string;

  private http: IHttp;

  public async load(
    path: string,
    options: HttpApiOptions,
  ): Promise<HttpApiResponse> {
    const { method, payload = null, hasAuth = false } = options;

    const headers = await this.getHeaders(hasAuth);

    const response = await this.http.load(path, {
      method,
      headers,
      payload,
    });

    return (await this.checkResponse(response)) as HttpApiResponse;
  }

  public constructor({ baseUrl, http, path }: Constructor) {
    this.baseUrl = baseUrl;
    this.http = http;
    this.path = path;
  }

  protected getFullEndpoint<T extends Record<string, string>>(
    ...parameters: [...string[], T]
  ): string {
    const copiedParameters = [...parameters];

    const options = copiedParameters.pop() as T;

    return configureString(
      this.baseUrl,
      this.path,
      ...(copiedParameters as string[]),
      options,
    );
  }

  private async getHeaders(hasAuth: boolean): Promise<Headers> {
    const headers = new Headers();

    headers.append("content-type", "application/json");

    if (hasAuth) {
      const token = window.localStorage.getItem(StorageKey.ACCESS_TOKEN);

      headers.append("Authorization", `Bearer ${token ?? ""}`);
    }

    return headers;
  }

  private async checkResponse(response: Response): Promise<Response | never> {
    if (!response.ok) {
      throw response.status;
    }

    return response;
  }
}

export { HttpApi };
