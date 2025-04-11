import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DarkMode from './DarkMode'; 
import './ResetPassword.css'; 


function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = DarkMode();
  const navigate = useNavigate();

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/author/reset-password`,
        { newPassword: password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage("Password reset successfully!");
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Invalid or expired reset link.");
        toast.error("Invalid or expired reset link.");
      } else if (error.response) {
        setErrorMessage("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      } else {
        console.error("Server error:", error.message);
        setErrorMessage("Server error. Please try again later.");
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark-bg' : 'light-bg min-h-screen flex items-center justify-center'}>
      <div className={isDarkMode ? 'dark-card' : 'light-card p-8 rounded-lg shadow-lg w-full max-w-md'}>
        <h1 className={isDarkMode ? 'text-blue-400' : 'text-blue-600 text-3xl font-bold text-center mb-4'}>
          Reset Password
        </h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600 text-center mb-6'}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>New Password</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              className={isDarkMode ? 'dark-input' : 'light-input w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              ref={confirmPasswordRef}
              required
              className={isDarkMode ? 'dark-input' : 'light-input w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}
              placeholder="Confirm new password"
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600 text-center mt-4'}>
          Remember your password?{' '}
          <Link to="/login" className={isDarkMode ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;