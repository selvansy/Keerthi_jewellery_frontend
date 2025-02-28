import Base from "../chit/components/common/Base";
import Scheme from "../chit/components/ourscheme/scheme/Scheme";
import AddScheme from "../chit/components/ourscheme/scheme/AddScheme";
import MetalRate from "../chit/components/ourscheme/metalrate/index";
import CreateMetalRate from "../chit/components/ourscheme/metalrate/Createmetalrate";
import SchemeClassification from "../chit/components/ourscheme/classification/schemeClassification";
import CreateSchemeClassificaton from "../chit/components/ourscheme/classification/CreateSchemeClassification";
import DigiGoldScheme from "../chit/components/ourscheme/digiGold/DigiGoldScheme"
import CreateDigiGoldScheme from "../chit/components/ourscheme/digiGold/CreateDigiGoldScheme";
import GiftVendor from "../chit/components/gift/giftvendor/index";
import GiftItem from "../chit/components/gift/giftitem/index";
import GiftInwards from "../chit/components/gift/giftPurchase/GiftPurchase";
import AddGiftPurchase from "../chit/components/gift/giftPurchase/AddGiftPurchase";
import Category from "../chit/components/catalog/category/Category";
import AddCategory from "../chit/components/catalog/category/AddCategory";
import Product from "../chit/components/catalog/product/Product";
import AddProduct from "../chit/components/catalog/product/AddProduct";
import Offers from "../chit/components/catalog/offers/Offers";
import NewArrivals from "../chit/components/catalog/newarrivals/NewArrivals";
import AddNewArrival from "../chit/components/catalog/newarrivals/AddNewArrival";
import Pushnotification from "../chit/components/notification/pushnotification/index";
import AddOffers from "../chit/components/catalog/offers/AddOffers";
import ExistingCusTable from "../chit/components/manageaccount/customer/index";
import Customers from "../chit/components/manageaccount/customer/Customers";
import OutStandingWeight from "../chit/components/Report/OutStandingWeight";
import ModeWisePayment from "../chit/components/Report/PaymentModeLedger";
import GiftStock from "../chit/components/Report/GiftStock";
import Branch from "../chit/components/Setup/branch/Branch";
import AddBranch from "../chit/components/Setup/branch/AddBranch";
import OurEmployee from "../chit/components/Setup/employee/OurEmployee";
import AddEmployee from "../chit/components/Setup/employee/AddEmployee";
import UserRole from "../chit/components/Setup/userrole/index";
import StaffUser from "../chit/components/Setup/staffuser/index";
import UserAccess from "../chit/components/Setup/useraccess/index";
import Wallet from "../chit/components/payment/wallet/Wallet";
import Redeem from "../chit/components/payment/redeem/Redeem";
import GiftHandOver from "../chit/components/gift/giftissues/GiftHandOver";
import AddGiftHandOver from "../chit/components/gift/giftissues/AddGiftHandOver";
import SchemePayment from "../chit/components/payment/schemepayment/SchemePayment";
import Schemeaccount from "../chit/components/manageaccount/schemeaccount/index";
import AddSchemeAccount from "../chit/components/manageaccount/schemeaccount/SchemeAccountform";
import CloseAccount from "../chit/components/manageaccount/closedaccount/CloseAccount";
import AddCloseAccount from "../chit/components/manageaccount/closedaccount/AddCloseAccount";
import AddRvertAccount from "../chit/components/manageaccount/closedaccount/AddRvertAccount";
import CompleteAccount from "../chit/components/manageaccount/completedaccount/CompleteAccount";
import DigiGold from "../chit/components/manageaccount/digigold/index";
import AddSchemePayment from "../chit/components/payment/schemepayment/AddSchemePayment";
import ProjectMaster from "../chit/components/SuperAdmin/Project/index";
import ProjectAccess from "../chit/components/SuperAdmin/ProjectAccess/index";
import Submenu from "../chit/components/Setup/submenu/index";
import Paymentmode from "../chit/components/Setup/paymentmode/index";
import Schemetype from "../chit/components/Setup/schemetype/index";
import Metal from "../chit/components/Setup/metal/index";
import Purity from "../chit/components/Setup/purity/index";
import MenuComp from "../chit/components/Setup/menu/index";
import Login from "../chit/components/Login";
import ClientMaster from '../chit/components/SuperAdmin/ClientMaster/index';
import ClientForm from '../chit/components/SuperAdmin/ClientMaster/ClientForm';
import AupayConfigure from "../chit/components/SuperAdmin/Configure/aupay/index";
import AdminMaster from "../chit/components/SuperAdmin/Accounts/AdminMaster";
import Dashboard from "../chit/components/SuperAdmin/Dashboard/Dashboard"
import AddNotfication from "../chit/components/notification/pushnotification/AddNotfication";
import Weddingnotification from "../chit/components/notification/Weddingnotification";
import Birthdaynotification from "../chit/components/notification/Birthdaynotification";
import SchemePaymentReport from "../chit/components/Report/SchemePaymentReport";
import SchemeAccountReport from "../chit/components/Report/SchemeAccountReport";
import AccountSummaryReport from "../chit/components/Report/AccountSummary";
import OutStandingReport from "../chit/components/common/OutStandingReport";
import OutStandingAmount from "../chit/components/Report/OutStandingAmout";
import CardPrint from "../chit/components/print/CardPrint/printone";
import ReceiptPrint from "../chit/components/print/ReceiptPrint/printone";
import NewArrivalsWhatsapp from "../chit/components/whatsapp/newarrivals/index";
import ProductWhatsapp from "../chit/components/whatsapp/product/index";
import OffersWhatsapp from  "../chit/components/whatsapp/offers/index";
import Organisation from "../chit/components/Setup/organisation";
import Department from "../chit/components/Setup/dept/Department";
import Topup from "../chit/components/Setup/topup";
import SchemeForm from "../chit/components/ourscheme/scheme/newScheme";
import Campaign from "../chit/components/Setup/campaign";
import configNotification from "../chit/components/notification/notification-configurations/configNotification";

