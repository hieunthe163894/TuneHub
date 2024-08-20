import { Link } from "react-router-dom";
import { FaCogs } from "react-icons/fa";
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import Logout from "../utilities/LogOut.js";
import { logOut } from "../redux/auth.js";
export default function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const expanded = useSelector((state) => state.sideBar.expanded);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const scrollPos = useSelector((state) => state.window.scrollPos);
  const openMenu = (e) => {
    setOpenProfileMenu(true);
    setAnchorProfile(e.currentTarget);
  };
  const closeMenu = (e) => {
    setOpenProfileMenu(false);
    setAnchorProfile(null);
  };
  const { performLogOut } = Logout();

  const location = useLocation();
  const currentPath = location.pathname;
   
  return (
    <div
      className={`flex items-center justify-end p-3 fixed top-0 right-0 left-0 z-50 ${
        window.innerWidth > 768 ? (expanded ? "ml-60" : "ml-20") : "ml-20"
      } ${scrollPos < 280 ? "" : "bg-light30 dark:bg-dark30"}`}
    >
      {/* <FaCogs size={35} className="mr-8" color="#f2785c" /> */}
      {currentPath === "/explore" ? <Search /> : null}
      <ThemeSwitcher />
      <IoIosNotifications
        className="text-light10 dark:text-dark10 ml-5 z-50"
        size={28}
      />
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
    </div>
  );
}
