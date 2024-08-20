import { useEffect } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerformRequest from "../utilities/PerformRequest";

export default function ArtistKitPayment() {
  const { artistName } = useParams();
  const hasMounted = useRef(false);
  const {OriginalRequest} = PerformRequest();
  useEffect(() => {
    const payment = async () => {
      try {
        const vnpayUrl = await OriginalRequest(
          "payment/artistKitPayment",
          "POST",
          {
            bankCode: "NCB",
            language: "en",
            artistName: decodeURIComponent(artistName),
          }
        );
        if (vnpayUrl) {
          window.location = vnpayUrl.data;
        }
      } catch (error) {
        console.error("Error creating payment URL:", error);
      }
    };
    if (hasMounted.current) {
      payment();
    } else {
      hasMounted.current = true;
    }
  }, [artistName]);
  return <div>now redirecting, please wait</div>;
}
