import ArtistTemplate from "../template/ArtistTemplate";
import TopGenre from "../component/ArtisFollower/TopGenre";
import Follower from "../component/ArtisFollower/TopFollower";
import Top3User from "../component/ArtisFollower/Top3User";
import BoardSong from "../component/ArtisFollower/BoardSong"
import PerformRequest from "../utilities/PerformRequest";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function ArtistFollower() {
    const [span, setSpan] = useState("weekly");
    const [valid, setValid] = useState(false);
    const hasMounted = useRef(false);
    const { OriginalRequest } = PerformRequest();

    useEffect(() => {
        try {
            const checkArtist = async () => {
                const response = await OriginalRequest(`auth/checkArtist`, "GET");
                if (response) {
                    setValid(true);
                }
            };
            if (hasMounted.current) {
                checkArtist();
            } else {
                hasMounted.current = true;
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [hasMounted, span]);

    if (valid) {
        return (
            <ArtistTemplate>
                <div className="w-full min-h-screen px-5">
                    <div className="flex justify-between items-center mt-5">
                        <h1 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
                            Artist Follower
                        </h1>
                    </div>
                    <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
                    <div className="w-12/12 flex flex-row">
                        <div className="w-5/12 mt-3 p-5 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30 flex justify-center items-center">
                            <div className="h-full w-11/12 -mt-5">
                                <h4 className="font-medium text-lightText dark:text-darkText">
                                    Popular Genre
                                </h4>
                                <TopGenre />
                            </div>
                        </div>
                        <div className="w-7/12 ml-2">
                            <div className="h-72 ml-3 mt-3 mb-5 p-5 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
                                <div className="h-full w-11/12 mb-3">
                                    <h4 className="font-medium text-lightText dark:text-darkText">
                                        Top Donate User
                                    </h4>
                                    <Top3User />
                                </div>
                            </div>
                            <div className="ml-3 p-5 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30 ">
                                <div className="h-52 w-11/12 mb-3">
                                    <h4 className="font-medium text-lightText dark:text-darkText">
                                        Follower
                                    </h4>
                                    <Follower />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5 w-full mt-4 p-5 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
                        <h4 className="font-medium text-lightText dark:text-darkText">
                            All Song
                        </h4>
                        <div className="w-11/12 mb-3">
                            <BoardSong />
                        </div>
                    </div>
                </div>
            </ArtistTemplate>
        );
    }
}
