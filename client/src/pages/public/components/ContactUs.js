/* Contact Us */
export function ContactUs() {
  return (
    <section id="contact" className="py-16 bg-pink-50 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-pink-700 mb-3">Contact Us</h2>
          <p className="text-gray-600">
            Have questions? Get in touch with our doctors and care team.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="bg-white shadow rounded-xl p-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded p-2 mb-3"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded p-2 mb-3"
            />
            <input
              type="number"
              placeholder="Your Phone Number"
              className="w-full border rounded p-2 mb-3"
            />
            <textarea
              placeholder="Message"
              rows="8"
              className="w-full border rounded p-2 mb-3"
            />
            <button className="bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700">
              Send Message
            </button>
          </form>

          {/* Google Map with Address */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden shadow">
              <iframe
                title="Bislig Premier Birthing Home Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d318.17132788757134!2d126.3567559!3d8.1858627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fdbbd313ae1bf5%3A0x24376b032f893a26!2sBISLIG%20PREMIER%20BIRTHING%20HOME!5e0!3m2!1sen!2sph!4v1726900000000!5m2!1sen!2sph"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {/* Address Text */}
            <div className="bg-white shadow rounded-xl p-4 py-1">
              <h3 className="text-lg font-semibold text-pink-700">
                Bislig Premier Birthing Home
              </h3>
              <p className="text-gray-600 leading-relaxed">
                EGS Building, Espirito Street, Mangagoy, Bislig City
              </p>

              <div className="flex items-center space-x-2 text-gray-700">
                <span className="text-pink-600">⏰</span>
                <span>
                  <span className="font-medium text-pink-600">Schedule:</span>{" "}
                  Monday – Saturday, 9:00 AM – 5:00 PM
                </span>
              </div>

              <div className="flex items-center space-x-2 text-gray-700">
                <span className="text-pink-600">📞</span>
                <span>
                  <span className="font-medium text-pink-600">Phone:</span> 0917
                  113 5187
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
