export const schemeColumns = (currentPage, itemsPerPage) => [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Customer name and Mobile",
      cell: (row) => row?.customerName,
    },
    {
        header: "Scheme Accounter Name",
        cell: (row) => `${row?.accounter_fname} ${row?.accounter_lname}`,
      },      
    {
      header: "Scheme Acc No",
      cell: (row) => row?.schemeAccNumber,
    },
    {
      header: "Paid Installments",
      cell: (row) => row?.paidInstallments,
    },
    {
      header: "Start Date",
      cell: (row) => row?.startDate,
    },
    {
      header: "Maturity Date",
      cell: (row) => row?.maturityDate,
    },
    {
      header: "Overdues ",
      cell: (row) => row?.due_months,
    },
  ];
  