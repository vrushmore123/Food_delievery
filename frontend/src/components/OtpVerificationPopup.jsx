import React, { useState } from "react";

const OtpVerificationPopup = ({ onClose, onVerify }) => {
  const [contactInfo, setContactInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (!contactInfo.trim()) {
      setError("Phone number or email is required");
      return;
    }
    setOtpSent(true);
    setError("");
    // Simulate OTP sending
    setTimeout(() => {
      alert("OTP sent to " + contactInfo);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp !== "1234") {
      // Simulate OTP verification
      setError("Invalid OTP");
      return;
    }
    setError("");
    onVerify(); // Trigger the onVerify callback to handle redirection
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          OTP Verification
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number or Email
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className={`w-full border-2 rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-100 ${
                error
                  ? "border-red-400"
                  : "border-gray-200 focus:border-orange-400"
              }`}
              placeholder="Enter phone number or email"
            />
          </div>
          {otpSent && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full border-2 rounded-lg p-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-100 ${
                  error
                    ? "border-red-400"
                    : "border-gray-200 focus:border-orange-400"
                }`}
                placeholder="Enter OTP"
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 px-6 rounded-xl hover:from-orange-500 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
            >
              Generate OTP
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-500 hover:to-green-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
            >
              Verify OTP
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full mt-4 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPopup;
