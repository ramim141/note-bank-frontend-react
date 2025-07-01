// src/components/ui/Dropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
// Import the specific icons you need, or use a general import if you prefer
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  icon: IconComponent, // Allow passing an icon component as a prop
  id,
  name,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (optionValue) => {
    setSelectedValue(optionValue);
    if (onChange) {
      // Mimic native event structure for onChange handler
      onChange({
        target: {
          name: name,
          value: optionValue,
        },
      });
    }
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        className={cn(
          'flex justify-between items-center px-4 py-2 w-full text-left rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'transition-all duration-300',
          'bg-white border-gray-300',
          'placeholder-gray-400',
          selectedValue ? 'text-gray-800' : 'text-gray-400',
          IconComponent ? 'pl-10' : 'pl-4'
        )}
        required={required}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {IconComponent && (
          // --- FIX APPLIED HERE ---
          // Ensure IconComponent is a valid React element before rendering
          // If IconComponent is passed as a JSX element (like <FaBuilding />), it should render directly.
          // The error suggests it might be interpreted incorrectly.
          // Passing the component itself (e.g. FaBuilding) and rendering it inside the div is safer.
          // Let's try to render it directly as it's expected to be a component.
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            {IconComponent} {/* Render the passed component directly */}
          </div>
        )}
        {displayValue}
        <span className="ml-2">
          {isOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
        </span>
      </button>

      {isOpen && (
        <ul
          className="overflow-auto absolute z-10 py-1 mt-1 w-full max-h-60 text-base bg-white rounded-lg border border-gray-300 ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm"
          role="listbox"
          aria-labelledby={`label-${id}`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelectOption(option.value)}
              className="relative py-2 pr-9 pl-3 text-gray-800 cursor-pointer select-none hover:bg-blue-500 hover:text-white"
              role="option"
              aria-selected={selectedValue === option.value}
            >
              <span className={`block truncate ${selectedValue === option.value ? 'font-semibold' : ''}`}>
                {option.label}
              </span>
              {selectedValue === option.value && (
                <span className="flex absolute inset-y-0 right-0 items-center pr-4 text-blue-600 pointer-events-none group-hover:text-white">
                  {/* Using FaCheck icon for selected item */}
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 4.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 10.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;