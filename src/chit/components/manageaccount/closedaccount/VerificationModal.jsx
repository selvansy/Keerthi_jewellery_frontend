import React, { useState, useRef, useEffect } from 'react';
import { sendOtp,verifyOtp} from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const VerificationModal = ({setIsOpen,mobile,branch,otpComplete}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const inputRefs = useRef([]);
  const [error,setError]=useState(false)

  // Handle countdown timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input when a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP resend
  const handleResend = (e) => {
    sendOtpToMobile()
    setError(false)
    setTimeLeft(30);
    setIsActive(true);
    setOtp(['', '', '', '']);
    inputRefs.current[0].focus();
  }

  const { mutate: postVerifyOtp } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      if(response.status === true){
        otpComplete()
      }
    },
    onError:((error)=>{
      setError(true)
    })
  });

  const { mutate: postSendOtpMobile } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (response) => {
      if (response) {
        toast.success(response.message);
        setCanResend(false);
      }
    },
  });

  const handleVerifyOtp = (e) => {
    if(e){
      e.preventDefault()
    }
    const data = otp.join("")

    if (!data) {
      toast.error("OTP is required");
      return;
    }

    postVerifyOtp({
      mobile: mobile,
      otp: data,
      type:'preclose',
      branchId: branch,
    });
  };

  const sendOtpToMobile = (e) => {
    if(e){
      e.preventDefault()
    }
    const mobileToUse = mobile;

    if (!mobileToUse) {
      toast.error("Mobile number is required");
      return;
    }

    postSendOtpMobile({
      mobile: mobile,
      branchId: branch,
    });
  };


  return (
        <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800"></h2>
        </div>
        
        <p className="text-gray-600 mb-6">{`Please enter the OTP sent to +91 ${mobile}`}</p>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Enter Your 4 Digit OTP</label>
          <div className="flex  justify-center gap-x-9">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                className={`w-12 h-12 border ${error ? "border-[#F04438]" : "border-gray-300"} rounded-md text-center text-lg`}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && (<span className='text-[#F04438] text-[12px]'> *Invaild OTP</span>)}
        </div>
        
        <div className="flex items-center mb-6">
          <button 
            className="text-black text-sm font-medium mr-2 disabled:text-gray-400"
            onClick={(e)=>handleResend(e)}
            disabled={timeLeft > 0}
          >
            Resend OTP
          </button>
          {timeLeft > 0 && (
            <span className="text-gray-500 text-sm">{`(${formatTime()})`}</span>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button className="px-6 py-2 bg-[#F6F7F9] text-[#6C7086] rounded-md " 
          onClick={(e)=>setIsOpen(e)}
          >
            Cancel
          </button>
          <button 
            className={`px-6 py-2 ${otp[otp.length-1] !== "bg-[#6C7086]" ? "bg-[#004181]": "bg-[#6C7086]"} text-white rounded-md `}
            disabled={otp.some(digit => digit === '')}
            onClick={(e)=>handleVerifyOtp(e)}
          >
            Verify
          </button>
        </div>
        </>
  );
};

export default VerificationModal;