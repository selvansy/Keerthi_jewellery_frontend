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
  const dropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!paymentData) return;

    if ([3, 4, 12].includes(weightScheme)) {
      const totalWeight = paymentData.reduce((acc, row) => acc + (parseFloat(row.metal_weight) || 0), 0);
      setTotal(prev => ({
        ...prev,
        totalWeight: totalWeight
      }));
    } else {
      const totalAMt = paymentData.reduce((acc, row) => acc + (parseFloat(row.paid_installments) || 0), 0);
      setTotal(prev => ({
        ...prev,
        totalAmt: totalAMt,
      }));
    }

  }, [paymentData]);



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

  // const handlePrint = () => {
  //   if (selectedRows.length === 0) {
  //     toast.error('No rows selected for printing.');
  //     return;
  //   }

  //   // CSS for the print layout
  //   const stylecss = `
  //     @media print {
  //       #customers {
  //         font-family: Arial, Helvetica, sans-serif;
  //         border-collapse: collapse;
  //         width: 100%;
  //         margin-top: 20px;
  //       }

  //       @page {
  //         size: auto;
  //         margin: 0mm;
  //       }

  //       #customers td, #customers th {
  //         border: none;
  //         padding: 8px;
  //         text-align: left;
  //       }

  //       #customers thead {
  //         display: none;
  //       }

  //       .tdoneaction, .print-button {
  //         display: none;
  //       }

  //       .fixedhgt {
  //         height: 40px !important;
  //         position: fixed;
  //       }

  //       .tdonefirst, .tdonesecond, .tdonethree,
  //       .tdonefour, .tdonefive, .tdonesix {
  //         font-size: 14px;
  //         padding: 8px;
  //         text-align: center;
  //       }

  //       #customers tr {
  //         page-break-inside: avoid;
  //       }
  //     }
  //   `;

  //   let printContent = `
  //     <table cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
  //       <tbody>
  //   `;

  //   selectedRows.forEach((row, index) => {
  //     printContent += `
  //       <tr>
  //         <td style="padding: 8px;">${row?.payment_receipt || "N/A"}</td>
  //         <td style="padding: 8px;">${row?.id_customer?.firstname || ""} ${row?.id_customer?.lastname || ""}</td>
  //         <td style="padding: 8px;">${formatDate(row?.createdAt)}</td>
  //         <td style="padding: 8px;">${row?.id_scheme?.scheme_name || "N/A"}</td>
  //         <td style="padding: 8px;">${row?.id_scheme?.code || "N/A"}</td>
  //         <td style="padding: 8px;">${row?.id_scheme_account.paymentcount}/${row?.id_scheme_account.total_installments}</td>
  //         <td style="padding: 8px;">${row?.payment_amount || "N/A"}</td>
  //         <td style="padding: 8px;">${row?.id_scheme_account?.total_installments || "N/A"}</td>
          
  //       </tr>
  //     `;
  //   });



  //   if ([3, 4, 12].includes(weightScheme)) {

  //     printContent += `
  //     <td style="padding: 8px;">${row?.metal_weight || "N/A"}</td>
  // `;

  //   } else {
  //     printContent += `
  //     <td style="padding: 8px;">${row?.total_amt || "N/A"}</td`;

  //   }


  //   // Close the table
  //   printContent += `
  //       </tbody>
  //     </table>
  //   `;

  //   // Open a new window and print
  //   const newWin = window.open("", "Print-Window");
  //   newWin.document.open();
  //   newWin.document.write(`
  //     <html>
  //       <head>
  //         <title>Print Selected Rows</title>
  //         <style>${stylecss}</style>
  //       </head>
  //       <body onload="window.print()">
  //         ${printContent}
  //       </body>
  //     </html>
  //   `);
  //   newWin.document.close();
  // };

  const handlePrint = () => {
    if (selectedRows.length === 0) {
      toast.error("No rows selected for printing.");
      return;
    }
  
    // CSS for the print layout
    const stylecss = `
      @media print {
        #customers {
         font-family: Inter, sans-serif;
          border-collapse: collapse;
          width: 100%;
          margin-top: 20px;
        }
  
        @page {
          size: auto;
          margin: 0mm;
        }
  
        #customers td, #customers th {
          border: none;
          padding: 8px;
          text-align: left;
        }
  
        #customers thead {
          display: none;
        }
  
        .tdoneaction, .print-button {
          display: none;
        }
  
        .fixedhgt {
          height: 40px !important;
          position: fixed;
        }
  
        .tdonefirst, .tdonesecond, .tdonethree,
        .tdonefour, .tdonefive, .tdonesix {
          font-size: 14px;
          padding: 8px;
          text-align: center;
        }
  
        #customers tr {
          page-break-inside: avoid;
        }
      }
    `;
  
    let printContent = `
      <table cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <tbody>
    `;
  
    selectedRows.forEach((row) => {
      printContent += `
        <tr>
          <td style="padding: 8px;">${row?.payment_receipt || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_customer?.firstname || ""} ${row?.id_customer?.lastname || ""}</td>
          <td style="padding: 8px;">${formatDate(row?.createdAt)}</td>
          <td style="padding: 8px;">${row?.id_scheme?.scheme_name || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_scheme?.code || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_scheme_account?.paymentcount || "N/A"}/${row?.id_scheme_account?.total_installments || "N/A"}</td>
          <td style="padding: 8px;">${row?.payment_amount || "N/A"}</td>
          <td style="padding: 8px;">${row?.id_scheme_account?.total_installments || "N/A"}</td>
      `;
  
      // Conditional rendering inside the loop
      if ([3, 4, 12].includes(weightScheme)) {
        printContent += `<td style="padding: 8px;">${row?.metal_weight || "N/A"}</td>`;
      } else {
        printContent += `<td style="padding: 8px;">${row?.total_amt || "N/A"}</td>`;
      }
  
      printContent += `</tr>`; // Closing the row
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
          <style>${stylecss}</style>
        </head>
        <body onload="window.print()">
          ${printContent}
        </body>
      </html>
    `);
    newWin.document.close();
  };

  
  const handleFrontPrint = () => {
    if (paymentData.length === 0) {
      toast.error('No data.');
      return;
    }

    const stylecss = `
      @media print {
  @page {
    size: 450px 600px;
    margin: 0;
  }

  .chitreceipt {
    font-weight: 600;
    font-size: 22px;
    text-align: center;
    font-family: Inter, sans-serif;
  }

  .paidamt {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 5px;
    text-align: center;
    font-family: Inter, sans-serif;
  }

  p {
    margin: 0px;
    font-family: Inter, sans-serif;
  }

  .main_section {
    padding: 20px;
    width: 500px;
    margin: auto;
    text-align: center;
    font-family: Inter, sans-serif;
  }

  .meena_name {
    font-size: 22px;
    font-weight: 600;
    text-align: center;
  }

  .address {
    font-size: 22px;
    font-weight: 400;
    text-align: center;
  }

  .details_count {
    font-size: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
  }

  .details {
    font-size: 20px;
    width: 120px;
    display: flex;
    justify-content: space-between;
  }

  .details_list {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 5px;
  }

  .amount_details {
    font-size: 20px;
    display: flex;
    justify-content: space-around;
    margin-top: 8px;
  }

  .schemename {
    width: 120px;
  }

  .mt-5 {
    margin-top: 20px;
  }
} `;

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
                <style>${stylecss}</style>
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

    if (!selectedRows || selectedRows.length === 0) {
      toast.error('No rows selected for printing.');
      return;
    }

    let printContent = `
  <div class="thermal-receipt">
    <div class="receipt-header">
      <h1>RECEIPT</h1>
      <p class="receipt-number">Receipt No: RC${selectedRows[0]?.payment_receipt}</p>
    </div>
    
    <div class="receipt-body">
      <p><span class="label">Name:</span> ${selectedRows[0].id_customer.firstname} ${selectedRows[0].id_customer.lastname}</p>
      <p><span class="label">Date:</span> ${formatDate(selectedRows[0]?.date_payment)}</p>
      <p><span class="label">Address:</span> ${selectedRows[0].id_customer.address}</p>
      <p><span class="label">Account No:</span> ${selectedRows[0].id_scheme_account?.scheme_acc_number}</p>
      
      <div class="receipt-details">
        <p><span class="label">Scheme:</span> ${selectedRows[0].id_scheme?.scheme_name}</p>
      </div>
    </div>

    <div class="receipt-details">
    <p><span class="label">Payments:</span></p>

`;

    selectedRows.forEach((row) => {
      printContent += `
    <p><span class="label"></span> Rs.${row?.payment_amount}</p>
  `;


    });

    printContent += `
    </div>
    <div class="receipt-total">
      <p><span class="label">Total Amount:</span> Rs.${selectedRows.reduce((acc, row) => acc + (parseFloat(row.payment_amount) || 0), 0)}</p>
    </div>
  </div>
`;

    const stylecss = `
@media print {
  body {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Courier New', monospace;
    background-color: white;
  }

  .thermal-receipt {
    width: 58mm;
    max-width: 58mm;
    padding: 10px;
    border: 1px dashed #000;
    font-size: 12px;
    line-height: 1.4;
    text-align: left;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .receipt-header {
    text-align: center;
    border-bottom: 1px dashed #000;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }

  .receipt-header h1 {
    margin: 0;
    font-size: 16px;
    text-transform: uppercase;
  }

  .receipt-number {
    font-size: 10px;
    margin: 5px 0 0;
  }

  .receipt-body p {
    margin: 3px 0;
    display: flex;
  }

  .receipt-body .label {
    font-weight: bold;
    min-width: 80px;
  }

  .receipt-details {
    margin: 10px 0;
    border-top: 1px dashed #000;
    border-bottom: 1px dashed #000;
    padding: 5px 0;
  }

  .receipt-total {
    text-align: right;
    font-weight: bold;
    margin-top: 10px;
  }
}
`;

    const newWin = window.open('', '', 'width=400,height=600');
    newWin.document.open();
    newWin.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>${stylecss}</style>
      </head>
      <body onload="window.print()">
        ${printContent}
      </body>
    </html>
  `);
    newWin.document.close();
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
      cell: (row) => (
        <div className="bg-green-500 rounded-full p-1 text-white flex justify-center">
          {row?.id_scheme_account.paymentcount}/{row?.id_scheme_account.total_installments}
        </div>
      ),
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

  if ([3, 4, 12].includes(weightScheme)) {
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
            ref={dropdownRef}
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