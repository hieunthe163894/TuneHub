import { useRef, useState, useEffect } from "react";
import PerformRequest from "../../../utilities/PerformRequest.js";
export default function ActiveEvent() {
  const [events, setEvents] = useState([]);
  const hasMounted = useRef(false);
  const { OriginalRequest } = PerformRequest();
  useEffect(() => {
    const fetchEvents = async () => {
      const result = await OriginalRequest("event", "GET");
      if (result.data) {
        setEvents(result.data);
      }
    };
    if (hasMounted.current) {
      fetchEvents();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);
  return (
    <div className="flex flex-wrap w-full ">
      {events.map((e) => (
        <div
          className="shadow-md h-32 w-96 justify-between bg-center bg-cover mr-4 mb-3 rounded-md relative"
          key={e._id}
          style={{ backgroundImage: `url(${e.eventBanner})` }}
        >
          <div className="absolute inset-0 bg-black opacity-30 rounded-md"></div>
          <h5 className="text-darkText ml-3 mt-24 opacity-100 z-10 relative">
            {e.eventName}
          </h5>
        </div>
      ))}
    </div>
  );
}
