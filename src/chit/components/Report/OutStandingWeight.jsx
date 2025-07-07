import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import { useMutation } from '@tanstack/react-query'
import {
    getbranchbyclient,getallbranchclassification, getallScheme,getallbranch,
    getallmetal, puritybymetal, allinstallmenttype, wastagetype,getallschemetypes, addscheme
} from "../../../chit/api/Endpoints";

import {OutstandingTable} from "../common/OutStandingReport"
import {OutStandingFilter} from "../common/OutStandingReport"
// import {  todayMetalRate } from "../SuperAdmin/Dashboard/dasApi"
import { useDispatch, useSelector } from 'react-redux';

export default function OutStandingWeight() { 
  
  const roledata = useSelector((state) => state.clientForm.roledata);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  const id_role = roledata?.id_role;
  const id_client = roledata?.id_client;
  const id_branch  = roledata?.id_branch;


    const [accsumm, setaccsumm] = useState([])
    const [accExp, setaccExp] = useState([]);
    let [metalRate, setMetalRate] = useState({})
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
     const date = new Date();
      const todayDate = date.toISOString();
    
   useEffect(() => {
    let payload = {
        todayDate:todayDate,
        id: id_branch
      }
        getTodaysMetalRate(payload)
    }, [id_branch])
    
   
     //mutation to get scheme type
     const { mutate: getSchemes } = useMutation({
        mutationFn: getallScheme,
        onSuccess: (response) => {
           
            setaccsumm(response.data)
      

            let arrayData = [];

            if (response.data.length !== 0) {

                for (const i in response.data) {
                    arrayData.push({
                        scheme_name: response.data[i].scheme_name,
                        code: response.data[i].code,
                        open: response.data[i].total_open,
                        close: response.data[i].total_close,
                        complete: response.data[i].total_complete,
                        total: response.data[i].total_account
                    });
                }

            }


            setaccExp(arrayData)

        },
        onError: (error) => {
            console.error('Error fetching countries:', error);
        }
    });


      const { mutate: getTodaysMetalRate } = useMutation({
        mutationFn: todayMetalRate,
        onSuccess: (response) => {
            
          setMetalRate(response.data)
    
        },
        onError: (error) => {
          console.error('Error:', error);
        }
      });
   
    return ( 
              <div className="flex flex-col p-4">
              <h2 className="text-2xl text-[#023453] font-bold">Outstanding Weight Summary Report</h2>

                 <OutStandingFilter 
                 accsumm={accsumm} 
                 accExp={accExp} 
                 getSchemes={getSchemes} 
                 currentPage={currentPage} 
                 itemsPerPage={itemsPerPage} />

                <Card metalRate={metalRate}/>

                 <OutstandingTable 
                 accsumm={accsumm} search={search} getSchemes={getSchemes}  currentPage={currentPage} 
                 itemsPerPage={itemsPerPage}/>
              </div>
    )
}



