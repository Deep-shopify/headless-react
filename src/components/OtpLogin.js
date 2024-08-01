// src/OtpLogin.js
import React, { useState } from 'react';
import axios from 'axios';

const OtpLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', {
        phoneNumber,
      });
      if (response.data.success) {
        setGeneratedOtp(response.data.otp); // Store the generated OTP for verification
        setIsOtpSent(true);
        setError('');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    if (otp === generatedOtp) {
      // Here you can handle the login with Shopify
      alert('OTP verified successfully! Logging you in...');
      
      // Example: Redirect to Shopify or perform any action
      // You might want to call your Shopify API here to log in the user
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login with OTP</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button onClick={sendOtp} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
        Send OTP
      </button>

      {isOtpSent && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button onClick={verifyOtp} style={{ width: '100%', padding: '10px' }}>
            Verify OTP
          </button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OtpLogin;
