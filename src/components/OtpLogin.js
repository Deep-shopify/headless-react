import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTwQEEdxkLzhL0H8tuWR_PoTxcQMegq_s",
  authDomain: "shopify-otp-retail-mart.firebaseapp.com",
  projectId: "shopify-otp-retail-mart",
  storageBucket: "shopify-otp-retail-mart.appspot.com",
  messagingSenderId: "433295715028",
  appId: "1:433295715028:web:5a4afb7182b2d237d16941",
  measurementId: "G-49YP56ZYN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const OTPLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleOtpChange = (event) => {  
    setOtp(event.target.value);
  }; 

  const sendOtp = async () => {
    // Ensure the recaptcha container is present
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', auth, {
        size: 'invisible', // or 'normal'
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        }
      });
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmationResult);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert('OTP verified successfully!');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>OTP Login</h2>
      <div>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
        <button onClick={sendOtp}>Get OTP</button>
      </div>

      {confirmationResult && (
        <div>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default OTPLogin;
