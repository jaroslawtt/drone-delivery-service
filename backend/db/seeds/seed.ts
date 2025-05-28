import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { droneDetails } from "../../src/packages/drones/drone-details.schema.js";
import { DroneStatus } from "../../src/packages/drones/libs/enums/enums.js";
import { drones } from "../../src/packages/drones/drone.schema.js";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

const db = drizzle(pool);

const main = async () => {
  console.log("Seeding database...");

  await db.transaction(async (tx) => {
    const insertedDrones = await tx
      .insert(drones)
      .values([
        {
          serialNumber: "DJI-MAVIC-001",
          status: DroneStatus.OFFLINE,
          batteryLevel: 100,
        },
        {
          serialNumber: "AUTEL-EVO-002",
          status: DroneStatus.OFFLINE,
          batteryLevel: 85,
        },
        {
          serialNumber: "SKYDIO-X2-003",
          status: DroneStatus.OFFLINE,
          batteryLevel: 0,
        },
      ])
      .returning({ id: drones.id });

    const droneIds = insertedDrones.map((drone) => drone.id);

    await tx.insert(droneDetails).values([
      {
        droneId: droneIds.at(0) as number,
        model: "DJI Mavic Air 2",
        maxSpeed: "68.40",
        maxAltitude: "5000.00",
        batteryCapacity: "3.50",
        weightCapacity: "0.570",
      },
      {
        droneId: droneIds.at(1) as number,
        model: "Autel EVO II",
        maxSpeed: "72.00",
        maxAltitude: "7000.00",
        batteryCapacity: "3.90",
        weightCapacity: "1.300",
      },
      {
        droneId: droneIds.at(2) as number,
        model: "Skydio X2",
        maxSpeed: "56.00",
        maxAltitude: "4500.00",
        batteryCapacity: "4.20",
        weightCapacity: "0.800",
      },
    ]);
  });

  console.log(`Successfully seeded`);
  process.exit(0);
};

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
