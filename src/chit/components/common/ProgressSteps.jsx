import React from 'react';
import { useSelector } from 'react-redux';

const SidebarStepper = ({ steps }) => {

  const currentStep = useSelector((state) => state.clientForm.currentStep);
  return (
    <aside className="border-2 rounded-tl-3xl lg:rounded-bl-3xl border-gray-300 bg-white p-4">
      {/* Step Header */}
      <div className="mb-8 lg:px-4">
        <h5 className="text-2xl font-bold text-[#023453]">
          Step {currentStep + 1}
        </h5>
        <p className="text-sm text-gray-500">Review and submit the form</p>
      </div>

      {/* Step List */}
      <ol className={` ${steps.length <= 3 ? "lg:h-[800px]" : "min-h-screen" } lg:py-6 lg:px-3 flex flex-grow justify-between lg:flex-col md:flex-row lg:-space-y-20 md:space-x-8 lg:space-x-0 md:space-y-0`}>
        {steps.map((step, index) => (
          <li
            key={index}
            className="relative flex items-center lg:flex-row flex-col"
          >
            {/* Step Icon */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${index <= currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-400 text-gray-300'
                }`}
            >
             {step.icon}
            </div>


            {/* Step Title */}
            <div
              className={`ml-2 md:mt-2 text-md ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
            >
              <span className="cursor-pointer">{step.title}</span>
            </div>

            {/* Connector Line */}
           {/* Connector Line */}
{steps.length > 3 ? (
  index < steps.length - 1 && (
    <div
      className={`absolute lg:top-[calc(100%+8px)] lg:h-[50px] lg:w-[3px] top-[50%] left-[18px] h-full`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          ${index < currentStep ? '#22C55E' : '#9ca3af'} 0px,
          ${index < currentStep ? '#22C55E' : '#9ca3af'} 4px,
          transparent 4px,
          transparent 8px
        )`,
        backgroundSize: '100% 8px',
        backgroundPosition: 'top',
      }}
    />
  )
) : (
  index < steps.length - 1 && (
    <div
      className={`absolute lg:top-[calc(100%+24px)] lg:h-[18rem] lg:w-[3px] top-[50%] left-[18px] h-full`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          ${index < currentStep ? '#22C55E' : '#9ca3af'} 0px,
          ${index < currentStep ? '#22C55E' : '#9ca3af'} 4px,
          transparent 4px,
          transparent 8px
        )`,
        backgroundSize: '100% 8px',
        backgroundPosition: 'top',
      }}
    />
  )
)}

          </li>
        ))}
      </ol>
    </aside>
  );
};

export default SidebarStepper;
