import Api from "./Api";
import axios from "axios";

//staff user Admin login
export const adminLogin = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/login`,
    data
  );
  return response.data;
};

//staff user login
export const staffLofgin = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    data
  );
  return response.data;
};

//scheme
export const getallSchemes = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/scheme`
  );
  return response.data;
};

//add employee
export const addemployee = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/employee`,
    data
  );
  return response.data;
};

export const getallemployeetable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/employee/table`,
    data
  );
  return response.data;
};

export const changeEmployeeStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/employee/${id}/active`
  );
  return response.data;
};

export const getemployeebyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/employee/${data.id || data}`
  );
  return response.data;
};

export const updateemployee = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/employee/${id}`,
    data
  );
  return response.data;
};

export const deleteemployee = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/employee/${id}`
  );
  return response.data;
};

//Wallet
export const getallwallet = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/get-rate`,
    data
  );
  return response.data;
};

export const addwalletData = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/rate`,
    data
  );
  return response.data;
};

export const walletRedeem = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/redeem`,
    data
  );
  return response.data;
};


// 

export const getRefferalpayment = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/refferal-list/payment/${data.id}`,
    data
  );
  return response.data;
};




export const walletRedeemByUser = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/user/redeemData?mobile=${data.mobile}`,
    data
  );
  return response.data;
};

export const RefferalByUser = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/refferal-list/user?mobile=${data.mobile}`,
    data
  );
  return response.data;
};



export const redeemType = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/redeem-type`
  );
  return response.data;
};

export const mobilesearch = async (mobile) => {
  
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/wallet/mobile?mobile=${mobile}`
  );
  return response.data;
};



export const walletHistory = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/table`,
    data
  );
  return response.data;
};

export const redeemHistory = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/redeemtable`,
    data
  );
  return response.data;
};

// Promotions
export const PromotionsHistory = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/notify/pormotion-table`,
    data
  );
  return response.data;
};

//Notification History
export const NotifcationsHistory = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/notify/push-notify-table`,
    data
  );
  return response.data;
};

/*Metal*/
export const getallmetaltable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/metal/table`,
    data
  );
  return response.data;
};

export const changemetalstatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/metal/${id}/active`
  );
  return response.data;
};
export const addmetal = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/metal`,
    data
  );
  return response;
};
export const deletemetal = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/metal/${id.MetalId}`
  );
  return response.data;
};

export const getmetalById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/metal/${id}`
  );
  return response.data;
};

export const updatemetal = async (metalData) => {
  const { id, metal_name } = metalData;
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/metal/${id}`,
    { metal_name }
  );
  return response;
};

export const getallmetal = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/metal`
  );
  return response.data;
};

/*purity*/

export const allFundtype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/fundtype`
  );
  return response.data;
};

export const getallpuritytable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/purity/table`,
    data
  );
  return response.data;
};

export const puritybymetal = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/purity/metal/${id}`
  );
  return response.data;
};
export const changedisplaystatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/purity/${id}/display`
  );
  return response.data;
};
export const changepurityStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/purity/${id}/active`
  );
  return response.data;
};
export const addpurity = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/purity`,
    data
  );
  return response;
};
export const deletepurity = async (id) => {
  const { purityId } = id;
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/purity/${purityId}`
  );
  return response.data;
};

export const getpurityById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/purity/${id}`
  );
  return response.data;
};

export const updatepurity = async (purityData) => {
  const { id, data } = purityData;
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/purity/${id}`,
    data
  );
  return response;
};

export const getallpurity = async (id, data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/purity`,
    data
  );
  return response.data;
};

//Configuration

export const getconfigurationtable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/configuration/table`,
    data
  );
  return response.data;
};

//add General
export const addgeneralsetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/generalsetting`,
    data
  );
  return response.data;
};

export const generalsettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/generalsetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add Notifcation
export const addnotificationsetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/notificationsetting`,
    data
  );
  return response.data;
};

export const notificationConfig = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/notification-config`,
    data
  );
  return response.data;
};

export const getConfig = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/notification-config`
  );
  return response.data;
};

export const notificationsettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/notificationsetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add SMS
export const addsmssetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/smssetting`,
    data
  );
  return response.data;
};

export const smssettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/smssetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add Whatsapp
export const addwhatsappsetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/whatsappsetting`,
    data
  );
  return response.data;
};

export const whatsappsettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/whatsappsetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add Gateway
export const addgatewaysetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/gatewaysetting`,
    data
  );
  return response.data;
};

export const gatewaysettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/gatewaysetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add s3bucket
export const adds3bucketsetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/bucketsetting`,
    data
  );
  return response.data;
};

