import { useSelector } from "react-redux";
import ArtistSideBar from "../component/ArtistSideBar.js";
import HeaderDefault from "../component/HeaderDefault.js";
export default function ArtistTemplate({ title, children }) {
  const expanded = useSelector((state) => state.sideBar.expanded);
  return (
    <div className="h-full flex-col">
      <div className="h-full flex flex-row">
        <ArtistSideBar />
        <div
          className={`w-full bg-light60 dark:bg-dark60 transition-all ${
            window.innerWidth > 768 ? (expanded ? "ml-60" : "ml-20") : "ml-20"
          }`}
        >
          <HeaderDefault />
          {children}
        </div>
      </div>
    </div>
  );
}
