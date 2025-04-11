// import React, { useRef, useState } from 'react';
// import DarkMode from './DarkMode';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// import "./VerifyOTP.css"; 

// function VerifyResetOTP() {
//   const [errorMessage, setErrorMessage] = useState("");
//   const [resendMessage, setResendMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { isDarkMode } = DarkMode();
//   const navigate = useNavigate();
//   const location = useLocation(); // Get email from navigation state
//   const email = location.state?.email || ''; // Safely access email from state

//   const inputRef = useRef([]);

//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
//       inputRef.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
//       inputRef.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData('text');
//     const pasteArray = paste.split('');
//     pasteArray.forEach((char, index) => {
//       if (inputRef.current[index]) {
//         inputRef.current[index].value = char;
//       }
//     });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage("");

//     try {
//       const otpArray = inputRef.current.map(e => e.value);
//       const otp = otpArray.join("");

//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/author/forgot-password`,
//         { email, otp }, // Include both email and OTP in body
//         { headers: { 'Content-Type': 'application/json' } } // Ensure JSON content type
//       );

//       if (response.status === 200) {
//         toast.success("OTP Verified Successfully!");
//         navigate("/reset-password", { state: { email, otp } }); // Pass email and OTP to next page
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         setErrorMessage("OTP expired or invalid");
//         toast.error("OTP expired or invalid");
//       } else if (error.response) {
//         setErrorMessage("Check OTP again.");
//         toast.error("Check OTP again.");
//       } else {
//         console.log(error.message);
//         setErrorMessage("Server error. Please try again later.");
//         toast.error("Server error. Please try again later.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setResendMessage("");
//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/author/send-reset-otp`,
//         { email }, // Resend OTP for the same email
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       if (response.status === 200) {
//         setResendMessage("OTP has been resent. Please check your email.");
//       }
//     } catch (error) {
//       console.error("Resend OTP error:", error);
//       setResendMessage("Failed to resend OTP. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={isDarkMode ? 'not-main' : 'main'}>
//       <div className={isDarkMode ? 'bg-[#3B3636] flex flex-col dark-shape' : 'bg-[#FFFFFF] flex flex-col shape'}>
//         <h1 className={isDarkMode ? 'text-[#00DDFF] text-3xl font-bold my-3 text-center' : 'text-[#20AFC5] text-3xl font-bold my-3 text-center'}>
//           Password Reset Verification
//         </h1>
//         <p className={isDarkMode ? 'text-center text-white' : 'text-center text-black'}>
//           Enter the 6-digit code sent to your email ID to reset your password.
//         </p>

//         <form className={isDarkMode ? 'not-forgot-1 flex flex-col gap-3 lg:w-500px lg:h-918px my-15' : 'forgot-1 flex flex-col gap-3 lg:w-500px lg:h-918px bg-[#FFFFFF] my-15'} onSubmit={onSubmit}>
//           <div className='flex justify-between mb-8 mt-5 gap-1' onPaste={handlePaste}>
//             {Array(6).fill(0).map((_, index) => (
//               <input
//                 type='text'
//                 maxLength='1'
//                 key={index}
//                 required
//                 className={isDarkMode ? 'bg-[#3B3636] w-12 h-10 text-white text-center text-lg rounded-md' : 'bg-[#FFFFFF] w-12 h-10 text-black text-center text-lg rounded-md'}
//                 ref={e => inputRef.current[index] = e}
//                 onInput={(e) => handleInput(e, index)}
//                 onKeyDown={(e) => handleKeyDown(e, index)}
//               />
//             ))}
//           </div>
//           <button
//             type='submit'
//             disabled={isLoading}
//             className='login-btn bg-[#00DDFF]'
//           >
//             {isLoading ? "Verifying..." : "Verify OTP"}
//           </button>
//           {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
//         </form>

//         <div className="flex flex-col items-center">
//           <button
//             onClick={handleResendOtp}
//             disabled={isLoading}
//             className="resend-btn bg-[#00DDFF] p-2 rounded-md"
//           >
//             {isLoading ? "Resending..." : "Resend OTP"}
//           </button>
//           {resendMessage && <p className="text-sm text-center mt-2">{resendMessage}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VerifyResetOTP;