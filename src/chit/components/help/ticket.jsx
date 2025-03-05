import React, { useState, useRef } from 'react';

const TicketSubmissionForm = () => {
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only image formats (PNG, JPG, JPEG, WEBP) are allowed.');
      return;
    }

    // Check file size (500KB = 512000 bytes)
    if (file.size > 512000) {
      setError('Maximum file size is 500KB.');
      return;
    }

    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachments([{
        name: file.name,
        size: file.size,
        preview: event.target.result,
        type: file.type
      }]);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white h-full w-full max-w-md text-gray-800 shadow-lg flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-medium">Submit a Ticket</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Form content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm mb-1">With which product or category do you need help?</label>
            <div className="relative">
              <select className="w-full border rounded-md p-2 pr-8 appearance-none bg-white">
                <option>Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-1">Ticket Description*</label>
            <textarea 
              placeholder="How can we help today" 
              className="w-full border rounded-md p-2 h-24 resize-none"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <div className="mb-2">
              <label htmlFor="file-upload" className="flex items-center text-gray-500 text-sm cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Add Attachment
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
                Allowed formats: PNG, JPG, JPEG, WEBP. Max size: 500KB
              </div>
            </div>
            
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
            
            {/* Attachment preview */}
            {attachments.length > 0 && (
              <div className="mt-2 border rounded-md p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {attachments[0].type.startsWith('image/') && (
                      <div className="mr-3 w-12 h-12 overflow-hidden rounded border">
                        <img src={attachments[0].preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium truncate max-w-xs">{attachments[0].name}</div>
                      <div className="text-xs text-gray-500">{formatFileSize(attachments[0].size)}</div>
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={removeAttachment}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="p-4 border-t mt-auto">
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-1.5 border border-gray-300 rounded text-sm">
              Clear
            </button>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm">
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSubmissionForm;