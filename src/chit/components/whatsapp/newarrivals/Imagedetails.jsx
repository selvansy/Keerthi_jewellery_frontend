import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setWhatsappData } from "../../../../redux/clientFormSlice"

function Imagedetails({ setIsOpen }) {

  let dispatch = useDispatch();

  const data = useSelector((state) => state.clientForm.whatsappData);
  

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(setWhatsappData(null))
    setIsOpen(false)
  }

  useEffect(() => {
    return () => {
      dispatch(setWhatsappData(null));
    };
  }, []);


  return (
    <div>

      <div className="flex flex-col">
        <div className="flex flex-col bg-[#f5f5dc] p-5 rounded-lg shadow-lg">
          <img
            src={`${data?.imgPath}${data?.img?.[0]}`}
            alt="Product"
            className="w-full max-h-[250px] object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-left">{data?.name || ''}</h2>
          <p className="text-lg text-gray-700 mb-4 text-left">{data?.desc || ''}</p>
        </div>
      </div>


      <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
        <div className="flex justify-end gap-2 mt-3">

          <>
            <button
              className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </>
        </div>
      </div>

    </div>
  );
}

export default Imagedetails;
