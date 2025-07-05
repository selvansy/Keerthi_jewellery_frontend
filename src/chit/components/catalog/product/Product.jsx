import React, { useEffect, useState } from "react";
import Table from "../../common/Table";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getproductTable,
  deleteproduct,
  activateproduct,
} from "../../../api/Endpoints";

import { eventEmitter } from "../../../../utils/EventEmitter";
import { openModal } from "../../../../redux/modalSlice";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../../../components/common/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../../hooks/useDebounce";
import Action from "../../common/action";
import { Breadcrumb } from "../../common/breadCumbs/breadCumbs";
import ActiveDropdown from "../../common/ActiveDropdown";
import plus from "../../../../assets/plus.svg";

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
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null);

  //mutation to get getproductData
  const { mutate: getproductData } = useMutation({
    mutationFn: (payload) => getproductTable(payload),
    onSuccess: (response) => {
      setisLoading(false);
      setSearchLoading(false);
      setproductData(response.data);
      setTotalDocuments(response.totalDocument);
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
      active: activeFilter,
    });
  }, [currentPage, itemsPerPage, debouncedSearch, activeFilter]);

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
    const handleDelete = (id) => {
      deleteProduct(id);
    };

    eventEmitter.on("CONFIRMATION_SUBMIT", handleDelete);

    return () => {
      eventEmitter.off("CONFIRMATION_SUBMIT", handleDelete);
    };
  }, []);

  const { mutate: deleteProduct } = useMutation({
    mutationFn: ({ productId }) => deleteproduct(productId),
    onSuccess: (response) => {
      toast.success(response.message);
      getproductData({
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
      });

      setDeleteId(null);
      eventEmitter.off("CONFIRMATION_SUBMIT");
    },
    onError: (error) => {
      setDeleteId(null);
      eventEmitter.off("CONFIRMATION_SUBMIT");
    },
  });

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
        return row.metalName;
      },
    },
    {
      header: "Purity Name",
      cell: (row) => {
        return row.purityName;
      },
    },
    {
      header: "Weight",
      cell: (row) => row?.weight,
    },
    {
      header: "Branch",
      cell: (row) => row?.branchName,
    },
    {
      header: "Image",
      cell: (row) => (
        <div className="w-12 h-12 rounded overflow-hidden">
          <img
            src={`${row.pathurl}${row.product_image[0]}`}
            alt={row?.branchName || "Preview"}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      header: "Create Date",
      cell: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-GB");
      },
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
            className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4 ring-1 ring-[#E7EEF5] p-[2px] after:duration-300 after:bg-[#004181] ${
              row?.active === true
                ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
                : "peer-checked:bg-[#E7EEF5] peer-checked:ring-gray-400"
            } after:rounded-full after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-checked:after:bg-[${layout_color}] peer-hover:after:scale-95`}
          ></div>
        </label>
      ),
    },
    {
      header: "Actions",
      cell: (row, rowIndex) => (
        <Action
          row={row}
          data={productData}
          rowIndex={rowIndex}
          activeDropdown={activeDropdown}
          setActive={hanldeActiveDropDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
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
    <>
      <Breadcrumb
        items={[{ label: "Catelogue" }, { label: "Product", active: true }]}
      />
      <div className="flex flex-col p-4 bg-white border border-[#F2F2F9]  rounded-[16px] ">
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="relative w-full  sm:mb-0 sm:order-2 sm:w-auto">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <Search className="text-[#6C7086] h-5 w-5" />
              )}
            </div>
            <input
              onChange={handleSearch}
              placeholder="Search"
              className="px-4 py-2 ps-9 border-2 border-[#F2F2F9] text-md rounded-[8px] w-full h-[36px] sm:w-[228px]"
            />
          </div>

          <div className="flex flex-row w-full sm:order-1 sm:w-auto sm:mr-auto">
            <div className="w-1/2 sm:w-auto me-1">
              <ActiveDropdown setActiveFilter={setActiveFilter} />
            </div>

            <div className="w-1/2 sm:hidden">
              <button
                className="rounded-md px-4 py-2 text-white whitespace-nowrap hover:bg-[#034571] transition-colors w-full"
                onClick={handleClick}
                style={{ backgroundColor: layout_color }}
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="hidden sm:block sm:order-3">
            <button
              className="flex rounded-lg px-[20px] py-[8px] text-sm font-semibold text-white items-center whitespace-nowrap hover:bg-[#034571] transition-colors sm:w-auto"
              onClick={handleClick}
              style={{ backgroundColor: layout_color }}
            >
               <img src={plus} alt="plus" className="w-4 h-4 me-[10px]" />
               Add Product
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={productData}
            currentPage={currentPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
            handlePageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalDocuments}
            columns={columns}
            loading={isLoading}
          />
        </div>

        <Modal />
      </div>
    </>
  );
};

export default Product;
