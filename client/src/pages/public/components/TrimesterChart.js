// import {
//   Video,
//   Download,
//   Rocket,
//   CheckSquare,
//   Music,
//   ArrowRight,
// } from "lucide-react";
// import Stages from "./Stages";

// const trimesters = [
//   {
//     stage: "1st Trimester",
//     range: "0.4kg - 2.0kg",
//     color: "bg-green-100 text-green-600",
//     image: "/assets/images/stage1.png",
//     weeks: [
//       {
//         week: 4,
//         title: "Things to Know",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Know More",
//         icon: <Video className="inline w-4 h-4" />,
//       },
//       {
//         week: 9,
//         title: "Fetal Development",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Download PDF",
//         icon: <Download className="inline w-4 h-4" />,
//       },
//       {
//         week: 13,
//         title: "Baby Movement",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "View Here",
//         icon: <Video className="inline w-4 h-4" />,
//       },
//     ],
//   },
//   {
//     stage: "2nd Trimester",
//     range: "2.0kg - 8.0kg",
//     color: "bg-blue-100 text-blue-600",
//     image: "/assets/images/stage2.png",
//     weeks: [
//       {
//         week: 18,
//         title: "Pregnancy Health",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Quick Tips",
//         icon: <Rocket className="inline w-4 h-4" />,
//       },
//       {
//         week: 22,
//         title: "Pregnancy Comfort",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "View Here",
//         icon: <CheckSquare className="inline w-4 h-4" />,
//       },
//       {
//         week: 27,
//         title: "Yoga & Exercise",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Read More",
//       },
//     ],
//   },
//   {
//     stage: "3rd Trimester",
//     range: "8.0kg - 13.6kg",
//     color: "bg-pink-100 text-pink-600",
//     image: "/assets/images/stage3.png",
//     weeks: [
//       {
//         week: 31,
//         title: "Healthy Sleep",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Watch Out",
//         icon: <ArrowRight className="inline w-4 h-4" />,
//       },
//       {
//         week: 36,
//         title: "Relax with Music",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Hit Here",
//         icon: <Music className="inline w-4 h-4" />,
//       },
//       {
//         week: 40,
//         title: "Lower Anxiety",
//         desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
//         link: "#",
//         linkText: "Click Here",
//         icon: <Video className="inline w-4 h-4" />,
//       },
//     ],
//   },
// ];

// export default function TrimesterChart() {
//   return (
//     <section id="trimester" className="py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Section Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-pink-600">Trimester Chart</h2>
//           <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
//             Duas molestias excepturi sint occaecati cupiditate non provident,
//             similique sunt in culpa qui officia deserunt mollitia animi, id est
//             laborum et dolorum fuga.
//           </p>
//         </div>

//         {/* Trimesters */}
//         <div className="grid md:grid-cols-3 gap-8">
//           {trimesters.map((tri, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <img
//                 src={tri.image}
//                 alt={tri.stage}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-6">
//                 {/* Weeks aligned horizontally */}
//                 <div className="flex gap-3 justify-center">
//                   {tri.weeks.map((w, j) => (
//                     <div key={j} className="relative group cursor-pointer">
//                       {/* Week number inside a heart shape */}
//                       <div className="w-10 h-10 flex items-center justify-center text-xs font-bold text-white bg-pink-500 rounded-full relative before:content-[''] before:absolute before:w-10 before:h-10 before:rounded-full before:bg-pink-500 before:-left-5 before:top-0 before:rotate-45 transform -rotate-45">
//                         {w.week}
//                       </div>

//                       {/* Hover content */}
//                       <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-40 bg-white text-gray-700 text-sm shadow-lg rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                         <h4 className="font-semibold">{w.title}</h4>
//                         <p className="text-xs">{w.desc}</p>
//                         <a
//                           href={w.link}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-pink-600 text-xs font-medium inline-flex items-center gap-1 hover:underline"
//                         >
//                           {w.linkText} {w.icon}
//                         </a>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Weight range */}
//                 <div className={`mt-6 p-4 rounded-lg text-center ${tri.color}`}>
//                   <h3 className="font-bold">{tri.stage}</h3>
//                   <div className="w-12 h-1 bg-current mx-auto my-2"></div>
//                   <h5 className="text-sm">{tri.range}</h5>
//                   {i === 2 && (
//                     <span className="block mt-2 text-xs text-gray-500">
//                       *units in weeks
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import {
  Video,
  Download,
  Rocket,
  CheckSquare,
  Music,
  ArrowRight,
} from "lucide-react";

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
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Know More",
        icon: <Video className="inline w-4 h-4" />,
      },
      {
        week: 9,
        title: "Fetal Development",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Download PDF",
        icon: <Download className="inline w-4 h-4" />,
      },
      {
        week: 13,
        title: "Baby Movement",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "View Here",
        icon: <Video className="inline w-4 h-4" />,
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
        title: "Pregnancy Health",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Quick Tips",
        icon: <Rocket className="inline w-4 h-4" />,
      },
      {
        week: 22,
        title: "Pregnancy Comfort",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "View Here",
        icon: <CheckSquare className="inline w-4 h-4" />,
      },
      {
        week: 27,
        title: "Yoga & Exercise",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Read More",
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
        title: "Healthy Sleep",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Watch Out",
        icon: <ArrowRight className="inline w-4 h-4" />,
      },
      {
        week: 36,
        title: "Relax with Music",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Hit Here",
        icon: <Music className="inline w-4 h-4" />,
      },
      {
        week: 40,
        title: "Lower Anxiety",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        link: "#",
        linkText: "Click Here",
        icon: <Video className="inline w-4 h-4" />,
      },
    ],
  },
];

export default function TrimesterChart() {
  return (
    <section id="trimester" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-pink-600">Trimester Chart</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Duas molestias excepturi sint occaecati cupiditate non provident,
            similique sunt in culpa qui officia deserunt mollitia animi, id est
            laborum et dolorum fuga.
          </p>
        </div>

        {/* Trimesters */}
        <div className="grid md:grid-cols-3 gap-2">
          {trimesters.map((tri, i) => (
            <div key={i} className=" rounded-lg overflow-hidden">
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
                      <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-40 bg-white text-gray-700 text-sm shadow-lg rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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
                <div className={`mt-6 p-4 rounded-lg text-center ${tri.color}`}>
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
