"use client";
import { FC } from "react";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import {
  useInitMap,
  useSetDronesMarkers,
  useFetchDrones,
  useSetDeliveryRoute,
} from "./libs/hooks/hooks";
import { useMapStore } from "~/stores/map/map";

type Properties = {
  initCoordinates?: [number, number];
  zoomLevel?: number;
};

const kyiv: [number, number] = [30.5234, 50.4501];

const Map: FC<Properties> = ({
  initCoordinates = kyiv,
  zoomLevel = 10,
}: Properties) => {
  const { mapRef: map, mapContainerRef: mapContainer } = useInitMap({
    initCoordinates,
    zoomLevel,
  });
  const canSetRoute = useMapStore((state) => state.canSetRoute);

  const { data } = useFetchDrones();

  useSetDronesMarkers({
    mapRef: map,
    drones: data,
  });
  useSetDeliveryRoute({
    mapRef: map,
    isEditable: canSetRoute,
  });

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export { Map };
