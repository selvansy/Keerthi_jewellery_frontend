import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { searchaccountnumber } from '../../../api/Endpoints';
import { useSelector } from 'react-redux';
import SpinLoading from '../../common/spinLoading';
import Table from "../../common/Table";
import usePagination from "../../../hooks/usePagination";


const PaymentPrint = () => {

  const printableAreaRef = useRef(null);
  const [isLoading, setisLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setvalue] = useState('');
  const [total, setTotal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [weightScheme, setWeightScheme] = useState(false);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  useEffect(() => {
    if(!paymentData) return;
    
      if((weightScheme === 3 || weightScheme === 4 || weightScheme === 12)){
        const totalWeight = paymentData.reduce((acc, row) => acc + (parseFloat(row.metal_weight) || 0), 0);
        setTotal(prev =>({
          ...prev,
          totalWeight:totalWeight
        }));
      }else{
        const totalAMt = paymentData.reduce((acc, row) => acc + (parseFloat(row.paid_installments) || 0), 0);
        setTotal(prev=>({
          ...prev,
          totalAmt:totalAMt,
        }));
      }
     
  }, [paymentData]);


  const handlePrint = () => {
    if (selectedRows.length === 0) {
      toast.error('No rows selected for printing.');
      return;
    }

    
    let printContent = `
      <table cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
      
        <tbody>
    `;

    selectedRows.forEach((row, index) => {


      printContent += `
        <tr>
          <td style="padding: 8px;">${row?.payment_receipt || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_customer?.firstname || ""} ${row?.id_customer?.lastname || ""}</td>
          <td style="padding: 8px;">${formatDate(row?.createdAt)}</td>
          <td style="padding: 8px;">${row?.id_scheme?.scheme_name || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_scheme?._id || "N/A"}</td>
          <td style="padding: 8px;">${row?.paid_installments || "N/A"} </td>
          <td style="padding: 8px;">${row?.payment_amount || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_scheme_account?.total_installments || "N/A"}</td>
          <td style="padding: 8px;">${row?.weight || "N/A"}</td>
        </tr>
      `;
    });


    // Close the table
    printContent += `
        </tbody>
      </table>
    `;

    // Open a new window and print
    const newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write(`
      <html>
        <head>
          <title>Print Selected Rows</title>
        </head>
        <body onload="window.print()">
          ${printContent}
        </body>
      </html>
    `);
    newWin.document.close();
  };




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


  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };


  const paginationData = { totalItems: totalPages, currentPage: currentPage, itemsPerPage: itemsPerPage, handlePageChange: handlePageChange }
  const paginationButtons = usePagination(paginationData)

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { mutate: handleSearchvalue } = useMutation({
    mutationFn: searchaccountnumber,
    onSuccess: (response) => {
      if (response) {
        setPaymentData(response.data);
        setWeightScheme(response.data[0].id_scheme.scheme_type)
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalDocuments(response.totalDocument);
      }
      setisLoading(false)
    },
    onError: (error) => {
      setisLoading(false)
      console.log("eror", error)
      toast.error(error.message || 'Try again');
    }
  });


  // const handleRowSelect = (paymentId) => {
  //   setSelectedRows((prevSelected) => {
  //     if (prevSelected.includes(paymentId)) {
  //       return prevSelected.filter((id) => id !== paymentId);
  //     } else {
  //       return [...prevSelected, paymentId];
  //     }
  //   });
  // };




  const handleSearchSubmit = () => {
    if (!value.trim()) {
      toast.error('Please enter a valid account number');
      return;
    }

    setPaymentData([]);
    setSelectedRows([]);
    setisLoading(true)
    handleSearchvalue(value);
  };

  const handlevalueChange = (e) => {
    const value = e.target.value;
    setvalue(value);
  };


  const handleCheckbox = (e, row) => {

    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, row]);
    } else {
      setSelectedRows((prev) => prev.filter((e) => e._id !== row._id));
    }
  };


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = paymentData.map(row => row._id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  
  const handleFrontPrint = () => {
    if (paymentData.length === 0) {
      toast.error('No data.');
      return;
    }
  
    let printContent = `
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ccc;">
        <h2>ID: ${paymentData[0]?.id_scheme_account?.scheme_acc_number}</h2>
        <p><strong>Name:</strong> ${paymentData[0]?.id_customer?.firstname} ${paymentData[0]?.id_customer?.lastname}</p>
        <p><strong>Address:</strong> ${paymentData[0]?.id_customer?.address}</p>
        <p><strong>Mobile:</strong> ${paymentData[0]?.id_customer?.mobile}</p>
        <p><strong>Scheme:</strong> ${paymentData[0]?.id_scheme?.scheme_name}</p>
      </div>
    `;
  
    const newWin = window.open("", "PrintWindow", "width=800,height=800");
  
    if (newWin) {
      newWin.document.open();
      newWin.document.write(`
        <html>
          <head>
            <title>Print Preview</title>
          </head>
          <body onload="window.print()">
            ${printContent}
          </body>
        </html>
      `);
      newWin.document.close();
  
      // Close window when printing is done
      newWin.onafterprint = () => newWin.close();
      newWin.onbeforeunload = () => newWin.close();
    }
  };

  const handleReceiptPrint = () => {

  
    
    if (selectedRows.length === 0) {
      toast.error('No rows selected for printing.');
      return;
    }

    if (!selectedRows) {
      toast.error('Selected row data not found.');
      return;
    }

    // const complist = selectedRows.branch_details;
    const scheme_details = selectedRows[0].id_scheme;
    const city_details = selectedRows.city_details;
    const customer_details = selectedRows[0].id_customer;
    const schemeaccount_details = selectedRows[0].id_scheme_account;

    let scheme_name = "";
    if (weightScheme === 3 || weightScheme === 4 || weightScheme === 12 ) {
      scheme_name = `${scheme_details?.scheme_name} (${scheme_details?.min_weight} Grm - ${scheme_details?.max_weight} Grm)`;
    }else{
      scheme_name = `${scheme_details?.scheme_name} (${scheme_details?.min_amount} AMT - ${scheme_details?.max_amount} AMT)`;
    }

    let printContent = `
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border: 1px solid #ccc;">
        <h2>Receipt No: RC${selectedRows[0]?.payment_receipt}</h2>
        <p><strong>Name:</strong> ${customer_details.firstname} ${customer_details.lastname}</p>
        <p><strong>Receipt Date:</strong>${formatDate(selectedRows[0]?.date_payment)}</p>
        <p><strong>Address:</strong> ${customer_details.address}</p>
        <p><strong>Account No:</strong> ${schemeaccount_details?.scheme_acc_number}</p>
        <p><strong>Scheme Name:</strong>${scheme_name}</p>
        <p><strong>Paid Amount:</strong> Rs.${selectedRows[0]?.payment_amount} </p>
        <p><strong>Total Installment:</strong> ${selectedRows[0]?.paid_installments}/${schemeaccount_details?.total_installments}</p>
        <p><strong>Total:</strong>{${(weightScheme === 3 || weightScheme === 4 || weightScheme === 12 )} ? ${total.totalWeight} : ${total.totalAMt} }</p>

      </div>
    `;

    const str = `
      <div className="main_section">
        <div className="mt-5">
          <p className="chitreceipt">CHIT RECEIPT</p>
        </div>
        <div className="mt">
          <div className="details_count">
            <div className="details">
              <p className="details_list">Receipt No</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">RC${selectedRows[0]?.payment_receipt} </p>
          </div>
          <div className="details_count">
            <div className="details">
              <p className="details_list">Receipt Date</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">${formatDate(selectedRows?.date_payment)}</p>
          </div>
          <div className="details_count">
            <div className="details">
              <p className="details_list">Name</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">${schemeaccount_details?.account_name}</p>
          </div>
          <div className="details_count">
            <div className="details">
              <p className="details_list">Account No</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">${schemeaccount_details?.scheme_acc_number}</p>
          </div>
          <div className="details_count">
            <div className="details">
              <p className="details_list">Scheme Name</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">${scheme_name}</p>
          </div>
          <div className="details_count">
            <div className="details">
              <p className="details_list">Paid Amount</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">Rs.${selectedRows[0]?.payment_amount}</p>
          </div>
        </div>

        <div className="amount_details">
          <div>
            <p className="paidamt">Total Installment</p>
            <p className="paidamt">${schemeaccount_details?.paymentcount}/${schemeaccount_details?.total_installments}</p>
          </div>
          <div>
            <p className="paidamt">Total Amount</p>
            <p className="paidamt">${total.totalAMt}</p>
          </div>
          ${(weightScheme === 3 || weightScheme === 4 || weightScheme === 12 ) && `
            <div>
              <p className="paidamt">Total Weight</p>
              <p className="paidamt">${total.totalWeight}</p>
            </div> `}
        </div>
      </div>
    `;

   

    const newWin = window.open('', '', 'width=600,height=800');
    newWin.document.open();
    newWin.document.write(`
      <html>
        <body onload="window.print()">
          <head>
            <title>Chit Receipt</title>
          </head>
          ${printContent}
        </body>
      </html>
    `);
    newWin.document.close();

    setTimeout(() => { newWin.close(); }, 3500);
  };

  


  const columns = [
    {
      header: () => (
        <>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              onChange={handleSelectAll}
              checked={paymentData.length > 0 && selectedRows.length === paymentData.length}
            />
            <span>Select All</span>
          </div>
        </>
      ),
      accessor: "select",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4"
            onChange={(e) => handleCheckbox(e, row)}
            checked={selectedRows.includes(row)}
          />
        </div>
      ),
      width: 50,
    },
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Payment Receipt number",
      cell: (row) => row?.payment_receipt || "N/A",
    },
    {
      header: "Name",
      cell: (row) => row?.id_customer.firstname + "" + row?.id_customer.lastname || "N/A",
    },
    {
      header: "Date",
      cell: (row) => formatDate(row?.createdAt)
    },
    {
      header: "Scheme name",
      cell: (row) => row?.id_scheme?.scheme_name || "N/A",
    },
    {
      header: "Scheme Code",
      cell: (row) => row?.id_scheme?.code || "N/A",
    },
    {
      header: "Paid Installments",
      cell: (row) => row?.paid_installments || "N/A",
    },
    {
      header: "Amount",
      cell: (row) => row?.payment_amount || "N/A",
    },
    {
      header: "Total Installment",
      cell: (row) => row?.id_scheme_account?.total_installments || "N/A",
    },
  ];

  if ((weightScheme === 3 || weightScheme === 4 || weightScheme === 12)) {
    columns.push({
      header: "Saved Weight",
      cell: (row) => row?.metal_weight || "N/A",
    })
  } else {
    columns.push({
      header: "Saved Amount",
      cell: (row) => row?.total_amt || "N/A",
    })
  }



  return (

    <div className=" my-8">
      {/* <button 
        onClick={handlePrint} 
        className="no-print mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Print
      </button> */}

      <div ref={printableAreaRef} className="rounded-lg p-6">

        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Print</h2>

          {/* Search Card */}
          <div className="flex justify-center mb-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-xl font-semibold mb-4 text-center">Search A/C number or Mobile</h3>

              {/* Search Input */}
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Enter A/C number or Mobile"
                  value={value}
                  onChange={handlevalueChange}
                  className="px-4 py-2 border rounded-l-md w-full"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="px-6 py-2 text-white rounded-r-md hover:bg-blue-600"
                  style={{ backgroundColor: layout_color }}
                  readOnly={isLoading}
                >
                  {isLoading ? <SpinLoading /> : 'Search'}

                </button>
              </div>
            </div>
          </div>

          {/* <button
            onClick={handlePrint}
            className="no-print mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: layout_color }}
          >
            <i className="fa fa-print mr-2"></i> Print
          </button> */}

          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="text-white font-lg rounded-lg text-sm px-5 py-2.5 my-3 text-center inline-flex items-center"
            type="button"
            style={{ backgroundColor: layout_color }}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            Print
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div
            id="dropdown"
            className={`z-10 my-2 bg-white border border-gray-500 text-gray-900 divide-y divide-gray-100 rounded-lg shadow-sm w-44 ${isOpen ? "block" : "hidden"
              }`}
          >
            <ul className="py-2 text-sm text-gray-700">
              <li className='hover:bg-gray-300'>
                <button className="text-left  block p-2" onClick={handlePrint}>
                  Card Print
                </button>
              </li>
              <li className='hover:bg-gray-300'>
                <button className="text-left block p-2" onClick={handleFrontPrint}>
                  Front Print
                </button>
              </li>
              <li className='hover:bg-gray-300'>
                <button className="text-left block p-2" onClick={handleReceiptPrint}>
                Receipt Print
                </button>
              </li>
            </ul>
          </div>

          <Table
            columns={columns}
            data={paymentData}
            isLoading={isLoading}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPrint;