import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PerformRequest from "../utilities/PerformRequest";
import {login} from "../redux/auth.js"
export default function Oauth2Redirect() {
  const navigate = useNavigate();
  const hasMounted = useRef(false);
  const auth = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { OriginalRequest } = PerformRequest();
  useEffect(() => {
    const fetchData = async () => {
      if (hasMounted.current) {
        const result = await OriginalRequest("auth/user", navigate, "GET");
        if (result) {
          dispatch(login(result));
          console.log(result);
        }
      } else {
        hasMounted.current = true;
      }
    };
    fetchData().then(() => {
      navigate("/");
    });
  }, [hasMounted]);

  return <div>Redirecting</div>;
}
