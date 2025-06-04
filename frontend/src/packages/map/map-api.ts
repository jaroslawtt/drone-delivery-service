import { HttpApi } from "~/libs/packages/api/http-api";
import { IHttp } from "~/libs/packages/http/libs/interfaces/interfaces";
import type { Feature, Position } from "geojson"; // Import necessary types

type Constructor = {
  baseUrl: string;
  http: IHttp;
};

class MapApi extends HttpApi {
  public constructor({ baseUrl, http }: Constructor) {
    super({ path: "", baseUrl, http });
  }

  public async getKyivCityArea(): Promise<Position[][]> {
    const apiUrl = process.env["NEXT_PUBLIC_API_KYIV_CITY_AREA"] as string;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API Error in getKyivCityArea: ${response.statusText}`);
    }
    const data = await response.json();

    const feature = data.features.find(
      (f: Feature) =>
        f.properties?.["text"] === "Kyiv City" ||
        f.properties?.["name"] === "Kyiv",
    );

    return (feature.geometry.coordinates as Position[][]) ?? [];
  }
}

export { MapApi };
