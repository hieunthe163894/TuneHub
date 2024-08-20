import cron from "node-cron";
import { EventRepository, SongRepository } from "../repository/index.js";

export const eventScheduler = () => {
  cron.schedule(
    "0 * * * * *",
    ()=>{
      EventRepository.updateEventStatus();
      SongRepository.removeEvents();
    },
    {
      timezone: "UTC",
    }
  );
  console.log("Scheduler initialized to run every 30 seconds.");
};
