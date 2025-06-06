import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContentTypes, getallContent } from "../../api/Endpoints";
import { useMutation } from "@tanstack/react-query";
import "react-quill/dist/quill.snow.css";
import { Breadcrumb } from "../common/breadCumbs/breadCumbs";
import { useNavigate } from "react-router-dom";

const PolicyView = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("1");
  const [contentData, setContentData] = useState([]);
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
  const [sections, setSections] = useState([]);

  const { mutate: ContentPolicy } = useMutation({
    mutationFn: (payload) => getContentTypes(payload),
    onSuccess: (response) => {
      setContentData(response.data);
    },
    onError: (error) => {
      setContentData([]);
    },
  });

  const { mutate: contents } = useMutation({
    mutationFn: () => getallContent(),
    onSuccess: (response) => {
      setSections(response.data);
    },
    onError: (error) => {
      setContentData([]);
    },
  });

  useEffect(() => {
    let payload = {
      page: 1,
      limit: 10,
      type: activeTab,
    };
    ContentPolicy(payload);
    contents();
  }, [activeTab]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <Breadcrumb
          items={[{ label: "Help" }, { label: "Policies", active: true }]}
        />

        <button
        className="px-4 py-2 rounded-lg transition-colors text-sm md:text-base text-white h-10"
        style={{ backgroundColor: layout_color }}
        onClick={()=> navigate('/help/policy/add')}
        >
          + Add
        </button>
      </div>
      <div className="w-full mx-auto p-6 border-[1px] rounded-[16px] bg-white">
        {/* Title */}
        <h1 className="text-center font-bold text-lg mb-6">Policies</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
            {sections.map(({ id, name }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-lg border transition-colors md:text-base  ${
                    activeTab === id
                      ? "text-white font-semibold"
                      : "bg-gray-200 text-[#232323] text-sm hover:bg-gray-300"
                  }`}
                  style={{
                    ...(activeTab === id && { backgroundColor: layout_color }),
                  }}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {sections.map(({ id, name }) =>
            activeTab === id ? (
              <div key={id} className="p-4 bg-gray-50 rounded-lg">
                {/* <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {name}
              </h2> */}

                {contentData.length > 0 ? (
                  <div className="space-y-6">
                    {contentData.map((e) => (
                      <div key={e._id} className="flex flex-col gap-3">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {e.title}
                        </h3>
                        <div className="prose max-w-none text-gray-800 bg-white p-4 rounded-md border border-gray-200">
                          <div
                            dangerouslySetInnerHTML={{ __html: e.content }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No records found
                  </p>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
};

export default PolicyView;
