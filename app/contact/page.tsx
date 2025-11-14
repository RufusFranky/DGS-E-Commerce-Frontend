"use client";

import Image from "next/image";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16 text-black">
      {/* Banner Section */}
      <section className="relative w-full h-[350px] md:h-[350px] bg-black">
        <Image
          src="/Jaguar-Sports-Carsa.jpg"
          alt="Contact us vehicle banner"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            We’re here to help! Reach out to us — our team will get back to you
            as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
          {/* Phone */}
          <a
            href="tel:+919876543210"
            className="p-6 rounded-xl shadow hover:shadow-lg transition block Phone_div text-white"
          >
            <FaPhoneAlt className="text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Call Us</h3>
            <p className="text-white mt-2">+91 98765 43210</p>
          </a>

          {/* Email */}
          <a
            href="mailto:rufusfranky@gmail.com"
            className="p-6 rounded-xl shadow hover:shadow-lg transition block Email_div text-white"
          >
            <FaEnvelope className=" text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Email</h3>
            <p className="text-white mt-2">rufusfranky@gmail.com</p>
          </a>

          {/* Location */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-xl shadow hover:shadow-lg transition block Location_div text-white"
          >
            <FaMapMarkerAlt className=" text-3xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Location</h3>
            <p className="text-white mt-2">Chennai, Tamil Nadu, India</p>
          </a>
        </div>

        {/* WhatsApp */}
        <div className="text-center mb-12">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition"
          >
            <FaWhatsapp className="text-2xl" /> Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Send Us a Message
          </h3>
          <form className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={5}
              className="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
