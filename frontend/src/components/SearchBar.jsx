import { Search } from "lucide-react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search for a task"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Search size={17} />
    </div>
  );
}

export default SearchBar;