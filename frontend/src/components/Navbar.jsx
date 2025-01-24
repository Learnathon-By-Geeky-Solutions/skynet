import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600"><Link to="/">Skynet</Link></div>
                <nav className="space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <a href="#" className="text-gray-700 hover:text-blue-600">Bookings</a>
                <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
                <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
                </nav>
            </div>
        </header>
    )
}

export default Navbar;