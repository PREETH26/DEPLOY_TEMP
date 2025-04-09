// import { useState, useEffect } from "react";

// const DarkMode = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     function checkTime() {
//       const hours = new Date().getHours();
//       setIsDarkMode(hours >= 18 || hours < 6);
//     }

//     checkTime();
//     const intervalId = setInterval(checkTime, 60 * 60 * 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   return isDarkMode;
// };

// export default DarkMode;



import { useState, useEffect } from "react";

const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        setIsDarkMode(true);
        return;
      }

      const hours = new Date().getHours();
      setIsDarkMode(hours >= 18 || hours < 6);
    };

    checkDarkMode();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDarkMode;
};

export default DarkMode;