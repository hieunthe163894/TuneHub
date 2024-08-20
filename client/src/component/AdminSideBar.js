import SideBarItem from "./SideBarItem";
import { FaHome, FaUser, FaChartLine, FaChartBar, FaMusic } from "react-icons/fa";
import { LuChevronLast, LuChevronFirst } from "react-icons/lu";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { useEffect } from "react";
import { BsSoundwave } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toogleExpand } from "../redux/sideBar.js";
export default function SideBar() {
  const expanded = useSelector((state) => state.sideBar.expanded);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleResize = () => {
      dispatch(toogleExpand(window.innerWidth > 768));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={` h-screen fixed top-0 left-0 bg-light60 dark:bg-dark60 overflow-hidden transition-all z-10 ${expanded ? "w-60" : "w-20"
        }`}
    >
      <nav className="h-full flex flex-col border-r shadow-lg border-lightTextSecondary dark:border-darkTextSecondary">
        <div className="p-4 flex items-center justify-between">
          <div
            className={`flex items-center overflow-hidden transition-all ${expanded ? "w-36" : "w-0"
              }`}
          >
            <BsSoundwave color="#ff5e3a" size={33} />
            <h3 className="text-lightText dark:text-darkText font-bold text-xl">
              Tune
            </h3>
            <h3 className="text-light10 font-bold text-xl">Hub</h3>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-light30 hover:dark:bg-dark30"
            onClick={(e) => dispatch(toogleExpand(!expanded))}
          >
            {expanded ? (
              <LuChevronFirst
                className="text-lightText dark:text-darkTextSecondary"
                size={32}
              />
            ) : (
              <LuChevronLast
                className="text-lightText dark:text-darkTextSecondary"
                size={32}
              />
            )}
          </button>
        </div>

        <ul className="flex-col px-3">
          <SideBarItem
            icon={
              <FaHome size={22} className="text-lightText dark:text-darkText" />
            }
            text={"Homepage"}
            url={"/"}
            active={window.location.href === "http://localhost:3000"}
          />
          <SideBarItem
            icon={
              <FaChartBar
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"DashBoard"}
            url={"/admin/dashboard"}
            active={window.location.href === "http://localhost:3000/admin/dashboard"}
          />
          <SideBarItem
            icon={
              <FaUser
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"User Manager"}
            url={"/admin/user"}
            active={window.location.href === "http://localhost:3000/admin/user"}
          />
          <SideBarItem
            icon={
              <FaMusic
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"Song Manager"}
            url={"/admin/song"}
            active={window.location.href === "http://localhost:3000/admin/song"}
          />
          <SideBarItem
            icon={
              <FaChartLine
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"Artist Statistic"}
            url={"/admin/artist/statistic"}
            active={window.location.href === "http://localhost:3000/admin/artist/statistic"}
          />
          <SideBarItem
            icon={
              <RiAccountPinBoxFill
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"Artist Manager"}
            url={"/admin/artist/createArtist"}
            active={window.location.href === "http://localhost:3000/admin/artist/createArtist"}
          />

        </ul>
        <hr
          className={`mx-auto overflow-hidden border-lightText dark:border-darkText transition-all ${expanded ? "w-3/5" : "w-0"
            }`}
        />
      </nav>
      <div className="h-20">

      </div>
    </div>
  );
}
