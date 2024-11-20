import React, { Fragment, useState } from "react";
import { PlusIcon, MinusIcon } from "lucide-react"; // Using Lucid UI icons for + and -

// Card component to display individual cards for each person
const Card = ({ data, expandedState, setExpandedState, level = 0 }) => {
  const levelColor = "#3730AB";

  // Function to handle expanding/collapsing for this card
  const handleToggle = (levelIndex) => {
    setExpandedState((prev) => ({
      ...prev,
      [levelIndex]: !prev[levelIndex], // Toggle the expanded state of the specific card (parent only)
    }));
  };

  return (
    <ul className="flex justify-center">
      {data.map((item) => {
        const avatarImage = item.avatar;

        return (
          <Fragment key={item.levelIndex}>
            <li>
              <div className="card">
                <div className="image">
                  <img
                    src={avatarImage}
                    alt="Profile"
                    style={{ borderColor: levelColor }}
                  />
                </div>
                <div className="card-body card-footer relative">
                  <h4>{item.name}</h4>
                  <p>{item.jobTitle}</p>
                </div>

                {/* Toggle expand/collapse on click */}
                {item.children && item.children.length > 0 && (
                  <button
                    className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 bg-blue-500 rounded-full z-10"
                    onClick={() => handleToggle(item.levelIndex)} // Use levelIndex to toggle
                  >
                    {expandedState[item.levelIndex] ? (
                      <MinusIcon className="w-5 h-5 text-white" />
                    ) : (
                      <PlusIcon className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
              </div>

              {/* Render direct children if expanded */}
              {expandedState[item.levelIndex] && item.children?.length > 0 && (
                <Card
                  data={item.children} // Only pass the direct children to next level
                  expandedState={expandedState} // Maintain the state for direct children
                  setExpandedState={setExpandedState}
                  level={level + 1} // Pass the level to track depth
                />
              )}
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
};

const Chart = () => {
  // Data directly inside the component (Example of organization hierarchy)
  const data = [
    {
      name: "John Doe",
      jobTitle: "Owner",
      avatar: "/assets/images/big-avatar-1.jpg",
      levelIndex: 1001,
      phone: "+1-234-567-8901", // Added phone number
      email: "john.doe@example.com", // Added email address
      children: [
        {
          name: "Jane Smith",
          jobTitle: "CEO",
          avatar: "/assets/images/big-avatar-2.jpg",
          levelIndex: 2001,
          phone: "+1-234-567-8902", // Added phone number
          email: "jane.smith@example.com", // Added email address
          children: [
            {
              name: "Jake White",
              jobTitle: "Software Engineer",
              avatar: "/assets/images/big-avatar-3.jpg",
              levelIndex: 20011,
              phone: "+1-234-567-8903", // Added phone number
              email: "jake.white@example.com", // Added email address
              children: [],
            },
            {
              name: "Emily Brown",
              jobTitle: "Product Manager",
              avatar: "/assets/images/big-avatar-4.jpg",
              levelIndex: 20012,
              phone: "+1-234-567-8904", // Added phone number
              email: "emily.brown@example.com", // Added email address
              children: [],
            },
            {
              name: "Olivia Green",
              jobTitle: "UI/UX Designer",
              avatar: "/assets/images/big-avatar-11.jpg",
              levelIndex: 20013,
              phone: "+1-234-567-8905", // Added phone number
              email: "olivia.green@example.com", // Added email address
              children: [],
            },
          ],
        },
        {
          name: "James Brown",
          jobTitle: "CFO",
          avatar: "/assets/images/big-avatar-5.jpg",
          levelIndex: 2002,
          phone: "+1-234-567-8906", // Added phone number
          email: "james.brown@example.com", // Added email address
          children: [
            {
              name: "Sophia Green",
              jobTitle: "Accountant",
              avatar: "/assets/images/big-avatar-6.jpg",
              levelIndex: 20021,
              phone: "+1-234-567-8907", // Added phone number
              email: "sophia.green@example.com", // Added email address
              children: [],
            },
            {
              name: "Michael Blue",
              jobTitle: "Financial Analyst",
              avatar: "/assets/images/big-avatar-7.jpg",
              levelIndex: 20022,
              phone: "+1-234-567-8908", // Added phone number
              email: "michael.blue@example.com", // Added email address
              children: [
                {
                  name: "Charlotte Grey",
                  jobTitle: "Junior Financial Analyst",
                  avatar: "/assets/images/big-avatar-12.jpg",
                  phone: "+1-234-567-8909", // Added phone number
                  email: "charlotte.grey@example.com", // Added email address
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: "Lucas White",
          jobTitle: "COO",
          avatar: "/assets/images/big-avatar-8.jpg",
          levelIndex: 2003,
          phone: "+1-234-567-8910", // Added phone number
          email: "lucas.white@example.com", // Added email address
          children: [
            {
              name: "Mia Black",
              jobTitle: "Operations Manager",
              avatar: "/assets/images/big-avatar-9.jpg",
              levelIndex: 20031,
              phone: "+1-234-567-8911", // Added phone number
              email: "mia.black@example.com", // Added email address
              children: [
                {
                  name: "Henry Red",
                  jobTitle: "Operations Assistant",
                  avatar: "/assets/images/big-avatar-13.jpg",
                  levelIndex: 200311,
                  phone: "+1-234-567-8912", // Added phone number
                  email: "henry.red@example.com", // Added email address
                  children: [],
                },
              ],
            },
            {
              name: "Liam Yellow",
              jobTitle: "Logistics Coordinator",
              avatar: "/assets/images/big-avatar-10.jpg",
              levelIndex: 20032,
              phone: "+1-234-567-8913", // Added phone number
              email: "liam.yellow@example.com", // Added email address
              children: [],
            },
          ],
        },
      ],
    },
  ];

  // Initialize expandedState with the second level expanded
  const [expandedState, setExpandedState] = useState(() => {
    const initialState = {
      1001: true,
    };

    // Expand second-level nodes by default (children of the root)
    data[0].children.forEach((node) => {
      initialState[node.levelIndex] = true; // Expand the second-level nodes by default
    });
    console.log(initialState);
    return initialState;
  });

  return (
    <div className="org-tree">
      <Card
        data={data}
        expandedState={expandedState}
        setExpandedState={setExpandedState}
      />
    </div>
  );
};

export default Chart;
