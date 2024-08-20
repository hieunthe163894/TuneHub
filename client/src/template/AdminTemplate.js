import { useSelector } from "react-redux";
import AdminSideBar from "../component/AdminSideBar.js";
import HeaderDefault from "../component/HeaderDefault.js";
export default function AdminTemplate({ title, children }) {
  const expanded = useSelector((state) => state.sideBar.expanded);
  return (
    <div className="h-full flex-col">
      <div className="h-full flex flex-row">
        <AdminSideBar />
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
