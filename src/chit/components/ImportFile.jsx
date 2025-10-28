import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { exportData } from "../api/Endpoints";
import { toast } from "sonner";

const UploadFileComponent = () => {
  const [selectedField, setSelectedField] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const downloadExcelFile = (blob, fileName) => {
    // Create a blob URL for the Excel file
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await exportData(formData);
      
      // Check if response is an Excel file (blob)
      if (response instanceof Blob) {
        return { isExcel: true, blob: response };
      }
      
      // Regular JSON response
      return { isExcel: false, data: response };
    },
    onSuccess: (result) => {
      if (result.isExcel) {
        // Handle Excel file download
        const fileName = `error_report_${selectedField}_${Date.now()}.xlsx`;
        downloadExcelFile(result.blob, fileName);
        toast.error("Upload failed. Downloading error report...");
      } else {
        // Handle regular success response
        toast.success(result.data.message || "Upload successful!");
      }
      setFile(null);
      setSelectedField("");
    },
    onError: (error) => {
      console.error("Upload failed", error);
      
      // Check if error response contains an Excel file
      if (error?.response?.data instanceof Blob) {
        const fileName = `error_report_${selectedField}_${Date.now()}.xlsx`;
        downloadExcelFile(error.response.data, fileName);
        toast.error("Upload failed. Downloading error report...");
      } else {
        // Regular error response
        setError(
          `Error field: ${error?.response?.data?.error}, Line: ${error?.response?.data?.errorLine}`
        );
        toast.error(error?.response?.data?.message || "Upload failed");
      }
      setFile(null);
    },
  });

  const handleUpload = () => {
    if (!file || !selectedField) {
      alert("Please select a file and a field.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", selectedField);

    setError("");
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload File</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Field</label>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select --</option>
          <option value="customers">Customers</option>
          <option value="schemeAccounts">Scheme Accounts</option>
          <option value="payments">Payments</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Choose File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
          accept=".xlsx,.xls,.csv"
        />
        <p className="text-sm text-gray-500 mt-1">
          Supported formats: .xlsx, .xls, .csv
        </p>
      </div>

      <button
        onClick={handleUpload}
        disabled={mutation.isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-xl transition duration-200"
      >
        {mutation.isLoading ? "Uploading..." : "Upload"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-500 text-sm">{error}</span>
        </div>
      )}

      {mutation.isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 mt-2">Processing your file...</p>
        </div>
      )}
    </div>
  );
};

export default UploadFileComponent;