const RouteList = [


  {
    name:'Login',
    path:'/', 
    element: <Login/>
  },
 
  {
    name: "Dashboard",
    path:'/dashboard',
    element:<Base renderContent={Dashboard}/>
  },

  //Scheme
  {
    name: "Scheme",
    path: "/scheme/scheme",
    element: <Base renderContent={Scheme}/>,
  },
  {
    name: "Add Scheme",
    path: "/scheme/addscheme",
    element: <Base renderContent={AddScheme}/>,
  },
  {
    name: "Add Scheme",
    path: "/scheme/addscheme/:id",
    element: <Base renderContent={AddScheme}/>,
  },

  //ManageAccount
   
  {
    name: "Scheme Account",
    path:'manageaccount/schemeaccount/',
    element:<Base renderContent={Schemeaccount}/>
  },
  {
    name: "Add Scheme Account",
    path:'/manageaccount/addschemeaccount',
    element:<Base renderContent={AddSchemeAccount}/>
  },

  {
    name: "Update Scheme Account",
    path:'/manageaccount/addschemeaccount/:id',
    element:<Base renderContent={AddSchemeAccount}/>
  },
  {
    name: "Digi Gold Account",
    path:'/manageaccount/digigoldaccount',
    element:<Base renderContent={DigiGold}/>
  },
  
   //Masters
   {
    name: "Purity",
    path:'masters/purity/',
    element:<Base renderContent={Purity}/>
  },
  {
    name: "Metal",
    path:'masters/metal/',
    element:<Base renderContent={Metal}/>
  },
  {
    name: "Metal Rate",
    path:'masters/metalrate',
    element:<Base renderContent={MetalRate}/>
  },
  {
    name: "Create Metal Rate",
    path:'/masters/metalrate/edit/:id',
    element:<Base renderContent={CreateMetalRate}/>
  },
  {
    name: "Create Metal Rate",
    path:'/masters/metalrate/add',
    element:<Base renderContent={CreateMetalRate}/>
  },
  {
    name: "User Role",
    path:'masters/userrole',
    element:<Base renderContent={UserRole}/>
  },
  {
    name: "User Access",
    path:'masters/useraccess',
    element:<Base renderContent={UserAccess}/>
  },
  {
    name: "Mode of Payment",
    path:'/masters/paymentmode/',
    element:<Base renderContent={Paymentmode}/>
  },
  {
    name: "Department",
    path:'/masters/department',
    element:<Base renderContent={Department}/>
  },
  {
    name: "Topup",
    path:'masters/topup',
    element:<Base renderContent={Topup}/>
  },
  {
    name: "Campaign Type",
    path:'/masters/campaign',
    element:<Base renderContent={Campaign}/>
  },

  //Payment
  {
    name: "Scheme Payment",
    path:'/payment/customerpayment',
    element:<Base renderContent={SchemePayment}/>
  },
    {
      name: "Add Scheme Payment",
      path:'/payment/addschemepayment',
      element:<Base renderContent={AddSchemePayment}/>
    },
     {
      name: "Add Scheme Payment",
      path:'/payment/addschemepayment/:id',
      element:<Base renderContent={AddSchemePayment}/>
    },

    //Catalog
    {
      name: "Category",
      path:'/catalog/category',
      element:<Base renderContent={Category}/>
    },
    {
      name: "Add Category",
      path:'/catalog/addcategory',
      element:<Base renderContent={AddCategory}/>
    },
    {
      name: "Update Category",
      path:'/catalog/editcategory/:id',
      element:<Base renderContent={AddCategory}/>
    },
    {
      name: "Product",
      path:'/catalog/product',
      element:<Base renderContent={Product}/>
  },
    {
      name: "Add Product",
      path:'/catalog/addproduct',
      element:<Base renderContent={AddProduct}/>
    },
    {
      name: "Update Product",
      path:'/catalog/editproduct/:id',
      element:<Base renderContent={AddProduct}/>
    },
    {
      name: "Offers",
      path:'/catalog/offers',
      element:<Base renderContent={Offers}/>
    },
    {
      name: "Add Offer",
      path:'/catalog/addoffers',
      element:<Base renderContent={AddOffers}/>
    },
    {
      name: "Update Offer",
      path:'/catalog/editoffers/:id',
      element:<Base renderContent={AddOffers}/>
    },
    {
      name: "New Arrivals",
      path:'/catalog/newarrivals',
      element:<Base renderContent={NewArrivals}/>
    },
    {
      name: "Add New Arrivals",
      path:'/catalog/addnewarrivals',
      element:<Base renderContent={AddNewArrival}/>
    },
    {
      name: "Update New Arrivals",
      path:'/catalog/editnewarrivals/:id',
      element:<Base renderContent={AddNewArrival}/>
    },

    //Manage Customers

    {
      name: "Existing customer",
      path:'/managecustomers/customer',
      element:<Base renderContent={ExistingCusTable}/>
    },
    {
      name: "Add Customer",
      path:'/managecustomers/addcustomer',
      element:<Base renderContent={Customers}/>
    },
    {
      name: "Add Customer",
      path:'/managecustomers/editcustomer/:id',
      element:<Base renderContent={Customers}/>
    },
     
  {
    name: "Completed Account",
    path:'/managecustomers/completedaccount',
    element:<Base renderContent={CompleteAccount}/>
  },


//Gifts

{
  name: "Gift Vendor",
  path:'/gift/giftvendor',
  element:<Base renderContent={GiftVendor}/>
}, 
{
  name: "Gift Item",
  path:'/gift/giftitem',
  element:<Base renderContent={GiftItem}/>
},
{
  name: "Gift Handover",
  path:'/gift/gifthandover',
  element:<Base renderContent={GiftHandOver}/>
},
{
  name: "Gift Purchase",
  path:'gift/giftpurchase/',
  element:<Base renderContent={GiftInwards}/>
},
{
  name: "Gift Purchase",
  path:'/gift/addgiftinwards',
  element:<Base renderContent={AddGiftPurchase}/>
},
{
  name: "Edit Gift Purchase",
  path:'/gift/addgiftinwards/:id',
  element:<Base renderContent={AddGiftPurchase}/>
},
{
  name: "Gift HandOver",
  path:'/gift/gifthandover',
  element:<Base renderContent={GiftHandOver}/>
},
{
  name: "Gift Issued Creation",
  path:'/gift/giftissues/creategiftissue',
  element:<Base renderContent={AddGiftHandOver}/>
},
{
  name: "Gift Stock Report",
  path:'/gift/stockreport/',
  element:<Base renderContent={GiftStock}/>
},

//Notifications

{
  name: "Push Notification",
  path:'/notification/pushnotification',
  element:<Base renderContent={Pushnotification}/>
},
{
  name: "Create Notification",
  path:'/notification/addnotification',
  element:<Base renderContent={AddNotfication}/>
},
{
  name: "Wedding Anniversary",
  path:'/notification/weddingnotification',
  element:<Base renderContent={Weddingnotification}/>
},
{
  name: "Birthday",
  path:'/notification/birthday',
  element:<Base renderContent={Birthdaynotification}/>
},
{
  name: "configurations",
  path:'/notification/configurations',
  element:<Base renderContent={configNotification}/>
},

//Scheme Reports
{
  name: "Outstanding Summary",
  path:'/reports/outstandingsummary',
  element:<Base renderContent={OutStandingReport}/>
},
{
  name: "Account Summary Report",
  path:'/reports/accountsummaryreport',
  element:<Base renderContent={AccountSummaryReport}/>
},
{
  name: "Scheme Payment Report",
  path:'/reports/schemepayment',
  element:<Base renderContent={SchemePaymentReport}/>
},
{
  name: "Scheme Account Report",
  path:'reports/schemeaccount',
  element:<Base renderContent={SchemeAccountReport}/>
},
{
  name: "Outstanding Amount",
  path:'/reports/outstanding',
  element:<Base renderContent={OutStandingAmount}/>
},
{
  name: "Outstanding Weight",
  path:'/reports/outstandingweight',
  element:<Base renderContent={OutStandingWeight}/>
},

//Employee
{
  name: "Employee Details",
  path:'/employee/details/',
  element:<Base renderContent={OurEmployee}/>
},
{
  name: "Employee Creation",
  path:'/employee/creation/',
  element:<Base renderContent={AddEmployee}/>
},
{
  name: "Employee Creation",
  path:'/employee/creation/:id',
  element:<Base renderContent={AddEmployee}/>
},

//Settings
{
  name: "Menu",
  path:'/setup/menu',
  element:<Base renderContent={MenuComp}/>
},
{
  name: "Sub Menu",
  path:'/setup/submenu',
  element:<Base renderContent={Submenu}/>
},
{
  name: "Branch",
  path:'/setup/branch',
  element:<Base renderContent={Branch}/>
},
{
  name: "Add Branch",
  path:'/setup/branch/add',
  element:<Base renderContent={AddBranch}/>
},
{
  name: "Edit Branch",
  path:'/setup/branch/edit/:id',
  element:<Base renderContent={AddBranch}/>
},
{
  name: "Staff User",
  path:'/settings/staffuser',
  element:<Base renderContent={StaffUser}/>
},
{
  name: "Organisation",
  path:'/settings/organisation',
  element:<Base renderContent={Organisation}/>
},

//Wallet
{
  name: "Wallet",
  path:'/payment/wallet',
  element:<Base renderContent={Wallet}/>
},

//Accounts Report
{
  name: "Payment Mode Ledger",
  path:'/reports/paymentmodeledger',
  element:<Base renderContent={ModeWisePayment}/>
},

//Whatsapp 
  {
    name: "Whastapp Offers",
    path:'/whatsapp/offers',
    element:<Base renderContent={OffersWhatsapp}/>
  },
  {
    name: "Whatsapp Product",
    path:'/whatsapp/product',
    element:<Base renderContent={ProductWhatsapp}/>
  },
  {
    name: "Whatsapp New Arrivals",
    path:'/whatsapp/newarrivals',
    element:<Base renderContent={NewArrivalsWhatsapp}/>
  },


  {
    name: "Card Print",
    path:'/cardprint/printone',
    element:<Base renderContent={CardPrint}/>
  },
  {
    name: "Receipt Print",
    path:'/receiptprint/printone',
    element:<Base renderContent={ReceiptPrint}/>
  },
 
  {
    name: "Card Print",
    path:'/cardprint/printone',
    element:<Base renderContent={CardPrint}/>
  },
  


  {
    name: "Classification",
    path:'/ourscheme/classification',
    element:<Base renderContent={SchemeClassification}/>
  },
  {
    name: "Digi Gold",
    path:'scheme/digigold',
    element:<Base renderContent={DigiGoldScheme}/>
  },
  {
    name: "Add DigiGold",
    path:'/classification/digigold',
    element:<Base renderContent={CreateDigiGoldScheme}/>
  },

  {
    name: "Add Classification",
    path:'/classification/addclassification',
    element:<Base renderContent={CreateSchemeClassificaton}/>
  },
  {
    name: "Add Classification",
    path:'/classification/addclassification/:id',
    element:<Base renderContent={CreateSchemeClassificaton}/>
  },
 

  {
    name: "Closed Account",
    path:'/manageaccount/closedaccount',
    element:<Base renderContent={CloseAccount}/>
  },
  {
    name: "Add Close Account",
    path:'/manageaccount/addcloseaccount',
    element:<Base renderContent={AddCloseAccount}/>
  },
  {
    name: "Add Revert Account",
    path:'/manageaccount/addrevertaccount',
    element:<Base renderContent={AddRvertAccount}/>
  },
  
 

  // Outstanding Report 
 
 
  // {
  //   name: "Out Standing Digi Gold",
  //   path:'/reports/outstandingdigigold',
  //   element:<Base renderContent={OutStandingDigiGold}/>
  // },
  // {
  //   name: "Agent Referral Report",
  //   path:'/reports/agenrefferal',
  //   element:<Base renderContent={AgenReferralReport}/>
  // },
  // {
  //   name: "Agent Incentive Report",
  //   path:'/reports/agentincentive',
  //   element:<Base renderContent={AgentIncentiveReport}/>
  // },
  // {
  //   name: "Agent Collection Report",
  //   path:'/reports/agentcollection',
  //   element:<Base renderContent={AgentCollectionReport}/>
  // },
  
  {
    name: "Scheme Type",
    path:'/setup/schemetype',
    element:<Base renderContent={Schemetype}/>
  },
 

  {
    name: "Redeem",
    path:'/payment/redeem',
    element:<Base renderContent={Redeem}/>
  },

    
     // super admin routes
     {
      name: "Client Master",
      path:'/superadmin/clientmaster',
      element:<Base renderContent={ClientMaster}/>
    },
    {
      name: "Add client",
      path:"/superadmin/addclient",
      element:<Base renderContent={ClientForm}/>
    },
 
  
   
    {
      name: "edit client",
      path:"/superadmin/addclient/:id",
      element:<Base renderContent={ClientForm}/>
    },
 
    {
      name: "Project Master",
      path:'/superadmin/projectmaster',
      element:<Base renderContent={ProjectMaster}/>
    },
      
    {
      name: "Project Access",
      path:'/superadmin/projectaccess',
      element:<Base renderContent={ProjectAccess}/>
    },
    
  
    {
      name: "Aupay Configure",
      path:'/superadmin/aupayconfigure',
      element:<Base renderContent={AupayConfigure}/>
    },
    {
      name: "Accounts",
      path:'/superadmin/admin',
      element:<Base renderContent={AdminMaster}/>
    },
    {
      name:'test',
      path:'/test',
      element:<Base  renderContent={SchemeForm}/>
    }

];

export default RouteList;