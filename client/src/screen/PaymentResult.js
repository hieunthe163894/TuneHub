import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import PerformRequest from "../utilities/PerformRequest";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/auth";

export default function PaymentResult() {
  const { status, message } = useParams();
  const navigate = useNavigate();
  const hasMounted = useRef(false);
  const {OriginalRequest} = PerformRequest();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      if (hasMounted.current) {
        if (status === "ok") {
          toast.success(message, { duration: 6000 });
        } else {
          toast.error(message, { duration: 6000 });
        }
        const user = await OriginalRequest("auth/user", "GET");
        if (user) {
          dispatch(setUserInfo(user.data));
        }
        navigate("/");
      } else {
        hasMounted.current = true;
      }
    };
    fetch()
  }, [hasMounted]);
  return <div classsName="min-h-screen bg-light60 w-full"></div>;
}
