export const Breadcrumb = ({ items }) => {
    return (
      <div className="flex items-center py-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="text-gray-500 mr-1">/</span>}
            <h1
              className={`text-[14px] leading-[13px] font-semibold ${
                item.active ? "text-[#232323]" : "text-gray-500"
              }`}
            >
             {item.label}
            </h1>
          </div>
        ))}
      </div>
    );
  };
  