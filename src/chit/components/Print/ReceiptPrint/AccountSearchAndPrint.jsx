import React, { useState, useEffect } from 'react'; 
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { searchaccountnumber } from '../../../api/Endpoints';
import { useSelector } from 'react-redux';
import SpinLoading from '../../common/spinLoading';

const AccountSearchAndPrint = () => {


  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [calculationdata, setcalculationData] = useState({});
  const [selectedRow, setSelectedRow] = useState(null); 
  const [accountNumber, setAccountNumber] = useState('');
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const { mutate: handleSearchAccountNumber } = useMutation({
    mutationFn: (data)=> searchaccountnumber(data),
    onSuccess: (response) => {
      if (response) {
        setPaymentData(response?.data);
        setcalculationData(response?.calculations);
        toast.success(response.message);
      }
      setIsLoading(false)
    },
    onError: (error) => {
      (setIsLoading(false))
      toast.error(error.message || 'Something went wrong');
    }
  });

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.toUpperCase(); 
    setAccountNumber(value);
  };

  const handleSearchSubmit = () => {
    if (!accountNumber.trim()) {
      toast.error('Please enter a valid account number');
      return;
    }
    setPaymentData([]); 
    setSelectedRow(null); 
    setIsLoading(true)
    handleSearchAccountNumber({mobile:mobile,acc_num:accountNumber });
  };

  const handlePrint = () => {
    if (!selectedRow) {
      toast.error('No row selected for printing.');
      return;
    }

    const selectedRowData = paymentData.find((data) => data._id === selectedRow);

    if (!selectedRowData) {
      toast.error('Selected row data not found.');
      return;
    }

    const complist = selectedRowData.branch_details;
    const scheme_details = selectedRowData.scheme_details;
    const city_details = selectedRowData.city_details;
    const customer_details = selectedRowData.customer_details;
    const schemeaccount_details = selectedRowData.scheme_account_details;

    let scheme_name = "";
    if (scheme_details?.scheme_type === 0 || scheme_details?.scheme_type === 1 || scheme_details?.scheme_type === 2) {
      scheme_name = `${scheme_details?.scheme_name} (₹. ${scheme_details?.amount})`;
    } else if (scheme_details?.scheme_type === 3) {
      scheme_name = `${scheme_details?.scheme_name} (${scheme_details?.min_weight} Grm - ${scheme_details?.max_weight} Grm)`;
    } else {
      scheme_name = `${scheme_details?.scheme_name} (₹${scheme_details?.min_amount} - ₹${scheme_details?.max_amount})`;
    }

    const str = `
      <div className="main_section">
        <div>
          <p className="meena_name">${complist?.branch_name}</p>
          <p className="address">${city_details?.city_name} ${complist?.pincode}.</p>
        </div>
        <div className="mt mt-5">
          <p className="chitreceipt">CHIT RECEIPT</p>
        </div>
        <div className="mt">
          <div className="details_count">
            <div className="details">
              <p className="details_list">Receipt No</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">RC${selectedRowData?.payment_receipt}</p>
          </div>
          <div className="details_count">
            <div className="details">
              <p className="details_list">Receipt Date</p>
              <p className="details_list">:</p>
            </div>
            <p className="details_list">${selectedRowData?.date_payment}</p>
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
            <p className="details_list">Rs.${selectedRowData?.total_amt}</p>
          </div>
        </div>

        <div className="amount_details">
          <div>
            <p className="paidamt">Total Installment</p>
            <p className="paidamt">${calculationdata?.total_paid_installments}/${schemeaccount_details?.total_installment}</p>
          </div>
          <div>
            <p className="paidamt">Total Amount</p>
            <p className="paidamt">${calculationdata?.total_paid_amount}</p>
          </div>
          ${scheme_details?.scheme_type !== 0 && scheme_details?.scheme_type !== 1 && scheme_details?.scheme_type !== 4 && scheme_details?.scheme_type !== 7 && scheme_details?.scheme_type !== 8 && scheme_details?.scheme_type !== 9 ? `
            <div>
              <p className="paidamt">Total Weight</p>
              <p className="paidamt">${calculationdata?.total_paid_weight}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;

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
}

    `;

    const newWin = window.open('', '', 'width=600,height=800');
    newWin.document.open();
    newWin.document.write(`
      <html>
        <body onload="window.print()">
          <head>
            <title>Chit Receipt</title>
            <style>${stylecss}</style>
          </head>
          ${str}
        </body>
      </html>
    `);
    newWin.document.close();

    setTimeout(() => { newWin.close(); }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Payment Receipt Print</h2>

      {/* Search Card */}
      <div className="flex justify-center mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">Search by Account Number</h3>

          {/* Search Input */}
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              className="px-4 py-2 border rounded-l-md w-full"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-6 py-2 text-white rounded-r-md hover:bg-blue-600"
              style={{ backgroundColor: layout_color }}
              disabled={isLoading}
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
        <i className="fa fa-print mr-2"></i> Print Selected Row
      </button>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Select</th>
              <th className="px-4 py-2 text-left">Installment</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Receipt No</th>
              {paymentData.some((row) => row?.scheme_details?.scheme_type === 0 || row?.scheme_details?.scheme_type === 1 || row?.scheme_details?.scheme_type === 4 || row?.scheme_details?.scheme_type === 7 || row?.scheme_details?.scheme_type === 8 || row?.scheme_details?.scheme_type === 9) && (
                <>
                  <th className="px-4 py-2 text-left">Paid Amount</th>
                  <th className="px-4 py-2 text-left">Total Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paymentData.map((data, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="radio"
                    name="selectedRow"
                    checked={selectedRow === data._id}
                    onChange={() => setSelectedRow(data._id)}
                  />
                </td>
                <td className="px-4 py-2">{data.scheme_details?.scheme_name}</td>
                <td className="px-4 py-2">{data.payment_date}</td>
                <td className="px-4 py-2">{data.payment_id}</td>
                {data?.scheme_details?.scheme_type === 0 || data?.scheme_details?.scheme_type === 1 || data?.scheme_details?.scheme_type === 4 || data?.scheme_details?.scheme_type === 7 || data?.scheme_details?.scheme_type === 8 || data?.scheme_details?.scheme_type === 9 ? (
                  <>
                    <td className="px-4 py-2">{data.scheme_details?.scheme_type}</td>
                    <td className="px-4 py-2">{data.payment_amount}</td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountSearchAndPrint;
