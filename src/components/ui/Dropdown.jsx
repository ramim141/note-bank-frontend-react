// components/ui/Dropdown.jsx
"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from 'lucide-react'

const Dropdown = ({ options, value, onChange, placeholder, id, name, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } })
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 text-left bg-white border-2 rounded-xl
          transition-all duration-200 ease-in-out
          ${
            isOpen
              ? "border-purple-400 ring-2 ring-purple-100 shadow-lg"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400
          flex items-center justify-between
        `}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          <div className="py-2">
            {/* Clear selection option */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`
                w-full px-4 py-2.5 text-left text-sm transition-all duration-150
                hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50
                hover:text-purple-700 hover:border-l-4 hover:border-purple-400
                ${!value ? "bg-purple-50 text-purple-700 border-l-4 border-purple-400" : "text-gray-700"}
                flex items-center justify-between
              `}
            >
              <span className="font-medium">{placeholder}</span>
              {!value && <Check className="w-4 h-4 text-purple-600" />}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm transition-all duration-150
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                  hover:text-blue-700 hover:border-l-4 hover:border-blue-400
                  hover:shadow-sm
                  ${
                    value === option.value
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-400 font-medium"
                      : "text-gray-700 hover:font-medium"
                  }
                  flex items-center justify-between
                `}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown