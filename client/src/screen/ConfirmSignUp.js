import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SERVER_URL from "../config.js";
import toast from "react-hot-toast";
export default function ConfirmSignUp() {
  const { token } = useParams();
  const hasMounted = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        toast.promise(
          (async () => {
            //add some delay here
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch(`${SERVER_URL}auth/verify/${token}`, {
              method: "PATCH",
            });

            if (!response.ok) {
              const errorData = await response.json();
            //   navigate("/login")
              throw new Error(errorData.error);
            }

            const data = await response.json();
            navigate("/login")
            return data;
          })(),
          {
            loading: "Verifying...",
            success: (data) => `${data.data}`,
            error: (err) => `${err.toString()}`,
          },
          {
            
            success: {
              duration: 5000,
            },
          }
        );
      } catch (error) {
        console.log(error.message);
      }
    };
    if (hasMounted.current) {
      verifyUser();
    } else {
      hasMounted.current = true;
    }
  }, [token]);

  return (<div className="w-full h-screen bg-primaryBg flex items-center justify-center">
    <h1 className="text-textSecondary text-center text-4xl">Verify your account</h1>
  </div>);
}
