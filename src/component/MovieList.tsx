import React, { useRef } from "react";

interface MovieListProps {
  items: any[];
  handleImageError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

const MovieList: React.FC<MovieListProps> = ({ items, handleImageError }) => {
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="container-fluid">
      <div className="row">
        {items.map((item: any, index: number) => (
          <div className="col-sm-4 content" key={index}>
            <img
              src={`https://test.create.diagnal.com/images/${item["poster-image"]}`}
              alt={item.name}
              onError={handleImageError}
              className="missing-img"
            />
            <h4 className="mt-3 txt-ellipsis">{item.name}</h4>
            {index === items.length - 1 && <div ref={lastItemRef}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
