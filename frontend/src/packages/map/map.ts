import { http } from "~/libs/packages/http/http";
import { MapApi } from "./map-api";

const mapApi = new MapApi({
  baseUrl: process.env["NEXT_PUBLIC_API_KYIV_CITY_AREA"] as string,
  http: http,
});

export { type MapGetAllItemReponseDto } from "./libs/types/types.js";
export { mapApi };
