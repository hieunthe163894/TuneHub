import { Link } from "react-router-dom";
import { FaUserCog } from "react-icons/fa";
import { useSelector } from "react-redux";
import ThemeSwitcher from "./ThemeSwitcher";
import { useLocation } from "react-router-dom";
import Search from "./search/Search.js";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import Logout from "../utilities/LogOut.js";
import NotificationBox from "./NotificationBox.js";
import socket from "../utilities/Socket.js";
import { FaChartLine } from "react-icons/fa6";
export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const darkMode = useSelector((state) => state.theme.theme);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const openMenu = (e) => {
    setOpenProfileMenu(true);
    setAnchorProfile(e.currentTarget);
  };
  const closeMenu = (e) => {
    setOpenProfileMenu(false);
    setAnchorProfile(null);
  };
  const openNotificationF = (e) => {
    setOpenNotification(true);
    setNotificationAnchor(e.currentTarget);
  };
  const closeNotification = () => {
    setOpenNotification(false);
    setNotificationAnchor(null);
  };
  const toogleSnackBar = (value) => {
    setOpenSnackBar(value);
  };
  useEffect(() => {
    const handleNewNotification = () => {
      setOpenSnackBar(true);
      console.log("troi oi sao ko duoc v");
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  const { performLogOut } = Logout();

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex items-center justify-end pt-5">
      {/* <FaCogs size={35} className="mr-8" color="#f2785c" /> */}
      {currentPath === "/explore" ? <Search /> : null}
      <ThemeSwitcher />
      <div>
        <div
          onClick={(e) => {
            openNotificationF(e);
            // setOpenSnackBar(true);
          }}
        >
          <IoIosNotifications
            className="text-light10 dark:text-dark10 ml-5"
            size={28}
          />
        </div>

        <Menu
          open={openNotification}
          anchorEl={notificationAnchor}
          onClose={closeNotification}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          autoFocus={false}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: darkMode ? "#172a46" : "#FBFDF3",
            },
          }}
        >
          <NotificationBox />
        </Menu>
      </div>
      <div className="">
        {isLoggedIn ? (
          <div className="mr-10 ml-5">
            <img
              src={userInfo.profile_picture}
              className="w-14 h-14 object-center object-cover rounded-full border-orange-200 dark:bg-dark10 shadow-lg border-2"
              onClick={(e) => {
                openMenu(e);
              }}
            />
            <Menu
              className="mt-3"
              open={openProfileMenu}
              anchorEl={anchorProfile}
              onClose={closeMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              autoFocus={false}
            >
              <MenuItem>
                <Link to={"/profile"} className="flex items-center">
                  <ListItemIcon>
                    <FaCircleUser />
                  </ListItemIcon>
                  <ListItemText>Your profile</ListItemText>
                </Link>
              </MenuItem>
              {userInfo.role === "artist" ? (
                <MenuItem>
                  <Link to={"/artist/dashboard"} className="flex items-center">
                    <ListItemIcon>
                      <FaChartLine />
                    </ListItemIcon>
                    <ListItemText>Artist dashBoard</ListItemText>
                  </Link>
                </MenuItem>
              ) : (
                <></>
              )}
              {userInfo.role === "admin" ? (
                <MenuItem>
                  <Link to={"/admin/dashboard"} className="flex items-center">
                    <ListItemIcon>
                      <FaUserCog />
                    </ListItemIcon>
                    <ListItemText>Admin dashBoard</ListItemText>
                  </Link>
                </MenuItem>
              ) : (
                <></>
              )}
              <Divider />
              <MenuItem
                onClick={(e) => {
                  performLogOut(e);
                }}
              >
                <ListItemIcon>
                  <IoLogOut />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Link to={"/login"} className="mr-10 ml-5">
            <button className="bg-light10 dark:bg-dark10 px-6 py-2 rounded-full text-textSecondary text-md hover:text-white">
              Login
            </button>
          </Link>
        )}
      </div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={10000}
        onClose={(e) => {
          setOpenSnackBar(false);
        }}
        sx={{ backgroundColor: "#FBFBFB" }}
        message="You have a new unread notification"
      />
    </div>
  );
}
