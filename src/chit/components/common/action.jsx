import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import More from "../../../assets/more.svg";
import { useSelector } from 'react-redux';

// Custom hook for detecting clicks outside
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

function Action({ row, data, rowIndex, activeDropdown, setActive, handleEdit, handleDelete=false,showDelete=true, handleView = null, showEdit = true ,cancel=true}) {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Use the outside click hook
  useOutsideClick([dropdownRef, buttonRef], () => {
    if (activeDropdown === row?._id) {
      setActive(null);
    }
  });
  const roledata = useSelector((state) => state.clientForm.roledata);
  

  const calculatePosition = () => {
    if (activeDropdown === row?._id && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const adjustedLeft = Math.min(
        rect.left + window.scrollX,
        window.innerWidth - 150
      );

      setPosition({
        top: rect.top + window.scrollY + rect.height + 3,
        left: adjustedLeft,
      });
    }
  };

  useEffect(() => {
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [activeDropdown]);

  return (
    <>
      <div className="dropdown-container relative flex items-center">
        <button
          ref={buttonRef}
          className="p-2 border hover:bg-gray-100 rounded-full flex justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setActive(activeDropdown === row?._id ? null : row?._id);
          }}
        >
          <img src={More} alt="" className='w-[20px] h-[20px]' />
        </button>
      </div>

      {activeDropdown === row?._id &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 9999,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
            }}
          >
            <div className="w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ">
              <div className="py-1">
                {handleView && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#E7EEF5] flex items-center gap-2"
                    onClick={() => {
                      handleView(row._id);
                      setActive(null);
                    }}
                  >
                    View
                  </button>
                )}

                {showEdit && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#E7EEF5] flex items-center gap-2"
                    onClick={() => {
                      handleEdit(row._id);
                      setActive(null);
                    }}
                  >
                    Edit
                  </button>
                )}
                {(showDelete) && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#E7EEF5] flex items-center gap-2"
                    onClick={() => {
                      handleDelete(row._id);
                      setActive(null);
                    }}
                  >
                    Delete
                  </button>
                )}
                {cancel && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setActive(null)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Action;