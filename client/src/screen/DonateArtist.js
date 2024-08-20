import { useRef, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PerformRequest from "../utilities/PerformRequest";
import DefaultTemplate from "../template/DefaultTemplate";
import TestRadioButton from "../component/TestRadioButton";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";

export default function DonateArtist() {
  const { OriginalRequest } = PerformRequest();
  const { artistId } = useParams();
  const [artist, setArtist] = useState();
  const hasMounted = useRef(false);
  const [amount, setAmount] = useState(10000);
  const bankCode = useSelector((state) => state.purchase.bank);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const artist = await OriginalRequest(
          `artists/getArtistInfo/${artistId}`,
          "GET"
        );
        setArtist(artist.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchInfo();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted, artistId]);
  const handlePayment = async () => {
    try {
      const vnpayUrl = await OriginalRequest("payment/donateArtist", "POST", {
        amount: amount,
        bankCode: bankCode,
        artistId: artist._id,
        language: "en",
      });
      if (vnpayUrl) {
        window.location = vnpayUrl.data;
      }
    } catch (error) {
      console.error("Error creating payment URL:", error);
    }
  };
  return (
    <DefaultTemplate>
      <div className="min-h-screen w-full">
        <h1 className="text-lightText dark:text-darkText text-2xl font-semibold pl-6">
          Donate
        </h1>
        <hr style={{ height: "2px" }} className="bg-neutral-600/50 my-2 mx-6" />
        {artist ? (
          <div className="mx-6 flex">
            <div className="w-9/12 bg-light5 dark:bg-dark30 shadow-lg mr-1 rounded-md py-2 px-3 relative">
              <h4 className="font-semibold text-lg">Amount</h4>
              <TextField
              className="w-full"
                type="number"
                variant="outlined"
                value={amount}
                inputProps={{ step: 10000, min: 10000 }}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                
              />
              
              <h4 className="font-semibold text-lg">Select Payment Method</h4>
              <div className="mt-5">
                <TestRadioButton />
              </div>
              <div className="h-20 w-full"></div>
              <div className="absolute bottom-5 w-full px-5 left-1/2 transform -translate-x-1/2">
                <button
                  className="w-full bg-light10 dark:bg-dark10 rounded-md text-darkText py-2 mt-2 text-lg font-medium"
                  onClick={(e) => {
                    handlePayment();
                  }}
                >
                  Purchase
                </button>
              </div>
            </div>
            <div className="w-3/12 bg-light5 dark:bg-dark30 shadow-lg ml-1 rounded-md py-2 px-3">
              <h4 className="font-semibold text-lg">Your Cart</h4>
              <div className="bg-black/50 mb-2" style={{ height: "1px" }}></div>
              <img
                src={artist.userId.profile_picture}
                className="aspect-square object-cover object-center w-12/12 mx-auto rounded-md"
              />
              <div className="bg-black/50 my-2" style={{ height: "1px" }}></div>
              <div className="flex justify-between">
                <div className="w-6/12 flex-col font-medium text-lightTextSecondary dark:text-darkTextSecondary">
                  <p>Transaction Type</p>
                  <p>To</p>
                  <p>Value</p>
                </div>
                <div className="w-6/12 flex-col text-lightTextSecondary dark:text-darkTextSecondary text-end">
                  <p>Donation</p>
                  <p>{artist.artist_name}</p>
                  <p>100.000 đ</p>
                </div>
              </div>
              <div className="bg-black/50 my-2" style={{ height: "1px" }}></div>
              <div className="flex justify-between text-lightText dark:text-darkText font-medium">
                <p className="">Total</p>
                <p className="text-end">100.000 đ</p>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </DefaultTemplate>
  );
}
