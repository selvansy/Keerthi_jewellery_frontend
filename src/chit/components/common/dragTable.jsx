import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export default function DraggableTable({ data = [], columns = [], onRowsReorder }) {
  const [rows, setRows] = useState([]);
  const [draggedRow, setDraggedRow] = useState(null);

  // Initialize rows from props data
  useEffect(() => {
    if (data && data.length > 0) {
      setRows(data);
    }
  }, [data]);

  const handleDragStart = (e, index) => {
    setDraggedRow(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedRow === null || draggedRow === index) return;

    const newRows = [...rows];
    const draggedItem = newRows[draggedRow];
    newRows.splice(draggedRow, 1);
    newRows.splice(index, 0, draggedItem);
    
    setRows(newRows);
    setDraggedRow(index);
  };

const handleDragEnd = () => {
  setDraggedRow(null);

  // Update order field when drag ends
  const updatedRows = rows.map((row, index) => ({
    ...row,
    classification_order: index + 1,
  }));

  setRows(updatedRows);

  if (onRowsReorder) {
    onRowsReorder(updatedRows);
  }
};


  const handleFieldChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  // Render cell content based on column configuration
  const renderCell = (column, row, rowIndex) => {
    if (column.cell) {
      return column.cell(row, rowIndex);
    }
    if (column.accessor) {
      return row[column.accessor];
    }
    return null;
  };

  // Check if column is editable (for orderType or similar fields)
  const isEditableColumn = (column) => {
    return column.editable === true;
  };

  return (
    <div >
      <div >
        
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#e7eef6] text-[#6C7086] ">
              <tr>
                <th className="w-12 px-4 py-3 sticky left-0 bg-[#e7eef6] text-[#6C7086] z-10 "></th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-2 text-left  font-semibold whitespace-nowrap uppercase text-xs ${
                      column.sticky === 'right' ? 'sticky right-0 bg-[#e7eef6] text-[#6C7086]' : ''
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  draggable
                  onDragStart={(e) => handleDragStart(e, rowIndex)}
                  onDragOver={(e) => handleDragOver(e, rowIndex)}
                  onDragEnd={handleDragEnd}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-move ${
                    draggedRow === rowIndex ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 sticky left-0 bg-white z-10">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </td>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-3 text-sm whitespace-nowrap ${
                        column.sticky === 'right' ? 'sticky right-0 bg-white' : ''
                      }`}
                    >
                      {isEditableColumn(column) && column.editType === 'select' ? (
                        <select
                          value={row[column.accessor]}
                          onChange={(e) => handleFieldChange(rowIndex, column.accessor, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {column.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : isEditableColumn(column) && column.editType === 'input' ? (
                        <input
                          type="text"
                          value={row[column.accessor]}
                          onChange={(e) => handleFieldChange(rowIndex, column.accessor, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="text-gray-800">
                          {renderCell(column, row, rowIndex)}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {rows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        )}
        
       
      </div>
    </div>
  );
}
