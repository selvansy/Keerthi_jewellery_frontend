// import React from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

// const PrintPassbook = ({ paymentData, selectedIds,schemeType }) => {
//   const layout_color = useSelector((state) => state.clientForm.layoutColor);
//       const schemeTypeNo=[2,6,5,3,4,12,10,14]
//   const ROWS_PER_PAGE = 12; // 13 rows per page

//  const handlePrint = () => {
//   if (!selectedIds || selectedIds.length < 1) {
//     return toast.error("Please select at least one row to print");
//   }

//   const showWeight = schemeTypeNo.includes(schemeType);

//   const selectedPayments = paymentData
//     .filter(payment => selectedIds.includes(payment._id))
//     .sort((a, b) => a.index - b.index);

//   const pages = [];
//   let pageRows = [];

//   selectedPayments.forEach((payment, index) => {
//     const rowHTML = `
//       <div style="
//         width: 100%;
//         height: 0.8cm;
//         font-size: 9px;
//         display: flex;
//         align-items: center;
//       ">
//         <div style="width: 10%; padding-left:4px; text-align: center;">${payment.index}</div>
//         <div style="width: 18%; padding-left:4px;">${payment.metal_rate}</div>
//         ${showWeight ? `<div style="width: 18%; padding-left:4px;">${payment.metal_weight}</div>` : ""}
//         <div style="width: 20%; padding-left:4px;">${new Date(payment.createdAt).toLocaleDateString()}</div>
//         <div style="width: 17%; padding-right:4px; text-align: right;">${payment.payment_amount.toFixed(2)}</div>
//         <div style="width: 17%; padding-right:4px; text-align: center;">${payment.payment_receipt}</div>
//       </div>
//     `;

//     pageRows.push(rowHTML);

//     if (pageRows.length === ROWS_PER_PAGE || index === selectedPayments.length - 1) {
//       pages.push(`
//         <div class="passbook-page">
//           ${pageRows.join("")}
//         </div>
//       `);
//       pageRows = [];
//     }
//   });

//   const printWindow = window.open("", "_blank");
//   printWindow.document.write(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Print Passbook</title>
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
//           body {
//             margin: 0;
//             padding: 0;
//             background: white;
//           }
//           .passbook-page {
//             width: 16cm;
//             height: auto;
//             padding: 0;
//             margin: 0;
//             background: white;
//             box-sizing: border-box;
//             page-break-after: always;
//           }
//           .passbook-page:last-child {
//             page-break-after: avoid;
//           }
//           @media print {
//             @page {
//               margin: 0;
//               size: auto;
//             }
//             body {
//               -webkit-print-color-adjust: exact;
//               print-color-adjust: exact;
//             }
//             .passbook-page {
//               margin: 0;
//               page-break-after: always;
//             }
//             .passbook-page:last-child {
//               page-break-after: avoid;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         ${pages.join("")}
//         <script>
//           window.onload = function() {
//             // Send form feed command to advance printer
//             document.body.insertAdjacentHTML('afterbegin', '\\f');
//           };
//         </script>
//       </body>
//     </html>
//   `);

//   printWindow.document.close();
//   setTimeout(() => {
//     printWindow.print();
//     printWindow.close();
//   }, 250);
// };

//   return (
//     <button
//       onClick={handlePrint}
//       style={{ backgroundColor: layout_color }}
//       className="px-4 py-2 rounded text-white"
//     >
//       Print Passbook
//     </button>
//   );
// };

// export default PrintPassbook;

// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { spliceDecimals } from "../../../../utils/Constants";

// const PrintPassbook = ({ paymentData, selectedIds, schemeType }) => {
//   const layout_color = useSelector((state) => state.clientForm.layoutColor);
//   const schemeTypeNo = [2, 6, 5, 3, 4, 12, 10, 14];

//   const ROWS_FIRST_HALF = 10;
//   const ROWS_SECOND_HALF = 10;
//   const TOTAL_ROWS_PER_SHEET = ROWS_FIRST_HALF + ROWS_SECOND_HALF;

//   const handlePrint = () => {
//     if (!selectedIds || selectedIds.length < 1) {
//       return toast.error("Please select at least one row to print");
//     }

//     const showWeight = schemeTypeNo.includes(schemeType);

//     const selectedPayments = paymentData
//       .filter((payment) => selectedIds.includes(payment._id))
//       .sort((a, b) => a.index - b.index);

//     if (selectedPayments.length === 0) {
//       return toast.info("No valid rows to print");
//     }

//     const firstIndex = selectedPayments[0].index;
//     const startPosition = (firstIndex - 1) % TOTAL_ROWS_PER_SHEET;
//     const startsInTopHalf = startPosition < ROWS_FIRST_HALF;

