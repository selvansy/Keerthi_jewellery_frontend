import Api from "./Api";
import axios from "axios";


//Superadmin
export const superadmin = async (data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/admin/login`,data);
    return response.data;
}
 

export const getactivemenuaccess = async (id) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/useraccess/menu/${id}`);
    return response.data;
}

export const getallemployee = async (page,limit,search) => {
   
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/employee?page=${page}&limit=${limit}&search=${search}`,data);
    return response.data;
}


//Dashboard

//get all clients
export const getAllClients = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/admin/client`);
    return response.data;
}
 
export const getpaymentmodesummary = async (data) => {
    console.log("data----",data)
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/summary/paymentmode`,data);
    return response.data;
}


export const getpaymentDashboard = async (data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/admin/getdashboardaccountcount`,data);
    return response.data;
}


//Category

export const createcategory= async(data)=>{
     console.log("Category",data)
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/category`,data)
    return response.data
}

export const activatecategory= async(id)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/category/${id}/active`)
    return response.data
}

export const getcategoryTable= async(data)=>{
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/category`,data)
    return response.data
}

export const categorybyid= async(data)=>{
  
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/category/${data.id}`)
    return response.data
}


export const updatecategory= async(data)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/category/${data.id}`,data.data)
    return response.data
}

export const deletecategory= async(id)=>{
    const response= await Api.delete(`${import.meta.env.VITE_API_URL}/api/client/category/${id}`)
    return response.data
}


//get branch data tabel
export const getBranchbyclient = async (id) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/branch/${id}`);
    return response.data;
}


export const getAllBranch = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/branch`,data);
    return response.data;
}

export const getBranchById = async (id)=>{
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/branch/${id}`)
    return response.data
}

//Offers
export const allofferstype = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/offerstype`);
    return response.data;
}

export const activateoffers= async(id)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/offer/${id}/active`)
    return response.data
}

export const deleteoffers= async(id)=>{
    console.log("Id",id)
    const response= await Api.delete(`${import.meta.env.VITE_API_URL}/api/client/offer/${id}`)
    return response.data
}


export const offersbyid= async(id)=>{
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/offer/${id}`)
    return response.data
}
 


export const createoffers= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/offer/`,data)
    return response.data
}

export const updateoffers= async(data)=>{

    const response= await Api.patch(`${import.meta.env.VITE_API_URL}api/client/offer/${data.id}`,data.data)
    return response.data
}
 

export const getoffersTable= async()=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/offer/alloffers`,data)
    return response.data
}


//New Arrivals
export const getnewarrivalsTable= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/newarrivals?page=${data.page}&limit=${data.limit}`,data)
    return response.data
}

export const createnewarrivals= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/newarrivals`,data)
    return response.data
}

export const updatenewarrivals= async(data)=>{
    console.log(data)
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/newarrivals/${data.id}`,data.data)
    return response.data
}

export const activatenewarrivals= async(id)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}/active`)
    return response.data
}


export const newarrivalsbyid= async(id)=>{
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}`)
    return response.data
}

 
export const deletenewarrivals= async(id)=>{
    const response= await Api.delete(`${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}`)
    return response.data
}



//Scheme
export const getSchemeTable= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/scheme/table`,data)
    return response.data
}

export const getschemeById= async(id)=>{
    console.log("Schemeid",id)
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/scheme/${id}`)
    return response.data
}

export const changeschemestatus = async (id) => {
    const response = await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/scheme/${id}/active`);
    return response.data;
}
 

export const updateScheme = async (data) => {
    const response = await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/scheme/${data.id}`,data.data);
    return response.data;
}

//add scheme
export const addscheme = async (data)=>{
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/scheme`,data)
    return response.data
}


// scheme classification
export const createSchemeClassification= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/classification`,data)
    return response.data
}
 

//get classification table
export const getmetalrateable= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/classification/table`,data)
    return response.data
}

export const activateClassification= async(id)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/classification/${id}/active`)
    return response.data
}

