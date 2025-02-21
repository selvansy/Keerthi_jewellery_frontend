import React from "react";
import { RotatingLines } from "react-loader-spinner";
 
function SpinLoading({color='white'}) {
  return (
    <div className="flex justify-center">
      <RotatingLines
        visible={true}
        height="10"
        width="26"
        strokeColor={color}
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
 
export default SpinLoading;