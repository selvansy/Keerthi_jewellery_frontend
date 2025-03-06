import { useState } from "react";
import { X } from "lucide-react";

const DescriptionModal = ({ isOpen, onClose, ticket }) => {
  // Early return if modal is not open or ticket is null
  if (!isOpen || !ticket) return null;

  // Check if there are attachments
  const hasAttachment = ticket?.attachment && ticket.attachment.length > 0;

  // Construct attachment URLs
  const attachmentUrls = hasAttachment
    ? ticket.attachment.map((file) => `${ticket.pathUrl}/${file}`)
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Ticket Description: {ticket?.id_ticketNo}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <h4 className="text-md font-semibold mb-2">Description</h4>
          <p className="text-gray-700 whitespace-pre-wrap mb-4">
            {ticket?.description || "No description available"}
          </p>

          {/* Attachments Section */}
          {hasAttachment && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Attachments</h4>
              <div className="grid grid-cols-1 gap-4">
                {attachmentUrls.map((imageUrl, index) => (
                  <ImageWithPlaceholder key={index} imageUrl={imageUrl} />
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                Ctrl+Click to open image in new tab
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Separate Image Component for Handling Loading and Errors
const ImageWithPlaceholder = ({ imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const placeholderUrl = "https://via.placeholder.com/400x300?text=Image+Not+Available";

  return (
    <div className="border rounded-lg overflow-hidden relative h-64">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-full h-full bg-gray-300 animate-pulse blur-sm"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt="Attachment"
        className={`w-full h-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"} cursor-pointer`}
        style={{ transition: "opacity 0.3s ease" }}
        title="Ctrl+Click to open in new tab"
        onClick={(e) => e.ctrlKey && window.open(imageUrl, "_blank")}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          setImageLoaded(true);
          e.target.onerror = null;
          e.target.src = placeholderUrl;
        }}
      />
    </div>
  );
};

export default DescriptionModal;
