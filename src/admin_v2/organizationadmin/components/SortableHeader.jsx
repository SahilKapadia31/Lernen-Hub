import React, { useState } from "react";

const rotate = { asc: "desc", desc: "", "": "asc" };

const SortableHeader = ({ column, onSort, name, center }) => {
  const [direction, setDirection] = useState("");

  const handleSort = () => {
    const newDirection = rotate[direction];
    setDirection(newDirection);
    onSort({ column, direction: newDirection });
  };

  return (
    <h5
      id={column}
      sortData={column}
      className={`mb-0`}
      // className={`sort mb-0 d-flex ${center ? 'justify-content-center' : ''} ${direction || "empty"}`}
      onClick={handleSort}
    >
      {name}
    </h5>
  );
};

export default SortableHeader;
