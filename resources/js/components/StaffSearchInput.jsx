import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const StaffSearchInput = ({ 
  onSelect, 
  placeholder = "Search staff members...", 
  className = "",
  disabled = false,
  selectedStaff = null,
  clearAfterSelect = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Query staff members based on search term
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ['staff-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      const response = await api.get(`/users/search-staff?search=${encodeURIComponent(searchTerm)}`);
      return response.data.users || [];
    },
    enabled: searchTerm.length >= 2, // Only search when at least 2 characters
    staleTime: 30000, // Cache for 30 seconds
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);
    
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle staff selection
  const handleSelect = (staff) => {
    onSelect(staff);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    if (clearAfterSelect) {
      setSearchTerm('');
    } else {
      setSearchTerm(staff.name);
    }
    
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || staffMembers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < staffMembers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < staffMembers.length) {
          handleSelect(staffMembers[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when selectedStaff changes externally
  useEffect(() => {
    if (selectedStaff) {
      setSearchTerm(selectedStaff.name);
    } else if (!clearAfterSelect) {
      setSearchTerm('');
    }
  }, [selectedStaff, clearAfterSelect]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.length >= 2) {
            setIsOpen(true);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        autoComplete="off"
      />
      
      {/* Search indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              Searching...
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              {searchTerm.length < 2 ? 'Type at least 2 characters to search' : 'No staff members found'}
            </div>
          ) : (
            staffMembers.map((staff, index) => (
              <div
                key={staff.id}
                onClick={() => handleSelect(staff)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                  index === highlightedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                } ${selectedStaff?.id === staff.id ? 'bg-blue-100 font-medium' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-600">{staff.email}</div>
                  </div>
                  <div className="flex flex-col items-end text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      staff.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {staff.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                    {staff.is_active ? (
                      <span className="text-green-600 mt-1">● Active</span>
                    ) : (
                      <span className="text-red-600 mt-1">● Inactive</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Helper text */}
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="text-xs text-gray-500 mt-1">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
};

export default StaffSearchInput;
