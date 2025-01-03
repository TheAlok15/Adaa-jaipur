import React, { useState } from "react";

const Navbar = () => {
  const categories = [
    { id: 1, name: "New Arrival", subcategories: [] },

    {
      id: 2,
      name: "top",
      subcategories: [
        {
          id: "topshort",
          name: "Top-short",
        },
        {
          id: "Toplong",
          name: "Top-long",
        },
        {
          id: "Topbottom",
          name: "Top-middle",
        },
      ],
    },

    {
      id: 3,
      name: "bottom",
      subcategories: [
        {
          id: "bottomshort",
          name: "bottom-short",
        },
        {
          id: "bottomlong",
          name: "bottom-long",
        },
        {
          id: "bottommedium",
          name: "bottom-middle",
        },
      ],
    },

    {
      id: 4,
      name: "medium",
      subcategories: [
        {
          id: "mediumshort",
          name: "medium-short",
        },
        {
          id: "mediumlong",
          name: "medium-long",
        },
        {
          id: "mediummiddle",
          name: "medium-middle",
        },
      ],
    },
  ];

  const [currentCategory, setCurrentCategory] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        columnGap: 70,
        paddingTop: 120,
      }}
    >
      {categories.map((category) => {
        return (
          <div
            key={category.id}
            onMouseEnter={() => {
              setCurrentCategory(category.id);
            }}
            onMouseLeave={() => {
              setCurrentCategory(null);
            }}
          >
            {category.name}
            <div>
              
              {currentCategory === category.id &&
                category.subcategories.length > 0 && (
                  <ul>
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.id}>{subcategory.name}</li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Navbar;
