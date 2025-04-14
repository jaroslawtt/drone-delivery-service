"use client";

import { type Metadata } from "next";
import "./globals.scss";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [droneLocations, setDroneLocations] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/api/v1/map", {});

    eventSource.onmessage = ({ data }) => {
      setDroneLocations(JSON.parse(data));
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <html lang="en">
      <body>
        {children} {JSON.stringify(droneLocations)}
      </body>
    </html>
  );
}
