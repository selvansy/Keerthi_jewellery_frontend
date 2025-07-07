import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setScemeAccountId } from "../../../../redux/clientFormSlice"
import { getschemeaccountbyid } from '../../../api/Endpoints'
import Table from '../../common/Table'

function Ledgerdetails({ setIsOpen }) {
 const layout_color = useSelector((state) => state.clientForm.layoutColor);
  let dispatch = useDispatch();
  const id = useSelector((state) => state.clientForm.id_scheme_account);
  
  const [ledgerData, setLedgerData] = useState([]);
  const [paymentdata, setpaymentdata] = useState([]);
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


  const getLedgerData = async (data) => {
    if (!data) return;
    const response = await getschemeaccountbyid({ id: data });
    if (response) {
      setLedgerData({
        id: response.data._id,
        id_scheme: response.data.id_scheme._id,
        scheme_type: response.data.id_scheme.scheme_type,
        scheme_name: response.data.id_scheme.scheme_name,
        total_installments: response.data.id_scheme.total_installments,
        min_amount: response.data.id_scheme.min_amount,
        max_amount: response.data.id_scheme.max_amount,
        min_weight: response.data.id_scheme.min_weight,
        max_weight: response.data.id_scheme.max_weight,
        amount: response.data.id_scheme.amount,
        id_customer: response.data.id_customer._id,
        scheme_acc_number: response.data.scheme_acc_number,
        start_date: response.data.start_date,
        total_paidamount: response.data.total_paidamount,
        total_paidinstallments: response.data.total_paidinstallments,
        total_weight: response.data.total_weight,
        bill_no: response.data.bill_no,
        bill_date: response.data.bill_date,
        id_classification: response.data.id_scheme.id_classification,
        id_branch: response.data.id_branch._id,
        account_name: response.data.account_name,
        address: response.data.id_customer.address,
        customer_name: response.data.id_customer.firstname + ' ' + response.data.id_customer.lastname,
        mobile: response.data.id_customer.mobile,
        maturity_date: response.data.maturity_date
      });
      setpaymentdata(response.data.paymentdata);
    } else {
      toast.error('Customer not created!');
    }
  };
  return (
    <div>

<div className="flex justify-center flex-col">
  {/* Ledger Details Section */}
  <div className="bg-[#f5f5dc] mb-2 p-3">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Customer Name</p>
        <p className="text-sm">{ledgerData?.customer_name || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Mobile Number</p>
        <p className="text-sm">{ledgerData?.mobile || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Scheme Type</p>
        <p className="text-sm">
          {
            ledgerData?.id_schme?.scheme_type === 1 ? "Amount End Weight" :
            ledgerData?.id_schme?.scheme_type === 2 ? "Amount To Weight" :
            ledgerData?.id_schme?.scheme_type === 3 ? "Weight" :
            ledgerData?.id_schme?.scheme_type === 4 ? "Flexible Amount To Bonus" :
            ledgerData?.id_schme?.scheme_type === 5 ? "Flexible Amount To Weight" :
            ledgerData?.id_schme?.scheme_type === 6 ? "Fixed Amount To Weight" :
            ledgerData?.id_schme?.scheme_type === 7 ? "Fixed Amount End Weight" :
            ledgerData?.id_schme?.scheme_type === 8 ? "Fixed Amount To Bonus" :
            ledgerData?.id_schme?.scheme_type === 9 ? "Flexible Amount End Weight" :
            ledgerData?.id_schme?.scheme_type === 10 ? "Digi Gold" : "Amount To Bonus"
          }
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Classification</p>
        <p className="text-sm">{ledgerData?.classification_name || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Scheme Name</p>
        <p className="text-sm">
          {(() => {
            if (ledgerData.scheme_type === 0 || ledgerData.scheme_type === 1 || ledgerData.scheme_type === 2) {
              return `${ledgerData.scheme_name} ( Rs. ${ledgerData.amount} )`;
            } else if (ledgerData.scheme_type === 4 || ledgerData.scheme_type === 6 || ledgerData.scheme_type === 7 || ledgerData.scheme_type === 8 || ledgerData.scheme_type === 9 || ledgerData.scheme_type === 10) {
              return `${ledgerData.scheme_name} ( Rs. ${ledgerData.min_amount} ) (${ledgerData.max_amount})`;
            } else if (ledgerData.scheme_type === 3) {
              return `${ledgerData.scheme_name} (${ledgerData.min_weight}) (${ledgerData.max_weight})`;
            } else {
              return `${ledgerData.scheme_name} ( Rs. ${ledgerData.payamount} )`;
            }
          })()}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Account No</p>
        <p className="text-sm">{ledgerData?.scheme_acc_number || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Account Name</p>
        <p className="text-sm">{ledgerData?.account_name || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Start Date</p>
        <p className="text-sm">{ledgerData?.start_date || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Bill No</p>
        <p className="text-sm">{ledgerData?.bill_no || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Bill Date</p>
        <p className="text-sm">{ledgerData?.bill_date || 'N/A'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Total Installment</p>
        <p className="text-sm">{ledgerData?.total_installments || '0'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Paid Installments</p>
        <p className="text-sm">{ledgerData?.total_paidinstallments || '0'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Paid Amount</p>
        <p className="text-sm">Rs. {ledgerData?.total_paidamount || '0'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Bonus</p>
        <p className="text-sm">Rs. {ledgerData?.total_paidamount || '0'}</p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700">Total Amount</p>
        <p className="text-sm">Rs. {ledgerData?.total_paidamount || '0'}</p>
      </div>
    </div>
  </div>

  {/* Payment Data Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors" style={{ backgroundColor: layout_color }}>
        <tr>
          <th className="px-4 py-2">SNo</th>
          <th className="px-4 py-2">Paid Inst</th>
          <th className="px-4 py-2">Paid Date</th>
          <th className="px-4 py-2">Receipt No</th>
          <th className="px-4 py-2">GST AMT</th>
          <th className="px-4 py-2">Fine AMT</th>
          <th className="px-4 py-2">Total AMT</th>
          <th className="px-4 py-2">ITR/UTR</th>
          <th className="px-4 py-2">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {paymentdata.map((payment, index) => {
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
          };

          return (
            <tr key={payment._id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{payment.paid_installments}</td>
              <td className="px-4 py-2">{formatDate(payment.date_payment)}</td>
              <td className="px-4 py-2">{payment.payment_receipt}</td>
              <td className="px-4 py-2">{payment.gst_amount}</td>
              <td className="px-4 py-2">{payment.fine_amount}</td>
              <td className="px-4 py-2">{payment.total_amt}</td>
              <td className="px-4 py-2">{payment.itr_utr || 'N/A'}</td>
              <td className="px-4 py-2">{payment.remark || 'N/A'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>



      <div className="bg-white p-2 border-t-2 border-gray-300 mt-4">
        <div className="flex justify-end gap-2 mt-3">

          <>
            <button
              className="bg-[#E2E8F0] text-black rounded-md p-2 w-full lg:w-20"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </>
        </div>
      </div>

    </div>
  );
}

export default Ledgerdetails;
