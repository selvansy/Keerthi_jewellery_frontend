import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { ExportToExcel } from './Excelexport';
import { ExportToPDF } from './ExportPdf';

const ExportDropdown = ({apiData,fileName}) => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className=" text-white hover:bg-[#034571] flex items-center gap-2 px-4 py-2 rounded-md"
        style={{ backgroundColor: layout_color }} >
          <Download className="h-4 w-4" />
          Export
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <ExportToExcel apiData={apiData} fileName={fileName}/>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <ExportToPDF apiData={apiData} fileName={fileName}/>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ExportDropdown;





        