import { Video, Rocket, CheckSquare, ArrowRight, BookOpen } from "lucide-react";

const trimesters = [
  {
    stage: "1st Trimester",
    range: "0.4kg - 2.0kg",
    color: "bg-green-100 text-green-600",
    weeks: [
      {
        week: 4,
        image: "/assets/images/week4.png",
        title: "Things to Know",
        desc: "Your baby is just beginning to form. Learn about early signs of pregnancy and important first steps.",
        link: "https://my.clevelandclinic.org/health/articles/9699-first-trimester",
        linkText: "Read More",
        icon: <BookOpen className="inline w-4 h-4" />,
      },
      {
        week: 9,
        image: "/assets/images/week9.png",
        title: "Fetal Development",
        desc: "Tiny organs are developing quickly. Discover what’s happening inside your womb during this week.",
        link: "https://www.youtube.com/watch?v=y4HK5CTVkXM",
        linkText: "Watch Video",
        icon: <Video className="inline w-4 h-4" />,
      },
      {
        week: 13,
        image: "/assets/images/week13.png",
        title: "Tips for First Trimester",
        desc: "What to expect and how to take care of yourself during early pregnancy – symptoms, health, diet, and more.",
        link: "https://www.akronchildrens.org/inside/?p=28204",
        linkText: "Get Tips",
        icon: <Rocket className="inline w-4 h-4" />,
      },
    ],
  },
  {
    stage: "2nd Trimester",
    range: "2.0kg - 8.0kg",
    color: "bg-blue-100 text-blue-600",
    weeks: [
      {
        week: 18,
        image: "/assets/images/week18.png",
        title: "What to Expect in 2nd Trimester",
        desc: "The second trimester is often easier—nausea may fade and energy returns. Find out what changes to expect in your body and baby.",
        link: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20047732",
        linkText: "Learn More",
        icon: <BookOpen className="inline w-4 h-4" />,
      },
      {
        week: 22,
        image: "/assets/images/week22.png",
        title: "Nutrition & Diet",
        desc: "Balanced nutrition is key during this stage—supports baby’s development and helps you feel stronger.",
        link: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy",
        linkText: "Get Diet Tips",
        icon: <CheckSquare className="inline w-4 h-4" />,
      },
      {
        week: 27,
        image: "/assets/images/week27.png",
        title: "Healthy Activity",
        desc: "Safe exercise like walking, swimming, or prenatal yoga helps with circulation and reduces discomfort.",
        link: "https://www.webmd.com/baby/second-trimester-tips",
        linkText: "Activity Tips",
        icon: <Rocket className="inline w-4 h-4" />,
      },
    ],
  },
  {
    stage: "3rd Trimester",
    range: "8.0kg - 13.6kg",
    color: "bg-pink-100 text-pink-600",
    weeks: [
      {
        week: 31,
        image: "/assets/images/week31.png",
        title: "Sleeping Well in Late Pregnancy",
        desc: "As your body changes, getting comfortable can be harder. Learn sleep positions and routines to help rest better.",
        link: "https://www.sleepfoundation.org/pregnancy/sleeping-during-3rd-trimester",
        linkText: "Sleep Guide",
        icon: <BookOpen className="inline w-4 h-4" />,
      },
      {
        week: 36,
        image: "/assets/images/week36.png",
        title: "Comfort & Relief",
        desc: "From swelling to back pain, find small changes and tips to improve comfort as you enter late pregnancy.",
        link: "https://www.nm.org/healthbeat/healthy-tips/staying-comfortable-in-the-third-trimester",
        linkText: "Relief Tips",
        icon: <CheckSquare className="inline w-4 h-4" />,
      },
      {
        week: 40,
        image: "/assets/images/week40.png",
        title: "Preparing for Birth",
        desc: "Labor may be near. Review your birth plan, hospital checklist, and things you’ll need for delivery and postpartum care.",
        link: "https://www.webmd.com/baby/how-to-create-a-birth-plan",
        linkText: "Create Birth Plan",
        icon: <ArrowRight className="inline w-4 h-4" />,
      },
    ],
  },
];

export default function TrimesterChart() {
  return (
    <section id="trimester" className="w-full py-6 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-pink-600">Trimester Chart</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Track your pregnancy journey, trimester by trimester. Each stage //
            highlights your baby’s development and helpful tips to keep you //
            healthy and prepared.
          </p>
        </div>

        {/* Trimesters */}
        <div className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
          {trimesters.map((tri, i) => (
            <div key={i} className="rounded-lg flex flex-col items-center">
              <div className="flex justify-center">
                {tri.weeks.map((w, j) => (
                  <div
                    key={j}
                    className="relative flex flex-col items-center group"
                  >
                    {/* Week Image */}
                    <div className="w-28 sm:w-36 h-48 sm:h-56 flex items-end justify-center overflow-hidden">
                      <img
                        src={w.image}
                        alt={w.title}
                        className=" object-contain w-full h-full"
                      />
                    </div>

                    {/* Heart with tooltip container */}
                    <div className="relative flex flex-col items-center mt-2">
                      {/* Heart number */}
                      <div className="relative w-10 aspect-[1.2/1]">
                        <img
                          src="/assets/images/heart.png"
                          alt="heart"
                          className="bg-pink-500 object-contain w-full h-full"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                          {w.week}
                        </span>
                      </div>

                      {/* Hover Tooltip (now attached to heart) */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full w-40 sm:w-52 bg-pink-500 text-white text-xs shadow-lg rounded-lg p-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] transition-all duration-200 z-20 pointer-events-auto text-center">
                        {/* Tooltip pointer */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-500 rotate-45"></div>

                        <h4 className="font-semibold text-sm">{w.title}</h4>
                        <p className="text-xs mt-1 leading-tight">{w.desc}</p>
                        <a
                          href={w.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white text-xs font-medium inline-flex items-center gap-1 underline mt-1"
                        >
                          {w.linkText} {w.icon}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weight info */}
              <div className={`m-4 p-2 text-center w-full`}>
                <div className={` p-2 rounded-lg text-center  ${tri.color}`}>
                  <h3 className="font-bold">{tri.stage}</h3>
                  <div className="w-12 h-1 bg-current mx-auto my-2"></div>
                  <h5 className="text-sm">{tri.range}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
