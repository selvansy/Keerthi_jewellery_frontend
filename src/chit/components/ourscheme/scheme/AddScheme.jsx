import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../components/ui/accordion";

const SchemeForm = () => {
  const formik = useFormik({
    initialValues: {
      schemeName: '',
      schemeCode: '',
      metalType: null,
      classification: null,
      purity: null,
      instalmentType: null,
      maturityMonth: '',
      schemeType: null,
      totalCount: '1',
      incrementRate: '500'
    },
    validationSchema: Yup.object({
      schemeName: Yup.string().required('Scheme name is required'),
      schemeCode: Yup.string().required('Scheme code is required'),
      metalType: Yup.object().required('Metal type is required'),
      classification: Yup.object().required('Classification is required'),
      purity: Yup.object().required('Purity is required'),
      instalmentType: Yup.object().required('Instalment type is required'),
      maturityMonth: Yup.string().required('Maturity month is required'),
      schemeType: Yup.object().required('Scheme type is required'),
      totalCount: Yup.number().required('Total count is required'),
      incrementRate: Yup.number().required('Increment rate is required')
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const metalOptions = [
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' }
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
    }),
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Add Scheme</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme name"
              {...formik.getFieldProps('schemeName')}
            />
            {formik.touched.schemeName && formik.errors.schemeName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.schemeName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Scheme Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter scheme code"
              {...formik.getFieldProps('schemeCode')}
            />
            {formik.touched.schemeCode && formik.errors.schemeCode && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.schemeCode}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Metal Type <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customStyles}
              options={metalOptions}
              placeholder="Select metal type"
              value={formik.values.metalType}
              onChange={(option) => formik.setFieldValue('metalType', option)}
              onBlur={() => formik.setFieldTouched('metalType', true)}
            />
            {formik.touched.metalType && formik.errors.metalType && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.metalType}</div>
            )}
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="classification" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Classification Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            {/* Classification form fields */}
            <div className="space-y-4">
              <p>Classification details content here</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payable" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Payable Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            {/* Payable details form fields */}
            <div className="space-y-4">
              <p>Payable details content here</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fund" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Fund Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            {/* Fund details form fields */}
            <div className="space-y-4">
              <p>Fund details content here</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Payment Details
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            {/* Payment details form fields */}
            <div className="space-y-4">
              <p>Payment details content here</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4">
            Advanced Settings
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            {/* Advanced settings form fields */}
            <div className="space-y-4">
              <p>Advanced settings content here</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
          onClick={() => formik.resetForm()}
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SchemeForm;