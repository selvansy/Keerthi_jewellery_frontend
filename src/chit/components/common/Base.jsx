import React, { useState, useEffect, useRef } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Settings,
  CreditCard,
  Gift,
  FileText,
  BarChart2,
  Home,
  User,
  Settings2,
  MessageCircle,
  Bell,
  X,
  Star,
  RefreshCcw,
  LucidePrinter,
  PawPrintIcon,
  CircleUserRound,
  UserRoundCheck

} from 'lucide-react';

import logo from '../../../assets/logo1.png'
import RouteList from '../../../routes/RouteList';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { setRoleData } from '../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query';
import { getactivemenuaccess } from "../../api/Endpoints"
import { GiConsoleController } from 'react-icons/gi';
import { setLayoutColor } from "../../../redux/clientFormSlice"
import { logout } from '../../../redux/authSlice';

const Base = ({ renderContent: RenderContent }) => {

  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef(null);
  const [menuLayout, setMenuLayout] = useState("left");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedParentSection, setSelectedParentSection] = useState('');
  const [selectedSubSection, setSelectedSubSection] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [openMenus, setOpenMenus] = useState({
    schemes: false,
    manageAccount: false,
    gifts: false,
    catalog: false,
    payment: false,
    report: false,
    setup: false
  });

  const sidebarRef = useRef(null);
  const headerMenuRef = useRef(null);
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const { info } = useSelector((state) => state.auth);
  const decoded = jwtDecode(info);

  const roledata = useSelector((state) => state.clientForm.roledata);


  const getRoleCharacter = (id) => {
    switch (id) {
      case 1:
        return "SA";
      case 2:
        return "A";
      case 3:
        return "BR";
      case 4:
        return "B";
      default:
        return <UserRoundCheck size={32} />;
    }
  };

  const role = getRoleCharacter(roledata?.id_role?.id_role);



  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    dispatch(logout());
    navigate("/");
  };

  const layout_color = useSelector((state) => state.clientForm.layoutColor);



  useEffect(() => {
    if (decoded.id_role.id_role === 1) {
      setIsSuperAdmin(true);
    } else {
      getAllMenusMutate(decoded.id_role._id);
      setIsSuperAdmin(false);
    }

    dispatch(setRoleData(decoded));

  }, []);

  const { mutate: getAllMenusMutate } = useMutation({
    mutationFn: getactivemenuaccess,
    onSuccess: (response) => {
      if (response) {
        let menuArray = [];
        if (response.data.length > 0) {
          response.data.forEach((menurow) => {
            let submenuArray = [];
            let menuItem = {
              text: menurow?.menu_name,
              hasSubmenu: true,
            };

            if (menurow?.menu_list.length > 0) {
              menurow?.menu_list.forEach((submenurow) => {
                submenuArray.push({
                  text: submenurow?.submenu_name,
                  action: () => handleClick(submenurow?.submenu_name),
                });
              });

              // Attach the submenu array to the menu item
              menuItem.submenu = submenuArray;
            }

            // Add the menu item to the main menuArray
            menuArray.push(menuItem);
          });
        }

        menuArray.unshift(
          {
            text: "Dashboard",
            hasSubmenu: false
          }
        )
        setMenuData(menuArray);


      }
    },
  });

  useEffect(() => {
    const route = RouteList.find(route => {
      return route.name === selectedSection || route.name === selectedParentSection;
    });

    if (route) {

      setSelectedRoute(route);
      if (route.name === "Dashboard") {
        handleClick("Dashboard")
      }

    }
  }, [selectedSection, selectedParentSection]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="toggle-sidebar"]')
      ) {
        setIsSidebarOpen(false);
      }

      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="toggle-settings"]')
      ) {
        setSettingsOpen(false);
      }

      if (
        headerMenuRef.current &&
        !headerMenuRef.current.contains(event.target)
      ) {
        setIsHeaderMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
        setSettingsOpen(false);
        setIsHeaderMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
        setSettingsOpen(false);
        setIsHeaderMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);



  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const SubMenuItem = ({ text, onClick, isLast, parentSection }) => (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-6 top-1/2 w-[1px] h-full bg-white -translate-x-1/2" />
      )}
      <div className="relative flex items-center">
        <div className={`absolute left-6 w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 z-10 ${selectedSubSection === text ? '' : 'bg-gray-400'}`}
        />
        <div
          className={`w-full flex items-center px-4 rounded-md py-2 pl-12 transition-colors cursor-pointer text-sm font-semibold
            ${selectedSubSection === text
              ? 'bg-white text-[#033453]'
              : 'text-white hover:bg-[#005073]'
            }`}
          onClick={() => {
            setSelectedSubSection(text);
            setSelectedSection(text);
            setSelectedParentSection(parentSection);
            onClick && onClick();
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );

  const MenuItem = ({ text, hasSubmenu = false, isOpen = false, onClick, children }) => {

    const isSelected = hasSubmenu
      ? selectedParentSection === text
      : selectedSection === text && selectedParentSection === text;

    return (
      <div className="w-full px-3 py-1 relative">
        <div
          className={`w-full flex items-center px-4 py-3 cursor-pointer rounded-md text-gray-300 transition-colors
            ${isSelected
              ? 'border-2 border-white'
              : 'hover:bg-[#005070] border-2 border-transparent'
            }`}
          onClick={() => {
            if (hasSubmenu) {
              setSelectedParentSection(text);
              toggleMenu(text.toLowerCase().replace(/\s+/g, ''));
            } else {
              setSelectedSection(text);
              setSelectedParentSection(text);
              setSelectedSubSection('');
              onClick && onClick();
            }
          }}
        >

          {
            text === "Dashboard" ? (
              <>
                <Home className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{text}</span>
              </>
            ) :
              text === "Master" ? (
                <>
                  <LayoutGrid className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Configuration" ? (
                <>
                  <Settings2 className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Our Scheme" ? (
                <>
                  <LayoutGrid className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Manage Account" ? (
                <>
                  <User className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Payment" ? (
                <>
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Catalog" ? (
                <>
                  <FileText className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Notification" ? (
                <>
                  <Bell className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Whatsapp" ? (
                <>
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Gift" ? (
                <>
                  <Gift className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Setting" ? (
                <>
                  <Settings className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : text === "Reports" ? (
                <>
                  <BarChart2 className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{text}</span>
                </>
              ) : null
          }


          {hasSubmenu && (
            <span className="ml-auto transition-transform duration-300">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          )}
        </div>

        <div className={`relative overflow-y-auto overflow-hidden transition-all scrollbar-hide duration-300 ease-in-out
          ${isOpen ? 'max-h-[60vh] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          {React.Children.map(children, (child, index) => {
            if (!child) return null;
            return React.cloneElement(child, {
              isFirst: index === 0,
              isLast: index === React.Children.count(children) - 1,
              parentSection: text
            });
          })}
        </div>
      </div>
    );
  };

  const handleClick = (text) => {

    setSelectedSection(text);

    const route = RouteList.find(route => route.name === text);

    if (route) {
      navigate(route.path);
    }
  };

  const superData = [
    {
      text: "Dashboard",
      icon: Home,
      hasSubmenu: false,
      onClick: () => setSelectedParentSection('Dashboard'),
    },
    {
      text: "Master",
      icon: LayoutGrid,
      hasSubmenu: true,
      submenu: [
        { text: "Project Master", action: () => handleClick('Project Master') },
        { text: "Client Master", action: () => handleClick('Client Master') },
        { text: "Branch Master", action: () => handleClick('Branch') },
        { text: "Project Access", action: () => handleClick('Project Access') }
      ],
      onClick: () => setSelectedParentSection('Master'),
    },
    {
      text: "Configuration",
      icon: LayoutGrid,
      hasSubmenu: true,
      submenu: [
        { text: "Aupay Configure", action: () => handleClick('Aupay Configure') }
      ],
      onClick: () => setSelectedParentSection('Configuration'),
    },
    {
      text: "Setting",
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { text: "Payment Mode", action: () => handleClick('Payment Mode') },
        { text: "Scheme Type", action: () => handleClick('Scheme Type') },
        { text: "Employee", action: () => handleClick('Employee') },
        { text: "User Role", action: () => handleClick('User Role') },
        { text: "User Access", action: () => handleClick('User Access') },
        { text: "Staff User", action: () => handleClick('Staff User') },
        { text: "Menu", action: () => handleClick('Menu') },
        { text: "Submenu", action: () => handleClick('Sub Menu') },
        { text: "Metal", action: () => handleClick('Metal') },
        { text: "Purity", action: () => handleClick('Purity') },
      ],
      onClick: () => setSelectedParentSection('Settings'),
    },
  ]

  const quickLinks = [
    { name: "Metal Rate", link: "/setup/metal", icon: <Star className="text-pink-500" /> },
    { name: "Customer", link: "/manageaccount/addcustomer", icon: <User className="text-blue-500" /> },
    { name: "Manage Account", link: "/manageaccount/addschemeaccount", icon: <Settings className="text-purple-500" /> },
    { name: "Payment", link: "/payment/addschemepayment", icon: <CreditCard className="text-green-500" /> },
    { name: "Card Print", link: "/cardprint/printone", icon: <LucidePrinter className="text-green-500" /> },
    { name: "Receipt Print", link: "/receiptprint/printone", icon: <PawPrintIcon className="text-green-500" /> }
    // { name: "Agent Incentive",link:"", icon: <DollarSign className="text-orange-500" /> },
    // { name: "Referral Incentive",link:"", icon: <Share2 className="text-teal-500" /> },
  ];

  return (

    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 right-0 left-0 bg-white shadow-md z-30 h-16">
        <div className='flex flex-row justify-end mt-3 mr-[32px]'>
          <button className="flex flex-row items-center p-2 text-gray-900 font-semibold"
            onClick={() => setSettingsOpen((prev) => !prev)}
          >
            <Settings size={28} />
          </button>

          {
            roledata ?
            <div className="relative inline-block text-left">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 focus:outline-none"
            >
              {/* Profile Circle */}
              <span
                className="flex items-center justify-center w-9 h-9 text-lg font-semibold text-white rounded-full"
                style={{ backgroundColor: layout_color }}
              >
                {role}
              </span>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

            </button>
      
            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                <button
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

              :
              <button className="flex flex-row items-center px-4 py-2 text-gray-900 font-semibold"
                onClick={() => setSettingsOpen((prev) => !prev)}
              >
                <UserRoundCheck size={32} />
              </button>

          }


        </div>

        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between lg:justify-end gap-3">
            <button
              className="lg:hidden p-2"
              aria-label="toggle-sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarOpen(!isSidebarOpen);
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 lg:w-64 scrollbar-hide transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50 pt-16 lg:pt-4 overflow-auto flex flex-col`}
        style={{ backgroundColor: layout_color }} >
        <div className="flex justify-center items-center mb-10">
          <img src={logo} alt="Logo" className="h-50 w-50 object-fill" />
        </div>

        <nav className="flex-1 text-white scrollbar-hide overflow-y-auto">
          {isSuperAdmin ? superData.map((menu, index) => (
            <MenuItem
              key={index}
              icon={menu.icon}
              text={menu.text}
              hasSubmenu={menu.hasSubmenu}
              isOpen={openMenus[menu.text.toLowerCase().replace(/\s+/g, '')]}
              onClick={() => {
                if (menu.hasSubmenu) {
                  setSelectedParentSection(menu.text);
                  toggleMenu(menu.text.toLowerCase().replace(/\s+/g, ''));
                } else {
                  setSelectedSection(menu.text);
                  menu.onClick && menu.onClick();
                }
              }}
            >
              {menu.submenu && menu.submenu.map((sub, subIndex) => (
                <SubMenuItem
                  key={subIndex}
                  text={sub.text}
                  onClick={sub.action}
                  parentSection={menu.text}
                />
              ))}
            </MenuItem>
          )) : menuData.map((menu, index) => (
            <MenuItem
              key={index}
              text={menu.text}
              hasSubmenu={menu.hasSubmenu}
              isOpen={openMenus[menu.text.toLowerCase().replace(/\s+/g, '')]}
              onClick={() => {
                setSelectedSection(menu.text);
                setSelectedParentSection(menu.text);
              }}
            >
              {menu.submenu && menu.submenu.map((sub, subIndex) => (
                <SubMenuItem
                  key={subIndex}
                  text={sub.text}
                  onClick={sub.action}
                  parentSection={menu.text}
                />
              ))}
            </MenuItem>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col min-h-screen bg-[#f5f5f5]  pt-14 lg:pl-64 pb-10 ">
        {/* SettingsButton  */}
        <div className='settingsButton flex flex-row justify-end items-center '>

          {
            settingsOpen === true && (


              <div
                ref={settingsRef}
                className={`fixed top-0 right-0 h-full scrollbar-hide w-64 lg:w-1/4 bg-[#f5f5f5] border-l-2 border-gray-300  transform transition-transform duration-300 ease-in-out ${settingsOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50 pt-16 lg:pt-4  flex flex-col`}
              >
                <nav className="flex-1 text-gray-900">
                  <div className='flex flex-col'>
                    {/* Title  */}

                    <div className='flex justify-between items-center'>
                      <div className='p-3 border-l'>
                        <h3 className='text-xl font-semibold text-start px-3'>Template Customizer</h3>
                        <p className='text-[#6D6B77] px-3'>Customize and preview in real time</p>
                      </div>
                      <div className='p-3 text-xl'>
                        <div className='flex items-center gap-2'>
                          <RefreshCcw size={24} onClick={() => dispatch(setLayoutColor("#023453"))} />
                          <X size={28} onClick={() => setSettingsOpen((prev) => !prev)} />
                        </div>
                      </div>
                    </div>

                    <div className='m-2 p-3 '>
                      <h4 className='text-xl font-semibold text-start px-3'>Color Palette</h4>
                      <div className="grid grid-cols-5">
                        <div
                          className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#023453" }}
                          onClick={() => dispatch(setLayoutColor("#023453"))} >

                          <p className='text-center text-white text-[12px]'>#023453 </p>
                        </div>
                        <div
                          className="w-16 h-12 m-2 p-3 border-2 rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#484453" }}
                          onClick={() => dispatch(setLayoutColor("#484453"))} >

                          <p className='text-center text-white text-[12px]'>#484453 </p>
                        </div>
                        <div
                          className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#006EBE" }}
                          onClick={() => dispatch(setLayoutColor("#006EBE"))} >

                          <p className='text-center text-white text-[12px]'>#006EBE </p>
                        </div>
                        <div
                          className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#4AA147" }}
                          onClick={() => dispatch(setLayoutColor("#4AA147"))} >

                          <p className='text-center text-white text-[12px]'>#4AA147 </p>
                        </div>
                        <div
                          className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#0094AD" }}
                          onClick={() => dispatch(setLayoutColor("#0094AD"))} >

                          <p className='text-center text-white text-[12px]'>#0094AD </p>
                        </div>
                        <div
                          className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#034200" }}
                          onClick={() => dispatch(setLayoutColor("#034200"))} >

                          <p className='text-center text-white text-[12px]'>#034200 </p>
                        </div>
                        <div
                          className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                          style={{ backgroundColor: "#DD408B" }}
                          onClick={() => dispatch(setLayoutColor("#DD408B"))}>

                          <p className='text-center text-white text-[12px]'>#DD408B</p>
                        </div>

                      </div>
                    </div>
                    {/* Quick Links */}
                    <div className='p-3'>
                      <h3 className="text-xl font-medium mb-2 px-3 m-2">Quick Links</h3>
                      <div className="grid grid-cols-2 gap-4 px-3">
                        {quickLinks.map((link, index) => (
                          <div key={index} className="flex flex-col items-center p-4 bg-white border rounded-lg shadow-lg hover:bg-gray-300 cursor-pointer"
                            onClick={() => navigate(link.link)}>
                            <div className="text-2xl mb-2">{link.icon}</div>
                            <span className="text-sm font-medium text-gray-700">{link.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </nav>
              </div>

            )
          }


          {settingsOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSettingsOpen((prev) => !prev)}
            />
          )}

        </div>
        <main className="bg-[#F5F5F5] px-6 pt-4 pb-4 mb-6">
          <div className='h-full'>
            <RenderContent />
          </div>
        </main>
      </div>


      <footer className="flex flex-row justify-center bg-white border-t p-2 fixed bottom-0 left-0 lg:left-40 w-full z-30">
        <div>
          Copyright 2024 © Aurumm by Atts
        </div>
      </footer>
    </div>
  );
};

export default Base;