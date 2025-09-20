// import { Facebook, Twitter, Pinterest } from "lucide-react";

import { ContactUs } from "./ContactUs";
import DoctorDetails from "./DoctorDetails";

const teamMembers = [
  {
    name: "Mary Johnson",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/do8.jpg",
  },
  {
    name: "Dev Dixit",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/team1.jpg",
  },
  {
    name: "Jeniffer Anis",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/do15.jpg",
  },
  {
    name: "Marco Polo",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/do17.jpg",
  },
  //   {
  //     name: "Peter Leo",
  //     qualification: "M B B S",
  //     role: "Family Practitioner",
  //     image: "/assets/images/do20.jpg",
  //   },
];

export default function Team() {
  return (
    <>
      <section className="py-16 bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Section Header */}
          <h2 className="text-3xl font-bold text-pink-600 mb-8">
            Our Specialized Team
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed
            sagittis nisi. Curabitur eget sagittis dui. In dignissim mauris
            augue.
          </p>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group relative bg-white shadow-md rounded-lg overflow-hidden"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-pink-500 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <a
                      href="#"
                      className="bg-white text-pink-600 font-medium px-4 py-2 rounded shadow hover:bg-pink-50"
                    >
                      View Details
                    </a>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 text-center">
                  <h4 className="font-bold text-lg">
                    {member.name}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      {member.qualification}
                    </span>
                  </h4>
                  <h5 className="text-sm text-pink-600">{member.role}</h5>

                  {/* Social Icons */}
                  {/* <div className="flex justify-center gap-4 mt-3 text-gray-500">
                  <a href="#" className="hover:text-pink-600">
                    <Pinterest className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-pink-600">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="hover:text-pink-600">
                    <Facebook className="w-4 h-4" />
                  </a>
                </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DoctorDetails />
      <ContactUs />
    </>
  );
}
