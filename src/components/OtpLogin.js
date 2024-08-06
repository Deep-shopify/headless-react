import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
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
