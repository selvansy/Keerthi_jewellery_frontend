import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Settings,
  CreditCard,
  User,
  Bell,
  X,
  Star,
  RefreshCcw,
  LucidePrinter,
  PawPrintIcon,
  UserRoundCheck,
  ChevronRight,
  Menu,
  LayoutDashboard,
} from "lucide-react";

import logo from "../../../assets/nytro.png";
import RouteList from "../../../routes/RouteList";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updatelayoutcolor } from "../../api/Endpoints";
import { RoleDatalogout, setLayoutColor } from "../../../redux/clientFormSlice";
import { logout, SetMenu } from "../../../redux/authSlice";
import Command from "../../../assets/command.svg";
import Search from "../../../assets/search.svg";
import CustomerModal from "./customerModal";
// import settings from "../../../assets/dashboard/setting.svg"
import notification from "../../../assets/dashboard/notification.svg";
import Dashboard from "../../../assets/icons/Dashboard.svg";

import {
  getallpurity,
  getMetalRateByMetalId,
  todaymetalrate,
} from "../../api/Endpoints";
import { formatNumber } from "../../utils/commonFunction";

const Base = ({ renderContent: RenderContent }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedParentSection, setSelectedParentSection] = useState("");
  const [selectedSubSection, setSelectedSubSection] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [laycolor, setLaycolor] = useState("");
  const [metalRate, setMetalRate] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const logoutRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState(null);

  const sidebarRef = useRef(null);
  const headerMenuRef = useRef(null);
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setIsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const location = useLocation();
  const sectionName =
    location.pathname.split("/")[1]?.replace(/^./, (c) => c.toUpperCase()) ||
    "";

  const { info } = useSelector((state) => state.auth);
  const decoded = jwtDecode(info);
  let id = decoded.id_role._id;
  const branchId = decoded.id_branch;

  const menus = useSelector((state) => state.auth.menu);

  const getPurity = async () => {
    try {
      const response = await getallpurity();
      const data = response?.data;

      if (!data || !Array.isArray(data)) return;

      const id_branch = decoded?.id_branch;
      const passData = { id_branch: branchId };
      const metalRates = await todaymetalrate(passData);

      // Create a map of metal rates by type and purity
      const ratesMap = {};

      metalRates?.data?.forEach((item) => {
        const metalName = item.material_type_id?.metal_name?.toLowerCase();
        const purityName = item.purity_id?.purity_name?.toLowerCase();

        if (!metalName || !purityName) return;

        if (metalName.includes("gold")) {
          if (
            purityName.includes("24") ||
            purityName.includes("24k") ||
            purityName.includes("24ct")
          ) {
            ratesMap["gold24k"] = item;
          } else if (
            purityName.includes("22") ||
            purityName.includes("22k") ||
            purityName.includes("22ct")
          ) {
            ratesMap["gold22k"] = item;
          }
        } else if (metalName.includes("silver")) {
          ratesMap["silver"] = item;
        }
      });

      // Create an array in fixed order: 24K, 22K, Silver
      const sortedRates = [
        ratesMap["gold24k"],
        ratesMap["gold22k"],
        ratesMap["silver"],
      ];

      setMetalRate(sortedRates);
    } catch (error) {
      console.error("Failed to fetch purity data:", error);
    }
  };

  useEffect(() => {
    getPurity();
  }, []);

  const renderMenuItems = () => {
    if (!menus) return null;

    return menus.map((menu) => {
      const menuKey = menu.menu_name.toLowerCase().replace(/\s+/g, "");
      const hasSubmenu = menu.menu_list && menu.menu_list.length > 0;

      return (
        <MenuItem
          key={menu._id}
          text={menu.menu_name}
          menuIcon={menu.menu_icon}
          hasSubmenu={hasSubmenu}
          onClick={() => {
            if (hasSubmenu) {
              setSelectedParentSection(menu.menu_name);
              toggleMenu(menuKey);
            } else {
              setSelectedSection(menu.menu_name);
              setSelectedParentSection(menu.menu_name);
              setSelectedSubSection("");
              handleClick(menu.menu_name);
            }
          }}
        >
          {hasSubmenu &&
            menu.menu_list.map((submenu, index) => (
              <SubMenuItem
                key={submenu.id_submenu}
                text={submenu.submenu_name}
                pathUrl={submenu.pathurl}
                onClick={() => {
                  handleClick(submenu.submenu_name);
                  navigate(
                    submenu.pathurl.startsWith("/")
                      ? submenu.pathurl
                      : `/${submenu.pathurl}`
                  );
                }}
                isLast={index === menu.menu_list.length - 1}
                parentSection={menu.menu_name}
              />
            ))}
        </MenuItem>
      );
    });
  };

  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const sidebar_color = useSelector((state) => state.clientForm.sideBarColor);

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

  useEffect(() => {
    if (decoded.id_role.id_role === 1) {
      setIsSuperAdmin(true);
    } else {
      setIsSuperAdmin(false);
      if (menus.length < 0) {
        getAllMenusMutate(decoded.id_role._id);
      }
    }
  }, []);

  useEffect(() => {
    if (laycolor !== "") {
      let id_branch = "";
      if (decoded.branch === "0") {
        id_branch = decoded.branch;
      } else {
        id_branch = decoded.branch;
      }
      updatelayoutmutate({
        id_branch: id_branch,
        layout_color: laycolor,
      });
    }
  }, [laycolor]);

  useEffect(() => {
    const route = RouteList.find((route) => {
      return (
        route.name === selectedSection || route.name === selectedParentSection
      );
    });

    if (route) {
      setSelectedRoute(route);
      if (route.name === "Dashboard") {
        handleClick("Dashboard");
      }
    }
  }, [selectedSection, selectedParentSection]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('[data-testid="toggle-sidebar"]')
      ) {
        setIsSidebarOpen(false);
      }

      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        !event.target.closest('[data-testid="toggle-settings"]')
      ) {
        setSettingsOpen(false);
      }

      if (
        headerMenuRef.current &&
        !headerMenuRef.current.contains(event.target)
      ) {
        setIsHeaderMenuOpen(false);
      }

      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target) &&
        !event.target.closest('[data-testid="logout-dropdown"]')
      ) {
        setIsOpen(false);
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
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
        setSettingsOpen(false);
        setIsHeaderMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    dispatch(logout());
    dispatch(RoleDatalogout());
    navigate("/");
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const { mutate: updatelayoutmutate } = useMutation({
    mutationFn: updatelayoutcolor,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const toggleMenu = (menu) => {
    setActiveMenu((prevActiveMenu) => (prevActiveMenu === menu ? null : menu));
  };

  const SubMenuItem = ({ text, onClick, isLast, parentSection, pathUrl }) => {
    const url = pathUrl?.startsWith("/") ? pathUrl : `/${pathUrl}`;

    const handleLeftClick = (event) => {
      if (event.ctrlKey || event.metaKey) {
        window.open(url, "_blank");
      } else {
        setSelectedSubSection(text);
        setSelectedSection(text);
        setSelectedParentSection(parentSection);
        onClick && onClick();
      }
    };

    return (
      <div className="w-full relative">
        {!isLast && (
          <div className="absolute left-6 top-1/2 w-[1px] h-full bg-white -translate-x-1/2" />
        )}
        <div className="relative flex items-center pl-12">
          <div
            className={`absolute left-6 w-3 h-3 rounded-full border-[1px] -translate-x-1/2 z-10 ${
              selectedSubSection !== text
                ? "border-white"
                : "bg-white border-[#004181]"
            }`}
          />
          <div
            className={`w-full flex items-start px-4 rounded-md py-2 transition-colors cursor-pointer my-1 text-sm font-semibold
                  ${
                    selectedSubSection === text
                      ? "bg-[#004181] text-white"
                      : "text-[#6C7086] hover:bg-[#004181] hover:text-white"
                  }`}
            onClick={handleLeftClick}
          >
            {text}
          </div>
        </div>
      </div>
    );
  };

  const MenuItem = ({
    text,
    menuIcon,
    hasSubmenu = false,
    onClick,
    children,
  }) => {
    const menuKey = text.toLowerCase().replace(/\s+/g, "");
    const isOpen = activeMenu === menuKey;
    const isSelected = hasSubmenu
      ? selectedParentSection === text
      : selectedSection === text && selectedParentSection === text;

    return (
      <div className="w-full px-3 py-1 relative">
        <div
          className={`w-full flex items-center px-4 py-3 cursor-pointer rounded-md transition-colors
            ${
              isSelected
                ? "border-2 border-[#004181] bg-[#004181] text-white"
                : "hover:bg-[#004181] hover:text-white border-2 border-transparent text-[#6b7086]"
            }`}
          onClick={() => {
            if (hasSubmenu) {
              setSelectedParentSection(text);
              toggleMenu(menuKey);
            } else {
              setSelectedSection(text);
              setSelectedParentSection(text);
              setSelectedSubSection("");
              onClick && onClick();
            }
          }}
        >
          {menuIcon ? (
            <img
              className={`w-6 h-6 ${
                isSelected ? "fill-white" : "fill-current"
              } hover:fill-white`}
              src={`${import.meta.env.VITE_API_URL}/${menuIcon}`}
              alt="Menu Icon"
              style={{
                filter: isSelected ? "brightness(0) invert(1)" : "none",
              }}
            />
          ) : (
            <img
              src={Dashboard}
              alt="Dashboard Icon"
              className={`w-6 h-6 ${
                isSelected ? "filter brightness-0 invert" : ""
              }`}
            />
          )}

          <span className={`flex-1 text-left ml-2`}>{text}</span>
          {hasSubmenu && (
            <span className="ml-auto transition-transform duration-300">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </div>

        <div
          className={`relative overflow-y-auto overflow-hidden transition-all scrollbar-hide duration-300 ease-in-out
          ${isOpen ? "max-h-[60vh] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
        >
          {React.Children.map(children, (child, index) => {
            if (!child) return null;
            return React.cloneElement(child, {
              isFirst: index === 0,
              isLast: index === React.Children.count(children) - 1,
              parentSection: text,
            });
          })}
        </div>
      </div>
    );
  };

  const handleClick = (text) => {
    setSelectedSection(text);

    const route = RouteList.find((route) => route.name === text);

    if (route) {
      navigate(route.path);
    }
  };

  const superData = [
    {
      text: "Master",
      icon: LayoutGrid,
      hasSubmenu: true,
      submenu: [
        { text: "Project Master", action: () => handleClick("Project Master") },
        { text: "Client Master", action: () => handleClick("Client Master") },
        { text: "Branch Master", action: () => handleClick("Branch") },
        { text: "Project Access", action: () => handleClick("Project Access") },
      ],
      onClick: () => setSelectedParentSection("Master"),
    },
    {
      text: "Configuration",
      icon: LayoutGrid,
      hasSubmenu: true,
      submenu: [
        {
          text: "Aupay Configure",
          action: () => handleClick("Aupay Configure"),
        },
      ],
      onClick: () => setSelectedParentSection("Configuration"),
    },
    {
      text: "Setting",
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { text: "Payment Mode", action: () => handleClick("Payment Ledger") },
        { text: "Scheme Type", action: () => handleClick("Scheme Type") },
        { text: "Employee", action: () => handleClick("Employee Details") },
        { text: "User Role", action: () => handleClick("User Role") },
        { text: "User Access", action: () => handleClick("User Access") },
        { text: "Staff User", action: () => handleClick("Staff User") },
        { text: "Menu", action: () => handleClick("Menu") },
        { text: "Submenu", action: () => handleClick("Sub Menu") },
        { text: "Metal", action: () => handleClick("Metal") },
        { text: "Purity", action: () => handleClick("Purity") },
        { text: "Policies", action: () => handleClick("Policies") },
      ],
      onClick: () => setSelectedParentSection("Settings"),
    },
  ];

  const quickLinks = [
    {
      name: "Metal Rate",
      link: "/setup/metal",
      icon: <Star className="text-pink-500" />,
    },
    {
      name: "Customer",
      link: "/manageaccount/addcustomer",
      icon: <User className="text-blue-500" />,
    },
    {
      name: "Manage Account",
      link: "/manageaccount/addschemeaccount",
      icon: <Settings className="text-purple-500" />,
    },
    {
      name: "Payment",
      link: "/payment/addschemepayment",
      icon: <CreditCard className="text-green-500" />,
    },
    {
      name: "Card Print",
      link: "/cardprint/printone",
      icon: <LucidePrinter className="text-green-500" />,
    },
    {
      name: "Receipt Print",
      link: "/receiptprint/printone",
      icon: <PawPrintIcon className="text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 right-0 lg:left-64 left-0 bg-white border-b-[1px] z-50 h-16 ">
        <div className="flex justify-between items-center h-full px-4">
          {/* Left side of header with burger menu and section title */}
          <div className="flex flex-row gap-4">
            <div className="flex items-center">
              {/* Burger menu button - positioned on the left for mobile */}
              <button
                className="lg:hidden p-2 mr-3"
                data-testid="toggle-sidebar"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Section title - hidden on mobile */}
              <div className="title lg:flex justify-center items-center hidden">
                <h1 className="text-[#232323] text-lg font-semibold ml-2">
                  {sectionName}
                </h1>
              </div>
            </div>

            <div className="text-[#F5F5F5] lg:flex text-xl font-semibold border-s-2 mt-1 border-[#F5F5F5] h-[28px] hidden"></div>
            {/* Search component */}
            <div
              className="se flex justify-center items-center pl-3 pr-5 w-[90px]  gap-3 border text-[#F2F2F9] h-[35px] rounded-[8px]"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="search">
                <img src={Search} alt="" className="w-7 h-7" />
              </div>

              <div className="command flex ps-1 items-center">
                <img src={Command} alt="" className="w-7 h-7" />
                <span className="text-[#232323] font-semibold text-sm ms-1">
                  F
                </span>
              </div>
            </div>
          </div>
          <div className="xl:flex items-center space-x-3 hidden ">
            <div className="bg-[#FFE28D] flex px-2 py-1 sm:px-3 sm:py-1.5 rounded-[8px] text-[#232323] font-medium sm:text-sm hidden md:flex">
              <span className="hidden sm:inline">Gold (24K):</span>
              <span className="ml-1 font-bold">
                {metalRate[0]?.rate
                  ? formatNumber({ value: metalRate[0].rate, decimalPlaces: 0 })
                  : "N/A"}
              </span>
            </div>
            <div className="bg-[#FFE28D] flex px-2 py-1 sm:px-3 sm:py-1.5 rounded-[8px] text-[#232323] font-medium sm:text-sm hidden md:flex">
              <span className="hidden sm:inline">Gold (22K):</span>
              <span className="ml-1 font-bold">
                {metalRate[1]?.rate
                  ? formatNumber({ value: metalRate[1].rate, decimalPlaces: 0 })
                  : "N/A"}
              </span>
            </div>
            <div className="bg-[#FFE28D] flex px-2 py-1 sm:px-3 sm:py-1.5 rounded-[8px] text-[#232323] font-medium sm:text-sm hidden md:flex">
              <span className="hidden sm:inline">Silver:</span>
              <span className="ml-1 font-bold">
                {metalRate[2]?.rate
                  ? formatNumber({ value: metalRate[2].rate, decimalPlaces: 0 })
                  : "N/A"}
              </span>
            </div>

            <div className="border-2 border-[#F2F2F9] rounded-full"></div>

            <div className="border-2 border-[#F2F2F9] rounded-full w-10 h-10">
              <button className="p-2 text-gray-900">
                <img src={notification} alt="" srcSet="" />
              </button>
            </div>

            {roledata ? (
              <div className="relative inline-block text-left" ref={logoutRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 p-2 focus:outline-none"
                  data-testid="logout-dropdown"
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 text-lg font-semibold text-white rounded-full"
                    style={{ backgroundColor: layout_color }}
                  >
                    {role}
                  </span>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="p-2 text-gray-900">
                <UserRoundCheck size={28} />
              </button>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && <CustomerModal close={handleClose} />}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 lg:w-64 scrollbar-hide transform transition-transform duration-300 ease-in-out  border-r-[1px] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50 pt-16 lg:pt-4 overflow-auto flex flex-col`}
        style={{ backgroundColor: sidebar_color }}
      >
        <div className="flex justify-center items-center p-6">
          <img src={logo} alt="Logo" className="h-12 w-22 object-fill mb-4" />
        </div>

        <nav className="flex-1 text-white scrollbar-hide overflow-y-auto text-sm font-semibold">
          {/* <MenuItem
            text="Dashboard"
            menuIcon={
              <img
                src={Dashboard}
                alt="Dashboard Icon"
                className="w-5 h-5"
              />}
            hasSubmenu={false}
            onClick={() => {
              setSelectedSection("Dashboard");
              setSelectedParentSection("Dashboard");
              handleClick("Dashboard");
            }}
          /> */}
          <MenuItem
            text="Dashboard"
            // menuIcon={Dashboard}
            hasSubmenu={false}
            onClick={() => {
              setSelectedSection("Dashboard");
              setSelectedParentSection("Dashboard");
              handleClick("Dashboard");
            }}
          />
          {isSuperAdmin
            ? superData.map((menu, index) => (
                <MenuItem
                  key={index}
                  icon={menu.icon}
                  text={menu.text}
                  hasSubmenu={menu.hasSubmenu}
                  // isOpen={
                  //   openMenus[menu.text.toLowerCase().replace(/\s+/g, "")]
                  // }
                  onClick={() => {
                    if (menu.hasSubmenu) {
                      setSelectedParentSection(menu.text);
                      toggleMenu(menu.text.toLowerCase().replace(/\s+/g, ""));
                    } else {
                      setSelectedSection(menu.text);
                      menu.onClick && menu.onClick();
                    }
                  }}
                >
                  {menu.submenu &&
                    menu.submenu.map((sub, subIndex) => (
                      <SubMenuItem
                        key={subIndex}
                        text={sub.text}
                        onClick={sub.action}
                        parentSection={menu.text}
                      />
                    ))}
                </MenuItem>
              ))
            : renderMenuItems()}
        </nav>
      </aside>

      <div className="flex flex-col min-h-screen bg-[#fffefa] pt-14 lg:pl-64 pb-10">
        {/* SettingsButton  */}
        <div className="settingsButton flex flex-row justify-end items-center">
          {settingsOpen === true && (
            <div
              ref={settingsRef}
              className={`fixed top-0 right-0 h-full scrollbar-hide w-64 lg:w-1/4 bg-[#f5f5f5] border-l-2 border-gray-300  transform transition-transform duration-300 ease-in-out ${
                settingsOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 z-50 pt-16 lg:pt-4  flex flex-col`}
            >
              <nav className="flex-1 text-gray-900">
                <div className="flex flex-col">
                  {/* Title  */}
                  <div className="flex justify-between items-center">
                    <div className="p-3 border-l">
                      <h3 className="text-xl font-semibold text-start px-3">
                        Template Customizer
                      </h3>
                      <p className="text-[#6D6B77] px-3">
                        Customize and preview in real time
                      </p>
                    </div>
                    <div className="p-3 text-xl">
                      <div className="flex items-center gap-2">
                        <RefreshCcw
                          size={24}
                          onClick={() => {
                            dispatch(setLayoutColor("#023453"));
                            setLaycolor("#023453");
                          }}
                        />
                        <X
                          size={28}
                          onClick={() => setSettingsOpen((prev) => !prev)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="m-2 p-3 ">
                    <h4 className="text-xl font-semibold text-start px-3">
                      Color Palette
                    </h4>
                    <div className="grid grid-cols-5">
                      <div
                        className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#023453" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#023453"));
                          setLaycolor("#023453");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #023453{" "}
                        </p>
                      </div>
                      <div
                        className="w-16 h-12 m-2 p-3 border-2 rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#484453" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#484453"));
                          setLaycolor("#484453");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #484453{" "}
                        </p>
                      </div>
                      <div
                        className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#006EBE" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#006EBE"));
                          setLaycolor("#006EBE");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #006EBE{" "}
                        </p>
                      </div>
                      <div
                        className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#4AA147" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#4AA147"));
                          setLaycolor("#4AA147");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #4AA147{" "}
                        </p>
                      </div>
                      <div
                        className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#0094AD" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#0094AD"));
                          setLaycolor("#0094AD");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #0094AD{" "}
                        </p>
                      </div>
                      <div
                        className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#034200" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#034200"));
                          setLaycolor("#034200");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #034200{" "}
                        </p>
                      </div>
                      <div
                        className="w-16 h-12 m-2 p-3 border-2  rounded-md text-center flex justify-center items-center shadow-lg"
                        style={{ backgroundColor: "#DD408B" }}
                        onClick={() => {
                          dispatch(setLayoutColor("#DD408B"));
                          setLaycolor("#DD408B");
                        }}
                      >
                        <p className="text-center text-white text-[12px]">
                          #DD408B
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Quick Links */}
                  <div className="p-3">
                    <h3 className="text-xl font-medium mb-2 px-3 m-2">
                      Quick Links
                    </h3>
                    <div className="grid grid-cols-2 gap-4 px-3">
                      {quickLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center p-4 bg-white border rounded-lg shadow-lg hover:bg-gray-300 cursor-pointer"
                          onClick={() => navigate(link.link)}
                        >
                          <div className="text-2xl mb-2">{link.icon}</div>
                          <span className="text-sm font-medium text-gray-700">
                            {link.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}

          {settingsOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSettingsOpen((prev) => !prev)}
            />
          )}
        </div>
        <main className="bg-[#fffefa] px-6 pt-4 pb-4 mb-6">
          <div className="h-full">
            <RenderContent refresh={getPurity} />
          </div>
        </main>
      </div>

      <footer className="flex flex-row justify-center items-center w-full h-10 bg-white border-t py-3 px-2 fixed bottom-0 left-0 lg:left-40 z-30">
        <div className="flex w-3/4 justify-center items-center ">
          <div className="text-sm lg:text-sm md:text-md flex text-nowrap text-gray-500">
            ATTS Technologies Private Limited © 2025. All rights reserved.
          </div>
          {/* <div className="mx-2">/</div>
          <div
            className="mx-2 cursor-pointer"
            onClick={() => navigate("/help/policy")}
          >
            {" "}
            <span className="text-blue-700">Legal Policies</span>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default Base;
