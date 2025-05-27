import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { searchaccountnumber } from '../../../api/Endpoints';
import { useSelector } from 'react-redux';
import SpinLoading from '../../common/spinLoading';

const CardPrint = () => {

  const [paymentData, setPaymentData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setvalue] = useState('');
  const [totalWeight, setTotalWeight] = useState(0);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  // Mutation to fetch payment data by account number
  const { mutate: handleSearchvalue, isLoading } = useMutation({
    mutationFn: searchaccountnumber,
    onSuccess: (response) => {
      if (response) {
        setPaymentData(response.data);
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
    }
  });

  // Handle row selection for printing
  const handleRowSelect = (paymentId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(paymentId)) {
        return prevSelected.filter((id) => id !== paymentId);
      } else {
        return [...prevSelected, paymentId];
      }
    });
  };

  // Calculate total weight
  useEffect(() => {
    const weight = paymentData.reduce((acc, row) => acc + (parseFloat(row.metal_weight) || 0), 0);
    setTotalWeight(weight);
  }, [paymentData]);

  // Handle search on submit
  const handleSearchSubmit = () => {
    if (!value.trim()) {
      toast.error('Please enter a valid account number');
      return;
    }

    setPaymentData([]);
    setSelectedRows([]);
    handleSearchvalue(value);
  };

  // Function to automatically change input value to uppercase
  const handlevalueChange = (e) => {
    const value = e.target.value;
    setvalue(value);
  };

  // Handle print action
  const handlePrint = () => {
    const selectedRowsData = paymentData.filter((data) =>
      selectedRows.includes(data._id)
    );

    if (selectedRowsData.length === 0) {
      toast.error('No rows selected for printing.');
      return;
    }

    // CSS for the print layout
    const stylecss = `
      @media print {
        #customers {
          fontfont-family: Inter, sans-serif;
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

    // Create the print content
    let printContent = "<table id='customers'>";
    printContent += "<thead><tr><th>Installment</th><th>Date</th><th>Receipt No</th><th>Total Amount</th><th>Metal Rate</th><th>Metal Weight</th><th>Total Weight</th></tr></thead>";
    printContent += "<tbody>";

    let totalWeightForPrint = 0;
    let grandTotal = 0;
    selectedRowsData.forEach((row, index) => {
      totalWeightForPrint += parseFloat(row?.metal_weight || 0);
      grandTotal += parseFloat(row?.total_amt || 0);

      printContent += `
        <tr className="fixedhgt">
          <td>${index + 1}</td>
          <td>${row?.date_payment}</td>
          <td>${row?.payment_receipt}</td>
          ${row?.scheme_details?.scheme_type === 0 || row?.scheme_details?.scheme_type === 1 || row?.scheme_details?.scheme_type === 4 || row?.scheme_details?.scheme_type === 7 || row?.scheme_details?.scheme_type === 8 || row?.scheme_details?.scheme_type === 9 ? `
            <td>${row?.total_amt}</td>
            <td>${grandTotal}</td>
          ` : `
            <td>${row?.total_amt}</td>
          `}
          ${row?.scheme_details?.scheme_type !== 0 && row?.scheme_details?.scheme_type !== 1 && row?.scheme_details?.scheme_type !== 4 && row?.scheme_details?.scheme_type !== 7 && row?.scheme_details?.scheme_type !== 8 && row?.scheme_details?.scheme_type !== 9 ? `
            <td>${row?.metal_rate}</td>
            <td>${row?.metal_weight}</td>
            <td>${totalWeight}</td>
          ` : ''}
        </tr>
      `;
    });

    printContent += "</tbody></table>";

    const newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write(`
      <html>
        <head>
          <title>Print Payment Records</title>
          <style>${stylecss}</style>
        </head>
        <body onload="window.print()">${printContent}</body>
      </html>
    `);
    newWin.document.close();
    setTimeout(() => {
      newWin.print();
      newWin.close();
    }, 1000);
  };

  // Handle row click
  const handleRowClick = (paymentId) => {
    handleRowSelect(paymentId);
  };

  return (
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
        className="mt-4 px-6 py-2 text-white rounded hover:bg-blue-600"
        style={{ backgroundColor: layout_color }}
      >
        <i className="fa fa-print mr-2"></i> Print Selected Rows
      </button>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(paymentData.map((row) => row._id)); 
                    } else {
                      setSelectedRows([]);  
                    }
                  }}
                  checked={selectedRows.length === paymentData.length} 
                />
              </th>
              <th className="px-4 py-2 text-left">Installment</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Receipt No</th>
              {paymentData.some((row) => row?.scheme_details?.scheme_type === 0 || row?.scheme_details?.scheme_type === 1 || row?.scheme_details?.scheme_type === 4 || row?.scheme_details?.scheme_type === 7 || row?.scheme_details?.scheme_type === 8 || row?.scheme_details?.scheme_type === 9) && (
                <>
                  <th className="px-4 py-2 text-left">Paid Amount</th>
                  <th className="px-4 py-2 text-left">Total Amount</th>
                </>
              )}
              {paymentData.some((row) => row?.scheme_details?.scheme_type !== 0 && row?.scheme_details?.scheme_type !== 1 && row?.scheme_details?.scheme_type !== 4 && row?.scheme_details?.scheme_type !== 7 && row?.scheme_details?.scheme_type !== 8 && row?.scheme_details?.scheme_type !== 9) && (
                <>
                  <th className="px-4 py-2 text-left">Metal Rate</th>
                  <th className="px-4 py-2 text-left">Metal Weight</th>
                  <th className="px-4 py-2 text-left">Total Weight</th>
                </>
              )}
            </tr>

          </thead>
          <tbody>
            {paymentData.length > 0 ? (
              paymentData.map((row, index) => (
                <tr
                  key={row?._id}
                  className={`border-b cursor-pointer ${selectedRows.includes(row?._id) ? 'bg-blue-100' : ''}`}
                  onClick={() => handleRowClick(row?._id)}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      onChange={() => handleRowSelect(row?._id)}
                      checked={selectedRows.includes(row?._id)}
                      className="form-checkbox"
                    />
                  </td>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{row?.date_payment}</td>
                  <td className="px-4 py-2">{row?.payment_receipt}</td>
                  {row?.scheme_details?.scheme_type === 0 || row?.scheme_details?.scheme_type === 1 || row?.scheme_details?.scheme_type === 4 || row?.scheme_details?.scheme_type === 7 || row?.scheme_details?.scheme_type === 8 || row?.scheme_details?.scheme_type === 9 ? (
                    <>
                      <td className="px-4 py-2">{row?.total_amt}</td>
                      <td className="px-4 py-2">{row?.total_amt}</td>
                    </>
                  ) : (
                    <td className="px-4 py-2">{row?.total_amt}</td>
                  )}
                  {row?.scheme_details?.scheme_type !== 0 && row?.scheme_details?.scheme_type !== 1 && row?.scheme_details?.scheme_type !== 4 && row?.scheme_details?.scheme_type !== 7 && row?.scheme_details?.scheme_type !== 8 && row?.scheme_details?.scheme_type !== 9 && (
                    <>
                      <td className="px-4 py-2">{row?.metal_rate}</td>
                      <td className="px-4 py-2">{row?.metal_weight}</td>
                      <td className="px-4 py-2">{totalWeight}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-2">No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CardPrint;
