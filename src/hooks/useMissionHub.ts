import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "@/lib/api";

type MissionEventHandlers = {
  onMissionCreated?: (mission: any) => void;
  onMissionReviewed?: (data: any) => void;
  onMissionStarted?: (data: any) => void;
  onMissionSubmitted?: (data: any) => void;
};

export function useMissionHub(userId: number | undefined, handlers: MissionEventHandlers) {
  const BACKEND = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!userId) return; 

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${BACKEND}/hubs/mission`, {
        accessTokenFactory: () => getAccessToken() || ""
      })
      .withAutomaticReconnect()
      .build();

    conn.start()
      .then(() => {
        console.log("Connected to MissionHub");

        if (handlers.onMissionCreated) {
          conn.on("MissionCreated", handlers.onMissionCreated);
        }

        if (handlers.onMissionReviewed) {
          conn.on("MissionReviewed", handlers.onMissionReviewed);
        }

        if (handlers.onMissionStarted) {
          conn.on("MissionStarted", handlers.onMissionStarted);
        }

        if (handlers.onMissionSubmitted) {
          conn.on("MissionSubmitted", handlers.onMissionSubmitted);
        }
      })
      .catch((err) => console.error("connect error:"));

    return () => {
      conn.stop();
    };
  }, [userId]);
}
