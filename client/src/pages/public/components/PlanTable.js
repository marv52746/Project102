import { useState } from "react";

const tabs = [
  {
    title: "Getting Pregnant",
    image: "/assets/images/tabs1.png",
    hoverImage: "/assets/images/tabs1-hover.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id est sed lacus volutpat lobortis. Lorem ipsum dolor sit amet. Going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text.",
    note: "Going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text.",
    imgRight: "/assets/images/9.png",
  },
  {
    title: "Baby Birth",
    image: "/assets/images/tabs4.png",
    hoverImage: "/assets/images/tabs4-hover.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id est sed lacus volutpat lobortis. Lorem ipsum dolor sit amet. Going to use a passage of Lorem Ipsum...",
    list: [
      "Aenean posuere sem imperdiet",
      "Sed semper lorem sit amet ultrices mollis.",
      "Vivamus vehicula diam ut velit lacinia",
      "Curabitur porta nibh id velit feugiat",
      "Proin condimentum nibh ut orci rutrum convallis.",
      "Pellentesque sed mi in ipsum tempus pharetra",
      "Aenean posuere sem imperdiet, viverra quam",
    ],
    imgRight: "/assets/images/7.png",
  },
  {
    title: "Your First Scan",
    image: "/assets/images/tabs2.png",
    hoverImage: "/assets/images/tabs2-hover.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id est sed lacus volutpat lobortis. Lorem ipsum dolor sit amet...",
    list: [
      "Pregnancy Care",
      "NICU Facilities",
      "Trisemester Care",
      "Maternal Practise",
      "Things to Know",
    ],
    list2: [
      "Are you Pregnant?",
      "Symptom Checker",
      "About Lab Tests you need",
      "Medical Treatment",
      "About Getting Emergency",
    ],
    imgRight: "/assets/images/surr-vector.png",
  },
  {
    title: "Pregnancy",
    image: "/assets/images/tabs3.png",
    hoverImage: "/assets/images/tabs3-hover.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id est sed lacus volutpat lobortis. Lorem ipsum dolor sit amet...",
    note: "Going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text.",
    imgRight: "/assets/images/8.png",
  },
  {
    title: "Baby Care",
    image: "/assets/images/tabs5.png",
    hoverImage: "/assets/images/tabs5-hover.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id est sed lacus volutpat lobortis. Lorem ipsum dolor sit amet...",
    imgRight: "/assets/images/child-vector.png",
  },
  {
    title: "Feeding Baby",
    image: "/assets/images/tabs6.png",
    hoverImage: "/assets/images/tabs6-hover.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id est sed lacus volutpat lobortis. Lorem ipsum dolor sit amet...",
    note: "Going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text.",
    imgRight: "/assets/images/9.png",
  },
];

const PlanTable = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="planTable" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-pink-600">Plan Table</h2>
        <p className="mt-2 text-gray-600">
          Similique sunt in culpa qui officia deserunt mollitia animi, id est
          laborum et dolorum fuga.
        </p>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center p-3 rounded-lg border transition ${
                activeTab === index
                  ? "bg-pink-100 border-pink-500"
                  : "bg-white border-gray-200 hover:bg-gray-100"
              }`}
            >
              <img
                src={tab.image}
                alt={tab.title}
                className="w-20 h-12 object-contain"
              />
              <span className="mt-2 text-sm font-medium">{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 text-left items-center">
          <div>
            <h3 className="text-2xl font-semibold text-pink-600">
              {tabs[activeTab].title}
            </h3>
            <p className="mt-4 text-gray-700">{tabs[activeTab].description}</p>

            {tabs[activeTab].list && (
              <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
                {tabs[activeTab].list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {tabs[activeTab].list2 && (
              <ul className="list-disc list-inside mt-4 text-gray-700 space-y-2">
                {tabs[activeTab].list2.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {tabs[activeTab].note && (
              <p className="mt-6 text-sm text-gray-500">
                <strong>Note:</strong> {tabs[activeTab].note}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <img
              src={tabs[activeTab].imgRight}
              alt={tabs[activeTab].title}
              className="max-w-sm rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanTable;
