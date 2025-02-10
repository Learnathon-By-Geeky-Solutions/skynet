import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Building } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    // Placeholder for search functionality
    console.log('Searching with params:', searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar></Navbar>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Find Your Perfect Room</h1>
        <p className="text-xl text-gray-600 mb-8">Discover and book rooms effortlessly across various locations</p>

        {/* Search Container */}
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Check-in Date */}
            <div className="relative">
              <Calendar className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="date"
                name="checkIn"
                value={searchParams.checkIn}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <Calendar className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="date"
                name="checkOut"
                value={searchParams.checkOut}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Guests */}
            <div className="relative">
              <Users className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="number"
                name="guests"
                min="1"
                value={searchParams.guests}
                onChange={handleInputChange}
                placeholder="Guests"
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            <Search className="inline-block mr-2" size={20} /> Search Rooms
          </button>
        </div>
      </div>

      {/* Featured Rooms Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Featured Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Business Suite", price: "$120/night", icon: <Building size={40} /> },
            { name: "Luxury Room", price: "$250/night", icon: <Building size={40} /> },
            { name: "Standard Room", price: "$80/night", icon: <Building size={40} /> }
          ].map((room, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-4 text-blue-600">{room.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
              <p className="text-gray-600">{room.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
};

export default Home;