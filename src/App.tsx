import "../src/css/main.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../src/component/Navbar";
import MovieList from "../src/component/MovieList";

interface JsonDataState {
  page: {
    title: string;
    "content-items": {
      content: any[];
    };
  };
}

function App() {
  const [isInputVisible, setInputVisible] = useState(false);
  const [jsonData, setJsonData] = useState<JsonDataState>({
    page: { "content-items": { content: [] }, title: "" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const oldSrc = event.currentTarget.src;
    const newSrc =
      "https://test.create.diagnal.com/images/placeholder_for_missing_posters.png";
    if (
      oldSrc.includes(
        "https://test.create.diagnal.com/images/posterthatismissing.jpg"
      )
    ) {
      event.currentTarget.src = newSrc;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScrollToTopVisibility = () => {
    if (window.scrollY > 100) {
      setScrollToTopVisible(true);
    } else {
      setScrollToTopVisible(false);
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollThreshold = 100;

    if (
      lastItemRef.current &&
      window.innerHeight + window.scrollY >= lastItemRef.current.offsetTop &&
      !isLoading &&
      hasMore
    ) {
      fetchJsonData(
        `https://test.create.diagnal.com/data/page${currentPage}.json`
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setHasMore(currentPage < 3);
    }

    if (scrollY + windowHeight >= documentHeight - scrollThreshold) {
      // Fetch more data if there is more to load
      if (!isLoading && hasMore) {
        fetchJsonData(
          `https://test.create.diagnal.com/data/page${currentPage}.json`
        );
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  const toggleInputVisibility = () => {
    setInputVisible((prevVisible) => !prevVisible);
  };

  const fetchJsonData = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 403) {
          console.warn(`No More JSON files available in this location`);
          setHasMore(false);
          return;
        }
      }

      const data = await response.json();
      setJsonData((prevData) => ({
        ...prevData,
        page: {
          ...prevData.page,
          "content-items": {
            content: [
              ...prevData.page["content-items"].content,
              ...data.page["content-items"].content,
            ],
          },
        },
      }));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      setIsLoading(false);
    }
  };

  const loadInitialData = () => {
    fetchJsonData(
      `https://test.create.diagnal.com/data/page${currentPage}.json`
    );
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollToTopVisibility);
    return () => {
      window.removeEventListener("scroll", handleScrollToTopVisibility);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, isLoading, hasMore]);

  const filteredItems = jsonData.page["content-items"].content.filter(
    (item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  const noResultsFound = filteredItems.length === 0 && searchQuery.length > 0;

  return (
    <>
        <div className="diagnal container-fluid">
          <div className="row">
            <Navbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isInputVisible={isInputVisible}
              toggleInputVisibility={toggleInputVisibility}
              clearSearchQuery={clearSearchQuery}
            />

            <h2>{jsonData.page.title}</h2>
            <div className="results">
              {noResultsFound && <p>No results found</p>}
            </div>
            {isLoading && <p className="pre-loader">Loading...</p>}

    
            <MovieList
              items={filteredItems}
              handleImageError={handleImageError}
            />
          </div>

          <div
              className="items-loaded"
              onClick={scrollToTop}
              title="Scroll to Top"
            >
              #{jsonData.page["content-items"].content.length}
            </div>
        </div>
    </>
  );
}

export default App;
