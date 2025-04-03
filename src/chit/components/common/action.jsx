import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
      <div ref={dropdownRef} className="dropdown-container relative flex items-center">
        <button
          className="p-2 border-2 border-[#F2F2F9] hover:bg-gray-100 rounded-full text-center"
          onClick={(e) => {
            e.stopPropagation();
            setActive(activeDropdown === row?._id ? null : row?._id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 4a2 2 0 11-4 0 2 2 0 014 0zM10 10a2 2 0 11-4 0 2 2 0 014 0zM10 16a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

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
            <div className="w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
