import React, { useState, useEffect } from 'react'
import Table from '../../common/Table'
import { toast } from 'react-toastify';
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux';
import { pagehandler } from '../../../../redux/clientFormSlice';
import { useParams } from 'react-router-dom';
import { getallclient } from "../../../api/Endpoints"
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'
import ProgressSteps from '../../common/ProgressSteps';
import Addadmin from './Addadmin';

const AdminMaster = () => {

    const navigate = useNavigate()

    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [active, setActive] = useState(false);
    const [isAdmin, setisAdmin] = useState(false);
    const [isLoading,setisLoading] = useState(true)

    
    const [clientTable, setClientTable] = useState([]);
    const { id } = useParams();
    let dispatch = useDispatch();


    //   const [filters, setFilters] = React.useState({
    //     metalType: '',
    //     branch: ''
    //   });

    const handleStatusToggle = (id) => {
        
        toast.success("status changed");
        setClientTable((prevData) =>
            prevData.map((e) =>
                e._id === id
                    ? { ...e, active: e.active === true ? false : true }
                    : e
            )
        );
    }


    const { mutate: getClients } = useMutation({
        mutationFn: (data)=>
             getAllClients(data),
        onSuccess: (response) => {
            setClientTable(response.data);
        },
        onError:()=>{
              setisLoading(false)
        }
    });

    useEffect(() => {
        getClients();
    }, [])

    useEffect(() => {
        getClients();
        dispatch(pagehandler(0))
        if (id) {
            setisAdmin(true);
            dispatch(pagehandler(0))
        } else {
            setisAdmin(false);
        }
    }, [id])

    //   useEffect(()=>{
    //      dispatch(setTotalPage(steps.length))
    //   },[])

    //   const handleEdit = (id) => {
    //     navigate(`/superadmin/clientmaster/${id}`)
    //   }


    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1,
        },
        {
            header: 'Name',
            cell: (row) => `${row?.company_name}`,
        },
        {
            header: 'Date',
            cell: (row) => `${row?.company_name}`,
        },
        {
            header: 'Status',
            accessor: 'active',
            cell: (row) => (
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row?.active === true}
                        onChange={() => handleStatusToggle(row?._id)}
                    />
                    <div
                        className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${row.active === true
                                ? 'peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]'
                                : 'peer-checked:bg-gray-400 peer-checked:ring-gray-400'
                            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
                    ></div>
                </label>
            )
        },
        {
            header: 'Actions',
            cell: (row, rowIndex) => (
                <div className="dropdown-container relative">
                    <button
                        className="p-1 hover:bg-gray-100 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(row?._id);
                            setActiveDropdown(activeDropdown === row?._id ? null : row?._id);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>

                    {activeDropdown === row?._id && (
                        <div
                            className="absolute right-[47px] lg:right-[235px] md:right-[150px] sm:right-[100px] transform -translate-x-8"
                            style={{
                                top: 'auto',
                                bottom: '-440%',
                                zIndex: 9999,
                                marginBottom: '8px',
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
                            }}
                        >
                            <div className="w-32 rounded-md bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => {
                                            handleEdit(row?._id);
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => {
                                            handleDelete(row?._id);
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ),
            sticky: 'right'
        }
    ]


    const handleAddClient = () => {
        setisAdmin(true);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex flex-col p-4 relative">
            {isAdmin ? 
            (<h2 className="text-2xl text-gray-900 font-bold">Admin's Master</h2>) : (<h2 className="text-2xl text-gray-900 font-bold">Admin's</h2>)}
            {!isAdmin && (
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
                    <div className="relative w-full lg:w-1/3 min-w-[200px]">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Search className="text-gray-500" />
                        </div>
                        <input
                            placeholder="Search..."
                            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
                        />
                    </div>
                    <div className="flex flex-row items-center justify-end gap-2">
                        <button
                            id="filter"
                            className=" text-white w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#034571] transition-colors flex-shrink-0"
                            style={{ backgroundColor: layout_color }} >
                            <SlidersHorizontal size={20} />
                        </button>
                        <button
                            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
                            onClick={handleAddClient}
                            style={{ backgroundColor: layout_color }}  >
                            + Add admin
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
          ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-3">
                        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-3 space-y-4 flex-1 overflow-y-auto">
                        <div className="flex flex-col border-t"></div>
                        {/* Metal Filter */}

                        {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Metal Type
              </label>
              <select
                name="metalType"
                value={filters.metalType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
              </select>
            </div> */}

                        {/* Branch Filter */}

                        {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Branches</option>
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
                <option value="branch3">Branch 3</option>
              </select>
            </div> */}

                        <div className="p-4 borde">
                            <div className="bg-yellow-300 flex justify-center gap-3">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="flex-1 px-4 py-2 bg-[#61A375] text-white rounded-md"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}

            <div className="mt-4">
                {(!isAdmin) ? (<Table data={clientTable} columns={columns} selectedRow={selectedRow} isLoading={isLoading}/>) : (

                    <div className="flex flex-col space-x-0 w-full">
                      <Addadmin setisAdmin={setisAdmin}/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminMaster