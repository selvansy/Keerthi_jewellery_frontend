import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

const usePagination = ({ currentPage}) => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
 

  return <>


    <div className="flex gap-2">
      <button
     
        className="p-2 w-10 h-10 rounded-md text-slate-300"
        style={{ backgroundColor: layout_color }}  >
        {currentPage}
      </button>
    </div>

  </>
};

export default usePagination;
