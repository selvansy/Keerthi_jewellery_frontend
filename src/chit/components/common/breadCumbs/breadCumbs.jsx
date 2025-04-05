export const Breadcrumb = ({ items }) => {
    return (
      <div className="flex items-center space-x-2 px-5 py-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="text-gray-500 mr-1">/</span>}
            <h1
              className={`text-[20px] leading-[13px] font-medium ${
                item.active ? "text-gray-900" : "text-gray-500"
              }`}
            >
             {item.label}
            </h1>
          </div>
        ))}
      </div>
    );
  };
  