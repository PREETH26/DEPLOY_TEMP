import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgetPasswordMiddle() {
  const navigate = useNavigate();

  useEffect(() => {
    const initiatePasswordReset = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/author/forgot-password`,
          {},
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          navigate("/reset-password");
        }
      } catch (error) {
        console.error("Password reset initiation failed:", error);
        if (error.response) {
          navigate('/');
        } else {
          console.error("Network or server error");
          navigate('/');
        }
      }
    };

    initiatePasswordReset();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</h3>
    </div>
  );
}

export default ForgetPasswordMiddle;