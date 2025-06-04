"use client";

import { FC, useState } from "react";
import { DroneGetAllItemResonseDto } from "~/packages/drones/drones";
import { DroneCard } from "../drone-card/drone-card";
import { Button } from "~/libs/components/button/button";
import { AddDroneMenu } from "../add-drone-menu/add-drone-menu";

type Properties = {
  drones: DroneGetAllItemResonseDto[];
};

const DroneParkList: FC<Properties> = ({ drones }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;

  const indexOfLastDrone = currentPage * itemsPerPage;
  const indexOfFirstDrone = indexOfLastDrone - itemsPerPage;
  const currentDrones = drones.slice(indexOfFirstDrone, indexOfLastDrone);

  const totalPages = Math.ceil(drones.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden">
      <div className="flex flex-col gap-y-3">
        <div className="w-full flex justify-between items-center">
          <h3 className="text-nowrap font-semibold text-xl">Drone Park</h3>
          <AddDroneMenu />
        </div>
        <div className="w-full flex-1 min-h-0 grid grid-cols-1 gap-y-3 flex-shrink overflow-y-scroll">
          {currentDrones.map((drone) => (
            <DroneCard key={drone.serialNumber} droneData={drone} />
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-x-4 mt-4">
          <Button
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            label="Previous"
            className="px-4 py-2 font-semibold"
          />
          <span className="text-sm text-gray-700 text-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            label="Next"
            className="px-4 py-2 font-semibold"
          />
        </div>
      )}
    </div>
  );
};

export { DroneParkList };