export const s3bucketsettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/bucketsetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add layout
export const addlayoutsetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/layoutsetting`,
    data
  );
  return response.data;
};

export const layoutsettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/layoutsetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

//add App Setting
export const addappsetting = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/appsetting`,
    data
  );
  return response.data;
};

export const appsettingprojectbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/appsetting/project/${
      data.id_project
    }/branch/${data.id_branch}`
  );
  return response.data;
};

export const layouttype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin//layouttype`
  );
  return response.data;
};

// get all classification using id_branch
export const getallclassification = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/allclassification`,
    data
  );
  return response.data;
};

//get all classification id based
export const allbranchclassification = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/classification/branch/${id}`
  );
  return response.data;
};

/* Gift Item*/

export const getallgiftitemtable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem/table`,
    data
  );
  return response.data;
};

export const changegiftitemStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem/${id}/active`
  );
  return response.data;
};
export const addgiftitem = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem`,
    data
  );
  return response;
};
export const deletegiftitem = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem/${id}`
  );
  return response.data;
};

export const getgiftitemById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem/${id}`
  );
  return response.data;
};

export const updategiftitem = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem/${id}`,
    data
  );
  return response;
};

export const getallgiftitem = async (id, data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem`,
    data
  );
  return response.data;
};

export const getgiftStock = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/giftreport`,
    data
  );
  return response.data;
};

/* Gift Vendor*/
export const getAllgiftvendors = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor/table`,
    data
  );
  return response.data;
};

export const changegiftvendorStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor/${id}/active`
  );
  return response.data;
};
export const addgiftvendor = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor`,
    data
  );
  return response;
};
export const deletegiftvendor = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor/${id}`
  );
  return response.data;
};

export const getgiftvendorById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor/${id}`
  );
  return response.data;
};

export const giftaccountcount = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/cards`,
    data
  );
  return response.data;
};

export const giftIssueBySchId = async (value) => {
    const {id,data} = value
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/schemeaccount/${id}`,
    data
  );
  return response.data;
};

export const getgiftvendorbranchById = async (data) => {

  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor/branch/${data}`
  );
  return response.data;
};

export const getgiftitemvendorById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftitem/vendor/${data}`
  );
  return response.data;
};

export const updategiftvendor = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftvendor/${id}`,
    data
  );
  return response;
};

export const getallgiftvendor = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/getallgiftvendor`
  );
  return response.data;
};

/* Gift inward*/

export const getallgiftinwardtable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards/table`,
    data
  );
  return response.data;
};

export const changegiftinwardStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards/${id}/active`
  );
  return response.data;
};
export const addgiftinward = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards`,
    data
  );
  return response;
};

export const updategiftinward = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards/${id}`,
    data
  );
  return response.data;
};
export const deletegiftinward = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards/${id}`
  );
  return response.data;
};

export const getgiftinwardById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards/${data.id}`
  );
  return response.data;
};

export const getallgiftinward = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftinwards`
  );
  return response.data;
};

export const getallgiftInwardByBranch = async (branch) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/giftinwards/branch/${branch}`);
    return response.data;
}

/* Gift Issues*/

export const giftissuesdatatable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/table`,
    data
  );
  return response.data;
};

export const changegiftissuesStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/${id}/active`
  );
  return response.data;
};
export const addgiftissues = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues`,
    data
  );
  return response;
};
export const deletegiftissues = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/${id}`
  );
  return response.data;
};

export const getgiftissuesById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/${id}`
  );
  return response.data;
};

export const getgiftissuesbranchById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/branch/giftissues/${data}`
  );
  return response.data;
};

export const getgiftitemissuesById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/${data}`
  );
  return response.data;
};

export const updategiftissues = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/${id}`,
    data
  );
  return response;
};

export const getallgiftissues = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues`
  );
  return response.data;
};

//!Scheme Payment
export const addschemepayment = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/payment`,
    data
  );
  return response.data;
};

export const updateschemepayment = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/payment/${data.id}`,
    data
  );
  return response.data;
};
export const deleteschemepayment = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/payment/${id}`
  );
  return response.data;
};
export const getschemepaymentbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/payment/${data.id}`
  );
  return response.data;
};

export const schemepaymenttodayrate = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/today-rate/${
      data.id_branch
    }/date/${data.date}`
  );
  return response.data;
};

export const todaymetalrate = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/today-rate/branchId/${data.id_branch}`
  );
  return response.data;
};

