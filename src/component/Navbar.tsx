import React, { useState } from "react";
import "../css/navbar.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void; // Ensure the prop is correctly typed
  isInputVisible: boolean;
  toggleInputVisibility: () => void;
  clearSearchQuery: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  isInputVisible,
  toggleInputVisibility,
  clearSearchQuery,
}) => {
  const [localState, setLocalState] = useState<string>("");
  return (
    <nav className="navbar sticky-top">
      <nav className="navbar sticky-top">
        <div className="container-fluid">
          <div className="d-flex">
            <div className="naviarrow" onClick={clearSearchQuery}></div>
            <h3>Romantic Comedy</h3>
            <div className="searchicon" onClick={toggleInputVisibility} />
          </div>
        </div>

        <div className="search-bar">
          {isInputVisible && (
            <div className="search-input-container">
              <input
                type="text"
                required
                className="search-box searchinput"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // setSearchQuery should work here
              />
              <span className="close-icon" onClick={clearSearchQuery}></span>
            </div>
          )}
        </div>
      </nav>
    </nav>
  );
};

export default Navbar;
