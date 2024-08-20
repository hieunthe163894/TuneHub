import { MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PerformRequest from "../utilities/PerformRequest";
import { format } from "date-fns";
export default function NotificationBox() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { OriginalRequest } = PerformRequest();
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await OriginalRequest("notification", "GET");
        if (response.data) {
          console.log(response.data);
          setNotificationList(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h3 className="text-lightText dark:text-darkText text-lg text-uppercase ml-3.5">
        Notification
      </h3>
      <div className="h-0.5 w-11/12 mx-auto bg-lightTextSecondary dark:bg-darkTextSecondary"></div>
      <div className="w-96">
        {isLoggedIn ? (
          notificationList.map((n, index) => (
            <MenuItem key={index} className="justify-between border-b-2 border-lightTextSecondary dark:border-darkTextSecondary">
              <p className="w-full text-lightText dark:text-darkText text-base line-clamp-2 overflow-ellipsis">
                {n.content}{" "}
              </p>
              <div>
                <div className="text-darkTextSecondary text-xs text-right">
                  <p>{format(n.createdAt, "MM/dd/yyyy")}</p>
                  <p>{format(n.createdAt, "hh:mm a")}</p>
                </div>
              </div>
            </MenuItem>
          ))
        ) : (
          <MenuItem className="">
            <p className="text-darkText text-base line-clamp-2 overflow-ellipsis">
              Log in to see the latest updates on your favourite artists
            </p>
          </MenuItem>
        )}
      </div>
    </div>
  );
}
