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
  Bell
  
} from 'lucide-react';
import logo from '../../../assets/logo1.png'
import RouteList from '../../../routes/RouteList';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { setRoleData } from '../../../redux/clientFormSlice';
import { useMutation } from '@tanstack/react-query';
import {getactivemenuaccess} from "../../api/Endpoints"

const Base = ({ renderContent: RenderContent }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedParentSection, setSelectedParentSection] = useState('');
  const [selectedSubSection, setSelectedSubSection] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [menuData, setMenuData] = useState([]);
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
  
  let id = decoded.id_role._id;

  // let id = "6792109203f5d0fceab07e92"


  const roledata = useSelector((state) => state.clientForm.roledata);


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
              text: menurow.menu_name,
              hasSubmenu: true,
            };

            if (menurow.menu_list.length > 0) {
              menurow.menu_list.forEach((submenurow) => {
                submenuArray.push({
                  text: submenurow.submenu_name,
                  action: () => handleClick(submenurow.submenu_name),
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
        headerMenuRef.current &&
        !headerMenuRef.current.contains(event.target)
      ) {
        setIsHeaderMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
        setIsHeaderMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
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
        <div className={`absolute left-6 w-3 h-3 rounded-full border-2 border-white -translate-x-1/2 z-10 ${selectedSubSection === text ? 'bg-[#023453]' : 'bg-gray-400'}`} />
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

  const MenuItem = ({  text, hasSubmenu = false, isOpen = false, onClick, children }) => {
    
    const isSelected = hasSubmenu
      ? selectedParentSection === text
      : selectedSection === text && selectedParentSection === text;

    return (
      <div className="w-full px-3 py-1 relative">
        <div
          className={`w-full flex items-center px-4 py-3 cursor-pointer rounded-md text-gray-300 transition-colors
            ${isSelected
              ? 'border-2 border-white'
              : 'hover:bg-[#005073] border-2 border-transparent'
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
            ) : text === "Master" ? (
              <>
                <LayoutGrid className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{text}</span>
              </>
            )   :text === "Configuration" ? (
              <>
                <Settings2 className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{text}</span>
              </>
            )  :text === "Our Scheme" ? (
              <>
                <LayoutGrid className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{text}</span>
              </>
            )  : text === "Manage Account" ? (
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
  //  console.log(text)
    setSelectedSection(text);

    const route = RouteList.find(route => route.name === text);
  //  console.log(route)
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


  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 right-0 left-0 bg-white shadow-md z-30">
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
        className={`fixed top-0 left-0 h-full w-64 lg:w-64 bg-[#023453] scrollbar-hide transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-50 pt-16 lg:pt-4 overflow-auto flex flex-col`}
      >
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

      <div className="flex flex-col min-h-screen pt-14 lg:pl-64 bg-[#F5F5F5] pb-10 overflow-hidden">
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