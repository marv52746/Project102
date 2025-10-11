import React, { useState } from "react";
import PlanTable from "./PlanTable";
import TrimesterChart from "./TrimesterChart";
import { X } from "lucide-react";

export default function ThingsToKnow() {
  const [selectedItem, setSelectedItem] = useState(null);

  const medicalSections = [
    {
      id: 1,
      title: "Infant Activities",
      image: "/assets/images/4.jpg",
      icon: "/assets/images/1-4-1.png",
      description: {
        overview:
          "Infant activities lay the groundwork for sensorimotor, cognitive, language, and social development. These early interactions help wire the brain’s neural circuits for attention, memory, perception, and emotional regulation. (Harvard Center on Developing Child, ZERO TO THREE)",
        key_benefits: [
          {
            text: "Strengthen fine and gross motor skills (grasping, rolling, sitting).",
            sources: ["NAPA", "UNICEF"],
          },
          {
            text: "Promote object permanence and cause-and-effect understanding (e.g., peek-a-boo).",
            sources: ["NAPA", "UNICEF"],
          },
          {
            text: "Foster language development by narrating daily routines, singing, and reading.",
            sources: ["NAPA"],
          },
          {
            text: "Support social-emotional bonding through responsive interaction and shared play.",
            sources: ["Pediatrics"],
          },
        ],
        recommended_activities: [
          {
            title: "Tummy Time",
            detail:
              "Encourages core strength, rolling, and crawling. Evidence shows tummy time is positively associated with gross motor development.",
            sources: ["BioMed Central"],
          },
          {
            title: "Peek-a-boo / Hiding Games",
            detail:
              "Boosts cognitive skills like object permanence and social predictability.",
            sources: ["Wikipedia"],
          },
          {
            title: "Drop-and-Dump",
            detail:
              "Let the baby drop soft blocks into containers and empty them—works on cause and effect and hand control.",
            sources: ["NAPA"],
          },
          {
            title: "Talking / Narrating",
            detail:
              "Describe what you are doing ('Now we wash your hands…')—supports vocabulary growth even before speech.",
            sources: ["ZERO TO THREE"],
          },
          {
            title: "Sensory Play",
            detail:
              "Use soft fabrics, textured toys, or safe household objects to help the baby explore textures and shapes.",
            sources: ["NAPA"],
          },
        ],
        when_to_seek_help: [
          "Lack of head control by 4–5 months",
          "No attempts to roll or reach by 6 months",
          "Minimal babbling or vocal play by 9–10 months",
          "Does not respond socially (smiling, eye contact)",
        ],
        further_reading: [
          {
            title: "UNICEF’s 21 learning activities for babies & toddlers",
            source: "UNICEF",
          },
          {
            title: "Harvard’s “Brain-Building Through Play” handouts",
            source: "Harvard Center on Developing Child",
          },
          {
            title: "ZERO TO THREE play & bonding ideas",
            source: "ZERO TO THREE",
          },
        ],
      },
    },
    {
      id: 2,
      title: "Maternal Care",
      image: "/assets/images/1.jpg",
      icon: "/assets/images/1-1-1.png",
      description: {
        overview:
          "Maternal care encompasses all the support, monitoring, and interventions during pregnancy and postpartum to ensure safety for both mother and baby. It includes medical check-ups, nutritional support, psychosocial care, and lifestyle guidance.",
        key_benefits: [
          "Early detection of complications (e.g., gestational diabetes, hypertension)",
          "Support fetal growth and reduce risk of preterm birth or low birth weight",
          "Promote maternal mental health and prepare for delivery and postpartum recovery",
          "Educate on healthy habits (diet, exercise, supplements, avoiding toxins)",
        ],
        recommended_practices: [
          "Regular prenatal visits (BP, urine, fetal growth scans)",
          "Blood tests (hemoglobin, glucose tolerance, infection screening)",
          "Ultrasound scans (anomaly and growth scans)",
          "Nutritional supplementation (folic acid, iron, calcium, prenatal vitamins)",
          "Counseling on weight gain, exercise, and mental health",
        ],
        when_to_seek_help: [
          "Sudden swelling, severe headache, visual changes (preeclampsia)",
          "Vaginal bleeding or fluid leakage",
          "Decreased fetal movements",
          "Severe nausea, vomiting, or inability to eat/drink",
        ],
        further_reading: [
          {
            title: "ACOG Guidelines for Perinatal Care",
            source: "hscsnhealthplan.org",
          },
          {
            title: "AAP / ACOG Perinatal Care Best Practices",
            source: "buckeyehealthplan.com",
          },
        ],
      },
    },
    {
      id: 3,
      title: "High Risk Pregnancy Care",
      image: "/assets/images/2.jpg",
      icon: "/assets/images/1-2-1.png",
      description: {
        overview:
          "A high-risk pregnancy is one where the health of the mother or fetus is at increased risk. Causes include hypertension, diabetes, multiple gestations, prior complications, fetal anomalies, or advanced maternal age.",
        key_benefits: [
          "Early detection of complications through close monitoring",
          "Tailored interventions to reduce morbidity and mortality",
          "Advanced imaging (ultrasound, fetal MRI) when necessary",
          "Coordinated care among obstetrics, MFM, and neonatology specialists",
        ],
        recommended_interventions: [
          "Frequent ultrasounds (growth, Doppler studies)",
          "Nonstress tests (NST), biophysical profiles",
          "Fetal MRI for better anatomic detail",
          "Possible hospital admission or inpatient monitoring",
          "Early consultation and planning for delivery (timing, mode)",
        ],
        when_to_seek_help: [
          "Preterm labor signs",
          "Abruptio placentae (pain, bleeding)",
          "Severe hypertension or preeclampsia",
          "Fetal distress on monitoring",
          "Sudden decrease in fetal movements",
        ],
        further_reading: [
          { title: "ACOG: So You Have a High-Risk Pregnancy", source: "ACOG" },
          { title: "SMFM Monograph on High-Risk Care", source: "MFM NYC" },
          {
            title: "Quality Measures in High-Risk Pregnancies",
            source: "AJOG",
          },
        ],
      },
    },
    {
      id: 4,
      title: "Gynecological Services",
      image: "/assets/images/5.jpg",
      icon: "/assets/images/1-5-1.png",
      description: {
        overview:
          "Gynecologic services focus on female reproductive health, including prevention, screening, diagnosis, surgical care, and hormonal therapy.",
        key_benefits: [
          "Early detection of reproductive cancers",
          "Management of menstrual disorders, fibroids, and infections",
          "Support for hormonal health (menopause, replacement therapy)",
          "Fertility counseling and family planning",
        ],
        recommended_services: [
          "Pap smear / HPV screening",
          "Pelvic exams and ultrasound imaging",
          "Hormonal panels (thyroid, fertility hormones)",
          "Minimally invasive surgery (laparoscopy)",
          "Counseling on contraception and reproductive planning",
        ],
        when_to_seek_help: [
          "Abnormal uterine bleeding",
          "Pelvic pain or masses",
          "Persistent discharge or odor",
          "Unexplained infertility",
        ],
        further_reading: [
          {
            title: "ACOG Obstetric & Gynecologic Guidelines",
            source: "hscsnhealthplan.org",
          },
        ],
      },
    },
    {
      id: 5,
      title: "MR-Guided Ultrasound (MRgFUS)",
      image: "/assets/images/6.jpg",
      icon: "/assets/images/1-6-1.png",
      description: {
        overview:
          "MR-guided focused ultrasound (MRgFUS) is a noninvasive procedure using MRI to target tissue with focused ultrasound energy. It treats fibroids, adenomyosis, and other localized lesions without incisions.",
        safety_and_use:
          "MRI and ultrasound are considered safe during pregnancy (no known radiation risk). MRgFUS offers shorter recovery, minimal risk, and organ preservation.",
        key_benefits: [
          "Reduced surgical risk and pain",
          "Shorter hospital stay and faster recovery",
          "Precise targeting that spares surrounding tissue",
        ],
        limitations: [
          "Not all patients are candidates (size, location constraints)",
          "Requires MRI-compatible setup and patient stability",
          "Limited long-term data available",
        ],
        further_reading: [
          {
            title: "ACOG Imaging Guidelines in Pregnancy",
            source: "ACOG",
          },
          {
            title: "UCSF Radiology: MRI in Pregnancy",
            source: "UCSF Radiology",
          },
        ],
      },
    },
    {
      id: 6,
      title: "Neonatal ICU (NICU)",
      image: "/assets/images/3.jpg",
      icon: "/assets/images/1-3-1.png",
      description: {
        overview:
          "The Neonatal Intensive Care Unit (NICU) provides specialized care for premature or ill newborns requiring continuous monitoring and medical support.",
        key_benefits: [
          "Continuous monitoring of vital signs",
          "Respiratory and nutritional support",
          "Infection and metabolic management",
          "Family-centered and developmental care",
        ],
        conceptual_framework: [
          {
            title: "Synactive Theory",
            detail:
              "NICU care balances the infant’s autonomic, motor, attention, and regulatory systems. The environment reduces stress and supports neurodevelopment.",
            source: "Wikipedia",
          },
          {
            title: "Family-Centered Care",
            detail:
              "Parents are integral to care—encouraged to participate in kangaroo care and bonding.",
          },
        ],
        when_to_expect_care: [
          "Prematurity (<37 weeks)",
          "Respiratory distress or RDS",
          "Infections or sepsis",
          "Congenital anomalies requiring surgery",
          "Hypoglycemia or severe jaundice",
        ],
        parental_tips: [
          "Visit and hold baby (kangaroo care) when permitted",
          "Ask care team about developmental and sensory management",
          "Participate in feeding and bonding activities",
        ],
        further_reading: [
          {
            title: "AAP / ACOG Neonatal Care Guidelines",
            source: "hscsnhealthplan.org",
          },
          {
            title: "Synactive Theory of Newborn Development",
            source: "Wikipedia",
          },
        ],
      },
    },
  ];

  // 🌐 Define known organization links (easily extendable)
  const sourceLinks = {
    ACOG: "https://www.acog.org",
    AJOG: "https://www.ajog.org",
    UNICEF: "https://www.unicef.org",
    "Harvard Center on Developing Child": "https://developingchild.harvard.edu",
    "ZERO TO THREE": "https://www.zerotothree.org",
    NAPA: "https://napacenter.org",
    Pediatrics: "https://publications.aap.org/pediatrics",
    "BioMed Central": "https://www.biomedcentral.com",
    Wikipedia: "https://en.wikipedia.org",
    "MFM NYC": "https://www.mfmnyc.com",
    "hscsnhealthplan.org": "https://www.hscsnhealthplan.org",
    "buckeyehealthplan.com": "https://www.buckeyehealthplan.com",
    "UCSF Radiology": "https://radiology.ucsf.edu",
  };

  // 🧠 Helper: Get clickable source text
  const renderSourceLinks = (sources) => {
    if (!sources || sources.length === 0) return null;
    return (
      <p className="text-xs text-gray-500 italic">
        Sources:&nbsp;
        {sources.map((src, i) => {
          const url = sourceLinks[src] || sourceLinks[src.trim()];
          return url ? (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              {src}
              {i < sources.length - 1 && ", "}
            </a>
          ) : (
            <span key={i}>
              {src}
              {i < sources.length - 1 && ", "}
            </span>
          );
        })}
      </p>
    );
  };

  // 🧠 Helper: Render description dynamically
  const renderSectionContent = (key, value) => {
    if (!value) return null;

    // If it's a simple string
    if (typeof value === "string") {
      return <p className="text-gray-700 leading-relaxed text-sm">{value}</p>;
    }

    // If it's an array of strings
    if (Array.isArray(value) && typeof value[0] === "string") {
      return (
        <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
          {value.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      );
    }

    // If it's an array of objects with title/detail
    if (Array.isArray(value) && typeof value[0] === "object") {
      return (
        <div className="space-y-4">
          {value.map((obj, i) => (
            <div key={i} className="border-l-4 border-pink-200 pl-4">
              {obj.title && (
                <h5 className="font-semibold text-gray-800 text-sm">
                  {obj.title}
                </h5>
              )}
              {obj.detail && (
                <p className="text-gray-700 text-sm">{obj.detail}</p>
              )}
              {obj.text && (
                <p className="text-gray-700 text-sm mb-1">{obj.text}</p>
              )}
              {obj.sources && renderSourceLinks(obj.sources)}
              {obj.source && renderSourceLinks([obj.source])}
            </div>
          ))}
        </div>
      );
    }

    // If it's an object (e.g. { title, source })
    if (typeof value === "object") {
      return (
        <div className="ml-4">
          {Object.entries(value).map(([subKey, subVal], i) => (
            <p key={i} className="text-gray-700 text-sm">
              <span className="font-semibold capitalize">{subKey}:</span>{" "}
              {subVal}
            </p>
          ))}
        </div>
      );
    }

    return null;
  };

  // 🧠 Capitalize keys nicely
  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <section
      id="things"
      className="py-10 sm:py-16 bg-gray-50 pt-20 sm:pt-24 pb-5 sm:pb-3"
    >
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
          {medicalSections.map((item, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-3 sm:p-4 transition duration-300 group-hover:bg-opacity-60">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-10 h-10 sm:w-16 sm:h-16 mb-2 sm:mb-3 opacity-0 group-hover:opacity-100 transition duration-300"
                />
                <h3 className="text-white font-bold text-sm sm:text-lg">
                  {item.title}
                </h3>
                <button className="mt-1 sm:mt-2 text-xs sm:text-sm text-pink-300 hover:text-white">
                  Learn More
                </button>
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

      {/* 🩺 Popup Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-5xl relative shadow-lg overflow-y-auto max-h-[80vh] sm:max-h-[90%]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Header Image */}
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-40 sm:h-60 object-cover rounded-t-2xl"
            />

            {/* Content */}
            <div className="p-4 sm:p-8">
              <div className="text-center mb-4 sm:mb-8">
                <h3 className="text-xl sm:text-3xl font-bold text-pink-600 leading-snug">
                  {selectedItem.title}
                </h3>
              </div>

              {/* 🧩 Dynamic Section Rendering */}
              <div className="space-y-4 sm:space-y-8">
                {Object.entries(selectedItem.description).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="pb-3 sm:pb-4 border-b border-gray-100"
                    >
                      <h4 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">
                        {formatKey(key)}
                      </h4>
                      <div className="text-sm sm:text-base leading-relaxed">
                        {renderSectionContent(key, value)}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
