import api from "@/api/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const [status, setStatus] = useState("⏳ Verifying your email...");
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await api.get(
        "/user/verify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSuccess(true);
        setStatus("✅ Email verified successfully! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.log("Verification Error:", err.response?.data);

      setSuccess(false);
      setStatus(
        err.response?.data?.msg ||
          "❌ Verification failed. Token may be expired."
      );
    }
  };

  useEffect(() => {
    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg_toggle w-full max-w-md p-6 rounded-xl shadow-lg text-center">
        <h1
          className={`text-xl font-semibold ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </h1>

        {!success && (
          <p className="mt-4 text-gray-600 text-sm">
            Please try signing up again or request a new verification email.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
