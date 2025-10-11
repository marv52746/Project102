import { useState } from "react";
import { ContactUs } from "./ContactUs";
import DoctorDetails from "./DoctorDetails";
import { X } from "lucide-react";
import { getAvatarUrl } from "../../../core/utils/avatarURL";

export default function Team({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <>
      <section className="py-4 sm:py-16 bg-gray-50 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Section Header */}
          <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6 sm:mb-8">
            Our Specialized Team
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our dedicated team of doctors and healthcare professionals is here
            to provide compassionate care and trusted medical expertise. With
            diverse specialties and years of experience, we work together to
            ensure the best care for you and your family.
          </p>

          {/* Team Grid */}
          <div className="mt-8 sm:mt-12">
            <div
              className="
      flex sm:flex-wrap justify-start sm:justify-center
      gap-4 sm:gap-8
      overflow-x-auto sm:overflow-visible
      pb-4 sm:pb-0
      snap-x snap-mandatory
      scrollbar-hide
    "
            >
              {doctors.map((member, i) => (
                <div
                  key={i}
                  className="
          flex-shrink-0
          w-44 sm:w-60 md:w-64
          bg-white shadow-md rounded-xl overflow-hidden
          group relative
          snap-center
          transition-transform duration-300 hover:scale-105
        "
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={
                        getAvatarUrl(member?.avatar || "") ||
                        "/assets/images/default-male.jpg"
                      }
                      alt={member.name}
                      className="w-full h-52 sm:h-72 object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-pink-500 bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setSelectedDoctor(member)}
                        className="bg-white text-pink-600 font-medium px-3 py-1.5 rounded shadow hover:bg-pink-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3 text-center">
                    <h4 className="font-semibold text-sm sm:text-base">
                      {member.first_name} {member.last_name}{" "}
                      <span className="text-xs text-gray-500">
                        {member.suffix}
                      </span>
                    </h4>
                    <h5 className="text-xs sm:text-sm text-pink-600 truncate">
                      {member.specialization}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Modal for Doctor Details */}

      {selectedDoctor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Doctor Info */}
            <div className="p-0 sm:p-6">
              <div className="absolute top-0 right-2 flex justify-end p-3 z-50">
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="bg-gray-100 hover:bg-gray-200 
             text-gray-700 hover:text-black rounded-full p-2 shadow-md transition"
                >
                  <X size={20} />
                </button>
              </div>
              <DoctorDetails doctor={selectedDoctor} />
            </div>
          </div>
        </div>
      )}

      <ContactUs />
    </>
  );
}
