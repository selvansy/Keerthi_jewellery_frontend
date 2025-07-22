import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setScemeAccountId } from "../../../../redux/clientFormSlice"
import { getschemeaccountbyid, searchPaymentBySchNo } from '../../../api/Endpoints'
import Table from '../../common/Table'
import { formatDecimal, formatNumber } from "../../../utils/commonFunction";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

function Ledgerdetails({ setIsOpen }) {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  let dispatch = useDispatch();
  const id = useSelector((state) => state.clientForm.id_scheme_account);

  const [ledgerData, setLedgerData] = useState({});
  const [paymentdata, setpaymentdata] = useState([]);
  const [isLoading, setisLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocument, setTotalDocument] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const weightScheme = [12, 3, 4, 2, 5, 6, 10, 14]

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(setScemeAccountId(null))
    setIsOpen(false)
  }

  useEffect(() => {
    if (id) {
      getLedgerData(id);
    }
  }, [id])

  useEffect(() => {
    if (!ledgerData || Object.keys(ledgerData).length === 0) return;
    
    fetchPaymentData();
  }, [ledgerData, currentPage, itemsPerPage])

  const fetchPaymentData = () => {
    const payload = {
      page: currentPage,
      limit: itemsPerPage,
      mobile: id
    }
    handleSearchvalue(payload);
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when items per page changes
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

  const { mutate: handleSearchvalue } = useMutation({
    mutationFn: searchPaymentBySchNo,
    onSuccess: (response) => {
      if (response) {
        setpaymentdata(response.data);
        setTotalDocument(response.totalDocument)
        setTotalPages(response.totalPages)
        setisLoading(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
      setisLoading(false);
    }
  });

  const getLedgerData = async (data) => {
    if (!data) return;
    setisLoading(true);
    try {
      const response = await getschemeaccountbyid(data);
      if (response) {
        setLedgerData({
          account_name: response?.data?.account_name,
          mobile: response.data.id_customer.mobile,
          scheme_name: response.data?.id_scheme?.scheme_name,
          start_date: response?.data?.start_date,
          scheme_acc_number: response?.data?.scheme_acc_number,
          maturity_date: response?.data?.maturity_date,
          id_classification: response?.data?.id_classification,
          total_installments: response?.data?.total_installments,
          scheme_type: response?.data?.scheme_type,
          scheme_typename: response?.data?.scheme_typename,
          gift_issues: response.data?.gift_issues,
          status: response?.data?.status_name,
          total_paidinstallments: response?.data?.paid_installments,
          total_paidamount: response?.data?.total_paidamount,
          total_weight: response?.data?.total_weight,
          paid_weight: response?.data?.weight,
        });
        setisLoading(false);
      }
    } catch (error) {
      toast.error('Failed to fetch ledger data!');
      setisLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Define columns conditionally based on scheme type
  const getColumns = () => {
    const baseColumns = [
      {
        header: "Installments",
        cell: (row) => row?.paid_installments ?? "-",
      },
      {
        header: "Receipt No",
        cell: (row) => row?.payment_receipt ?? "-"
      },
      {
        header: "Total Amount",
        cell: (row) => formatNumber({ value: row?.payment_amount ?? 0, decimalPlaces: 0 })
      },
      {
        header: "ITR/UTR",
        cell: (row) => row?.itr_utr ?? "-"
      },
      {
        header: "Remarks",
        cell: (row) => row?.remark ?? "-"
      },
    ];

    if (weightScheme.includes(ledgerData?.scheme_type)) {
      baseColumns.splice(3, 0, {
        header: "Saved Weight",
        cell: (row) => `${formatDecimal(row?.metal_weight)} g`
      });
    }

    return baseColumns;
  };

  return (
    <div className="bg-white mx-auto">
      {/* Scheme Details */}
      <div className="grid grid-rows-2 lg:grid-cols-2 gap-4 text-sm">
        <Detail label="Accounter Name" value={ledgerData?.account_name} />
        <Detail label="Mobile No" value={ledgerData?.mobile} />
        <Detail label="Scheme Name" value={ledgerData?.scheme_name} />
        <Detail label="Start Date" value={formatDate(ledgerData?.start_date)} />
        <Detail label="Scheme A/C No" value={ledgerData?.scheme_acc_number} />
        <Detail label="Maturity Date" value={ledgerData?.maturity_date} />
        <Detail label="Classification" value={ledgerData?.id_classification?.name ?? "-"} />
        {ledgerData.scheme_type == 10 || ledgerData.scheme_type == 14 ? (
          <Detail
            label="Paid Installments"
            value={`${ledgerData?.total_paidinstallments ?? "0"}`}
          />
        ) : (
          <Detail
            label="Paid Installments"
            value={`${ledgerData?.total_paidinstallments ?? "0"}/${ledgerData?.total_installments}`}
          />
        )}
        <Detail label="Scheme Type" value={ledgerData?.scheme_typename} />
        <Detail label="Paid Amount" value={formatNumber({ value: ledgerData?.total_paidamount ?? "", decimalPlaces: 0 })} />
        <Detail label="Bonus Amount" value={
          formatNumber({ value: paymentdata[0]?.wallet?.balance_amt ?? "-", decimalPlaces: 0 })} />
        <Detail label="Paid Weight" value={`${formatDecimal(ledgerData?.paid_weight)} g`} />
        <Detail label="Gift Handover" value={ledgerData?.gift_issues} />
        <Detail label="Status" value={ledgerData?.status} highlight={false} />
      </div>

      {/* Installments Table */}
      <div className="mt-10">
        <div className="overflow-x-auto">
          <Table
            data={paymentdata}
            columns={getColumns()} // Use the dynamic columns function
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocument}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Ledgerdetails;

function Detail({ label, value, highlight = false }) {
  const statusStyles = {
    Open: {
      bg: "bg-[#12B76A38]",
      text: "text-green-500",
    },
    Completed: {
      bg: "bg-[#FDA70038]",
      text: "text-[#FDA700]",
    },
    Closed: {
      bg: "bg-[#FF000038]",
      text: "text-red-500",
    },
    Preclose: {
      bg: "bg-[#FF000038]",
      text: "text-red-500",
    },
    Refund: {
      bg: "bg-[#FF000038]",
      text: "text-red-500",
    },
  };

  const textColorClass = statusStyles[value]?.text || '';

  return (
    <div className="flex">
      <span className="w-44 font-medium text-gray-700">{label}</span>
      <span
        className={`${
          highlight
            ? "text-red-500 font-semibold"
            : `${textColorClass} text-start`
        }`}
      >
        {value !== undefined && value !== null ? value : 'N/A'}
      </span>
    </div>
  );
}