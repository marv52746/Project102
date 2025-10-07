import {
  Twitter,
  Facebook,
  Mail,
  Instagram,
  Linkedin,
  Youtube,
  X,
} from "lucide-react";
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
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Doctor Image (Desktop Only) */}
            <div className="relative w-full h-72 md:h-auto hidden md:block">
              <img
                src={
                  getAvatarUrl(doctor?.avatar || "") ||
                  "/assets/images/default-male.jpg"
                }
                alt={doctor.name}
                className="w-full h-full object-cover md:rounded-l-3xl"
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
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between">
              {/* 🔹 Mobile Top Section: image + name + socials */}
              <div className="flex md:hidden items-center gap-4 mb-4">
                <img
                  src={
                    getAvatarUrl(doctor?.avatar || "") ||
                    "/assets/images/default-male.jpg"
                  }
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">
                    {doctor.fullname}
                  </h2>
                  <p className="text-sm text-gray-500">{doctor.suffix}</p>
                  <p className="text-pink-600 font-medium text-sm mt-1">
                    {Array.isArray(doctor.specialization) &&
                    doctor.specialization.length > 0
                      ? doctor.specialization.join(", ")
                      : "Not specified"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {doctor.twitter && (
                      <a
                        href={doctor.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Twitter size={14} />
                      </a>
                    )}
                    {doctor.facebook && (
                      <a
                        href={doctor.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Facebook size={14} />
                      </a>
                    )}
                    {doctor.instagram && (
                      <a
                        href={doctor.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Instagram size={14} />
                      </a>
                    )}
                    {doctor.linkedin && (
                      <a
                        href={doctor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Linkedin size={14} />
                      </a>
                    )}
                    {doctor.youtube && (
                      <a
                        href={doctor.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Youtube size={14} />
                      </a>
                    )}
                    {doctor.email && (
                      <a
                        href={`mailto:${doctor.email}`}
                        className="p-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                      >
                        <Mail size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* 🔹 Desktop Header */}
              <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {doctor.fullname}
                  </h2>
                  <p className="text-sm text-gray-500">{doctor.suffix}</p>
                  <p className="text-pink-600 font-medium mt-1">
                    {Array.isArray(doctor.specialization) &&
                    doctor.specialization.length > 0
                      ? doctor.specialization.join(", ")
                      : "Not specified"}
                  </p>
                </div>

                {/* Socials */}
                <div className="flex flex-wrap justify-start md:justify-end gap-2">
                  {doctor.twitter && (
                    <a
                      href={doctor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {doctor.facebook && (
                    <a
                      href={doctor.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {doctor.instagram && (
                    <a
                      href={doctor.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {doctor.linkedin && (
                    <a
                      href={doctor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {doctor.youtube && (
                    <a
                      href={doctor.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Youtube size={18} />
                    </a>
                  )}
                  {doctor.email && (
                    <a
                      href={`mailto:${doctor.email}`}
                      className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                    >
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-b my-5"></div>

              {/* Other Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                {doctor.qualification?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Qualification
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {doctor.qualification.map((cert, i) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {doctor.certifications?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">
                      Certifications
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {doctor.certifications.map((cert, i) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {doctor.awards?.length > 0 && (
                  <div className="sm:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-1">Awards</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {doctor.awards.map((award, i) => (
                        <li key={i}>{award}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {doctor.bio && (
                  <div className="sm:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-1">About</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {doctor.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Book Appointment (Mobile only) */}
              <div className="mt-6 text-center md:hidden">
                <button
                  onClick={() => setBookAppointment(doctor)}
                  className="bg-pink-500 text-white text-sm px-8 py-3 rounded-full shadow-md
                    hover:bg-pink-600 transition-all whitespace-nowrap"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      {bookAppointment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
          onClick={() => setBookAppointment(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
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
