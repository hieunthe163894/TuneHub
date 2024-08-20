import { useState, useRef, useEffect } from "react";
import AdminTemplate from "../../../template/AdminTemplate";
import PerformRequest from "../../../utilities/PerformRequest";
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import AdminActiveArtist from "../AdminActiveArtist/AdminActiveArtist";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
function CreateArtistAccount() {
  const { OriginalRequest } = PerformRequest();
  const defaultArtist = {
    first_name: "",
    last_name: "",
    email: "",
    introduction: "",
    profile_picture: "",
    artist_name: "",
    account_number: "",
    account_holder: "",
  };
  const [artistInfo, setArtistInfo] = useState(defaultArtist);
  const [imageCover, setImageCover] = useState("");
  const [imageFile, setImageFile] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistInfo({ ...artistInfo, [name]: value });

    console.log(artistInfo);
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setImageFile(file.name);
    reader.onloadend = () => {
      setImageCover(reader.result);
      const base64Image = reader.result;
      setArtistInfo((prevAlbumChange) => ({
        ...prevAlbumChange,
        profile_picture: base64Image,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const createArtistAccount = async () => {
    const {
      first_name,
      last_name,
      email,
      introduction,
      profile_picture,
      role,
      artist_name,
      account_number,
      account_holder,
    } = artistInfo;
    const response = await OriginalRequest(
      `artists/createArtistByAdmin/`,
      "POST",
      {
        first_name,
        last_name,
        email,
        introduction,
        profile_picture,
        role,
        artist_name,
        account_number,
        account_holder,
      }
    );

    if (response) {
      setImageCover("");
      setArtistInfo(defaultArtist);
      setImageFile("");
    }
  };
  const [valid, setValid] = useState(false)
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const hasMouted = useRef(false)
  useEffect(()=> {
    if(hasMouted.current){
      setValid(true)
    }else{
      hasMouted.current = true;
    }
  }, [hasMouted])
  if(valid){
    if (userInfo.role === "admin") {
      return (
        <AdminTemplate>
          <div className="w-full min-h-screen px-5 ">
            <h3 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
              Artist Manager
            </h3>
            <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
            <div className="w-full mx-auto p-5 mb-5">
              <AdminActiveArtist />
            </div>
            <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
            <div className="flex items-start justify-between">
              <div className="formSection w-7/12">
                <h4 className="text-lightText dark:text-darkText text-2xl font-semibold pl-16 p-6">
                  Artist Profile
                </h4>
                <form className="w-10/12 mx-auto" encType="multipart/form-data">
                  <FormControl className="w-full gap-6 flex-col">
                    <FormControl className="flex-row justify-between items-center">
                      <FormControl className="w-6/12 mr-5">
                        <TextField
                          required
                          label="Artist name"
                          name="artist_name"
                          color="warning"
                          value={artistInfo?.artist_name}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl
                        className="w-6/12 ml-5"
                        onClick={handleImageClick}
                      >
                        <TextField
                          required
                          label="Upload Your Cover Image Here"
                          // onChange={handleImageUpload}
                          value={imageFile}
                        />
                        <input
                          id="imageInput"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                        />
                      </FormControl>
                    </FormControl>
  
                    <FormControl className="flex-row justify-between items-center">
                      <FormControl className="w-6/12 mr-5">
                        <TextField
                          required
                          label="First Name"
                          name="first_name"
                          color="warning"
                          value={artistInfo?.first_name}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl className="w-6/12 ml-5">
                        <TextField
                          required
                          label="Last Name"
                          name="last_name"
                          color="warning"
                          value={artistInfo?.last_name}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </FormControl>
  
                    <FormControl className="flex-row justify-between items-center">
                      <FormControl className="w-6/12 mr-5">
                        <TextField
                          required
                          label="Email"
                          name="email"
                          color="warning"
                          value={artistInfo?.email}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl className="w-6/12 ml-5">
                        <TextField
                          required
                          label="Introduction"
                          name="introduction"
                          color="warning"
                          value={artistInfo?.introduction}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </FormControl>
                  </FormControl>
                </form>
                <h4 className="text-lightText dark:text-darkText text-2xl font-semibold pl-16 p-8">
                  Banking Information
                </h4>
                <form className="w-10/12 mx-auto" encType="multipart/form-data">
                  <FormControl className="w-full gap-6 flex-col">
                    <FormControl className="flex-row justify-between items-center">
                      <FormControl className="w-6/12 mr-5">
                        <TextField
                          required
                          label="Account number"
                          name="account_number"
                          color="warning"
                          value={artistInfo?.account_number}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl className="w-6/12 ml-5">
                        <TextField
                          required
                          label="Account holder's name"
                          name="account_holder"
                          color="warning"
                          value={artistInfo?.account_holder}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </FormControl>
                  </FormControl>
                </form>
                <Button
                  className="bg-orange-400 m-16"
                  variant="contained"
                  onClick={createArtistAccount}
                >
                  CREATE
                </Button>
              </div>
              <div className="formSection w-5/12">
                <h4 className="text-lightText dark:text-darkText text-2xl font-semibold pl-16 py-6">
                  Demo
                </h4>
                <form
                  className="w-9/12 ml-16 mx-auto"
                  encType="multipart/form-data"
                >
                  <Card className="bg-slate-100">
                    <CardContent>
                      <div className="previewSection flex">
                        <img
                          className="w-2/12 mr-5 aspect-square border-2 shadow-lg border-lightTextSecondary/30 rounded-md object-cover object-center"
                          src={
                            imageCover
                              ? imageCover
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi_guXp3VdsedwmecUjqvEmZEJ8B1Kp2RdlA&s"
                          }
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Typography className="text-lg hover:underline font-bold">
                            {artistInfo.artist_name}
                          </Typography>
                          <Typography
                            className="text-xs hover:underline"
                            style={{ fontSize: "0.8rem", lineHeight: "1rem" }}
                          >
                            {artistInfo.email}
                          </Typography>
                        </div>
                      </div>
                      <Typography className="pt-4">
                        {artistInfo.introduction}
                      </Typography>
                    </CardContent>
                  </Card>
                </form>
              </div>
            </div>
          </div>
        </AdminTemplate>
      );
    }else{
      toast.error('Unauthorized')
      navigate(`/`)
    }
  }
    
}

export default CreateArtistAccount;
