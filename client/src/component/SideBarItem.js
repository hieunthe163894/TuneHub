import { useContext } from "react";
import { expandedContext } from "./SideBar.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function SideBarItem({ icon, text, active, alert, url}) {
  const expanded = useSelector((state) => state.sideBar.expanded);
  return (
    <li
      className={`relative font-medium
        rounded-md cursor-pointer text-textSecondary transition-colors
        ${
          active
            ? "bg-light30 dark:bg-dark30 text-lightText dark:text-darkText"
            : "hover:bg-light30 hover:dark:bg-dark30 text-lightText dark:text-darkText"
        }`}
    >
      <Link to={url} className="flex items-center py-2 px-3 my-1">
        <div>{icon}</div>
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-40" : "w-0"
          }`}
        >
          &nbsp;{text}
        </span>
      </Link>
    </li>
  );
}
