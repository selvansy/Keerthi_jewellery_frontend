import Api from "../../../api/Api";
import axios from "axios";


 
export const schemepaymentdatatable = async (data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/payment/table`,data);
    return response.data;
}

 
export const getpaymentmodesummary = async(data) => {
    console.log(data)
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/summary/paymentmode`,data);
    return response.data;
}


export const todayMetalRate = async(id)=>{
  
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/metalrate/today/${id}`);
    return response.data;
}
