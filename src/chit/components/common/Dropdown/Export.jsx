import React from 'react';
import { Download, FileSpreadsheet, FileText,ChevronDown } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { ExportToExcel } from './Excelexport';
import { ExportToPDF } from './ExportPdf';
import exportIcon from "../../../../assets/icons/send-square.svg"

const ExportDropdown = ({apiData,header,fileName,dynamicRemove={}}) => {


  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  return (
    <Menu as="div" className="relative inline-block text-left z-20">
      <div>
        <Menu.Button
          className="flex items-center gap-2 border border-[#091B1B] bg-white text-[#091B1B] 
                     px-4 py-1.5 text-sm font-medium rounded-md"
        >
          <img src={exportIcon} alt="Export" className="h-4 w-4" />
          Export
          <ChevronDown className="h-4 w-4" />
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
                <ExportToPDF 
                apiData={apiData}
                header={header}
                fileName={fileName}
                />
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ExportDropdown;