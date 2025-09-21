import { useState } from "react";
import { ContactUs } from "./ContactUs";
import DoctorDetails from "./DoctorDetails";
import { X } from "lucide-react";

const teamMembers = [
  {
    name: "Mary Johnson",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/do8.jpg",
    bio: "Mary Johnson has 10 years of experience in family practice.",
  },
  {
    name: "Dev Dixit",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/team1.jpg",
    bio: "Dev Dixit specializes in preventive care and wellness.",
  },
  {
    name: "Jeniffer Anis",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/do15.jpg",
    bio: "Jeniffer Anis focuses on women’s health and pediatrics.",
  },
  {
    name: "Marco Polo",
    qualification: "M B B S",
    role: "Family Practitioner",
    image: "/assets/images/do17.jpg",
    bio: "Marco Polo is passionate about patient-centered healthcare.",
  },
];

export default function Team() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <>
      <section className="py-16 bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Section Header */}
          <h2 className="text-3xl font-bold text-pink-600 mb-8">
            Our Specialized Team
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team of doctors and healthcare professionals is here
            to provide compassionate care and trusted medical expertise. With
            diverse specialties and years of experience, we work together to
            ensure the best care for you and your family.
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
                    <button
                      onClick={() => setSelectedDoctor(member)}
                      className="bg-white text-pink-600 font-medium px-4 py-2 rounded shadow hover:bg-pink-50"
                    >
                      View Details
                    </button>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Modal for Doctor Details */}

      {selectedDoctor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelectedDoctor(null)} // close on backdrop click
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-2/3 lg:w-2/3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 
                   text-gray-700 hover:text-black rounded-full p-2 shadow-md transition"
            >
              <X size={20} />
            </button>

            <DoctorDetails doctor={selectedDoctor} />
          </div>
        </div>
      )}
      <ContactUs />
    </>
  );
}
