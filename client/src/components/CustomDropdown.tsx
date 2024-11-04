import { useState, useRef, useEffect } from "react";

interface CustomDropdownProps {
  options: { id: string; label: string }[];
  selectedOption: string;
  onChange: (option: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  selectedOption,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="dropdown-select tw-rounded-lg tw-p-2 tw-w-48 tw-border tw-border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
      </button>
      {isOpen && (
        <div className="absolute z-50 bg-white border border-gray-300 tw-rounded-lg tw-w-48">
          {options.map(({ id, label }) => (
            <div
              key={id}
              className="dropdown-option tw-p-2 cursor-pointer hover:bg-red-500 hover:text-white"
              onClick={() => handleOptionSelect(label)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
