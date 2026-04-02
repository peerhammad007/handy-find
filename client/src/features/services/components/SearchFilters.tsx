import React from 'react';

type SearchField = 'title' | 'category';

type SearchFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchField: SearchField;
  onSearchFieldChange: (value: SearchField) => void;
};

const SearchFilters = ({
  searchTerm,
  onSearchTermChange,
  searchField,
  onSearchFieldChange,
}: SearchFiltersProps) => (
  <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
    <div className="flex flex-col gap-1 w-full sm:max-w-xs">
      <label htmlFor="searchTerm" className="text-sm font-medium text-gray-700">
        Search
      </label>
      <input
        id="searchTerm"
        type="text"
        value={searchTerm}
        onChange={e => onSearchTermChange(e.target.value)}
        placeholder={`Search by ${searchField}`}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
    </div>
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <label htmlFor="searchField" className="text-sm font-medium text-gray-700">
        Field
      </label>
      <select
        id="searchField"
        value={searchField}
        onChange={e => onSearchFieldChange(e.target.value as SearchField)}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        <option value="title">Title</option>
        <option value="category">Category</option>
      </select>
    </div>
  </div>
);

export default SearchFilters;
