import { createSlice } from '@reduxjs/toolkit';
import { addbranch } from '../chit/api/Endpoints';


const initialState = {
  currentStep: 0,
  Clientdata:{
    company_name: "",
    shop_contact: "",
    md_name: "",
    md_mobile: "",
    organiz_spocname: "",
    organiz_spoccontact: "",
    aupay_active: false,
    aupay_url: "",
    ausale_active: false,
    ausale_url: "",
    pawn_active: false,
    pawn_url: "",
},
accExp:{},
outreport:[],
  branchdata:[],
  reviewData:[],
  whatsappData:[],
  superAdmin:true,
  totalSteps: null,
  layoutColor: "#004181",
  sideBarColor: "#ffffff",
  selectedProject: null,
  pushnotifyId:null,
  id_scheme_account:null,
  settingtype:null,
  accessmenudata:[],
  id:null,
  roledata:null,
  id_client: null,
  id_project: null,
  id_branch: null
};

const clientFormSlice = createSlice({
  name: 'clientForm',
  initialState,
  reducers: {
    pagehandler: (state, action) => {

      if (action.payload >= 0 && action.payload < state.totalSteps) {
        state.currentStep = action.payload;
      }
    },
    SetaccExp:(state,action)=>{
      if (!action.payload) return;
      state.accExp = action.payload
    },
    SetOutreport:(state,action)=>{
      state.outreport = action.payload
    },
    setLayoutColor:(state,action)=>{
      state.layoutColor = action.payload
    },
    setSuperAdmin: (state)=>{
      state.superAdmin = !state.superAdmin;
    },
    setWhatsappData:(state,action)=>{
      state.whatsappData = action.payload
    },
    setRoleData: (state,action)=>{
      state.roledata = action.payload;
    },
    setClientData: (state,action)=>{
      state.Clientdata = action.payload;
    },
    setBranchForm: (state, action) => {
      state.branchdata.push(action.payload);
    },
    setReviewForm: (state, action) => {
      state.reviewData.push(action.payload);
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setid: (state, action) => {
      state.id = action.payload;
    },
    setPushnotifyId: (state, action) => {
      state.pushnotifyId = action.payload;
    },
    setScemeAccountId: (state, action) => {
      state.id_scheme_account = action.payload;
    },
    setSettingtype: (state, action) => {
      state.settingtype = action.payload;
    },
    setAccessmenudata: (state, action) => {
      state.accessmenudata = action.payload;
    },
    setClientId: (state, action) => {
      state.id_client = action.payload;
    },
    setProjectId: (state, action) => {
      state.id_project = action.payload;
    },
    setAupayurl: (state, action) => {
      state.aupay_url = action.payload;
    },
    setAusaleurl: (state, action) => {
      state.aupay_url = action.payload;
    },
    setPawnurl: (state, action) => {
      state.aupay_url = action.payload;
    },
    setbranchId: (state, action) => {
      state.id_branch = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalSteps = action.payload;
    },
    resetPage: (state) => {
      state.currentStep = 0;
    },
    RoleDatalogout: (state) => {
      state.roledata = null;

    },
  },
});

export const { pagehandler, setTotalPage, resetPage,setid,setSuperAdmin,setPushnotifyId,setSettingtype,setAccessmenudata,setWhatsappData,setLayoutColor,setScemeAccountId,SetaccExp,SetOutreport,
  setSelectedProject, setClientId, setProjectId,setAupayurl,setAusaleurl,setPawnurl, setbranchId,setClientData,setBranchForm,setReviewForm,setRoleData,RoleDatalogout } = clientFormSlice.actions;
export default clientFormSlice.reducer;
