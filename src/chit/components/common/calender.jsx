import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react"; // or any icon lib

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
    setOpen(false);
    onChange?.(ranges.selection);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 border border-[#F2F2F9]   rounded-[8px] text-sm text-[#6C7086] bg-white "
        onClick={() => setOpen(!open)}
      >
        <CalendarDays size={16} className="text-[#6C7086]" />
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
            className="bg-white border border-[#F2F2F9]"
          />
        </div>
      )}
    </div>
  );
}