export const schemepaymentdatatable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/payment/table`,
    data
  );
  return response.data;
};

export const schemePayment = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/paymentsummary`,data
  );
  return response.data;
};

//Department

export const getalldepttable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/department/table`,
    data
  );
  return response.data;
};

export const addDepartment = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/department`,
    data
  );
  return response.data;
};

export const getDepartmentById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/department/${data}`
  );
  return response.data;
};

export const getAllDepartments = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/department`
  );
  return response.data;
};

export const updateDepartment = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/department/${data.id}`,
    data.data
  );
  return response.data;
};

export const changedeptstatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/department/${id}/active`
  );
  return response.data;
};

export const deleteDept = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/department/${id}`
  );
  return response.data;
};

//Topup

export const addTopup = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/topup/add`,
    data
  );
  return response.data;
};

export const topupTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/topup/table`,
    data
  );
  return response.data;
};

export const updateStatus = async (payload) => {
  const { id, data } = payload;
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/topup/${id}`,
    data
  );
  return response.data;
};

export const getTopupByClient = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/topup/${id}`
  );
  return response.data;
};

//Campaign

export const getallCampaigntable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/campaigntype/allcampaigntype`,
    data
  );
  return response.data;
};

export const getallCampaign = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/campaigntype`
  );
  return response.data;
};

export const addCampaign = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/campaigntype`,
    data
  );
  return response.data;
};

export const getCampaignById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/campaigntype/${data}`
  );
  return response.data;
};

export const updateCampaign = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/campaigntype/${data.id}`,
    data.data
  );
  return response.data;
};

// export const changedeptstatus = async(id)=>{
//     const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/department/${id}/active`)
//     return response.data
// }

export const deleteCampaign = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/campaigntype/${id}`
  );
  return response.data;
};

//Offers

export const activateoffers = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/offer/${id}/active`
  );
  return response.data;
};

export const deleteoffers = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/offer/${id}`
  );
  return response.data;
};

export const offersbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/offer/${id}`
  );
  return response.data;
};

export const createoffers = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/offer/`,
    data
  );
  return response.data;
};

export const updateoffers = async (data,id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/offer/${id}`,
    data
  );
  return response.data;
};

export const getoffersTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/offer/table`,
    data
  );
  return response.data;
};

//New Arrivals
export const getnewarrivalsTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/table`,
    data
  );
  return response.data;
};

export const createnewarrivals = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals`,
    data
  );
  return response.data;
};

export const updatenewarrivals = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}`,
    data
  );
  return response.data;
};

export const activatenewarrivals = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}/active`
  );
  return response.data;
};

export const newarrivalsbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/${data.id}`
  );
  return response.data;
};

export const deletenewarrivals = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}`
  );
  return response.data;
};

export const updateproduct = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/product/${data.id}`,
    data.formDataToSend
  );
  return response.data;
};

export const deleteproduct = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/product/${id}`
  );
  return response.data;
};

export const activateproduct = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/product/${id}/active`
  );
  return response.data;
};

export const productbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/product/${id}`
  );
  return response.data;
};

export const categorybymetalid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/category/metal/${id}`
  );
  return response.data;
};

export const updatecategory = async (data) => {
  const { id, category_name, id_metal, id_branch,description } = data;
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/category/${id}`,
    { category_name, id_metal, id_branch ,description}
  );
  return response.data;
};

export const deletecategory = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/category/${id}`
  );
  return response.data;
};

export const activatecategory = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/category/${id}/active`
  );
  return response.data;
};

export const pushnotificationdatatable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/pushnotificaiton/table`,
    data
  );
  return response.data;
};

export const deletepushnotification = async (id) => {
  const response = await Api.delete(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/pushnotificaiton/permenentdelete/${id}`
  );
  return response.data;
};

export const createpushnotification = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/pushnotificaiton`,
    data
  );
  return response.data;
};

export const pushnotificationbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/pushnotificaiton/${id.id}`
  );
  return response.data;
};
export const getweddingbirthbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/wedding/${data.type}`
  );
  return response.data;
};

export const createweddingbirth = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/wedding`,
    data
  );
  return response.data;
};

export const getuserpermission = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/useraccess/permissions/${
      data.id_role
    }`
  );
  return response.data;
};

export const updatemenupermission = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/useraccess/${data.id_role}`,
    data
  );
  return response.data;
};

export const getactivemenuaccess = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/useraccess/menu/${data}`
  );
  return response.data;
};

