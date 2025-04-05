import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import More from "../../../assets/more.svg"

function Action({ row, data, rowIndex, activeDropdown, setActive, handleEdit, handleDelete, handleView = null, showEdit = true }) {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const calculatePosition = () => {
    if (activeDropdown === row?._id && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();

      const adjustedLeft = Math.min(
        rect.left + window.scrollX,
        window.innerWidth - 150
      );

      setPosition({
        top: rect.top + window.scrollY + 3,
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
      <div ref={dropdownRef} className="dropdown-container relative flex items-center ">
        <button
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
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              zIndex: 9999,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
            }}
          >
            <div className="w-32 rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {handleView && (

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleView(row._id)
                      setActive(null)
                    }}
                  >
                    View
                  </button>
                )}

                {showEdit && (
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      handleEdit(row._id)
                      setActive(null)
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => handleDelete(row._id)}
                >
                  Delete
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => setActive(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Action;
