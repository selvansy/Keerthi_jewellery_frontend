import React from "react";
import { RotatingLines } from "react-loader-spinner";
 
function SpinLoading({customCss}) {
  return (
    <div className="flex justify-center">
      <RotatingLines
        visible={true}
        height="10"
        width="26"
        // strokeColor= customCss ? customCss: "white"
        strokeColor={customCss || "white"}
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