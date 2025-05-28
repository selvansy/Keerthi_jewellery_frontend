import React, { useEffect, useState } from "react";
import plus from "../../../../../assets/plus.svg";
import { paymentHistory } from "../../../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function PaymentHistory({ id_branch }) {
  const [paymentData, setPaymentData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const limit = 4;

  const { mutate: getPaymentData } = useMutation({
    mutationFn: ({ page, limit }) => paymentHistory({ page, limit, id_branch }),
    onSuccess: (response) => {
      const { data } = response;
      setPaymentData(data?.data || []);
      setTotalRecords(data?.total || 0);
      setisLoading(false);
    },
    onError: (error) => {
      setisLoading(false);
      console.error("Error fetching payment data:", error);
    },
  });

  useEffect(() => {
    setisLoading(true);
    getPaymentData({ page, limit });
  }, [page]);

  const totalPages = Math.ceil(totalRecords / limit);

  const navigate=useNavigate()
  return (
    <div>
      <div className="bg-white rounded-[16px] mt-6 text-[#232323]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Payment History</h2>
          <div className="flex items-center justify-center p-3 rounded-md cursor-pointer bg-[#004181]" onClick={()=>navigate('/payment/addschemepayment')}>
            <img src={plus} alt="plus" className="w-3 h-3" />
            <div className="text-white text-md font-sm px-2">Add Payment</div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-[#6C7086] border-b uppercase bg-[#E7EEF5]">
              <tr>
                <th className="px-6 py-3">S.no</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Scheme name</th>
                <th className="px-6 py-3">Paid Amount</th>
                <th className="px-6 py-3">Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((item, index) => (
                <tr key={item._id} className="bg-white border-b text-[#232323] hover:bg-gray-50 font-semibold">
                  <td className="px-6 py-4">{(page - 1) * limit + index + 1}</td>
                  <td className="px-6 py-4">{item?.id_customer?.firstname} {item?.id_customer?.lastname}</td>
                  <td className="px-6 py-4">{item?.id_scheme?.scheme_name}</td>
                  <td className="px-6 py-4">{item?.payment_amount}</td>
                  <td className="px-6 py-4">{new Date(item?.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
  <span className="text-sm text-gray-500">
    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalRecords)} of {totalRecords}
  </span>

  <div className="flex gap-2 items-center">
    <button
      onClick={() => page > 1 && setPage((prev) => prev - 1)}
      disabled={page === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Previous
    </button>

    {/* Page Numbers */}
    {totalPages > 1 && (
      <>
        {page > 2 && (
          <>
            <button onClick={() => setPage(1)} className="px-3 py-1 border rounded">
              1
            </button>
            {page > 3 && <span className="px-2">...</span>}
          </>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) =>
              p === page ||
              p === page - 1 ||
              p === page + 1
          )
          .map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 border rounded ${
                page === p ? "bg-blue-500 text-white" : ""
              }`}
            >
              {p}
            </button>
          ))}

        {page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && <span className="px-2">...</span>}
            <button onClick={() => setPage(totalPages)} className="px-3 py-1 border rounded">
              {totalPages}
            </button>
          </>
        )}
      </>
    )}

    <button
      onClick={() => page < totalPages && setPage((prev) => prev + 1)}
      disabled={page === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;
