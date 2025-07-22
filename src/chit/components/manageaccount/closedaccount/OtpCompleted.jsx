import React, { useState, useEffect } from 'react';
import SuccessImg from '../../../../assets/icons/Successmark.svg'

const OtpCompleted = ({ setIsOpen }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer effect
  // useEffect(() => {
  //   if (timeLeft <= 0) {
  //     setIsOpen(false); // Auto-close modal
  //     return;
  //   }

  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => prev - 1);
  //   }, 300);

  //   return () => clearInterval(timer);
  // }, [timeLeft, setIsOpen]);

  return (
    <div className="text-center p-6">
      <img
        src={SuccessImg}
        alt="Success"
        className="mx-auto mb-4 w-32 h-32"
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Phone Number Verified 
      Successfully!</h2>
    </div>
  );
};

export default OtpCompleted;
