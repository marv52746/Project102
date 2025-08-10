import { Link } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";

export default function Home() {
  return (
    <div className="font-sans">
      {/* Navigation */}
      <header className="bg-blue-700 text-white">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <h1 className="text-xl font-bold">Medical Clinic</h1>
          <nav className="space-x-6">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="#appointments" className="hover:underline">
              Appointments
            </a>
            <a href="#doctors" className="hover:underline">
              Doctors
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
            <a>
              <Link to={all_routes.login}>Login</Link>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[url('https://medical-clinic.cmsmasters.net/wp-content/uploads/2016/06/home-2-section-bg.jpg')] bg-cover bg-center text-white">
        <div className="bg-black/60">
          <div className="container mx-auto px-4 py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Medical Clinic
            </h1>
            <p className="text-lg md:text-xl mb-6">
              A modern solution for all your medical needs
            </p>
            <button className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3">
              Make an Appointment
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="appointments" className="bg-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">
          <div className="bg-blue-700 text-white p-8 rounded-lg w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Book an Appointment</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="bg-blue-600 text-white p-3 rounded border border-blue-500">
                <option>Select Departments</option>
              </select>
              <select className="bg-blue-600 text-white p-3 rounded border border-blue-500">
                <option>Select Doctors</option>
              </select>

              <input
                type="text"
                placeholder="Your Name"
                className="bg-blue-600 text-white p-3 rounded border border-blue-500"
              />
              <input
                type="text"
                placeholder="Phone"
                className="bg-blue-600 text-white p-3 rounded border border-blue-500"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="bg-blue-600 text-white p-3 rounded border border-blue-500"
              />
              <input
                type="date"
                className="bg-blue-600 text-white p-3 rounded border border-blue-500"
              />

              <div className="md:col-span-2">
                <button className="w-full bg-white text-blue-700 font-semibold py-3">
                  Make an Appointment
                </button>
              </div>
            </form>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-blue-600 font-medium mb-2">Testimonials</p>
            <h3 className="text-3xl font-bold mb-4">Our Clients Say</h3>
            <div className="bg-white shadow-lg rounded-md">
              <div className="bg-cyan-500 text-white px-6 py-4 rounded-t-md flex items-center gap-4">
                <img
                  src="https://medical-clinic.cmsmasters.net/wp-content/uploads/2016/06/testimonials-1-90x90.jpg"
                  alt="Vanessa Adams"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="font-semibold">Vanessa Adams</p>
                  <p className="text-sm">Officer Cleaner</p>
                </div>
              </div>
              <div className="p-6">
                <blockquote className="italic border-l-4 border-cyan-500 pl-4">
                  I have been to see Dr. Powers twice now and am very satisfied
                  with the services provided. I have been dealing with pain for
                  over a year now and Dr. Powers has given me great advice, new
                  ideas for helping relieve my pain, and effective prescription
                  pain management. The office staff is cheerful and helpful.
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Details Section */}
      <section id="doctors" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <img
              src="https://medicenter.bold-themes.com/clinic/wp-content/uploads/sites/2/2015/12/doctor-5.jpg"
              alt="Earlene Milone"
              className="rounded-lg w-full md:w-1/2 shadow-md"
            />
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-2">Earlene Milone, Prof.</h2>
              <p className="text-sm text-gray-600 mb-4">
                Laryngological Clinic
              </p>
              <p className="text-gray-700 mb-6">
                Dr. Adams is certified by the American Board in Internal
                Medicine and in hematology and medical oncology. He currently
                serves as a consultant in medical oncology at Medicenter
                Hospital and as the program director for the National Healthcare
                Group Medical Oncology Residency Program.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Speciality:</strong> Laryngologist
                </p>
                <p>
                  <strong>Degrees:</strong> M.D. of Medicine
                </p>
                <p>
                  <strong>Expertise:</strong> Adolescent Health, Immunology,
                  Internal Medicine
                </p>
                <p>
                  <strong>Office:</strong> 12, Hall B
                </p>
                <p>
                  <strong>Gender:</strong> Female
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Medical Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
