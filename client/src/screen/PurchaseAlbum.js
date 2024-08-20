import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DefaultTemplate from "../template/DefaultTemplate";
import PerformRequest from "../utilities/PerformRequest";
import { List, ListItemDecorator } from "@mui/joy";
import { FormControlLabel, ListItem, Radio, RadioGroup } from "@mui/material";
import { FaPaypal } from "react-icons/fa6";
import TestRadioButton from "../component/TestRadioButton";
import { useSelector } from "react-redux";

export default function PurchaseAlbum() {
  const { OriginalRequest } = PerformRequest();
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const bank = useSelector((state) => state.purchase.bank);
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await OriginalRequest(
          `album/getAlbumById/${albumId}`,
          "GET"
        );
        if (response) {
          setAlbum(response.data);
        }
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };
    fetchAlbum();
  }, [albumId]);

  const handlePayment = async () => {
    try {
      if (!album) {
        return;
      }
      const vnpayUrl = await OriginalRequest(
        "payment/create_payment_album_url",
        "POST",
        {
          amount: album.price,
          bankCode: bank,
          albumId: album._id,
          language: "en",
        }
      );
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
          Purchase
        </h1>
        <hr style={{ height: "2px" }} className="bg-neutral-600/50 my-2 mx-6" />
        {album ? (
          <div className="mx-6 flex">
            <div className="w-9/12 bg-light5 dark:bg-dark30 shadow-lg mr-1 rounded-md py-2 px-3 relative">
              <h4 className="font-semibold text-lg">Select Payment Method</h4>
              <div>
                <TestRadioButton />
              </div>
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
                src={album.album_cover}
                className="aspect-square object-cover object-center w-12/12 mx-auto rounded-md"
              />
              <div className="bg-black/50 my-2" style={{ height: "1px" }}></div>
              <div className="flex justify-between">
                <div className="w-6/12 flex-col font-medium text-lightTextSecondary dark:text-darkTextSecondary">
                  <p>Item</p>
                  <p>Transaction Type</p>
                  <p>Owned By</p>
                  <p>Value</p>
                </div>
                <div className="w-6/12 flex-col text-lightTextSecondary dark:text-darkTextSecondary text-end">
                  <p>{album.album_name}</p>
                  <p>Album Purchase</p>
                  <p>{album.artist_name}</p>
                  <p>{new Intl.NumberFormat("de-DE").format(album.price)} đ</p>
                </div>
              </div>
              <div className="bg-black/50 my-2" style={{ height: "1px" }}></div>
              <div className="flex justify-between text-lightText dark:text-darkText font-medium">
                <p className="">Total</p>
                <p className="text-end">
                  {new Intl.NumberFormat("de-DE").format(album.price)} đ
                </p>
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
