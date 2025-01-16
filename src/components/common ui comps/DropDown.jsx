// src/components/ui/Dropdown.js
import React, { useState, useEffect } from "react";

export function Dropdown({
  options = [],
  placeholder = "Select an option",
  onSelect,
  selectedValue,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selectedValue) {
      const matchedOption = options.find(
        (option) => option.value === selectedValue
      );
      setSelected(matchedOption);
    }
  }, [selectedValue, options]);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-2 border border-slate-300 rounded-md text-sm hover:border-slate-400 focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 transition-all duration-150"
      >
        {selected ? selected.label : placeholder}
        <span className="ml-2 text-slate-500">
          ▼ {/* Replace with a suitable icon */}
        </span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 w-full mt-1 border border-slate-300 rounded-md bg-white shadow-lg max-h-60 overflow-auto z-10">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 cursor-pointer text-sm"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
