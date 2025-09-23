// src/components/DoctorDetails.js
import { Twitter, Facebook, Mail, X } from "lucide-react";
import { getAvatarUrl } from "../../../core/utils/avatarURL";
import { useState } from "react";
import BookAppointmentForm from "./BookAppointmentForm";
import { useDispatch, useSelector } from "react-redux";

const DoctorDetails = ({ doctor }) => {
  const [bookAppointment, setBookAppointment] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  if (!doctor) return null;

  return (
    <>
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <h2 className="text-3xl font-bold text-pink-600 mb-8">
            Doctor Details
          </h2>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl">
          <div className="grid md:grid-cols-3">
            {/* Doctor Image */}
            <div className="relative">
              <img
                src={
                  getAvatarUrl(doctor?.avatar || "") ||
                  "/assets/images/default-male.jpg"
                }
                alt={doctor.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => setBookAppointment(doctor)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
    bg-pink-500 text-white text-sm px-6 py-2 rounded-full shadow-md
    hover:bg-pink-600 transition-all whitespace-nowrap"
              >
                Book Appointment
              </button>
            </div>

            {/* Doctor Info */}
            <div className="md:col-span-2 p-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {doctor.fullname}
                  </h2>
                  <p className="text-sm text-gray-500">{doctor.suffix}</p>
                  <p className="text-pink-600 font-medium mt-1">
                    {doctor.specialization}
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
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Qualification
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {doctor.qualification || "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Certification
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>General Medical License</li>
                    <li>Specialist Certification</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Awards</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Outstanding Service Award</li>
                    <li>Top Medical Practitioner</li>
                  </ul>
                </div>

                {doctor.bio && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-1">About</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {doctor.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {bookAppointment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setBookAppointment(null)} // close on backdrop click
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setBookAppointment(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 
                   text-gray-700 hover:text-black rounded-full p-2 shadow-md transition z-50"
            >
              <X size={20} />
            </button>

            <BookAppointmentForm
              userInfo={userInfo}
              dispatch={dispatch}
              doctor={doctor}
              title="Book Your Appointment"
              description=""
              onClose={() => setBookAppointment(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDetails;
