import Api from "../../../api/Api";
import axios from "axios";


 
export const schemepaymentdatatable = async (data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/payment/table`,data);
    return response.data;
}

 
export const getpaymentmodesummary = async(data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/summary/paymentmode`,data);
    return response.data;
}

// /api/client/metalrate/today/676e4a9dd3e747cfc70968a2/2025-02-06T04:16:36.625+00:00

export const todayMetalRate = async(data)=>{
    
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/metalrate/today/${data.id}/${data.todayDate}`);
    return response.data;
}
