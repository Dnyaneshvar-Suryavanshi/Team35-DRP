Contact
import React from "react";
export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-600 text-white py-12">
                <h1 className="text-3xl font-bold text-center">
                    Contact Us
                </h1>
                <p className="text-center mt-2 text-blue-100">
                    We are here to help you
                </p>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-6">


                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">
                            Get in Touch
                        </h2>
                        <p className="text-gray-700 mb-4">
                            If you have any questions, issues, or feedback regarding ration distribution,
                            feel free to contact us.
                            <br /><br />
                            यदि आपको राशन वितरण से संबंधित कोई भी प्रश्न, समस्या या सुझाव हों, तो कृपया हमसे संपर्क करने में संकोच न करें।
                            <br /><br />
                            रेशन वितरणासंबंधी आपल्याला कोणतेही प्रश्न, अडचणी किंवा अभिप्राय असल्यास, कृपया आमच्याशी संपर्क साधण्यास अजिबात संकोच करू नका।
                        </p>

                        <div className="space-y-2 text-gray-700">
                            <p><strong>Email:</strong> Nochinta@rationportal.gov</p>
                            <p><strong>Phone:</strong> +91 98765 43210</p>
                            <p><strong>Office Hours:</strong> 9:00 AM – 6:00 PM</p>
                            <p><strong>Address:</strong> Civil Supplies Department, India </p>
                            <p><strong>Devloper:</strong> AlfhaVibe  From Cdac Kharghar, Mumbai </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">
                            Send a Message
                        </h2>
                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                placeholder="Your Message"
                                rows="4"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}