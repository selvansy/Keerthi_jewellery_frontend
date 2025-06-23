import React, { useState } from "react";

const UploadFileComponent = () => {
  const [selectedField, setSelectedField] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file || !selectedField) {
      alert("Please select a file and a field.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", selectedField);

    // Simulate upload
    console.log("Uploading...", { file, field: selectedField });

    // Example: Upload to backend
    // fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log("Success:", data))
    //   .catch((err) => console.error("Error:", err));
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
          <option value="schemes">Schemes</option>
          <option value="schemeAccounts">Scheme Accounts</option>
          <option value="customers">Customers</option>
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
        Upload
      </button>
    </div>
  );
};

export default UploadFileComponent;