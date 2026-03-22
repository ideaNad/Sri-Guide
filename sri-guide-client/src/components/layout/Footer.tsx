import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="relative flex items-center h-8 md:h-10">
                            <img
                                src="/logo.svg"
                                alt="SRIGuide Logo"
                                className="absolute left-0 h-40 w-auto brightness-0 invert object-contain"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Your ultimate travel companion to explore the wonders of Sri Lanka.
                            From pristine beaches to misty mountains, we guide you through it all.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { Icon: Facebook, href: "https://www.facebook.com/share/1L2EokQwo5/" },
                                { Icon: Instagram, href: "https://instagram.com/SriGuide" },
                                { Icon: Twitter, href: "https://twitter.com/SriGuide" },
                                { Icon: Youtube, href: "https://www.youtube.com/@SriGuide" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white"
                                >
                                    <social.Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {["About Us", "Our Tours", "Local Guides", "Travel Blog", "Contact Us"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-highlight transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Categories</h3>
                        <ul className="space-y-4">
                            {["Beach Vacations", "Cultural Heritage", "Wild Safari", "Hill Country", "Adventure Depot"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-highlight transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>+94 11 234 5678</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <span>hello@sriguide.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-gray-400 font-medium">
                    <p>© 2026 SriGuide Travel (Pvt) Ltd. All Rights Reserved.</p>

                    <div className="flex space-x-6 uppercase tracking-widest text-[10px]">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookies Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
