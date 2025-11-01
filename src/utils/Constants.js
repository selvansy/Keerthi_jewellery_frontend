export const graceType = [
    {
        id:1,
        name:'Month Wise'
    },
    {
        id:2,
        name:'Week Wise'
    },
    {
        id:3,
        name:'Daily Wise'
    },
    {
        id:4,
        name:'Yearly'
    }
]

export const benefiMakingCharge = [
    {
        id:1,
        name:'Zero making charge'
    },
    {
        id:2,
        name:'Non zero making charge'
    }
]

export const rewardType = [
    {
        id:1,
        name:'Amount'
    },
    {
        id:2,
        name:'Percentage'
    }
]

export const bonusTypeOptions = [
    { id:1, value: "installment-wise", label: "Installment Wise" , code: 'Installment'},
    { id:2, value: "date-wise", label: "Date Wise" , code: 'Date'},
    { id:3, value: "amount-wise", label: "Amount Wise" , code: "Amount"},
  ];

export const entryTypeOptions = [
    { id:1, value: "individual", label: "Individual" },
    { id:2, value: "range", label: "Range" },
  ];


// export const sections = [
//       { id: 1, name: "Terms & Conditions" },
//       { id: 2, name: "Privacy Policy" },
//       { id: 4, name: "Refund Policy" }
//   ];

export  function spliceDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(num * factor) / factor;
}

export const commissionTriggerType =[
    {id:1,name:"On Each Payment"},
    {id:2,name:"On First Payment"},
]

export const referralCommissionType=[
    {id:1,name:"Percentage Of Payment"},
    {id:2,name:"Fixed Amount"}
]