export const getaccountSummaryReport = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/accountsummary`
  );
  return response.data;
};

export const getOutstandingSummaryReport = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/outstandingreport`,
    data
  );
  return response.data;
};

export const getpaymentmodesummary = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/dashboard/summary/paymentmode`,
    data
  );
  return response.data;
};

export const dashboardCardsData = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/dashboard`,
    data
  );
  return response.data;
};

/* Menu*/

export const getallmenudatatable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting/allmenu`,
    data
  );
  return response.data;
};

export const changeMenuStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting/${id}/active`
  );
  return response.data;
};

export const addMenu = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting`,
    data
  );
  return response;
};
export const deleteMenu = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting/${id}`
  );
  return response.data;
};

export const getMenuById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting/${id}`
  );
  return response.data;
};

export const updateMenu = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting/${id}`,
    data
  );
  return response;
};

export const getallmenu = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/menusetting`
  );
  return response.data;
};

/* submenu*/

export const getallsubmenudatatable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/submenusetting/submenu`,
    data
  );
  return response.data;
};

export const changesubmenuStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/submenusetting/${id}/active`
  );
  return response.data;
};
export const addsubmenu = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/submenusetting`,
    data
  );
  return response;
};
export const deletesubmenu = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/submenusetting/${id}`
  );
  return response.data;
};

export const getsubmenuById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/submenusetting/${id}`
  );
  return response.data;
};

export const updatesubmenu = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/submenusetting/${id}`,
    data
  );
  return response.data;
};

export const getallsubmenu = async (id, data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/allsubmenusetting`,
    data
  );
  return response.data;
};

/*paymentmode*/

export const getallpaymentmodes = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode/table`,
    data
  );
  return response.data;
};

export const changepaymentmodestatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode/${id}/active`
  );
  return response.data;
};
export const addpaymentmode = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode`,
    data
  );
  return response;
};
export const deletepaymentmode = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode/${id}`
  );
  return response.data;
};

export const getpaymentmodebyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode/${id}`
  );
  return response.data;
};

export const updatepaymentmode = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode/${id}`,
    data
  );
  return response;
};

export const getallpaymentmode = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/paymentmode`
  );
  return response.data;
};

//staff user
export const getstaffusertable = async (data) => {
  
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/staff/table`,
    data
  );
  return response.data;
};
export const addstaff = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/staff`,
    data
  );
  return response.data;
};

export const updatestaff = async (id, data) => {
  
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/staff/${id}`,
    data
  );
  return response;
};

export const changeStaffUserStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/staff/${id}/active`
  );
  return response.data;
};

export const deleteStaffUser = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/staff/${id}`
  );
  return response.data;
};

export const getstaffbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/staff/${id}`
  );
  return response.data;
};

/*User ROle*/

export const getalluserroletable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/userrole/table`,
    data
  );
  return response.data;
};

export const changeuserrolestatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/userrole/${id}/active`
  );
  return response.data;
};
export const adduserrole = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/userrole`,
    data
  );
  return response;
};
export const deleteuserrole = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/userrole/${id}`
  );
  return response.data;
};

export const getuserroleById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/userrole/${id}`
  );
  return response.data;
};

export const updateuserrole = async (id, data) => {

  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/userrole/${id}`,
    data
  );
  return response;
};

export const getalluserrole = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/userrole`
  );
  return response.data;
};

/*schemetype*/

export const getschemetypetable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype/table`,
    data
  );
  return response.data;
};

export const changeschemetypestatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype/${id}/active`
  );
  return response.data;
};
export const addschemetype = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype`,
    data
  );
  return response;
};
export const deleteschemetype = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype/${id}`
  );
  return response.data;
};

export const getschemetypebyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype/${id}`
  );
  return response.data;
};

export const updateschemetype = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype/${id}`,
    data
  );
  return response;
};

export const getallschemetypes = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/schemetype`
  );
  return response.data;
};

//Client

export const getallclienttable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/client/table`,data
  );
  return response.data;
};

export const addclient = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/client`,
    data
  );
  return response.data;
};

export const updateclient = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/client/${data.id}`,
    data
  );
  return response.data;
};

export const deleteclient = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/admin/client/${id}`
  );
  return response.data;
};

export const getclientbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/client/${id}`
  );
  return response.data;
};

export const getallclient = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/client`
  );
  return response.data;
};

//Project
export const getallprojecttable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/projects/table`,
    data
  );
  return response.data;
};

