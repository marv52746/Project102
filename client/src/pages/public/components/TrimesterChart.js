import { Video, Rocket, CheckSquare, ArrowRight, BookOpen } from "lucide-react";

const trimesters = [
  {
    stage: "1st Trimester",
    range: "0.4kg - 2.0kg",
    color: "bg-green-100 text-green-600",
    image: "/assets/images/stage1.png",
    weeks: [
      {
        week: 4,
        title: "Things to Know",
        desc: "Your baby is just beginning to form. Learn about early signs of pregnancy and important first steps.",
        link: "https://my.clevelandclinic.org/health/articles/9699-first-trimester", // Cleveland Clinic: First Trimester article :contentReference[oaicite:0]{index=0}
        linkText: "Read More",
        icon: <BookOpen className="inline w-4 h-4" />,
      },
      {
        week: 9,
        title: "Fetal Development",
        desc: "Tiny organs are developing quickly. Discover what’s happening inside your womb during this week.",
        link: "https://www.youtube.com/watch?v=y4HK5CTVkXM", // 3D fetal development video :contentReference[oaicite:1]{index=1}
        linkText: "Watch Video",
        icon: <Video className="inline w-4 h-4" />,
      },
      {
        week: 13,
        title: "Tips for First Trimester",
        desc: "What to expect and how to take care of yourself during early pregnancy – symptoms, health, diet, and more.",
        link: "https://www.akronchildrens.org/inside/?p=28204", // “12 ways to survive the first trimester” blog :contentReference[oaicite:2]{index=2}
        linkText: "Get Tips",
        icon: <Rocket className="inline w-4 h-4" />,
      },
    ],
  },
  {
    stage: "2nd Trimester",
    range: "2.0kg - 8.0kg",
    color: "bg-blue-100 text-blue-600",
    image: "/assets/images/stage2.png",
    weeks: [
      {
        week: 18,
        title: "What to Expect in 2nd Trimester",
        desc: "The second trimester is often easier—nausea may fade and energy returns. Find out what changes to expect in your body and baby.",
        link: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20047732", // Mayo Clinic :contentReference[oaicite:4]{index=4}
        linkText: "Learn More",
        icon: <BookOpen className="inline w-4 h-4" />,
      },
      {
        week: 22,
        title: "Nutrition & Diet",
        desc: "Balanced nutrition is key during this stage—supports baby’s development and helps you feel stronger.",
        link: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy", // ACOG :contentReference[oaicite:5]{index=5}
        linkText: "Get Diet Tips",
        icon: <CheckSquare className="inline w-4 h-4" />,
      },
      {
        week: 27,
        title: "Healthy Activity",
        desc: "Safe exercise like walking, swimming, or prenatal yoga helps with circulation and reduces discomfort.",
        link: "https://www.webmd.com/baby/second-trimester-tips", // WebMD’s “Second Trimester Tips” :contentReference[oaicite:6]{index=6}
        linkText: "Activity Tips",
        icon: <Rocket className="inline w-4 h-4" />,
      },
    ],
  },
  {
    stage: "3rd Trimester",
    range: "8.0kg - 13.6kg",
    color: "bg-pink-100 text-pink-600",
    image: "/assets/images/stage3.png",
    weeks: [
      {
        week: 31,
        title: "Sleeping Well in Late Pregnancy",
        desc: "As your body changes, getting comfortable can be harder. Learn sleep positions and routines to help rest better.",
        link: "https://www.sleepfoundation.org/pregnancy/sleeping-during-3rd-trimester", // SleepFoundation :contentReference[oaicite:7]{index=7}
        linkText: "Sleep Guide",
        icon: <BookOpen className="inline w-4 h-4" />,
      },
      {
        week: 36,
        title: "Comfort & Relief",
        desc: "From swelling to back pain, find small changes and tips to improve comfort as you enter late pregnancy.",
        link: "https://www.nm.org/healthbeat/healthy-tips/staying-comfortable-in-the-third-trimester", // NM.org :contentReference[oaicite:8]{index=8}
        linkText: "Relief Tips",
        icon: <CheckSquare className="inline w-4 h-4" />,
      },
      {
        week: 40,
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
    <section id="trimester" className="py-16 bg-gray-50 pb-0">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-pink-600">Trimester Chart</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Track your pregnancy journey, trimester by trimester. Each stage
            highlights your baby’s development and helpful tips to keep you
            healthy and prepared.
          </p>
        </div>

        {/* Trimesters */}
        <div className="grid md:grid-cols-3 gap-2">
          {trimesters.map((tri, i) => (
            <div key={i} className=" rounded-lg overflow-visible">
              <img
                src={tri.image}
                alt={tri.stage}
                className="w-full h-50 object-cover"
              />
              <div className="p-6">
                {/* Weeks aligned horizontally */}
                <div className="flex items-center justify-center gap-4">
                  {tri.weeks.map((w, j) => (
                    <div
                      key={j}
                      className="relative flex items-center group cursor-pointer"
                    >
                      {/* Heart Number */}
                      <div className="relative w-11 h-9 m-auto">
                        <img
                          src="/assets/images/heart.png"
                          alt="heart"
                          className=" bg-pink-500 object-contain"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                          {w.week}
                        </span>
                      </div>

                      {/* Connector Line (skip after last item) */}
                      {j < tri.weeks.length - 1 && (
                        <div className="w-10 h-1 bg-pink-500 mx-2"></div>
                      )}

                      {/* Hover content */}
                      <div className="absolute bottom-full mb-1 w-40 bg-white text-gray-700 text-sm shadow-lg rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <h4 className="font-semibold">{w.title}</h4>
                        <p className="text-xs">{w.desc}</p>
                        <a
                          href={w.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-600 text-xs font-medium inline-flex items-center gap-1 hover:underline"
                        >
                          {w.linkText} {w.icon}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {i === 2 && (
                  <span
                    className="block mt-2 text-xs text-gray-500"
                    style={{ float: "right" }}
                  >
                    *units in weeks
                  </span>
                )}

                {/* Weight range */}
                <div className={`mt-6 p-2 rounded-lg text-center ${tri.color}`}>
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
