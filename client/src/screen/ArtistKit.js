import { useRef, useState } from "react";
import NoActionBarTemplate from "../template/NoActionBarTemplate";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import PerformRequest from "../utilities/PerformRequest";
export default function ArtistKit() {
  const [aggred, setAggred] = useState(false);
  const darkMode = useSelector((state) => state.theme.theme);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { OriginalRequest } = PerformRequest();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: darkMode ? "#172a46" : "#FBFDF3",
    boxShadow: 24,
    p: 4,
  };
  const [artistName, setArtistName] = useState("");
  const applyArtistKit = async () => {
    try {
      const result = OriginalRequest("artistKitApplication", "POST", {
        artistName: artistName,
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NoActionBarTemplate>
      <div className="h-screen">
        <div className="mx-auto w-11/12 h-5/6 pt-3 px-5  bg-center bg-cover rounded bg-light5 dark:bg-dark30 shadow-lg relative">
          <span className="text-2xl font-medium ">Become Our Creator</span>
          <br />
          <span className="text-lightTextSecondary">
            and start making some music !!!
          </span>
          <div className="mx-auto shadow-xl w-4/12 h-[80%] bg-cover bg-center relative bg-[url('https://d3rf6j5nx5r04a.cloudfront.net/-GjKlZ-z70I3r1SsjhMxKMy8aJw=/560x0/product/f/0/6fc4d8610d5b4bbfb1a5369ff330a8fa_opt.jpg')] rounded-sm">
            <div className="absolute backdrop-blur-sm inset-0"></div>
            <div className="z-10 rounded-sm p-3 w-[92%] h-[92%] bg-light5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="text-base font-normal">Artist Kit</span>
                  <br />
                  <span className="text-2xl font-medium">250.000 đ</span>
                  <br />
                  <span className="font-base text-sm">
                    All basic features, plus
                  </span>
                  <div className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-light10" />
                      <span className="ml-3">Pubish Songs</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="text-light10" />
                      <span className="ml-3">Pubish Albums</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="text-light10" />
                      <span className="ml-3">Monetize publish</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="text-light10" />
                      <span className="ml-3">Artist Dashboard</span>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setAggred(e.target.checked);
                      }}
                    />
                    <span className="text-sm pl-3">
                      I have read and understand the{" "}
                      <span className="text-[#4096FF]">Term and condition</span>{" "}
                      of this segment
                    </span>
                  </div>
                  <button
                    disabled={!aggred}
                    className={`px-4 text-white py-1 bg-cover bg-center bg-light10 mt-3 rounded-sm ${
                      aggred ? "" : "opacity-60"
                    }`}
                    onClick={(e) => {
                      handleOpen();
                    }}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="text-lightText dark:text-darkText">
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              className="mb-3"
            >
              What should we call you
            </Typography>
            <TextField
              label="Artist name"
              variant="outlined"
              fullWidth
              value={artistName}
              onChange={(e) => {
                setArtistName(e.target.value);
              }}
            />
            <div className="flex justify-end w-full">
              <button
                className="bg-light10 px-3 py-1 mt-3 rounded-sm"
                onClick={applyArtistKit}
              >
                Apply
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </NoActionBarTemplate>
  );
}
