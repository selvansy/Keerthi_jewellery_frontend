import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getproductTable,
  getallbranch,
  getBranchById,
  deleteproduct,
  activateproduct,
  puritybymetal,
  showtype,
  displayselltype,
  getallmetal,
  categorybymetalid,
  schemepaymenttodayrate,
} from "../../../api/Endpoints";

import { eventEmitter } from "../../../../utils/EventEmitter";
import { openModal } from "../../../../redux/modalSlice";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../../../components/common/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../../hooks/useDebounce";
import Action from "../../common/action";

const Product = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(true);

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const roledata = useSelector((state) => state.clientForm.roledata);
  const id_branch = roledata?.branch;

  const [productData, setproductData] = useState([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalDocuments,setTotalDocuments]=useState(0)

  //mutation to get getproductData
  const { mutate: getproductData } = useMutation({
    mutationFn: (payload) => getproductTable(payload),
    onSuccess: (response) => {
      setisLoading(false);
      setSearchLoading(false);
      setproductData(response.data);
      setTotalDocuments(response.totalDocument)
      setTotalPages(response.data.totalPages);
    },
    onError: (error) => {
      setSearchLoading(false);
      setproductData([]);
      console.error("Error:", error);
      setisLoading(false);
    },
  });

  useEffect(() => {
    getproductData({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      id_branch: id_branch,
    });
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearch(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/catalog/addproduct");
  };

  const handleStatusToggle = async (id) => {
    let response = await activateproduct(id);
    if (response) {
      setproductData((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, active: !cat.active } : cat
        )
      );
      toast.success(response.message);
    }
  };

  const handleDelete = (id) => {
    setActiveDropdown(null);
    dispatch(
      openModal({
        modalType: "CONFIRMATION",
        header: "Delete Scheme",
        formData: {
          message: "Are you sure you want to delete?",
          productId: id,
        },
        buttons: {
          cancel: {
            text: "Cancel",
          },
          submit: {
            text: "Delete",
          },
        },
      })
    );
  };

  useEffect(() => {
    eventEmitter.on("CONFIRMATION_SUBMIT", async (data) => {
      try {
        let response = await deleteproduct(data.productId);
        console.log(response);
        if (response.message == "Product deleted successfully") {
          toast.success(response.message);
          setproductData((prev) =>
            prev.filter((pro) => pro._id !== data.productId)
          );
        } else {
          toast.error(
            "Something went wrong while deleting the product. Please try again later."
          );
        }
      } catch (error) {
        toast.error(
          "Something went wrong while deleting the product. Please try again later."
        );

        console.error("Error:", error);
      }
    });
    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT");
    };
  }, [eventEmitter]);

  const handleEdit = (id) => {
    navigate(`/catalog/editproduct/${id}`);
  };

  const columns = [
    {
      header: "S.No",
      cell: (_, index) => index + 1 + (currentPage - 1) * itemsPerPage,
    },
    {
      header: "Product Name",
      cell: (row) => row?.product_name,
    },
    {
      header: "Metal Name",
      cell: (row) => {
        return row.id_metal.metal_name;
      },
    },
    {
      header: "Purity Name",
      cell: (row) => {
        return row.id_purity.purity_name;
      },
    },
    {
      header: "Description",
      cell: (row) => row?.description,
    },
    {
      header: "Weight",
      cell: (row) => row?.weight,
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      header: "Branch",
      cell: (row) => row?.id_branch.branch_name,
    },
    {
      header: "Active",
      accessor: "active",
      cell: (row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row?.active === true}
            onChange={() => handleStatusToggle(row?._id)}
          />
          <div
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-black p-[2px] after:duration-300 after:bg-black ${
              row?.active === true
                ? "peer-checked:bg-[#61A375] peer-checked:ring-[#61A375]"
                : "peer-checked:bg-gray-400 peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-white peer-hover:after:scale-95`}
          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action row={row} data={productData} rowIndex={rowIndex} activeDropdown={activeDropdown} setActive={hanldeActiveDropDown}  handleEdit={handleEdit} handleDelete={handleDelete}/>
      ),
      sticky: "right",
    },
  ];

  const hanldeActiveDropDown = (data) => {
    setActiveDropdown(data);
  };


  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl text-[#023453] font-bold">Product</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4">
        <div className="relative w-full lg:w-1/3 min-w-[200px]">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {searchLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
            ) : (
              <Search className="text-gray-500" />
            )}
          </div>
          <input
            placeholder="Search..."
            className="p-3 pl-10 pr-3 border-2 bg-[#F5F5F5] border-gray-500 rounded-md w-full"
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <button
            type="button"
            className=" rounded-md px-4 py-2 text-white whitespace-nowrap flex-shrink-0 hover:bg-[#034571] transition-colors"
            onClick={handleClick}
            style={{ backgroundColor: layout_color }}
          >
            + Create product
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table data={productData} currentPage={currentPage} handleItemsPerPageChange={handleItemsPerPageChange} handlePageChange={handlePageChange}  itemsPerPage={itemsPerPage} totalItems={totalDocuments} columns={columns} loading={isLoading} />
      </div>
   

      <Modal />
    </div>
  );
};

export default Product;
