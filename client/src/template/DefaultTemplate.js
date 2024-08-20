import { useSelector } from "react-redux";
import Header from "../component/Header";
import SideBar from "../component/SideBar";
import ActionBar from "../component/ActionBar.js";
import SongQueue from "../component/SongQueue.js";
import HeaderDefault from "../component/HeaderDefault.js";
import Player from "../component/Player.js";

export default function DefaultTemplate({ title, children }) {
  const expanded = useSelector((state) => state.sideBar.expanded);
  return (
    <div className="h-full flex-col">
      <div className="h-full flex flex-row mb-20">
        <SideBar />
        <div
          className={`w-full bg-light60 dark:bg-dark60 transition-all ${
            window.innerWidth > 768 ? (expanded ? "ml-60" : "ml-20") : "ml-20"
          }`}
        >
          <HeaderDefault />
          {/* <div style={{ height: "80px" }}></div> */}
          {children}
        </div>
      </div>
      <SongQueue />
      <ActionBar />
    </div>
  );
}