export const addproject = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/projects`,
    data
  );
  return response.data;
};

export const updateproject = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/projects/${id}`,
    data
  );
  return response.data;
};

export const changeprojectstatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/projects/${id}/active`
  );
  return response.data;
};

export const deleteproject = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/admin/projects/${id}`
  );
  return response.data;
};

export const getprojectbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/projects/${id}`
  );
  return response.data;
};

export const getallprojects = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/projects`
  );
  return response.data;
};
//get all projects
export const getallProject = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/projectdatatable`,
    data
  );
  return response.data;
};

export const getprojectbyclient = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/projects/client/${
      data.id_client
    }`
  );
  return response.data;
};

//Project
export const getallprojectaccesstable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess/table`,
    data
  );
  return response.data;
};

export const addprojectaccess = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess`,
    data
  );
  return response.data;
};

export const updateprojectaccess = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess/${data._id}`,
    data
  );
  return response.data;
};

export const changeprojectaccessstatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess/${id}/active`
  );
  return response.data;
};

export const deleteprojectaccess = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess/${id}`
  );
  return response.data;
};

export const getprojectaccessbyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess/${id}`
  );
  return response.data;
};

export const getallprojectaccesss = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccess`,
    data
  );
  return response.data;
};

export const getprojectaccessbyclient = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/admin/projectaccessbyclient/${id}`
  );
  return response.data;
};

//Branch
export const getallbranchtable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/branch/table`,
    data
  );
  return response.data;
};

export const addbranch = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/branch`,
    data
  );
  return response.data;
};

export const updatebranch = async ({ id, ...data }) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/client/branch/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getbranchbyclient = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/branch/client/${data.id_client}`
  );
  return response.data;
};

export const getbranchbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/branch//${data.id}`
  );
  return response.data;
};

export const getBranchById = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/branch/${data.id || data}`
  );
  return response.data;
};

export const deletebranch = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/branch/${id}`
  );
  return response.data;
};

export const activatebranch = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/branch/${id}/active`
  );
  return response.data;
};

export const getallbranch = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/branch`
  );
  return response.data;
};

export const getAllBranch = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/branch`,
    data
  );
  return response.data;
};

export const employeebybranch = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/employeebybranch`,
    data
  );
  return response.data;
};

//Customer

export const getcustomertable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/customer/table`,
    data
  );
  return response.data;
};

export const addcustomer = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/customer`,
    data
  );
  return response.data;
};
export const updatecustomer = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/customer/${data.id}`,
    data.data
  );
  return response.data;
};

export const changecustomerStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/customer/${id}/active`
  );
  return response.data;
};

export const deletecustomer = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/customer/${id}`
  );
  return response.data;
};

export const getcustomerbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/customer/${data.id}`
  );
  return response.data;
};

export const getallcustomer = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/customer`
  );
  return response.data;
};

export const getcustomerByBranchId = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/customer/branch/${id}`
  );
  return response.data;
};

export const getCustomersByScheme =  async (data)=>{
  const response = await Api.post(`${import.meta.env.VITE_API_URL}/api/client/customer/scheme`,data)
}

export const getcustomerById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/customer/${id}`
  );
  return response.data;
};

//Scheme Account
export const addschemeaccount = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount`,
    data
  );
  return response.data;
};
export const schemeaccounttable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/table`,
    data
  );
  return response.data;
};
export const changeschemeaccountStatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${id}/active`
  );
  return response.data;
};
export const updateschemeaccount = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${data.id}`,
    data
  );
  return response.data;
};
export const deleteschemeaccount = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${id}`
  );
  return response.data;
};
export const getallbranchscheme = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/branch/${data.id_branch}`
  );
  return response.data;
};
export const getallbranchclassification = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/classification/scheme`
  );
  return response.data;
};
export const getemployeebybranch = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/employee/branch/${
      data.id_branch
    }`
  );
  return response.data;
};
export const getallbranchcustomer = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/getallbranchcustomer`,
    data
  );
  return response.data;
};
export const searchcustomermobile = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/customer/branch/${data.id_branch}/search?search=${data.search}`);
    return response.data;
}

export const searchmobileschemeaccount = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/branch/${
      data.id_branch
    }/customer/search?mobile=${data.search_mobile}&state=${data.type}`
  );
  return response.data;
};

export const customSearchScheme = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/search`,data);
  return response.data;
};

export const getschemeaccountbyid = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${data}`);
  return response.data;
};

