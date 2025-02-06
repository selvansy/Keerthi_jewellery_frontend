import Base from "../chit/components/common/Base";
import Scheme from "../chit/components/ourscheme/scheme/Scheme";
import AddScheme from "../chit/components/ourscheme/scheme/AddScheme";
import MetalRate from "../chit/components/ourscheme/metalrate/index";
import CreateMetalRate from "../chit/components/ourscheme/metalrate/Createmetalrate";
import SchemeDetails from "../chit/components/ourscheme/scheme/SchemeDetails";
import SchemeClassification from "../chit/components/ourscheme/classification/schemeClassification";
import CreateSchemeClassificaton from "../chit/components/ourscheme/classification/CreateSchemeClassification";
import DigiGoldScheme from "../chit/components/ourscheme/digiGold/DigiGoldScheme"
import CreateDigiGoldScheme from "../chit/components/ourscheme/digiGold/CreateDigiGoldScheme";
import GiftVendor from "../chit/components/gift/giftvendor/index";
import GiftItem from "../chit/components/gift/giftitem/index";
import GiftInwards from "../chit/components/gift/giftinwards/giftInwards";
import GiftInwardsCreation from "../chit/components/gift/giftinwards/giftInwardsCreation";
import Category from "../chit/components/catalog/category/Category";
import AddCategory from "../chit/components/catalog/category/AddCategory";
import Product from "../chit/components/catalog/product/Product";
import AddProduct from "../chit/components/catalog/product/AddProduct";
import Offers from "../chit/components/catalog/offers/Offers";
import NewArrivals from "../chit/components/catalog/newarrivals/NewArrivals";
import AddNewArrival from "../chit/components/catalog/newarrivals/AddNewArrival";
import Pushnotification from "../chit/components/notification/pushnotification/index";
import AddOffers from "../chit/components/catalog/offers/AddOffers";
import Customer from "../chit/components/manageaccount/customer/Customer";
import AddCustomer from "../chit/components/manageaccount/customer/AddCustomer";
import SchemeWiseAccountReport from "../chit/components/Report/SchemeWiseAccountReport";
import SummaryWiseReport from "../chit/components/Report/SummaryWiseReport";
import PaymentWiseReport from "../chit/components/Report/PaymentWiseReport";
import PendingDuePayment from "../chit/components/Report/PendingDuePayment";
import CustomerAccountSummary from "../chit/components/Report/CustomerAmountSummary";
import OutStandingWeight from "../chit/components/Report/OutStandingWeight";
import DigiGoldReport from "../chit/components/Report/DigiGoldReport";
import OutStandingDigiGold from "../chit/components/Report/OutStandingDigiGold";
import AgenReferralReport from "../chit/components/Report/AgenReferralReport";
import AgentIncentiveReport from "../chit/components/Report/AgentIncentiveReport";
import AgentCollectionReport from "../chit/components/Report/AgentCollectionReport";
import ModeWisePayment from "../chit/components/Report/PaymentReport";
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
import GiftIssued from "../chit/components/gift/giftissues/GiftIssued";
import AddGiftIssued from "../chit/components/gift/giftissues/AddGiftIssued";
import SchemePayment from "../chit/components/payment/schemepayment/SchemePayment";
import Schemeaccount from "../chit/components/manageaccount/schemeaccount/index";
import AddSchemeAccount from "../chit/components/manageaccount/schemeaccount/SchemeAccountform";
import CloseAccount from "../chit/components/manageaccount/closedaccount/CloseAccount";
import AddCloseAccount from "../chit/components/manageaccount/closedaccount/AddCloseAccount";
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
// import Giftvendor from '../chit/components/gift/giftvendor/GiftVendor';
import AupayConfigure from "../chit/components/SuperAdmin/Configure/aupay/index";
import AdminMaster from "../chit/components/SuperAdmin/Accounts/AdminMaster";
import Dashboard from "../chit/components/SuperAdmin/Dashboard/Dashboard"
import AddNotfication from "../chit/components/notification/pushnotification/AddNotfication";
import Weddingnotification from "../chit/components/notification/Weddingnotification";
import SchemePaymentReport from "../chit/components/Report/SchemePaymentReport";
import SchemeAccountReport from "../chit/components/Report/SchemeAccountReport";
import AccountSummaryReport from "../chit/components/Report/AccountSummary";
import OutStandingReport from "../chit/components/common/OutStandingReport";
import OutStandingAmount from "../chit/components/Report/OutStandingAmout";
import CardPrint from "../chit/components/print/CardPrint/printone";

  
import NewArrivalsWhatsapp from "../chit/components/whatsapp/newarrivals/index";
import ProductWhatsapp from "../chit/components/whatsapp/product/index";
import OffersWhatsapp from  "../chit/components/whatsapp/offers/index";

