import * as React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import { FaPaypal, FaCcMastercard } from "react-icons/fa6";
import { useState } from "react";
import { FaCcVisa } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { setBank } from "../redux/purchase.js";
import { useDispatch, useSelector } from "react-redux";
export default function TestRadioButton() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Domestic ATM");
  const dispatch = useDispatch();
  const bankCode = useSelector((state)=>state.purchase.bank)
  const atms = [
    {
      value: "NCB",
      image:
        "https://www.saokim.com.vn/wp-content/uploads/2023/01/Bieu-Tuong-Logo-Ngan-Hang-NCB.png",
    },
    {
      value: "BIDV",
      image:
        "https://image.bnews.vn/MediaUpload/Org/2022/04/26/logo-bidv-20220426071253.jpg",
    },
  ];
  const creditCard = [
    {
      value: "visa",
      image: "https://1000logos.net/wp-content/uploads/2021/11/VISA-logo.png",
    },
    {
      value: "mastercard",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
    },
  ];
  const supportedPayment = () => {
    let paymentArray = [];
    if (selectedPaymentMethod === "Paypal") {
      console.log("comming soon");
    } else if (selectedPaymentMethod === "Credit Card") {
      paymentArray = creditCard;
    } else {
      paymentArray = atms;
    }
    return paymentArray.map((atm) => (
      <div
        className={`w-40 h-28 rounded-lg shadow-lg bg-contain bg-center m-2 border-2 bg-no-repeat ${atm.value === bankCode ? "border-blue-500": ""}`}
        style={{ backgroundImage: `url(${atm.image})` }}
        onClick={(e)=>{
          console.log(atm.value);
          dispatch(setBank(atm.value))
        }}
      ></div>
    ));
  };
  return (
    <div>
      <RadioGroup
        aria-label="Your plan"
        name="people"
        defaultValue="Paypal"
        value={selectedPaymentMethod}
        onChange={(e) => {
          setSelectedPaymentMethod(e.target.value);
        }}
      >
        <List
          sx={{
            minWidth: 240,
            "--List-gap": "0.5rem",
            "--ListItem-paddingY": "1rem",
            "--ListItem-radius": "8px",
            "--ListItemDecorator-size": "32px",
          }}
        >
          {["Paypal", "Credit Card", "Domestic ATM"].map((item, index) => (
            <ListItem variant="outlined" key={item} sx={{ boxShadow: "sm" }}>
              <Radio
                overlay
                value={item}
                label={item}
                sx={{ flexGrow: 1 }}
                slotProps={{
                  action: ({ checked }) => ({
                    sx: (theme) => ({
                      ...(checked && {
                        inset: -1,
                        border: "2px solid",
                        borderColor: theme.vars.palette.primary[500],
                      }),
                    }),
                  }),
                }}
              />
              <ListItemDecorator>
                {
                  [
                    <FaPaypal />,
                    [
                      <FaCcMastercard style={{ marginRight: "5px" }} />,
                      <FaCcVisa style={{ marginRight: "10px" }} />,
                    ],
                    <BsBank2 />,
                  ][index]
                }
              </ListItemDecorator>
            </ListItem>
          ))}
        </List>
      </RadioGroup>
      <div className="w-full flex flex-wrap">{supportedPayment()}</div>
    </div>
  );
}
