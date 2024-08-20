import React, { useState } from 'react';
import '../style/forgotpassword.css'
import { BsSoundwave } from 'react-icons/bs';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FormControl, TextField } from '@mui/material';
import PerformRequest from '../utilities/PerformRequest';
const ForgotPassword = () => {
  const { OriginalRequest } = PerformRequest();
  const [email, setEmail] = useState({ email: "" });
  const handleChange = (e) => {
    setEmail({ ...email, [e.target.name]: e.target.value });
    console.log(email);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Gọi hàm OriginalRequest để gửi yêu cầu gửi email đặt lại mật khẩu
      OriginalRequest("auth/forgot-password", "POST", email);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    }
  };

  return (

    <div className='contain' >
      <div className='part-left'>
        <div className='header-left'>
          <Link to={"/login"} className='back-link'>
            <MdOutlineKeyboardBackspace size={30} />
            <p className="text-lg font-semibold text-light10">Login</p>
          </Link>
        </div>
        <div className='content-left'>
          <div className='content-inner-left'>
            <div className='logo-name'>
              <BsSoundwave color="#ff5e3a" size={50} className="mr-1" />
              <h3 style={{ fontWeight: "bold", color: "#353535" }}>Tune</h3>
              <h3 style={{ fontWeight: "bold", color: "#F2785C" }}>Hub</h3>
            </div>
            <div className='form-forgot'>
              <h4>Forgot password</h4>
              <p>Enter your email address or username, and we'll send you a link to get back into your account.</p>
              <form
                style={{ paddingTop: "30px" }}
                className="w-full"
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <FormControl className="w-full gap-6 flex-col">
                  <TextField
                    required
                    label="email address"
                    name="email"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    color="warning"
                  />

                  <button
                    // className="bg-light10 rounded-md py-3 shadow-md"
                    type="submit"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    Send request
                  </button>

                </FormControl>
              </form>
              <h3 className="content-footer">
              Do have an account ? Sign in{" "}
                <Link to={"/login"} className="text-blue-600 underline text-md">
                  here
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className='part-right'>
        
      </div>
    </div>
  );
}

export default ForgotPassword;