//     const pages = [];
//     let currentPaymentIndex = 0;

//     if (startPosition > 0) {

//       const firstSheetPayments = [];

//       for (let i = 0; i < startPosition; i++) {
//         firstSheetPayments.push(null);
//       }

//       while (
//         firstSheetPayments.length < TOTAL_ROWS_PER_SHEET &&
//         currentPaymentIndex < selectedPayments.length
//       ) {
//         firstSheetPayments.push(selectedPayments[currentPaymentIndex]);
//         currentPaymentIndex++;
//       }

//       const topRows = firstSheetPayments.slice(0, ROWS_FIRST_HALF);
//       const bottomRows = firstSheetPayments.slice(ROWS_FIRST_HALF);

//       pages.push(createSheet(topRows, bottomRows, showWeight, startsInTopHalf));
//     }

//     while (currentPaymentIndex < selectedPayments.length) {
//       const sheetPayments = selectedPayments.slice(
//         currentPaymentIndex,
//         currentPaymentIndex + TOTAL_ROWS_PER_SHEET
//       );

//       const topRows = sheetPayments.slice(0, ROWS_FIRST_HALF);
//       const bottomRows = sheetPayments.slice(ROWS_FIRST_HALF);

//       pages.push(createSheet(topRows, bottomRows, showWeight, true));

//       currentPaymentIndex += TOTAL_ROWS_PER_SHEET;
//     }

//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
// <!DOCTYPE html>
// <html>
// <head>
// <title>Print Passbook</title>
// <style>
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   body {
//     background: white;
//     margin: 0;
//     padding: 0;
//     -webkit-print-color-adjust: exact;
//     print-color-adjust: exact;
//   }

//   .passbook-sheet {
//     width: 29.7cm;
//     height: 21cm;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
//     page-break-after: always;
//     padding: 0.5cm 0.8cm;
//     margin: 0;
//   }

//   .passbook-half {
//     width: 100%;
//     height: 50%;
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//   }

//   .header {
//     font-weight: bold;
//     font-size: 14px;
//     display: flex;
//     border-bottom: 0.5px solid #000;
//     margin-bottom: 2px;
//     padding-bottom: 2px;
//   }

//   .top-half {
//     padding-bottom: 0.2cm;
//   }

//   .bottom-half {
//     margin-top: 0.2cm;
//   }

//   .empty-row {
//     visibility: hidden;
//   }

//   @page {
//             size: 18cm 9cm landscape;
//             margin: 0;
//           }

//   @media print {
//     body {
//       margin: 0;
//       padding: 0;
//     }
//       @page {

//             margin: 0;
//           }

//     .passbook-sheet {
//       width: 29.7cm;
//       height: 21cm;
//       margin: 0;
//       padding: 0.5cm 0.8cm;
//     }
//   }
// </style>
// </head>
// <body>
// ${pages.join("")}
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 300);
//   };
// const createSheet = (topRows, bottomRows, showWeight, showTopHeader) => {
//   const createRows = (rows) =>
//     rows
//       .map((payment) => {
//         if (!payment) {
//           return `
//             <div class="empty-row" style="
//               width: 100%;
//               height: 0.9cm;
//               font-size: 11px;
//               display: flex;
//               align-items: center;
//             ">
//               ${Array.from({ length: 6 })
//                 .map(
//                   () =>
//                     `<div style="width: 16.66%; text-align: center;">&nbsp;</div>`
//                 )
//                 .join("")}
//             </div>
//           `;
//         }

//        return `
//   <div style="
//     width: 100%;
//     height: 0.9cm;
//     font-size: 14px;
//     display: flex;
//     align-items: center;
//     font-weight: bold;
//   ">
//     <div style="flex: 1; text-align: left; margin-left:20px">${payment.index}</div>
//     <div style="flex: 1; text-align: left;">${payment.metal_rate}</div>
//     ${
//       showWeight
//         ? `<div style="flex: 1; text-align: left;">${spliceDecimals(payment.metal_weight,3)}</div>`
//         : `<div style="display:hidden;">&nbsp;</div>`
//     }
//     <div style="flex: 1; text-align: left;">${new Date(
//       payment.createdAt
//     ).toLocaleDateString()}</div>
//     <div style="flex: 1; text-align: left;">${spliceDecimals(payment.payment_amount,2)}</div>
//     ${
//      showWeight
//        ? `<div style="flex: 1; text-align: left;">${spliceDecimals(payment.accWeight,3)}</div>`
//        : `<div style="display:hidden;">&nbsp;</div>`
//    }
//     <div style="flex: 1; text-align: left;">${payment.payment_receipt}</div>
//   </div>
// `;
//   })
//       .join("");

