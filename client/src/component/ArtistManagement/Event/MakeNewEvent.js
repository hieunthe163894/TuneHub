import { TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import PerformRequest from "../../../utilities/PerformRequest";
import moment from 'moment';

export default function MakeNewEvent() {
  const [event, setEvent] = useState({});
  const [imageSrc, setImageSrc] = useState(
    "https://res.cloudinary.com/djzdhtdpj/image/upload/v1704269768/tempAvatar_juqb4s.jpg"
  );
  const { OriginalRequest } = PerformRequest();
  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    if (!file.type.startsWith("image/")) {
      // Dispatch action to show an error toast
      toast.error("Invalid file. Please drop an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    console.log(imageSrc);
    reader.readAsDataURL(file);
  });
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    const updatedEvent = { ...event };
    updatedEvent.eventBanner = imageSrc;
    try {
      const data = await OriginalRequest("event", "POST", updatedEvent);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDataChange = (name, value) => {
    setEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(event);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "40px",
    textAlign: "center",
  };
  return (
    <div>
      <h4 className="font-medium mb-5 text-lg">Create New Event</h4>
      <div className=" bg-light5 rounded-md mb-5 shadow-lg">
        <div className="py-3">
          <div className="flex">
            <div className="w-3/12 flex justify-center items-center px-5">
              <TextField
                label="EventName"
                name="eventName"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  handleDataChange("eventName", e.target.value);
                }}
              />
            </div>
            <div className="w-3/12 relative bottom-1">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="flex justify-center items-center ">
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      name="eventStart"
                      label="Event Starts"
                      onChange={(date) => {
                        handleDataChange("eventStart", moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
                      }}
                    />
                  </DemoContainer>
                </div>
              </LocalizationProvider>
            </div>
            <div className="w-3/12 relative bottom-1">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="flex justify-center items-center ">
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Event Ends"
                      onChange={(date) => {
                        handleDataChange("eventDeadline", moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
                      }}
                      name="eventDeadline"
                    />
                  </DemoContainer>
                </div>
              </LocalizationProvider>
            </div>
            <div className="w-3/12 flex justify-center items-center px-5">
              <TextField
                label="Discount"
                variant="outlined"
                type="number"
                fullWidth
                onChange={(e) => {
                  handleDataChange("discount", e.target.value);
                }}
                name="discount"
              />
            </div>
          </div>
          <div className="px-5">
            <h4 className="font-medium my-4 ">Event Banner</h4>
            <div {...getRootProps()} style={dropzoneStyle}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drop or browse your file</p>
              )}
            </div>
          </div>
          <div className="px-5">
            <h4 className="font-medium my-4 ">Event Note</h4>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              placeholder="Give us a little thought . . ."
              onChange={(e) => {
                handleDataChange("eventContent", e.target.value);
              }}
            />
          </div>
          <div className="flex justify-end pr-6 mt-5">
            <button
              className="px-12 rounded-sm text-darkText bg-light10 py-1"
              onClick={(e) => {
                handleSubmitEvent(e);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
