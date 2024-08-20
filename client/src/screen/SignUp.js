import { FormControl, TextField } from "@mui/material";
import { BsSoundwave } from "react-icons/bs";
import { IoArrowForward } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import PerformRequest from "../utilities/PerformRequest.js";
import toast from "react-hot-toast";
export default function SignUp() {
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    introduction: "",
  });
  const { OriginalRequest } = PerformRequest();
  const [imageSrc, setImageSrc] = useState(
    "https://res.cloudinary.com/djzdhtdpj/image/upload/v1704269768/tempAvatar_juqb4s.jpg"
  );
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    if (!file.type.startsWith("image/")) {
      // Dispatch action to show an error toast
      toast.error("Invalid file. Please drop an image file.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    console.log(imageSrc);
    reader.readAsDataURL(file);
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
  };
  const handleDataChange = (e) => {
    setSignUpData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateSignupData = { ...signUpData };
    updateSignupData.profilePicture = imageSrc;
    try {
      setLoading(true);
      const data = await OriginalRequest(
        `auth/signup`,
        "POST",
        updateSignupData
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex">
      <div className="md:w-4/6 w-0 bg-cover bg-[url('https://us.images.westend61.de/0001361979pw/crowd-at-music-concert-EYF03813.jpg')] bg-center">
        <div className="w-full h-full backdrop-filter backdrop-brightness-50 py-14 px-14">
          <p className="typingText text-light10 text-4xl font-medium">
            Hi there,
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
      <div className="md:w-2/6 w-full h-full bg-light60 p-2 z-10">
        <div>
          <Link className="flex items-center" to={"/"}>
            <MdOutlineKeyboardBackspace size={30} />
            <p className="text-lg font-semibold text-light10">HomePage</p>
          </Link>
        </div>
        <div className="w-4/5 mx-auto">
          <div className={`flex items-center pt-4`}>
            <BsSoundwave color="#ff5e3a" size={50} className="mr-1" />
            <h3 className="text-lightText font-bold text-2xl">Tune</h3>
            <h3 className="text-light10 font-bold text-2xl">Hub</h3>
          </div>
          <h4 className="font-medium text-lightText text-2xl pt-4">
            Create your account
          </h4>
          {/* <h4 className="text-lightTextSecondary">It's simple. we'll help</h4> */}
          <form
            className="w-full py-10"
            encType="multipart/form-data"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <img
              src={imageSrc}
              className="w-20 h-20 rounded-full mx-auto mb-5 object-cover object-center"
            />
            <FormControl className="w-full gap-2 flex-col">
              <div className="flex items-center justify-between">
                <TextField
                  required
                  label="First name"
                  name="firstName"
                  color="warning"
                  onChange={(e) => {
                    handleDataChange(e);
                  }}
                />
                <div className="w-5"></div>
                <TextField
                  required
                  label="Last name"
                  name="lastName"
                  color="warning"
                  onChange={(e) => {
                    handleDataChange(e);
                  }}
                />
              </div>
              <TextField
                required
                label="email address"
                name="email"
                color="warning"
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />
              <TextField
                required
                type="password"
                label="password"
                name="password"
                color="warning"
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />
              <TextField
                required
                type="password"
                label="confirm password"
                name="confirmPassword"
                color="warning"
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />
              <TextField
                label="Introduce yourself"
                name="introduction"
                color="warning"
                multiline
                rows={2}
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drop or browse your profile picture</p>
                )}
              </div>
              <button
                className={`${
                  loading ? "bg-slate-400" : "bg-light10"
                } rounded-md py-3 shadow-md`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Please wait ..." : "Sign Up"}
              </button>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  );
}