//   const topHalf = `
//    <div class="passbook-half top-half">
//   ${
//     showTopHeader
//       ? `
//       <div class="header" style="
//         display: flex;
//         align-items: center;
//         font-weight: bold;
//         font-size: 14px;
//       ">
//         <div style="flex: 1; text-align: left; margin-left:15px">Installment</div>
//         <div style="flex: 1; text-align: left;">Metal Rate</div>
//         ${
//           showWeight
//             ? `<div style="flex: 1; text-align: left;">Weight</div>`
//             : `<div style="display:hidden;">&nbsp;</div>`
//         }

//         <div style="flex: 1; text-align: left;">Date</div>
//         <div style="flex: 1; text-align: left;">Amount</div>
//         ${
//           showWeight
//             ? `<div style="flex: 1; text-align: left;">Acc. Weight</div>`
//             : `<div style="display:hidden;">&nbsp;</div>`
//         }
//         <div style="flex: 1; text-align: left;">Receipt</div>
//       </div>
//       `
//       : ""
//   }
//   ${createRows(topRows)}
// </div>`

//   const bottomHalf = `
//     <div class="passbook-half bottom-half">
//       ${createRows(bottomRows)}
//     </div>`;

//   return `
//     <div class="passbook-sheet">
//       ${topHalf}
//       ${bottomHalf}
//     </div>
//   `;
// };

//   return (
//     <button
//       onClick={handlePrint}
//       style={{ backgroundColor: layout_color }}
//       className="px-4 py-2 rounded text-white"
//     >
//       Print Passbook
//     </button>
//   );
// };

// export default PrintPassbook;

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import { spliceDecimals } from "../../../../utils/Constants";

