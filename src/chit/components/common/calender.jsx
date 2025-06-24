import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangeSelector({ onChange }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    
    if (ranges.selection.startDate.getTime() !== ranges.selection.endDate.getTime()) {
      onChange?.(ranges.selection);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white"
        onClick={() => setOpen(!open)}
      >
        <CalendarDays size={16} className="text-gray-500" />
        {`${format(range[0].startDate, "dd/MM/yyyy")} to ${format(
          range[0].endDate,
          "dd/MM/yyyy"
        )}`}
      </button>

      {open && (
        <div className="absolute z-10 mt-2">
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={range}
            className="bg-white border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}