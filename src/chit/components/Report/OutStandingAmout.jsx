import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import { useMutation } from '@tanstack/react-query'
import {
    getbranchbyclient,getallbranchclassification, getallScheme,getallbranch,
    getallmetal, puritybymetal, allinstallmenttype, wastagetype,getallschemetypes, addscheme
} from "../../../chit/api/Endpoints";

import {OutstandingTable} from "../common/OutStandingReport"
import {OutStandingFilter} from "../common/OutStandingReport"

export default function OutStandingAmount() { 

 
    const [accsumm, setaccsumm] = useState([])
    const [accExp, setaccExp] = useState([]);
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
   
     //mutation to get scheme type
     const { mutate: getSchemes } = useMutation({
        mutationFn: getallScheme,
        onSuccess: (response) => {
           
            setaccsumm(response.data)
            let arrayData = [];

            if (response.data.length !== 0) {

                for (const i in response.data) {
                    arrayData.push({
                        scheme_name:response.data[i].scheme_name,
                        code:response.data[i].scheme_name,
                        open:response.data[i].scheme_name,
                        close:response.data[i].scheme_name,
                        complete:response.data[i].scheme_name,
                        total:response.data[i].scheme_name
                    });
                }

            }


            setaccExp(arrayData)

        },
        onError: (error) => {
            console.error('Error fetching countries:', error);
        }
    });

   
    return ( 
              <div className="flex flex-col p-4">
              <h2 className="text-2xl text-[#023453] font-bold">Outstanding Amount Summary Report</h2>

                 <OutStandingFilter 
                 accsumm={accsumm} 
                 accExp={accExp} 
                 getSchemes={getSchemes} 
                 currentPage={currentPage} 
                 itemsPerPage={itemsPerPage} />

                   <Card/>

                 <OutstandingTable 
                 accsumm={accsumm} search={search} getSchemes={getSchemes}  currentPage={currentPage} 
                 itemsPerPage={itemsPerPage}/>
              </div>
    )
}



