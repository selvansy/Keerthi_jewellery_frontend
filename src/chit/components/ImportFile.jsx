import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { exportData } from "../api/Endpoints"; // Use a single API for all types
import { toast } from "sonner";

const UploadFileComponent = () => {
  const [selectedField, setSelectedField] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (formData) => await exportData(formData),
    onSuccess: (response) => {
      ;
      toast.success(response.message);
    },
    onError: (error) => {
      console.error("Upload failed", error);
      setError(
        `Error field: ${error?.response?.data?.error}, Line: ${error?.response?.data?.errorLine}`
      );
      toast.error(error?.response?.data?.message || "Upload failed");
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
        />
      </div>

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200"
      >
        {mutation.isLoading ? "Uploading..." : "Upload"}
      </button>

      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default UploadFileComponent;