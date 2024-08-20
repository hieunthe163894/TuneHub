import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiFolderUploadFill } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { setSongInfo } from "../redux/artistUpload.js";
import PerformRequest from "../utilities/PerformRequest.js";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";
const AudioDropZone = () => {
  const dispatch = useDispatch();
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles[0]);
    if (
      acceptedFiles[0].type !== "audio/mp3" &&
      acceptedFiles[0].type !== "audio/mpeg"
    ) {
      toast.error("Invalid Audio File");
      return;
    }
    const audio = new Audio();
    audio.src = URL.createObjectURL(acceptedFiles[0]);
    audio.onloadedmetadata = () => {
      dispatch(
        setSongInfo({ name: "duration", value: Math.floor(audio.duration) })
      );
    };
    dispatch(setSongInfo({ name: "audioFile", value: acceptedFiles[0] }));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
  };
  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Upload Your Audio File Here</p>
      )}
    </div>
  );
};
const CoverImageDropZone = () => {
  const dispatch = useDispatch();
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file.type.startsWith("image/")) {
      // Dispatch action to show an error toast
      toast.error("Invalid file. Please drop an image file.");
      return;
    }
    dispatch(setSongInfo({ name: "coverImage", value: acceptedFiles[0] }));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
  };
  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Upload Your Cover Image Here</p>
      )}
    </div>
  );
};
export default function SongUploadForm() {
  const coverImage = useSelector((state) => state.artistUpload.coverImage);
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const handleChange = (event, newValue) => {
    dispatch(setSongInfo({ name: "previewStart", value: newValue[0] }));
    dispatch(setSongInfo({ name: "previewEnd", value: newValue[1] }));
  };
  const [artist, setArtist] = useState([]);
  const [genres, setGenres] = useState([]);
  const songInfo = useSelector((state) => state.artistUpload.songInfo);
  const dispatch = useDispatch();
  const playerRef = useRef(null);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await OriginalRequest("genres/", "GET");
        setGenres(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchGenres();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await OriginalRequest("artists/findByName", "POST", {
          artistName: "",
        });
        console.log(response);
        setArtist(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchArtists();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);
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
  const HandleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("songName", songInfo.songName);
    formData.append("genre", songInfo.genre);
    formData.append("participatedArtists", songInfo.participatedArtists);
    if (!songInfo.audioFile) {
      toast.error("No mp3 file uploaded");
      return;
    }
    formData.append("audioFile", songInfo.audioFile);
    formData.append("duration", songInfo.duration);
    formData.append("isPublic", songInfo.isPublic);
    if (songInfo.isExclusive) {
      formData.append("isExclusive", true);
      formData.append("previewStart", songInfo.previewStart);
      formData.append("previewEnd", songInfo.previewEnd);
      formData.append("price", songInfo.price);
    }
    if (songInfo.coverImage) {
      try {
        const coverImageBase64 = await readFileAsDataURL(songInfo.coverImage);
        formData.append("coverImage", coverImageBase64);
      } catch (error) {
        console.error("Error reading the cover image:", error);
      }
    }
    try {
      await OriginalRequest("songs/uploadSingle", "POST", formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-center">
        <h4 className="text-center text-lightText dark:text-darkText font-semibold text-lg">
          Upload Your Song Here{" "}
        </h4>
        &nbsp;
        <RiFolderUploadFill
          className="text-lightText dark:text-darkText"
          size={25}
        />
      </div>
      <div className="flex items-start justify-between mt-5">
        <div className="formSection w-6/12">
          <form
            onSubmit={(e) => {
              HandleSubmit(e);
            }}
            className="w-10/12 mx-auto"
            encType="multipart/form-data"
          >
            <FormControl className="w-full gap-6 flex-col">
              <FormControl className="flex-row justify-between items-center">
                <FormControl className="w-6/12 mr-1">
                  <TextField
                    required
                    label="Song Name"
                    name="songName"
                    color="warning"
                    onChange={(e) => {
                      dispatch(
                        setSongInfo({
                          name: e.target.name,
                          value: e.target.value,
                        })
                      );
                    }}
                  />
                </FormControl>
                <FormControl className="w-6/12 ml-1">
                  <InputLabel id="genreLable">Genre</InputLabel>
                  <Select
                    value={songInfo.genre}
                    labelId="genreLable"
                    id="genre"
                    label="Genre"
                    onChange={(e) => {
                      dispatch(
                        setSongInfo({
                          name: "genre",
                          value: e.target.value,
                        })
                      );
                    }}
                  >
                    {genres.map((genre) => (
                      <MenuItem value={genre._id} key={genre._id}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={artist}
                  getOptionLabel={(option) => option.artist_name}
                  filterSelectedOptions
                  onChange={(event, selected) => {
                    const selectedIds = selected.map((item) => item._id);
                    dispatch(
                      setSongInfo({
                        name: "participatedArtists",
                        value: selectedIds,
                      })
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Featured Artist"
                      placeholder="Featured Artist"
                    />
                  )}
                />
              </FormControl>
              <FormControl>
                <CoverImageDropZone />
              </FormControl>
              <FormControl>
                <AudioDropZone />
              </FormControl>
              {songInfo.audioFile ? (
                <div>
                  <div className="flex items-center">
                    <FormControl className="w-3/12 mr-7">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              dispatch(
                                setSongInfo({
                                  name: "isPublic",
                                  value: e.currentTarget.checked,
                                })
                              );
                            }}
                          />
                        }
                        label="Public"
                      />
                    </FormControl>
                    {songInfo.isExclusive ? (
                      <div>
                        <FormControl>
                          <TextField
                            label="Price(vnd)"
                            type="number"
                            color="warning"
                            value={songInfo.price}
                            onChange={(e) => {
                              dispatch(
                                setSongInfo({
                                  name: "price",
                                  value: e.currentTarget.value,
                                })
                              );
                            }}
                          />
                        </FormControl>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <FormControl className="w-2/12">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              dispatch(
                                setSongInfo({
                                  name: "isExclusive",
                                  value: e.currentTarget.checked,
                                })
                              );
                              if (e.currentTarget.checked) {
                                dispatch(
                                  setSongInfo({
                                    name: "previewStart",
                                    value: 0,
                                  })
                                );
                                dispatch(
                                  setSongInfo({
                                    name: "previewEnd",
                                    value: 30,
                                  })
                                );
                                dispatch(
                                  setSongInfo({
                                    name: "price",
                                    value: 0,
                                  })
                                );
                              }
                            }}
                          />
                        }
                        label="Exclusive"
                      />
                    </FormControl>
                    {songInfo.isExclusive ? (
                      <FormControl className="w-9/12 flex items-center justify-between">
                        <p className="w-4/12">Preview range</p>
                        <Box width={300}>
                          <Slider
                            getAriaLabel={() => "Preview range"}
                            value={[songInfo.previewStart, songInfo.previewEnd]}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) =>
                              `${Math.floor(value / 60)}:${value % 60}`
                            }
                            min={0}
                            max={songInfo.duration}
                          />
                        </Box>
                      </FormControl>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </FormControl>
            <div className="w-full flex justify-center">
              <button className="bg-light10 px-6 py-3 mt-5 rounded-md">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="previewSection w-6/12">
          <div className="flex bg-light30 dark:bg-dark30 rounded-md w-8/12">
            <img
              className="w-24 h-24 rounded-md object-cover object-center"
              src={
                songInfo.coverImage
                  ? URL.createObjectURL(songInfo.coverImage)
                  : "https://res.cloudinary.com/djzdhtdpj/image/upload/v1704269768/tempAvatar_juqb4s.jpg"
              }
            />
            <div className="pl-3">
              <h4 className="text-lightText text-xl mb-3">
                {songInfo.songName ? songInfo.songName : "Song name"}
              </h4>
              {songInfo.audioFile ? (
                <ReactPlayer
                  // className="hidden"
                  url={URL.createObjectURL(songInfo.audioFile)}
                  ref={playerRef}
                  controls
                  width="250px"
                  height="50px"
                  volume={1}
                  playing={playing}
                  onStart={(e) => {
                    setPlaying(true);
                    if (songInfo.previewStart) {
                      playerRef.current.seekTo(songInfo.previewStart);
                    }
                  }}
                  onProgress={async (e) => {
                    if (
                      songInfo.previewEnd &&
                      playerRef.current.getCurrentTime() >= songInfo.previewEnd
                    ) {
                      playerRef.current.seekTo(songInfo.previewStart);
                      document.getElementById("toggleButton").click();
                    }
                  }}
                  onPause={(e) => {
                    setPlaying(false);
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <button
          className="hidden"
          id="toggleButton"
          onClick={async (e) => {
            setPlaying(false);
          }}
        >
          Toogle
        </button>
      </div>
    </div>
  );
}