export const geallschemebyclassification = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/classification?classId=${data}`
  );
  return response.data;
};

export const extendinstallment = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/extendinstallment`,
    data
  );
  return response.data;
};
export const addcloseSchemeAccount = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/addcloseSchemeAccount`,
    data
  );
  return response.data;
};
export const revertschemeAccount = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/schemeAccount/${id}/revert`
  );
  return response.data;
};

export const getcustomerschemeaccount = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/schemeaccount/branch/${
      data.id_branch
    }/customer/${data.id_customer}`
  );
  return response.data;
};

export const searchGiftCodenumber = async (data) => {
  
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/giftissues/branch/${data.id_branch}/barcode`,
    data.GiftCode
  );
  return response.data;
};

export const getSchemeAccountCount = async (mobile, schemeId) => {
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/schemeaccount/accountcount?mobile=${mobile}&schemeid=${schemeId}`
  );
  return response.data;
};

export const schemeAccByCusIdSchmeId = async (cusId, schemeAccNum) => {
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/schemeaccount/revert?cusid=${cusId}&schemenum=${schemeAccNum}`
  );
  return response.data;
};

//Aupay Configure
export const printtype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/printtype`
  );
  return response.data;
};
export const accountnotype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/accountnotype`
  );
  return response.data;
};
export const classifytype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/classifytype`
  );
  return response.data;
};
export const referralcalculation = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/referralcalculation`
  );
  return response.data;
};
export const displaytype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/displaytype`
  );
  return response.data;
};
export const receipttype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/receipttype`
  );
  return response.data;
};
export const closeprinttype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/closeprinttype`
  );
  return response.data;
};
export const smsaccesstype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/smsaccesstype`
  );
  return response.data;
};
export const whatsapptype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/whatsapptype`
  );
  return response.data;
};
export const paymenttype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/paymenttype`
  );
  return response.data;
};
export const fundtype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/fundtype`
  );
  return response.data;
};

export const typeway = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/typeway`
  );
  return response.data;
};
export const allinstallmenttype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/installmenttype`
  );
  return response.data;
};
export const allmakingcharge = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/allmakingcharge`
  );
  return response.data;
};
export const wastagetype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/wastagetype`
  );
  return response.data;
};
export const referralvisible = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/referralvisible`
  );
  return response.data;
};
export const allmetal = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/allmetal`
  );
  return response.data;
};
export const allpaymentmode = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/allpaymentmode`
  );
  return response.data;
};
export const allpaymentstatus = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/allpaymentstatus`
  );
  return response.data;
};
export const allschemestatus = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/schemestatus`
  );
  return response.data;
};
export const allpurity = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/allpurity`
  );
  return response.data;
};
export const gender = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/gender`
  );
  return response.data;
};
export const allcountry = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/country`
  );
  return response.data;
};

export const allstate = async (country) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/state/${country}`
  );
  return response.data;
};

export const allcity = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/city/${data}`
  );
  return response.data;
};

export const addedtype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/addedtype`
  );
  return response.data;
};

export const giftissuetype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/giftissuetype`
  );
  return response.data;
};

export const offerstype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/offerstype`
  );
  return response.data;
};

export const showtype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/showtype`
  );
  return response.data;
};

export const displayselltype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/displayselltype`
  );
  return response.data;
};

export const notificationtype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/notificationtype`
  );
  return response.data;
};

export const buygsttype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/buygsttype`
  );
  return response.data;
};

//Category
export const createcategory = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/category`,
    data
  );
  return response.data;
};

export const getcategoryTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/category/table`,
    data
  );
  return response.data;
};

export const categorybyid = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/category/${id}`
  );
  return response.data;
};

// /api/client/product
export const getproductTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/product/table`,
    data
  );
  return response.data;
};

export const createproduct = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/product/`,
    data
  );
  return response.data;
};

//Scheme
export const getSchemeTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/table`,
    data
  );
  return response.data;
};

export const getschemeById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/${id}`
  );
  return response.data;
};

export const changeschemestatus = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/${id}/active`
  );
  return response.data;
};

export const updateScheme = async (id, data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/${id}`,
    data
  );
  return response;
};

//add scheme
export const addscheme = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/scheme`,
    data
  );
  return response.data;
};

// scheme classification
export const createSchemeClassification = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/classification`,
    data
  );
  return response.data;
};

//get classification table
export const getClassificationTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/classification/table`,
    data
  );
  return response.data;
};

