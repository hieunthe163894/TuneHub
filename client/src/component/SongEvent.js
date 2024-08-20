import moment from "moment";
export default function SongEvent({ event }) {
  const clientTimezone = moment.tz.guess();
  return (
    <div className="w-full px-5 py-3">
      <h4 className="text-xl font-semibold text-lightText dark:text-darkText">
        Event
      </h4>
      <div
        className="bg-cover bg-center h-48 mt-3 rounded-sm relative group"
        style={{ backgroundImage: `url(${event.eventBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
        <div className="absolute bottom-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
          <p className="text-white text-lg font-medium">{event.eventName}</p>
          <span className="text-darkTextSecondary">
            from{" "}
            {moment.tz(event.eventStart, clientTimezone).format("YYYY-MM-DD")}{" "}
            to{" "}
            {moment
              .tz(event.eventDeadline, clientTimezone)
              .format("YYYY-MM-DD")}
          </span>
          <p className="text-darkTextSecondary">{event.eventContent}</p>
        </div>
      </div>
    </div>
  );
}
