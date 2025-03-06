import Table from '../../../common/Table'
import React, { useState, useEffect } from 'react'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { pagehandler, resetPage, setTotalPage, setSelectedProject, setClientId, setProjectId, setAupayurl, setAusaleurl, setPawnurl, setbranchId } from '../../../../../redux/clientFormSlice';
import ProgressSteps from '../../../common/ProgressSteps';
import GeneralDetails from '../../../../components/SuperAdmin/Configure/Aupay/GeneralDetails';
import NotificationDetails from "../../../../components/SuperAdmin/Configure/Aupay/NotificationDetails";
import SmsDetails from "../../../../components/SuperAdmin/Configure/Aupay/SmsDetails";
import WhatsappDetails from "../../../../components/SuperAdmin/Configure/Aupay/WhatsappDetails";
import GatewayDetails from "../../../../components/SuperAdmin/Configure/Aupay/GatewayDetails";
import S3bucketDetails from "../../../../components/SuperAdmin/Configure/Aupay/S3bucketDetails";
import AppsettingDetails from '../../../../components/SuperAdmin/Configure/Aupay/AppsettingDetails';
import LayoutSettings from "../../../../components/SuperAdmin/Configure/Aupay/LayoutSettings"
import { getconfigurationtable } from "../../../../api/Endpoints"
import { useDebounce } from '../../../../hooks/useDebounce';
import {
    CircleCheckBig,
    ShieldAlert

} from 'lucide-react';
const AupayConfigure = () => {
    const layout_color = useSelector((state) => state.clientForm.layoutColor);

    const [selectedRow, setSelectedRow] = useState(null);
    const [project, setProject] = useState([]);
    const [isAddClient, setIsAddClient] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [aupayData, setAupayData] = useState([]);
    const [project_type, setProjectType] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebounce(searchInput, 500)
    const currentStep = useSelector((state) => state.clientForm.currentStep);
    const projectTitle = useSelector((state) => state.clientForm.selectedProject);
    const [isLoading, setisLoading] = useState(true)

    const dispatch = useDispatch();
    const [filters, setFilters] = React.useState({
        metalType: '',
        branch: ''
    });

    const { mutate: getallconfigureData } = useMutation({
        mutationFn: (payload) =>
            getconfigurationtable(payload),

        onSuccess: (response) => {
            setAupayData(response.data);
            setisLoading(false)
        },
        onError: () => {
            setisLoading(false)
        }
    });

    useEffect(() => {
        dispatch(setTotalPage(steps.length))
    }, [])

    useEffect(() => {
        getallconfigureData({ page: currentPage, limit: itemsPerPage, project_type: 1 });
    }, [currentPage, itemsPerPage, debouncedSearch, project_type, isAddClient])


    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1,
        },
        {
            header: 'Client NAME',
            cell: (row) => `${row?.company_name}`,
        },
        {
            header: 'GENERAL SETTING',
            cell: (row) => row?.general ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'NOTIFICATION',
            cell: (row) => row?.notification ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'SMS',
            cell: (row) => row?.sms ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'WHATSAPP',
            cell: (row) => row?.whatsapp ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'GATEWAY',
            cell: (row) => row?.gateway ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'S3 BUCKET',
            cell: (row) => row?.bucket ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'APP SETTING',
            cell: (row) => row?.app ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'LAYOUT',
            cell: (row) => row?.layout ? <CircleCheckBig className='text-green-500' /> : <ShieldAlert className='text-red-500' />,
        },
        {
            header: 'Sign Date',
            cell: (row) => `${row?.sign_date || '0000-00-00'}`,
        },

        {
            header: 'Launch Date',
            cell: (row) => `${row?.launch_date || '0000-00-00'}`,
        }

    ];

    const steps = [
        { title: "General Settings", icon: <i className="fa-solid fa-user-large"></i> },
        { title: "Notification", icon: <i className="fa-solid fa-book"></i> },
        { title: "Sms", icon: <i className="fa-solid fa-user-large"></i> },
        { title: "Whatsapp", icon: <i className="fa-solid fa-user-large"></i> },
        { title: "Gateway", icon: <i className="fa-solid fa-user-large"></i> },
        { title: "S3 Bucket", icon: <i className="fa-solid fa-user-large"></i> },
        { title: "App Settings", icon: <i className="fa-solid fa-user-large"></i> },
        { title: "Layout", icon: <i className="fa-solid fa-user-large"></i> },
    ];

    const handleAddClient = () => {
        dispatch(pagehandler(0))
        setIsAddClient(true);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationButtons.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`p-2 w-10 h-10 rounded-md  ${currentPage === i ? ' text-white' : 'text-slate-400'}`}
                style={{ backgroundColor: layout_color }} >
                {i}
            </button>
        );
    }

    const handleItemsPerPageChange = (value) => {

        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleReset = () => {
        dispatch(resetForm());
    };

    const handleSearch = (e) => {
        setSearchInput(e.target.value)
    }


    return (
        <div className="flex flex-col p-4 relative">
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl text-gray-900 font-bold">Aupay Configure</h2>
                    <h2 className="text-2xl text-gray-900 font-bold">{projectTitle}</h2>
                </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
                <div className="relative w-full lg:w-1/3 min-w-[200px]">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Search className="text-gray-500" />
                    </div>
                    <input
                        onChange={handleSearch}
                        placeholder="Search..."
                        className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
                    />
                </div>

                <div className="flex flex-row items-center justify-end gap-2">
                    <button
                         className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                         style={{ backgroundColor: layout_color }}
                        onClick={handleAddClient}
                    >
                       + Add Configure

                    </button>
                </div>



            </div>

            <div className="mt-4">
                {!isAddClient ? (
                    <>

                        <Table data={aupayData} columns={columns} selectedRow={selectedRow} isLoading={isLoading} />

                        {aupayData.length > 0 && (
                            <div className="flex justify-between mt-4 p-2">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            readOnly={currentPage === 1}
                                            className="p-2 text-gray-500 rounded-md"
                                        >
                                            Previous
                                        </button>
                                    </div>

                                    <div className="flex flex-row items-center justify-center gap-2">
                                        {paginationButtons}
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            readOnly={currentPage === totalPages}
                                            className="p-2 text-gray-500 rounded-md"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2 justify-center items-center">
                                    <span className="text-gray-500">Show</span>
                                    <select
                                        id="itemsPerPage"
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        className="p-2 h-10 border-gray-500 rounded-md text-black bg-gray-300"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={250}>250</option>
                                        <option value={500}>500</option>
                                        <option value={1000}>1000</option>
                                    </select>
                                    <span className="text-gray-500">entries</span>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Sidebar */}
                        <div className="lg:w-1/4 h-full flex-shrink-0 flex flex-col">
                            <ProgressSteps steps={steps} />
                        </div>

                        {/* Content Area */}
                        <div className="lg:w-3/4 w-full bg-white border-2 lg:rounded-tr-3xl lg:rounded-br-3xl border-gray-300 p-4 flex-grow">
                            {(() => {
                                switch (currentStep) {
                                    case 0:
                                        return <GeneralDetails setIsAddClient={setIsAddClient} />;
                                    case 1:
                                        return <NotificationDetails setIsAddClient={setIsAddClient} />;
                                    case 2:
                                        return <SmsDetails setIsAddClient={setIsAddClient} />;
                                    case 3:
                                        return <WhatsappDetails setIsAddClient={setIsAddClient} />;
                                    case 4:
                                        return <GatewayDetails setIsAddClient={setIsAddClient} />;
                                    case 5:
                                        return <S3bucketDetails setIsAddClient={setIsAddClient} />;
                                    case 6:
                                        return <AppsettingDetails setIsAddClient={setIsAddClient} />;
                                    case 7:
                                        return <LayoutSettings setIsAddClient={setIsAddClient} />
                                }
                            })()}
                        </div>
                    </div>

                )}
            </div>
        </div>
    )
}

export default AupayConfigure