export const activateClassification = async (id) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/classification/${id}/active`
  );
  return response.data;
};

//get classification by id
export const getClassificationById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/classification/${id}`
  );
  return response.data;
};

export const updateSchemeClassification = async (values) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/classification/${values.id}`,
    values.data
  );
  return response.data;
};

export const getClassificationByBranch = async (id_branch) => {
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/classification/branch/${id_branch}`
  );
  return response.data;
};

export const deleteClassification = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/classification/${id}`
  );
  return response.data;
};

export const deleteScheme = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/${id}`
  );
  return response.data;
};

//Branch By Client
export const getBranchByClient = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/branch/client`,
    data
  );
  return response.data;
};

//Report
export const getallScheme = async (id, data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/admin/accountsummaryreport`,
    data
  );
  return response.data;
};

export const productbyId = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/product/${id}`
  );
  return response.data;
};

export const allofferstype = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/offerstype`
  );
  return response.data;
};

export const getnotificationtype = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/notificationtype`
  );
  return response.data;
};

// Metal Rate
export const createmetalrate = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate`,
    data
  );
  return response.data;
};

export const updatemetalrate = async (values) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/${values.id}`,
    values.data
  );
  return response.data;
};

export const getmetalratetable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/table`,
    data
  );
  return response.data;
};

export const getmetalrateById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/${id}`
  );
  return response.data;
};

export const deletemetalrate = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/${id}`
  );
  return response.data;
};

export const getMetalRateByMetalId = async (metalId, purityId, date,branch) => {
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/metalrate/current?metalid=${metalId}&purity=${purityId}&date=${date}&branch=${branch}`
  );
  return response.data;
};

export const sendwhatsappmessage = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/whatsappmessage`,
    data
  );
  return response.data;
};

export const getmultipaymentmode = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/multipaymentmode`
  );
  return response.data;
};

export const todayMetalRate = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/metalrate/today/${data.id}/${
      data.todayDate
    }`
  );
  return response.data;
};

export const searchaccountnumber = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/payment/schacc?schAcc=${data}`
  );
  return response.data;
};

export const searchPaymentBySchNo = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/payment/schacc?schAcc=${data.mobile}&limit=${data.limit}&page=${data.page}`
  );
  return response.data;
};




export const searchSchAccByMobile = async (data) => {
    const response = await Api.get(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/accnum/mobile/search?value=${data.value}&branchId=${data.branchId}`);
    return response.data;
}


//offers
export const getOfferById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/offer/${id}`
  );
  return response.data;
};

export const getNewArrivalsById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/${id}`
  );
  return response.data;
};

export const getProductById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/product/${id}`
  );
  return response.data;
};
export const getProductByBranch = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/product/branch/${id}`
  );
  return response.data;
};

export const getNewArrivalByBranch = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/newarrivals/branch/${id}`
  );
  return response.data;
};

export const updatelayoutcolor = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/admin/layoutsetting/color`,
    data
  );
  return response;
};

export const organisation = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/organisation`,
    data
  );
  return response.data;
};

export const getOrganisation = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/organisation`,
    data
  );
  return response.data;
};

//new scheme api
export const getSchemeClassifications = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/classification/scheme`
  );
  return response.data;
};

//get customer details by mobile number no branch Id needed
export const getCustomerByMobile = async (number,customer) => {
  
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/customer/mobile/search?search=${number}&customer=${customer}`
  );
  return response.data;
};

export const getEmployeeByMobile = async (number) => {
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/employee/mobile?search=${number}`
  );
  return response.data;
};

export const getCustomerSummary = async (data) => {
  const response = await Api.get(
    `${
      import.meta.env.VITE_API_URL
    }/api/client/wallet/customer-details?mobileNumber=${data}`
  );
  return response.data;
};

export const digiGoldStaticData = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/scheme/digigold`
  );
  return response.data;
};

// ticket Raise api
export const getAllTicket = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/ticketraise/table`,
    data
  );
  return response.data;
};

export const addTicketRaise = async (formData) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/ticketraise`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const getallContent = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/content-type`
  );
  return response.data;
};

export const addContent = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/content/add`,
    data
  );
  return response.data;
};

export const getContentById = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/content/${id}`
  );

  return response.data;
};

export const deleteContent = async (id) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/content/${id}`
  );
  return response.data;
};

export const getfaqCat = async () => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/common/faq-category`
  );
  return response.data;
};

export const getAllfaq = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/faq/all/`,
    data
  );
  return response.data;
};

export const addFaq = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/faq/add/`,
    data
  );
  return response.data;
};

