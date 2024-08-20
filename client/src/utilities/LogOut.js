import { useDispatch } from "react-redux";
import { logOut } from "../redux/auth.js";
import { useNavigate } from "react-router-dom";
import PerformRequest from "./PerformRequest.js";
export default function LogOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {OriginalRequest} = PerformRequest()
  const clearToken = async () => {
    await OriginalRequest("auth/logOut", "GET")
  };
  const clearAuthInfo = () => {
    dispatch(logOut());
  };
  const performLogOut = async () => {
    await clearToken();
    dispatch(logOut());
    navigate("/");
  };
  return {performLogOut}
}
