/* Contact Us */
export function ContactUs() {
  return (
    <section id="contact" className="py-16 bg-pink-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-pink-700 mb-6">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Have questions? Get in touch with our doctors and care team.
        </p>
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
          <textarea
            placeholder="Message"
            className="w-full border rounded p-2 mb-3"
          />
          <button className="bg-pink-600 text-white py-2 px-6 rounded hover:bg-pink-700">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
