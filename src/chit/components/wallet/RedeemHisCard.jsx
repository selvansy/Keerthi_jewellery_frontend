import React, { useEffect, useMemo, useState } from 'react'
import Select from "react-select";
import Table from "../common/Table"
import { walletRedeemByUser, getRefferalpayment,userRedeemHistory} from "../../api/Endpoints"
import { useMutation } from '@tanstack/react-query';
import { formatNumber } from '../../utils/commonFunction';


export default function RedeemHisCard(userdata) {
    const { data } = userdata;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [walletData, setwalletData] = useState([]);
    const [isLoading, setisLoading] = useState(false);


    useEffect(() => {
        if (!data) return;
        const payload = { page: currentPage, limit: itemsPerPage, mobile: "" };
        if(data._id){
            payload.id = data._id
        }

        getallWalletData(payload);
    }, [currentPage, itemsPerPage, data]);



    const { mutate: getallWalletData } = useMutation({
        mutationFn: (payload) => userRedeemHistory(payload),
        onSuccess: (response) => {
            setwalletData(response.data)
            setTotalPages(response.totalPages)
            setCurrentPage(response.currentPage)
            setTotalDocuments(response.totalDocuments)
        },
        onError: (error) => {
            
            setisLoading(false)
            setwalletData([])
        }
    });

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };


    const handlePageChange = (page) => {
        const pageNumber = Number(page);
        if (
            !pageNumber ||
            isNaN(pageNumber) ||
            pageNumber < 1 ||
            pageNumber > totalPages
        ) {
            return;
        }

        setCurrentPage(pageNumber);
    };


    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Redeemed Amount",
            cell: (row) => {
                return row?.credited_amount !== undefined ? formatNumber({ value: Math.abs(row.credited_amount) }) : "-";
            }
        },
        {
            header: "Bill No",
            cell: (row) => `${row?.bill_no || "-"}`,
        },
        {
            header: "Date",
            cell: (row) => {
                if (!row?.createdAt) return "-";
                const date = new Date(row?.createdAt);
                const formattedDate = date.toISOString().split("T")[0];
                return formattedDate;
            }
        },

    ];


    return (
        <>
            <div className="w-full flex flex-col bg-white">
                <div className="flex flex-col pb-4 relative ">
                    <div className=" grid grid-rows-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 border-gray-300 overflow-y-scroll scrollbar-hide">

                        <div className="flex flex-row mb-4 border-b">
                            <label className="text-gray-700 font-medium">
                                Name
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {data?.id_customer
                                        ? `${data.id_customer.firstname || ""} ${data.id_customer.lastname || ""}`
                                        : data?.id_employee
                                            ? `${data.id_employee.firstname || ""} ${data.id_employee.lastname || ""}`
                                            : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4 border-b">
                            <label className="text-gray-700 font-medium">
                                Mobile No
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {data?.id_customer
                                        ? `${data.id_customer.mobile || ""}`
                                        : data?.id_employee
                                            ? `${data.id_employee.mobile || ""}`
                                            : "-"}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Wallet Amount
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {data?.total_reward_amt}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Redeemed Amount
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {data?.redeem_amt}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Table */}
                    <div className="mt-4">
                        <Table
                            data={walletData}
                            columns={columns}
                            isLoading={isLoading}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalDocuments}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </div>
                </div >
            </div >
        </>
    )
}


export function RefferalCusCard({ refData }) {


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalDocuments, setTotalDocuments] = useState(0)
    const [paymentData, setpaymentData] = useState([]);
    const [isLoading, setisLoading] = useState(false);


    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };


    const handlePageChange = (page) => {
        const pageNumber = Number(page);
        if (
            !pageNumber ||
            isNaN(pageNumber) ||
            pageNumber < 1 ||
            pageNumber > totalPages
        ) {
            return;
        }

        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!refData) return;
        const payload = { page: currentPage, limit: itemsPerPage, id: refData?.id_scheme_account._id };

        getallpaymentData(payload);
    }, [currentPage, itemsPerPage, refData]);



    const { mutate: getallpaymentData } = useMutation({
        mutationFn: (payload) => getRefferalpayment(payload),
        onSuccess: (response) => {

            setpaymentData(response.data.data)
            setTotalPages(response.totalPages)
            setCurrentPage(response.currentPage)
            setTotalDocuments(response.totalDocuments)
        },
        onError: (error) => {
            setisLoading(false)
            setpaymentData([])
        }
    });

    const totalReferral = useMemo(() => {
        return paymentData.reduce((acc, curr) => acc + (curr.referral_amount || 0), 0);
    }, [paymentData]);



    const columns = [
        {
            header: 'S.No',
            cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
        },
        {
            header: "Installment Date",
            cell: (row) => {
                if (!row?.createdAt) return "-";
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-GB');
                };
                return formatDate(row?.createdAt);
            }
        },
        {
            header: "Paid Amount",
            cell: (row) => formatNumber({ value: row?.payment_amount, decimalPlaces: 0 }),
        },
        {
            header: "Monthly Reward",
            cell: (row) => formatNumber({ value: row?.referral_amount, decimalPlaces: 0 }),
        },

    ];

    return (
        <>
            <div className="w-full flex flex-col bg-white">
                <div className="flex flex-col pb-4 relative ">
                    <div className=" grid grid-rows-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 border-gray-300 overflow-y-scroll scrollbar-hide">

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Customer Name
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {refData?.id_scheme_account?.firstname}  {refData?.id_scheme_account?.lastname}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4 ">
                            <label className="text-gray-700 font-medium">
                                Mobile No
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {refData?.id_scheme_account?.mobile}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Scheme Name
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {refData?.id_scheme?.scheme_name} {refData?.id_scheme?.code} {refData?.id_scheme?.description}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Scheme Acc No
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {refData?.id_scheme_account?.scheme_acc_number}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Total Paid Installment
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {/* {refData?.id_scheme_account?.paymentcount}/{refData?.id_scheme_account?.total_installments} */}
                                    {paymentData[0]?.id_scheme_account?.paid_installments}/{refData?.id_scheme_account?.total_installments}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Total Paid
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {formatNumber({ value: refData?.payment[0]?.total_amt, decimalPlaces: 0 })}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Total Refferal amount
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {formatNumber({value:totalReferral,decimalPlaces:0})}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 mb-4">
                            <label className="text-gray-700 font-medium">
                                Maturity Date
                            </label>

                            <div className="relative">
                                <div className='px-2  w-full text-[#6C7086]'>
                                    {refData?.id_scheme_account?.maturity_date}
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Table */}
                    <div className="mt-4">
                        <Table
                            data={paymentData}
                            columns={columns}
                            isLoading={isLoading}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalDocuments}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </div>
                </div >
            </div >
        </>
    )

}

