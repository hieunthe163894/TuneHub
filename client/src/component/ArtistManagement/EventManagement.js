import ActiveEvent from "./Event/ActiveEvent";
import MakeNewEvent from "./Event/MakeNewEvent";

export default function EventManagement() {
  return (
    <div className="w-full">
      <div className="event">
        <h4 className="font-medium mb-3 text-lg">Active Events</h4>
        <ActiveEvent />
        <MakeNewEvent />
      </div>
    </div>
  );
}
