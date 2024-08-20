import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import "../style/themeSwitcher.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toogleTheme } from "../redux/theme.js";
export default function ThemeSwitcher() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [theme]);
  return (
    <div className="flex items-center">
      <button
        onClick={(e) => {
          dispatch(toogleTheme());
        }}
      >
        {theme ? (
          <FaSun size={24} color="#da8f66" />
        ) : (
          <FaMoon size={22} color="#F2785C" />
        )}
      </button>
    </div>
  );
}