//get classification by id
export const getClassificationById= async(id)=>{  
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/classification/${id}`)
    return response.data
}


export const updateSchemeClassification = async (values) => {
    const response = await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/classification/${values.id}`,values.data);
    return response.data;
}

export const getClassificationByBranch = async (id) => {

    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/classification/branch/${id}`);
    return response.data;
}

export const deleteClassification= async(id)=>{
    const response= await Api.delete(`${import.meta.env.VITE_API_URL}/api/client/classification/${id}`)
    return response.data
}
 

//Get Scheme Type
export const getschemetypeById = async (id) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/schemetype/${id}`);
    return response.data;
}


//Scheme Account

export const getschemeaccountbyid = async (data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/admin/schemeaccountbyid`,data);
    return response.data;
} 

//Customer
export const getallcustomer = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/customer?page=${data.page}&limit=${data.limit}&search=`);
    return response.data;
}

 
export const updatecustomer = async (data) => {
    const response = await Api.patch(`${import.meta.env.VITE_API_URL}/api/admin/customer/${data.id}`,data);
    return response.data;
}
 
export const changecustomerStatus = async (id) => {
    const response = await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/customer/${id}/active`);
    return response.data;
}

export const deletecustomer = async (id) => {
    const response = await Api.delete(`${import.meta.env.VITE_API_URL}/api/client/customer/${id}`);
    return response.data;
}
 
export const getcustomerById = async (id) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/customer/${id}`,data);
    return response.data;
}
 


//common

export const allpurity = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/purity`);
    return response.data;
}

export const getallmetal = async (id, data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/metal`);
    return response.data;
}

export const allshowtype = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/showtype`);
    return response.data;
}

export const allmetal = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/metal`);
    return response.data;
}

export const displayselltype = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/displaytype`);
    return response.data;
}

export const categorybymetalid= async(id)=>{
   
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/category/metal/${id}`)
    return response.data
}


export const getallschemetypes = async (id, data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/schemetype`, data);
    return response.data;
}
export const puritybymetal = async(id)=>{
 
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/purity/metal/${id}`)
    return response.data;
}

export const buygsttype = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/buygsttype`);
    return response.data;
}

export const allwastagetype = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/wastagetype`);
    return response.data;
}

export const allinstallmenttype = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/installmenttype`);
    return response.data;
}

export const allFundtype = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/common/fundtype`);
    return response.data;
}

//Product

export const deleteproduct= async(id)=>{
    const response= await Api.delete(`${import.meta.env.VITE_API_URL}/api/client/product/${id}`)
    return response.data
}

export const activateproduct= async(id)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/product/${id}/active`)
    return response.data
}


export const productbyId= async(id)=>{
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/product/${id}`)
    return response.data
}


export const getproductTable= async(data)=>{
    const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/product`,data)
    return response.data
}


export const createproduct= async(data)=>{
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/product/`,data)
    return response.data
}

export const updateproduct= async(data)=>{
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/product/${data.id}`,data.data)
    return response.data
}

 
export const schemepaymenttodayrate = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/payment/metalrate/${data}`);
    return response.data;
}
export const getaccountSummaryReport = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/reports/accountsummary`);
    return response.data;
}

export const getOutstandingSummaryReport = async () => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/reports/accountsummary`);
    return response.data;
}

export const postOutstandingSummaryReport = async (data) => {
    const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/reports/outstanding`,data);
    return response.data;
}


export const sendOtp = async(data)=>{
    
    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/close/${data.mobile}/branch/${data.branchId}`)
    return response.data
}

export const verifyOtp = async(data)=>{

    const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/verifyotp`,data)
    return response.data
}

export const closeBill = async(data)=>{

    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${data.id_scheme_account}/close`,data)
    return response.data
}

//  

export const revertBill = async(data)=>{
     console.log("data----",data)
    const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${data.id_scheme_account}/revert`)
    return response.data
}
 


 