const PrintPassbook = ({ paymentData, selectedIds, schemeType }) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const schemeTypeNo = [2, 6, 5, 3, 4, 12, 10, 14];

  const ROWS_FIRST_HALF = 11;

  const ROWS_SECOND_HALF = 11;

  const TOTAL_ROWS_PER_SHEET = ROWS_FIRST_HALF + ROWS_SECOND_HALF;

  const handlePrint = () => {
    if (!selectedIds || selectedIds.length < 1) {
      return toast.error("Please select at least one row to print");
    }

    const showWeight = schemeTypeNo.includes(schemeType);

    const selectedPayments = paymentData

      .filter((payment) => selectedIds.includes(payment._id))

      .sort((a, b) => a.index - b.index);

    if (selectedPayments.length === 0) {
      return toast.info("No valid rows to print");
    }

    const firstIndex = selectedPayments[0].index;

    const startPosition = (firstIndex - 1) % TOTAL_ROWS_PER_SHEET;

    const startsInTopHalf = startPosition < ROWS_FIRST_HALF;

    const pages = [];

    let currentPaymentIndex = 0;

    // ✅ If startPosition === 0, we start at top of a new passbook page

    // so we show header; otherwise, we skip header

    let isFirstHeaderPrinted = startPosition > 0;

    if (startPosition > 0) {
      const firstSheetPayments = [];

      for (let i = 0; i < startPosition; i++) {
        firstSheetPayments.push(null);
      }

      while (
        firstSheetPayments.length < TOTAL_ROWS_PER_SHEET &&
        currentPaymentIndex < selectedPayments.length
      ) {
        firstSheetPayments.push(selectedPayments[currentPaymentIndex]);
        currentPaymentIndex++;
      }

      const topRows = firstSheetPayments.slice(0, ROWS_FIRST_HALF);
      const bottomRows = firstSheetPayments.slice(ROWS_FIRST_HALF);

      // ❌ Old
      // pages.push(createSheet(topRows, bottomRows, showWeight, !isFirstHeaderPrinted));
      // ✅ New
      pages.push(createSheet(topRows, bottomRows, showWeight, false));

      isFirstHeaderPrinted = true; // mark header printed
    }

    while (currentPaymentIndex < selectedPayments.length) {
      const sheetPayments = selectedPayments.slice(
        currentPaymentIndex,
        currentPaymentIndex + TOTAL_ROWS_PER_SHEET
      );

      const topRows = sheetPayments.slice(0, ROWS_FIRST_HALF);
      const bottomRows = sheetPayments.slice(ROWS_FIRST_HALF);

      // ✅ Always show header for every new full page
      pages.push(createSheet(topRows, bottomRows, showWeight, true));

      currentPaymentIndex += TOTAL_ROWS_PER_SHEET;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Print Passbook</title>
<style>

  * {

    margin: 0;

    padding: 0;

    box-sizing: border-box;

  }
 
  body {

    background: white;

    margin: 0;

    padding: 0;

    -webkit-print-color-adjust: exact;

    print-color-adjust: exact;

  }
 
  .passbook-sheet {

    width: 29.7cm;

    height: 21cm;

    display: flex;

    flex-direction: column;

    justify-content: space-between;

    page-break-after: always;

    padding: 0.5cm 0.8cm;

    margin: 0;

  }
 
  .passbook-half {

    width: 100%;

    height: 50%;

    display: flex;

    flex-direction: column;

    justify-content: flex-start;

  }
 
  .header {

    font-weight: bold;

    font-size: 14px;

    display: flex;

    border-bottom: 0.5px solid #000;

    margin-bottom: 2px;

    padding-bottom: 2px;

  }
 
  .top-half {

    padding-bottom: 0.2cm;

  }
 
  .bottom-half {

    margin-top: 0.2cm;

  }
 
  .empty-row {

    visibility: hidden;

  }
 
  @page {

    size: 18cm 9cm landscape;

    margin: 0;

  }
 
  @media print {

    body {

      margin: 0;

      padding: 0;

    }

    @page {

      margin: 0;

    }
 
    .passbook-sheet {

      width: 29.7cm;

      height: 21cm;

      margin: 0;

      padding: 0.5cm 0.8cm;

    }

  }
</style>
</head>
<body>

${pages.join("")}
</body>
</html>

    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();

      printWindow.close();
    }, 300);
  };

  const createSheet = (topRows, bottomRows, showWeight, showTopHeader) => {
    const createRows = (rows) =>
      rows

        .map((payment) => {
          if (!payment) {
            return `
<div class="empty-row" style="

                width: 100%;

                height: 0.9cm;

                font-size: 11px;

                display: flex;

                align-items: center;

              ">

                ${Array.from({ length: 6 })

                  .map(
                    () =>
                      `<div style="width: 16.66%; text-align: center;">&nbsp;</div>`
                  )

                  .join("")}
</div>

            `;
          }

 return `
<div style="
    width: 100%;
    height: 0.9cm;
    font-size: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 1px;
    font-weight: bold;
    
  ">
  <div style="flex: 1; text-align: left; margin-left:20px">${payment.index}</div>
  <div style="flex: 1; text-align: left;">${payment.metal_rate}</div>

  ${
    showWeight
      ? `<div style="flex: 1; text-align: left;">${spliceDecimals(payment.metal_weight, 3)}</div>`
      : `<div style="display:hidden;">&nbsp;</div>`
  }

  <div style="flex: 1; text-align: left;">${new Date(payment.createdAt).toLocaleDateString()}</div>
  <div style="flex: 1; text-align: left;">${spliceDecimals(payment.payment_amount, 2)}</div>

  ${
    showWeight
      ? `<div style="flex: 1; text-align: left;">${spliceDecimals(payment.accWeight, 3)}</div>`
      : `<div style="display:hidden;">&nbsp;</div>`
  }

  <div style="flex: 1; text-align: left;">${payment.payment_receipt}</div>
</div>
`;

        })

        .join("");

const topHalf = `
<div class="passbook-half top-half">
  ${
    showTopHeader
      ? `
<div class="header" style="
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 15px;
      ">
  <div style="flex: 1; text-align: left; margin-left:15px">Installment</div>
  <div style="flex: 1; text-align: left;">Metal Rate</div>
  ${
    showWeight
      ? `<div style="flex: 1; text-align: left;">Weight</div>`
      : `<div style="display:hidden;">&nbsp;</div>`
  } 
  <div style="flex: 1; text-align: left;">Date</div>
  <div style="flex: 1; text-align: left;">Amount</div>
  ${
    showWeight
      ? `<div style="flex: 1; text-align: left;">Acc. Weight</div>`
      : `<div style="display:hidden;">&nbsp;</div>`
  }
  <div style="flex: 1; text-align: left;">Receipt</div>
</div>
      `
      : `
<div style="
  height: 0.9cm; 
"></div>
      `
  }

  ${createRows(topRows)}
</div>`;


    const bottomHalf = `
<div class="passbook-half bottom-half">

      ${createRows(bottomRows)}
</div>`;

    return `
<div class="passbook-sheet">

      ${topHalf}

      ${bottomHalf}
</div>

  `;
  };

  return (
    <button
      onClick={handlePrint}
      style={{ backgroundColor: layout_color }}
      className="px-4 py-2 rounded text-white"
    >
      Print Passbook
    </button>
  );
};

export default PrintPassbook;
