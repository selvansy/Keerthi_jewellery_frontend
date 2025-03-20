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

  const [paymentData, setPaymentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setvalue] = useState('');
  const [totalWeight, setTotalWeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);


  const handlePrint = () => {
    if (selectedRows.length === 0) {
      toast.error('No rows selected for printing.');
      return;
    }
  
    // // Create a table structure based on your column definitions
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
          <td style="padding: 8px;">${row?.paid_installments || "N/A"}</td>
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
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        setTotalDocuments(response.totalDocument);
      }
      setisLoading(false)
    },
    onError: (error) => {
      setisLoading(false)
      console.log("eror",error)
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


  useEffect(() => {
    const weight = paymentData.reduce((acc, row) => acc + (parseFloat(row.metal_weight) || 0), 0);
    setTotalWeight(weight);
  }, [paymentData]);

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

  
  const columns = [
    {
      header: () => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4"
            onChange={handleSelectAll}
            checked={paymentData.length > 0 && selectedRows.length === paymentData.length}
          />
        </div>
      ),
      accessor: "select",
      cell: (row ) => (
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
      header: "Scheme number",
      cell: (row) => row?.id_scheme?._id || "N/A",
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
    {
      header: "Saved Weight",
      cell: (row) => row?.weight || "N/A",
    },

  ];



  return (

    <div className=" my-8">
      {/* <button 
        onClick={handlePrint} 
        className="no-print mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Print
      </button> */}

      <div ref={printableAreaRef} className="bg-white rounded-lg shadow-lg p-6">

        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Payment Print</h2>

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
            onClick={handlePrint}
            className="no-print mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: layout_color }}
          >
            <i className="fa fa-print mr-2"></i> Print
          </button>

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