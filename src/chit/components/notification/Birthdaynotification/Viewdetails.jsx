import React, { useState, useEffect } from "react";
import { pushnotificationbyid } from '../../../api/Endpoints';
import { useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setPushnotifyId } from "../../../../redux/clientFormSlice"

import { toast } from 'react-toastify';



function Viewnotification({ setIsOpen}) {
let dispatch = useDispatch();
const id = useSelector((state) => state.clientForm.pushnotifyId);

const [notifypopup,setNotifyPopup]=useState(null)

 const handleCancel = (e) => {
    e.preventDefault();
    dispatch(setPushnotifyId(null))
    setIsOpen(false)
  }
  useEffect(() => {
    if (id) {
      fetchpushnotificationById(id);
    }

  }, [])


  const { mutate: fetchpushnotificationById } = useMutation({
       mutationFn: pushnotificationbyid,
       onSuccess: (response) => {
        
        if(response){     
          setNotifyPopup({
            noti_name: response.data.noti_name,
            noti_desc: response.data.noti_desc,
            noti_image: response.data.noti_image,
            pathurl: response.data.pathurl,
          });
        } else {
          toast.error("No record data!");
        }
       
       },
       onError: (error) => {
         console.error("Error fetching countries:", error);
       },
     });

  return (
    <div>

      <div className="flex flex-col">
        <div className="flex flex-col bg-[#f5f5dc] p-5 rounded-lg shadow-lg">
          <img
            src={`${notifypopup?.pathurl}${notifypopup?.noti_image}`}
            alt="Product"
            className="w-full max-h-[250px] object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-left">{notifypopup?.noti_name || ''}</h2>
          <p className="text-lg text-gray-700 mb-4 text-left">{notifypopup?.noti_desc || ''}</p>
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

export default Viewnotification;
