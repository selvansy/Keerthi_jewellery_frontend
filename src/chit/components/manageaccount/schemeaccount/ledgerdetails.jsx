import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setScemeAccountId } from "../../../../redux/clientFormSlice"
import { getschemeaccountbyid, searchPaymentBySchNo } from '../../../api/Endpoints'
import Table from '../../common/Table'
import { formatNumber } from "../../../utils/commonFunction";
import { useMutation } from "@tanstack/react-query";

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
    if (!ledgerData) return;
    if (Object.keys(ledgerData).length !== 0) {

      const payload = {
        page: currentPage,
        limit: itemsPerPage,
        mobile: ledgerData?.mobile
      }
      handleSearchvalue(payload)
    } else {
      setpaymentdata([]);
    }
  }, [ledgerData])


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


  const { mutate: handleSearchvalue } = useMutation({
    mutationFn: searchPaymentBySchNo,
    onSuccess: (response) => {
      if (response) {
        setpaymentdata(response.data);
        setTotalDocument(response.totalDocument)
        setCurrentPage(response.currentPage)
        setTotalPages(response.totalPages)
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
    }
  });


  const getLedgerData = async (data) => {
    if (!data) return;
    const response = await getschemeaccountbyid(data);
    if (response) {
      console.log(response,"response")
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
        gift_issues:response.data?.gift_issues,
        status:response?.data?.status_name
        // id: response?.data?._id,
        // id_scheme: response?.data?.id_scheme._id,
        // min_amount: response?.data?.id_scheme.min_amount,
        // max_amount: response?.data?.id_scheme.max_amount,
        // min_weight: response?.data?.id_scheme.min_weight,
        // max_weight: response?.data?.id_scheme.max_weight,
        // amount: response?.data?.id_scheme.amount,
        // id_customer: response?.data?.id_customer._id,
        // total_paidamount: response?.data?.total_paidamount,
        // total_paidinstallments: response?.data?.total_paidinstallments,
        // total_weight: response?.data?.total_weight,
        // bill_no: response?.data?.bill_no,
        // bill_date: response?.data?.bill_date,
        // id_branch: response?.data?.id_branch._id,
        // address: response?.data?.id_customer.address,
        // customer_name: response?.data?.id_customer?.firstname + ' ' + response.data?.id_customer?.lastname,
        // paid_weight:response.data?.payment?.metal_weight,

      });
      setpaymentdata(response?.data?.paymentdata);
    } else {
      toast.error('Customer not created!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };


  const columns = [
    // {
    //     header: 'S.No',
    //     cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    // },
    {
      header: "Installments",
      cell: (row) => row?.paid_installments ?? "-",
    },
    {
      header: "Receipt No",
      cell: (row) => row?.payment_receipt
    },
    {
      header: "Total Amount",
      cell: (row) => row?.total_amt
    },
    {
      header: "A/c No",
      cell: (row) => row?.id_scheme_account?.scheme_acc_number ?? "-"
    },
    {
      header: "ITR/UTR",
      cell: (row) => row?.itr_utr ?? "-"
    },
    {
      header: "Remarks",
      cell: (row) => row?.remark ?? "-"
    },


  ]
console.log(ledgerData,"kd")

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
        <Detail
          label="Paid Installments"
          value={`${ledgerData?.total_paidinstallments ?? "0"}/${ledgerData?.total_installments}`}
        />
        <Detail label="Scheme Type" value={ledgerData?.scheme_typename} />
        <Detail label="Paid Amount" value={formatNumber({value:ledgerData?.total_paidamount ?? "",decimalPlaces:0})} />
        <Detail label="Bonus Amount" value={   
          formatNumber({value:paymentdata[0]?.wallet?.balance_amt ?? "-",decimalPlaces:0}) } />
        <Detail label="Paid Weight" value={ledgerData?.paid_weight} />
        <Detail label="Total Amount" value={formatNumber({value:ledgerData?.total_paidamount ?? "",decimalPlaces:0})} />
        <Detail label="Gift Handover" value={ledgerData?.gift_issues} />
        <Detail label="Status" value={ledgerData?.status} highlight />
      </div>

      {/* Installments Table */}
      <div className="mt-10">

        <div className="overflow-x-auto">
          <Table
            data={paymentdata}
            columns={columns}
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
  console.log(label,value)
  return (
    <div className="flex">
      <span className="w-44 font-medium text-gray-700">{label}</span>
      <span className={`${highlight ? 'text-green-600 font-semibold' : 'text-gray-600 text-start'} `}>
      {value !== undefined && value !== null ? value : 'N/A'}
      </span>

    </div>
  );
}