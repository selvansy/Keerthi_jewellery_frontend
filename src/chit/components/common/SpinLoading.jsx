import React from "react";
import { RotatingLines } from "react-loader-spinner";
 
function SpinLoading() {
  return (
    <div className="flex justify-center">
      <RotatingLines
        visible={true}
        height="10"
        width="26"
        strokeColor="white"
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