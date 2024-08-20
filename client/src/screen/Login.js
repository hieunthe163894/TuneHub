import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";
import { motion, useAnimation } from "framer-motion";
import { BsSoundwave } from "react-icons/bs";
import { FormControl, TextField } from "@mui/material";
// import MuiTextField from "@mui/material/TextField";
// import styled from "@emotion/styled";
import SERVER_URL from "../config.js";
import "../style/login.css";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PerformRequest from "../utilities/PerformRequest.js";
import { login } from "../redux/auth.js";
import { GoogleLogin } from "@react-oauth/google";
export default function Login() {
  const controls = useAnimation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { OriginalRequest } = PerformRequest();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(loginData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await OriginalRequest(
        "auth/login",
        "POST",
        loginData
      );
      if (data) {
        dispatch(login(data.data));

        console.log(data.data);

        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const postGoogleAuth = async (token) => {
    try {
      //a reusable fetch function, the body is optional,
      //other parameters are uri, navigate hook, and the method of the reques
      const data = await OriginalRequest("auth/googlelogin", "POST", {
        token: token,
      });
      if (data) {
        dispatch(login(data.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //   const CustomTextField = styled(MuiTextField)({
  //     // Your styles here
  //     '& label.Mui-focused': {
  //       color: 'green',
  //     },
  //     '& .MuiOutlinedInput-root': {
  //       '& fieldset': {
  //         borderColor: 'red',
  //       },
  //       '&:hover fieldset': {
  //         borderColor: 'blue',
  //       },
  //       '&.Mui-focused fieldset': {
  //         borderColor: 'green',
  //       },
  //     },
  //   });
  return (
    <div className="w-full h-screen flex">
      <div className="md:w-2/6 w-full bg-light60 p-2">
        <motion.div
          onHoverStart={() =>
            controls.start({
              //   scale: 1.2,
              transformOrigin: "left",
              textDecoration: "underline",
            })
          }
          onHoverEnd={() =>
            controls.start({
              //   scale: 1,
              transformOrigin: "left",
              textDecoration: "none",
            })
          }
          animate={controls}
          transition={{ duration: 0.1 }}
        >
          <Link className="flex items-center" to={"/"}>
            <MdOutlineKeyboardBackspace size={30} />
            <p className="text-lg font-semibold text-light10">HomePage</p>
          </Link>
        </motion.div>
        <div className="w-4/5 mx-auto">
          <div className={`flex items-center pt-4`}>
            <BsSoundwave color="#ff5e3a" size={50} className="mr-1" />
            <h3 className="text-lightText font-bold text-2xl">Tune</h3>
            <h3 className="text-light10 font-bold text-2xl">Hub</h3>
          </div>
          <h4 className="font-medium text-lightText text-2xl pt-4">
            Log in to your account
          </h4>
          <h4 className="text-lightTextSecondary">
            Don't have an account ? Sign up{" "}
            <Link to={"/signup"} className="text-blue-600 underline text-md">
              here
            </Link>
          </h4>
          <form
            style={{ paddingTop: "30px" }}
            className="w-full"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <FormControl className="w-full gap-6 flex-col">
              <TextField
                required
                label="email address"
                name="email"
                onChange={(e) => {
                  handleChange(e);
                }}
                color="warning"
              />
              <TextField
                required
                type="password"
                label="password"
                name="password"
                onChange={(e) => {
                  handleChange(e);
                }}
                color="warning"
              />
              <button
                className="bg-light10 rounded-md py-3 shadow-md"
                type="submit"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                Login
              </button>
            </FormControl>
          </form>
          <h4 className="text-textSecondary pt-2">
            Forgot password ? Reset{" "}
            <Link to={"/forgot-password"} className="text-blue-600 underline text-md">
              here
            </Link>
          </h4>
          <div className="flex items-center justify-between pt-4">
            <hr className="w-2/5 bg-slate-600" style={{ height: "2px" }} />
            or
            <hr className="w-2/5 bg-slate-600" style={{ height: "2px" }} />
          </div>
          <div className="pt-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                // console.log(credentialResponse?.credential);
                postGoogleAuth(credentialResponse?.credential);
              }}
              onError={() => {
                toast.error("Something went wrong");
              }}
              text="Login with google"
              size={"large"}
              width={"395px"}
            />
          </div>
        </div>
      </div>
      <div className="md:w-4/6 w-0 bg-cover bg-[url('https://volna.volkovdesign.com/img/home/slide1.jpg')] bg-center">
        <div className="w-full h-screen backdrop-filter backdrop-brightness-50 py-14 px-14">
          <p className="typingText text-light10 text-4xl font-medium">
            Welcome back
          </p>
          <p className="w-3/5 typingText text-neutral-300 text-base font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            quis mauris nunc. Nullam dignissim sapien non augue consequat
            tristique.{" "}
            <span className="underline flex items-center">
              Nullam eget mollis nisl.
              <IoArrowForward />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