export const deleteFaq = async (data) => {
  const response = await Api.delete(
    `${import.meta.env.VITE_API_URL}/api/client/faq/${data}`
  );
  return response.data;
};

export const getfaqTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/faq/all/`,
    data
  );
  return response.data;
};

export const getContentTable = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/content/all/`,
    data
  );
  return response.data;
};

export const getFaqId = async (id) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/faq/${id}`
  );
  return response.data;
};

export const updateFaq = async (data) => {
  const response = await Api.patch(
    `${import.meta.env.VITE_API_URL}/api/client/faq/update/${data.id}`,
    data.values
  );
  return response.data;
};

export const addPromotions = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/notify/promotion`,
    data
  );
  return response.data;
};

export const getContentTypes = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/content/all/type/${data.type}`,
    data.data
  );
  return response.data;
};

//
export const dueReportSummary = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/overdue`,data
  );
  return response.data;
};

export const preCloseSummary = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/preclosesummary`,data
  );
  return response.data;
};
export const closedSummary = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/closedsummary`,data
  );
  return response.data;
};
export const refundSummary = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/refundsummary`,data
  );
  return response.data;
};
export const completedAccount = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/account/completed`,data
  );
  return response.data;
};
export const getOverAllSummary = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/overallreport`,data
  );
  return response.data;
};
export const amountPayble = async (data) => {
  
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/amountpayble`,data
  );
  return response.data;
};

export const getPaymentLedger = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/paymentledger`,
    data
  );
  return response.data;
};


//re check needed for this api section
export const sendOtp = async(data)=>{
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/close/${data.mobile}/branch/${data.branchId}`)
  return response.data
}

export const verifyOtp = async(data)=>{
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/otp/verifyotp`,data)
  return response.data
}

export const closeBill = async(data)=>{
  const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${data.id_scheme_account}/close`,data)
  return response.data
}

export const revertBill = async(data)=>{ 
  const response= await Api.patch(`${import.meta.env.VITE_API_URL}/api/client/schemeaccount/${data.id_scheme_account}/revert`)
  return response.data
}

//scheme
export const getDelistedSchemes = async(data)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/scheme/delist`,data)
  return response.data
}


// dashboard

export const getOverAllDashboard = async(branchId)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/overall`,{branchId})
  return response.data
}

export const getAccountReview = async(data)=>{ 
  
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/accountreview`,data)
  return response.data
}

export const accountStats = async(data)=>{ 
  
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/account`,data)
  return response.data
}

export const getSchemeByBrachId = async(id)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/scheme/branch/${id}`)
  return response.data
}
export const getActiveScheme = async()=>{ 
  const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/scheme`)
  return response.data
}
export const paymentHistory = async(data)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/paymenthistory`,data)
  return response.data
}

export const paymentModeHistory = async(data)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/dashboard/paymentmodehistory`,data)
  return response.data
}

export const getEmployeeRefferal = async(data)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/reports/employeereffer`,data)
  return response.data
}
export const getCustomerRefferal = async(data)=>{ 
  const response= await Api.post(`${import.meta.env.VITE_API_URL}/api/client/reports/customerreffer`,data)
  return response.data
}

export const customerOverview = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/customer/overview`,
    data
  );
  return response.data;
};

export const activeSchemes = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/activeaccounts`,
    data
  );
  return response.data;
};

export const redeemedSchemes = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/redeemedaccounts`,
    data
  );
  return response.data;
};

//!per user redeem history
export const userRedeemHistory = async (data) => {
  const response = await Api.get(
    `${import.meta.env.VITE_API_URL}/api/client/wallet/history?id=${data.id}&page=${data.page}&limit=${data.limit}`,
    data
  );
  return response.data;
};




//!drill down api

export const getSchemeDetailedView = async(data)=>{ 
  const response= await Api.get(`${import.meta.env.VITE_API_URL}/api/client/reports/scheme?schemeid=${data.id}&page=${data.page}&limit=${data.limit}&search=${data.search}`,)
  return response.data
}

export const getSchemewiseAmount = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/amount`,data
  );
  return response.data;
};

export const getSchemewiseWeight = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/reports/weight`,data
  );
  return response.data;
};


//endpoints for exporting data
export const exportData= async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/import`,data
  );
  return response.data;
};

export const getSchemeCustomers = async (data) => {
  const response = await Api.post(
    `${import.meta.env.VITE_API_URL}/api/client/notify/schemecustomers`,
    data
  );
  return response.data;
};
