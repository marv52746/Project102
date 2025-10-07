import { useState } from "react";

const tabs = [
  {
    title: "Getting Pregnant",
    image: "/assets/images/tabs1.png",
    hoverImage: "/assets/images/tabs1-hover.png",
    description:
      "Preparing for pregnancy is an important first step toward a healthy journey. We provide guidance on nutrition, lifestyle, and prenatal vitamins to help you get ready physically and emotionally.",
    note: "Our doctors can help assess your overall health and answer questions before you start trying.",
    imgRight: "/assets/images/9.png",
  },
  {
    title: "Baby Birth",
    image: "/assets/images/tabs4.png",
    hoverImage: "/assets/images/tabs4-hover.png",
    description:
      "Welcoming your baby is one of life’s most special moments. Our birthing team is here to ensure safe, compassionate care during labor and delivery.",
    list: [
      "Comfortable and supportive birthing environment",
      "Skilled obstetric and midwife care",
      "Options for pain management",
      "Emergency readiness and monitoring",
      "Family-centered approach to delivery",
    ],
    imgRight: "/assets/images/7.png",
  },
  {
    title: "Your First Scan",
    image: "/assets/images/tabs2.png",
    hoverImage: "/assets/images/tabs2-hover.png",
    description:
      "Your first ultrasound is an exciting milestone. It allows you to see your baby for the first time and helps us monitor development and overall health.",
    list: [
      "Confirming pregnancy",
      "Checking baby’s heartbeat",
      "Estimating due date",
      "Early screening for health concerns",
    ],
    list2: [
      "Discuss your symptoms",
      "Understand recommended lab tests",
      "Know when to seek urgent care",
    ],
    imgRight: "/assets/images/surr-vector.png",
  },
  {
    title: "Pregnancy",
    image: "/assets/images/tabs3.png",
    hoverImage: "/assets/images/tabs3-hover.png",
    description:
      "Pregnancy is a journey filled with changes. Regular checkups, proper nutrition, and emotional support are essential for both mother and baby.",
    note: "We provide trimester-based guidance so you know what to expect at every stage.",
    imgRight: "/assets/images/8.png",
  },
  {
    title: "Baby Care",
    image: "/assets/images/tabs5.png",
    hoverImage: "/assets/images/tabs5-hover.png",
    description:
      "Caring for a newborn can feel overwhelming. Our team provides support on everything from safe sleep and bathing to immunizations and growth monitoring.",
    imgRight: "/assets/images/child-vector.png",
  },
  {
    title: "Feeding Baby",
    image: "/assets/images/tabs6.png",
    hoverImage: "/assets/images/tabs6-hover.png",
    description:
      "Feeding is one of the most important ways to bond with your baby. Whether you choose breastfeeding, bottle-feeding, or both, we’re here to guide you with safe and healthy practices.",
    note: "Lactation support and nutrition counseling are available for all new mothers.",
    imgRight: "/assets/images/9.png",
  },
];

const PlanTable = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="planTable" className="py-2 sm:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600">
          Plan Table
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          From getting pregnant to caring for your little one, our plan table
          gives you clear insights and practical tips for every step of the
          journey.
        </p>

        {/* Tabs */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
                activeTab === index
                  ? "bg-pink-100 border-pink-500"
                  : "bg-white border-gray-200 hover:bg-gray-100"
              }`}
            >
              <img
                src={tab.image}
                alt={tab.title}
                className="w-14 h-10 sm:w-20 sm:h-12 object-contain"
              />
              <span className="mt-2 text-xs sm:text-sm font-medium text-gray-700 text-center">
                {tab.title}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left items-center">
          {/* Left side (text) */}
          <div className="px-2 sm:px-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-pink-600">
              {tabs[activeTab].title}
            </h3>
            <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
              {tabs[activeTab].description}
            </p>

            {tabs[activeTab].list && (
              <ul className="list-disc list-inside mt-3 sm:mt-4 text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                {tabs[activeTab].list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {tabs[activeTab].list2 && (
              <ul className="list-disc list-inside mt-3 sm:mt-4 text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                {tabs[activeTab].list2.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {tabs[activeTab].note && (
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 leading-snug">
                <strong>Note:</strong> {tabs[activeTab].note}
              </p>
            )}
          </div>

          {/* Right side (image) */}
          <div className="flex justify-center">
            <img
              src={tabs[activeTab].imgRight}
              alt={tabs[activeTab].title}
              className="max-w-[70%] sm:max-w-sm rounded-lg shadow-md sm:shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanTable;
