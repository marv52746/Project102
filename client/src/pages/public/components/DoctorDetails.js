// src/components/DoctorDetails.js
import { Twitter, Facebook, Mail } from "lucide-react";

const DoctorDetails = () => {
  return (
    <>
      <section className="py-16 bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Section Header */}
          <h2 className="text-3xl font-bold text-pink-600 mb-8">
            Doctor Details
          </h2>
        </div>
        <div className="max-w-5xl mx-auto  rounded-3xl ">
          <div className="grid md:grid-cols-3">
            {/* Doctor Image */}
            <div className="relative">
              <img
                src="https://dtpregnancy.wpengine.com/wp-content/uploads/2016/05/do21.jpg"
                alt="Dr. Aachman Rio"
                className="w-full h-full object-cover"
              />
              <a
                href="#"
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
              bg-pink-500 text-white text-sm px-6 py-2 rounded-full shadow-md
              hover:bg-pink-600 transition-all"
              >
                Book Appointment
              </a>
            </div>

            {/* Doctor Info */}
            <div className="md:col-span-2 p-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Dr. Aachman Rio
                  </h2>
                  <p className="text-sm text-gray-500">M.D, F.A.C.S.</p>
                  <p className="text-pink-600 font-medium mt-1">
                    General Practitioner
                  </p>
                </div>

                {/* Socials */}
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b my-5"></div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Qualification
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    M.D, F.A.C.S., MS - Obstetrics and Gynaecology
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Certification
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>National Specialist Register in Pregnancy</li>
                    <li>Gynecology Department of Science Major</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Awards</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Pregnancy Care for Women 2016</li>
                    <li>Best Doctor for Women</li>
                    <li>Prescription of Medicine</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DoctorDetails;
