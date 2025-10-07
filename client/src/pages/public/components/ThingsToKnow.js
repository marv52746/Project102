import { Link } from "react-router-dom";
import PlanTable from "./PlanTable";
import TrimesterChart from "./TrimesterChart";

export default function ThingsToKnow() {
  const items = [
    {
      title: "Infant Activities",
      image: "/assets/images/4.jpg",
      icon: "/assets/images/1-4-1.png",
      link: "https://www.unicef.org/parenting/child-care/21-learning-activities-babies-and-toddlers", // UNICEF activities for babies & toddlers :contentReference[oaicite:0]{index=0}
    },
    {
      title: "Maternal Care",
      image: "/assets/images/1.jpg",
      icon: "/assets/images/1-1-1.png",
      link: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/prenatal-care/art-20047186", // keep yours – Mayo Clinic prenatal care
    },
    {
      title: "High Risk Pregnancy Care",
      image: "/assets/images/2.jpg",
      icon: "/assets/images/1-2-1.png",
      link: "https://my.clevelandclinic.org/departments/obgyn-womens-health/depts/maternal-fetal-medicine-high-risk-pregnancy", // Johns Hopkins high-risk pregnancy info
    },
    {
      title: "Gynecological Services",
      image: "/assets/images/5.jpg",
      icon: "/assets/images/1-5-1.png",
      link: "https://my.clevelandclinic.org/departments/obgyn-womens-health/depts/general-gynecology", // Cleveland Clinic gynecology services page
    },
    {
      title: "MR Guided Ultrasound",
      image: "/assets/images/6.jpg",
      icon: "/assets/images/1-6-1.png",
      link: "https://stanfordhealthcare.org/medical-treatments/m/mr-guided-focused-ultrasound.html", // Stanford MR-guided focused ultrasound info :contentReference[oaicite:1]{index=1}
    },
    {
      title: "Neonatal ICU",
      image: "/assets/images/3.jpg",
      icon: "/assets/images/1-3-1.png",
      link: "https://www.stanfordchildrens.org/en/topic/default?id=the-neonatal-intensive-care-unit-nicu-90-P02389", // keep your Stanford Children’s NICU link
    },
  ];

  return (
    <section id="things" className="py-10 sm:py-16 bg-gray-50 pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-pink-600 mb-4 sm:mb-8">
            Things to Know
          </h2>

          <h3 className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
            Learn more about the services and care we provide for mothers,
            infants, and families. From pregnancy and delivery to newborn care,
            our team is here to guide you every step of the way.
          </h3>
        </div>

        {/* Grid Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg group"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-3 sm:p-4 transition duration-300 group-hover:bg-opacity-60">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-10 h-10 sm:w-16 sm:h-16 mb-2 sm:mb-3 opacity-0 group-hover:opacity-100 transition duration-300"
                />
                <h3 className="text-white font-bold text-sm sm:text-lg">
                  {item.title}
                </h3>
                <Link
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 sm:mt-2 text-xs sm:text-sm text-pink-300 hover:text-white underline"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tables Below */}
      <div className="mt-10 sm:mt-16 px-2 sm:px-6">
        <PlanTable />
        <TrimesterChart />
      </div>
    </section>
  );
}
