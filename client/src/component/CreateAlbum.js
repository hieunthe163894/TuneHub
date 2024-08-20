import { Autocomplete, FormControl, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDropzone } from "react-dropzone";
import { MdAlbum } from "react-icons/md";
import { useSelector } from "react-redux";
import { CgColorPicker } from "react-icons/cg";
import { IoIosClose } from "react-icons/io";
import PerformRequest from "../utilities/PerformRequest";
import toast from "react-hot-toast";
export default function CreateAlbum() {
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  const [album, setAlbum] = useState({
    background: "#aabbcc",
  });
  const [preview, setPreview] = useState(null);
  const [pickerVisibility, setPickerVisibility] = useState(false);
  const updateAlbum = ({ name, value }) => {
    const updatedAlbum = { ...album, [name]: value };
    console.log(updatedAlbum);
    setAlbum(updatedAlbum);
  };
  const theme = useSelector((state) => state.theme.theme);
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPreview(file);
      const albumCover = await readFileAsDataURL(file);
      updateAlbum({
        name: "album_cover",
        value: albumCover,
      });
    },
    [setPreview, updateAlbum]
  );
  const [unpublishedSongs, setUnpublishedSongs] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    color: theme ? "white" : "#353535",
  };
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await OriginalRequest("songs/unpublished", "GET");
        console.log(response.data);
        setUnpublishedSongs(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchSongs();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);
  const inputOutLineColor = () => {
    return theme ? "#ADADAD" : "#717171";
  };
  const inputTextColor = () => {
    return theme ? "white" : "#353535";
  };
  const inputStyle = () => {
    return {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: inputOutLineColor(),
      },
      "& .MuiInputLabel-root": {
        color: inputTextColor(),
      },
      "& .MuiInputBase-input": {
        color: inputTextColor(),
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: inputTextColor(),
      },
    };
  };
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (preview) {
    //   try {
    //     const albumCover = await readFileAsDataURL(preview);
    //     updateAlbum({
    //       name: "album_cover",
    //       value: albumCover,
    //     });
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // }

    if (
      !album.album_name ||
      !album.price ||
      !album.album_cover ||
      album.songs.length === 0
    ) {
      toast("Please fill out missing fields", {
        duration: 3000,
        position: "top-center",
        icon: "👺",
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
      return;
    }

    try {
      await OriginalRequest("album/add", "POST", album);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-center mb-5">
        <h4 className="text-center text-lightText dark:text-darkText font-semibold text-lg">
          Publish Your Album Here{" "}
        </h4>
        &nbsp;
        <MdAlbum size={25} className="text-lightText dark:text-darkText" />
      </div>
      <div className="w-full flex justify-between">
        <div className="w-5/12 h-10 p-5">
          <form
            className="w-full"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className="flex w-full justify-between mb-5">
              <TextField
                label="Album Name"
                variant="outlined"
                sx={inputStyle()}
                onChange={(e) => {
                  updateAlbum({
                    name: "album_name",
                    value: e.currentTarget.value,
                  });
                }}
              />
              <TextField
                label="Price"
                variant="outlined"
                type="number"
                sx={inputStyle()}
                onChange={(e) => {
                  updateAlbum({ name: "price", value: e.currentTarget.value });
                }}
              />
            </div>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={2}
              sx={inputStyle()}
              className="mb-5"
              onChange={(e) => {
                updateAlbum({
                  name: "description",
                  value: e.currentTarget.value,
                });
              }}
            />
            <div className="mb-5" {...getRootProps()} style={dropzoneStyle}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p className="overflow-ellipsis">
                  {preview ? preview.name : "Upload Your Cover Image Here"}
                </p>
              )}
            </div>
            <div className="flex items-center mb-5">
              <label className="text-lightText dark:text-darkText font-semibold text-base">
                Album Theme
              </label>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPickerVisibility(!pickerVisibility);
                }}
                className={`px-4 py-1 ml-5 border-2 border-light10 dark:border-dark10 rounded-md hover:bg-light10 dark:hover:bg-dark10 ${
                  pickerVisibility ? "bg-light10 dark:bg-dark10" : ""
                }`}
              >
                {pickerVisibility ? (
                  <IoIosClose className="dark:text-white" />
                ) : (
                  <CgColorPicker className="dark:text-white" />
                )}
              </button>
              {pickerVisibility ? (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "32%",
                    zIndex: 999,
                  }}
                  className="shadow-lg shadow-neutral-400 dark:shadow-blue-500/50"
                >
                  <HexColorPicker
                    color={album.background}
                    onChange={(color) => {
                      updateAlbum({
                        name: "background",
                        value: color,
                      });
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
            <div>
              <label className="text-lightText dark:text-darkText font-semibold text-base">
                Add Songs
              </label>
              <FormControl fullWidth className="mt-3">
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={unpublishedSongs}
                  getOptionLabel={(option) => option.song_name} // This determines what's displayed in the dropdown
                  filterSelectedOptions
                  onChange={(event, selected) => {
                    const selectedItems = selected.map((item) => item);
                    updateAlbum({ name: "songs", value: selectedItems });
                  }}
                  sx={inputStyle()}
                  renderOption={(props, option, { selected }) => (
                    <li
                      {...props}
                      key={option._id}
                      className={`flex items-center justify-start px-3 hover:bg-neutral-200 mb-1`}
                    >
                      <img
                        className="h-10 w-10 rounded-md object-cover object-center"
                        src={option.cover_image}
                        alt={option.song_name}
                      />
                      <p className="ml-2">{option.song_name}</p>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unpublished Songs"
                      placeholder="Unpublished Songs"
                    />
                  )}
                />
              </FormControl>
            </div>
            <div className="w-full flex justify-center">
              <button className="bg-light10 text-lightText dark:bg-dark10 dark:text-darkText px-3 py-2 rounded-md mt-4">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="w-7/12">
          <div className="w-full p-5 flex justify-center items-center">
            <div
              className="w-72 h-72 py-4 mx-auto z-20 left-16 relative"
              style={{ backgroundColor: album.background }}
            >
              <img
                className="w-64 h-64 object-cover object-center mx-auto"
                src={
                  preview
                    ? URL.createObjectURL(preview)
                    : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                }
              />
            </div>
            <img
              src="https://res.cloudinary.com/djzdhtdpj/image/upload/v1709269357/png-transparent-phonograph-record-lp-record-music-others-miscellaneous-album-disc-jockey-thumbnail_1_dd0lc3.png"
              className="w-64 h-64 right-20 relative animate-spin"
              style={{ animationDuration: "10000ms" }}
            />
          </div>
          <div className="w-full">
            <h4 className="font-semibold">Songs Included</h4>
            <table className="w-full text-lightText dark:text-darkText">
              <thead className="font-semibold">
                <tr className="border-b border-neutral-300">
                  <td className="w-1/12 text-center">#</td>
                  <td className="w-8/12">Song</td>
                  <td className="w-2/12">Price(vnd)</td>
                  <td className="w-1/12">duration</td>
                </tr>
              </thead>
              {album.songs && (
                <tbody className="text-lightTextSecondary dark:text-darkTextSecondary hover:po">
                  {album.songs.map((song, index) => (
                    <tr
                      className="border-b border-neutral-300 hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
                      key={song._id}
                    >
                      <td className="w-1/12 text-center">{index + 1}</td>
                      <td className="w-8/12 py-2">
                        <div className="flex items-center">
                          <div
                            style={{
                              backgroundImage: `url('${song.cover_image}')`,
                            }}
                            className={`relative w-14 h-14 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm`}
                          ></div>

                          <div className="ml-2">
                            <h4 className="font-semibold text-md">
                              {song.song_name}
                            </h4>
                            <p className="text-xs">{song.artist.artist_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="w-1/12">{song.price}</td>
                      <td className="w-1/12">
                        {Math.floor(song.duration / 60)}:{song.duration % 60}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