const RouteList = [
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
    name: "Metal Rate",
    path:'/ourscheme/metalrate',
    element:<Base renderContent={MetalRate}/>
  },
 
  {
    name: "Crate Metal Rate",
    path:'/ourscheme/createmetalrate',
    element:<Base renderContent={CreateMetalRate}/>
  },
  {
    name: "Card Print",
    path:'/cardprint/printone',
    element:<Base renderContent={CardPrint}/>
  },
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
  {
    name: "Scheme",
    path: "/ourscheme/scheme",
    element: <Base renderContent={Scheme}/>,
  },
  {
    name: "Add Scheme",
    path: "/scheme/addscheme",
    element: <Base renderContent={AddScheme}/>,
  },
 
  {
    name: "Classification",
    path:'/ourscheme/classification',
    element:<Base renderContent={SchemeClassification}/>
  },
  {
    name: "Digi Gold",
    path:'/ourscheme/digigold',
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
    name: "Edit Classification",
    path:'/editclassification/:id',
    element:<Base renderContent={CreateSchemeClassificaton}/>
  },
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
    name: "Gift Inwards",
    path:'/gift/giftinwards',
    element:<Base renderContent={GiftInwards}/>
  },
  {
    name: "Gift Inwards Creation",
    path:'/gift/addgiftinwards',
    element:<Base renderContent={GiftInwardsCreation}/>
  },
  {
    name: "Edit Gift Inwards",
    path:'/gift/addgiftinwards/:id',
    element:<Base renderContent={GiftInwardsCreation}/>
  },
  {
    name: "Gift Issues",
    path:'/gift/giftissues',
    element:<Base renderContent={GiftIssued}/>
  },
  {
    name: "Gift Issued Creation",
    path:'/gift/giftissues/creategiftissue',
    element:<Base renderContent={AddGiftIssued}/>
  },
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
    path:'/catalog/addcategory/:id',
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
    path:'/catalog/addproduct/:id',
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
    path:'/catalog/addoffers/:id',
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
    path:'/catalog/addnewarrivals/:id',
    element:<Base renderContent={AddNewArrival}/>
  },
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
    name: "Push Notification",
    path:'/notification/pushnotification',
    element:<Base renderContent={Pushnotification}/>
  },
  {
    name: "Customer",
    path:'/manageaccount/customer',
    element:<Base renderContent={Customer}/>
  },
  {
    name: "Add Customer",
    path:'/manageaccount/addcustomer',
    element:<Base renderContent={AddCustomer}/>
  },
 
  {
    name: "Scheme Account",
    path:'/manageaccount/schemeaccount/',
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
    name: "Closed Account",
    path:'/manageaccount/closedaccount',
    element:<Base renderContent={CloseAccount}/>
  },
  {
    name: "Add Close Account",
    path:'/manageaccount/closedaccount/add',
    element:<Base renderContent={AddCloseAccount}/>
  },
 
  {
    name: "Digi Gold Account",
    path:'/manageaccount/digigold',
    element:<Base renderContent={DigiGold}/>
  },
  
  {
    name: "Completed Account",
    path:'/manageaccount/completeaccount',
    element:<Base renderContent={CompleteAccount}/>
  },

  // Outstanding Report 
  {
    name: "Outstanding Summary Report",
    path:'/reports/outstandingsummary',
    element:<Base renderContent={OutStandingReport}/>
  },
  {
    name: "Summary Wise Report",
    path:'/reports/summary',
    element:<Base renderContent={SummaryWiseReport}/>
  },
  {
    name: "Account Summary Report",
    path:'/reports/accounts',
    element:<Base renderContent={AccountSummaryReport}/>
  },
  {
    name: "Scheme Payment Report",
    path:'/reports/schemepayment',
    element:<Base renderContent={SchemePaymentReport}/>
  },
  {
    name: "Scheme Account Report",
    path:'/reports/schemeaccount',
    element:<Base renderContent={SchemeAccountReport}/>
  },
  {
    name: "Payment Wise Report",
    path:'/reports/payment',
    element:<Base renderContent={PaymentWiseReport}/>
  },
  {
    name: "Pending Due Payment",
    path:'/reports/pendingdue',
    element:<Base renderContent={PendingDuePayment}/>
  },
  {
    name: "Customer Account Summary",
    path:'/reports/customeraccount',
    element:<Base renderContent={CustomerAccountSummary}/>
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
  {
    name: "Digi Gold Report",
    path:'/reports/digigoldreport',
    element:<Base renderContent={DigiGoldReport}/>
  },
  {
    name: "Out Standing Digi Gold",
    path:'/reports/outstandingdigigold',
    element:<Base renderContent={OutStandingDigiGold}/>
  },
  {
    name: "Agent Referral Report",
    path:'/reports/agenrefferal',
    element:<Base renderContent={AgenReferralReport}/>
  },
  {
    name: "Agent Incentive Report",
    path:'/reports/agentincentive',
    element:<Base renderContent={AgentIncentiveReport}/>
  },
  {
    name: "Agent Collection Report",
    path:'/reports/agentcollection',
    element:<Base renderContent={AgentCollectionReport}/>
  },
  {
    name: "Payment Mode Ledger",
    path:'/reports/paymentmodeledger',
    element:<Base renderContent={ModeWisePayment}/>
  },
  {
    name: "Gift Stock",
    path:'/reports/giftstock',
    element:<Base renderContent={GiftStock}/>
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
    name: "Employee",
    path:'/setup/employee',
    element:<Base renderContent={OurEmployee}/>
  },
  {
    name: "Add Employee",
    path:'/setup/employee/add',
    element:<Base renderContent={AddEmployee}/>
  },
  {
    name: "Edit Employee",
    path:'/setup/employee/edit/:id',
    element:<Base renderContent={AddEmployee}/>
  },
  {
    name: "User Role",
    path:'/setup/userrole',
    element:<Base renderContent={UserRole}/>
  },
  {
    name: "Staff User",
    path:'/setup/staffuser',
    element:<Base renderContent={StaffUser}/>
  },
  {
    name: "User Access",
    path:'/setup/useraccess',
    element:<Base renderContent={UserAccess}/>
  },
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
    name: "Payment Mode",
    path:'/setup/paymentmode',
    element:<Base renderContent={Paymentmode}/>
  },
  {
    name: "Scheme Type",
    path:'/setup/schemetype',
    element:<Base renderContent={Schemetype}/>
  },
  {
    name: "Metal",
    path:'/setup/metal',
    element:<Base renderContent={Metal}/>
  },
  {
    name: "Purity",
    path:'/setup/purity',
    element:<Base renderContent={Purity}/>
  },
  {
    name: "Wallet",
    path:'/payment/wallet',
    element:<Base renderContent={Wallet}/>
  },
  {
    name: "Redeem",
    path:'/payment/redeem',
    element:<Base renderContent={Redeem}/>
  },
  {
    name: "Scheme Payment",
    path:'/payment/schemepayment',
    element:<Base renderContent={SchemePayment}/>
  },
    {
      name: "Add Scheme Payment",
      path:'/payment/addschemepayment',
      element:<Base renderContent={AddSchemePayment}/>
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
    

];

export default RouteList;