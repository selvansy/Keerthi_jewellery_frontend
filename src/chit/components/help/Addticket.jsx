import React, { useState, useRef } from "react";
import axios from "axios";
import { addTicketRaise } from "../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SpinLoading from "../common/spinLoading";

const TicketSubmissionForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [attachment, setAttachments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only image formats (PNG, JPG, JPEG, WEBP) are allowed.");
      return;
    }

    if (file.size > 512000) {
      setError("Maximum file size is 500KB.");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachments([
        {
          name: file.name,
          size: file.size,
          preview: event.target.result,
          type: file.type,
          file: file,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  //mutation for add ticket raise
  const { mutate: handleAddTicket } = useMutation({
    mutationFn: addTicketRaise,
    onSuccess: (response) => {
      if (response.message) {
        toast.success(response.message)
        setCategory('Other');
        setDescription('');
        setAttachments([]);
        onClose()
      }
      
    },
    onError: (error) => {
      toast.error("Failed to submit the ticket. Please try again.");
      
    },
  });

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Ticket description is required.");
      return;
    }
    setLoading(true)
    setError("");

    const formData = new FormData();
    formData.append("option", category);
    formData.append("description", description);

    if (attachment.length > 0) {
      formData.append("ticket_img", attachment[0].file);
    }

    try {
      handleAddTicket(formData);
    } catch (error) {
      setError("Failed to submit the ticket. Try again.");
    } 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white h-full w-full max-w-md text-gray-800 shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-medium">Submit a Ticket</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm mb-1">Product/Category</label>
            <select
              className="w-full border rounded-md p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Ticket Description*</label>
            <textarea
              placeholder="How can we help today?"
              className="w-full border rounded-md p-2 h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="flex items-center text-gray-500 text-sm cursor-pointer"
            >
              📎 Add Attachment
            </label>
            <input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
            />
            <div className="text-xs text-gray-500 mt-1">
              Allowed: PNG, JPG, JPEG, WEBP. Max size: 500KB
            </div>
          </div>

          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

          {attachment.length > 0 && (
            <div className="mt-2 border rounded-md p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="mr-3 w-12 h-12 overflow-hidden rounded border">
                    <img
                      src={attachment[0].preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium truncate max-w-xs">
                      {attachment[0].name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(attachment[0].size)}
                    </div>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={removeAttachment}
                >
                  ✖
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-1.5 border border-gray-300 rounded text-sm"
              onClick={onClose}
            >
              Clear
            </button>
            <button
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading?<SpinLoading/>:"Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSubmissionForm;
