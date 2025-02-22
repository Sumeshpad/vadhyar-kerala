"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// Fetch data from API
async function fetchVadhyars() {
  const response = await fetch(
    "https://vadhyar-kerala.vercel.app/api/vadhyars",
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("API did not return an array:", data);
    return [];
  }

  return data;
}

export default function Vadhyars() {
  const [vadhyars, setVadhyars] = useState([]);
  const [filteredVadhyars, setFilteredVadhyars] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Loader state

  useEffect(() => {
    async function loadVadhyars() {
      setLoading(true); // ✅ Start loader
      const data = await fetchVadhyars();
      setVadhyars(data);
      setFilteredVadhyars(data);
      setLoading(false); // ✅ Stop loader when data loads
    }
    loadVadhyars();
  }, []);

  // Handle filtering based on selected criteria
  useEffect(() => {
    let filtered = vadhyars;

    if (selectedLanguage) {
      filtered = filtered.filter((vadhyar) =>
        vadhyar.tags.includes(selectedLanguage)
      );
    }

    if (selectedService) {
      filtered = filtered.filter((vadhyar) =>
        vadhyar.services
          .split(",")
          .some((service) => service.trim() === selectedService)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((vadhyar) =>
        vadhyar.location.includes(selectedLocation)
      );
    }

    setFilteredVadhyars(filtered);
  }, [selectedLanguage, selectedService, selectedLocation, vadhyars]);

  // Extract unique filter options
  const languages = [...new Set(vadhyars.map((vadhyar) => vadhyar.tags))];
  const services = [
    ...new Set(
      vadhyars.flatMap((vadhyar) =>
        vadhyar.services.split(",").map((s) => s.trim())
      )
    ),
  ];
  const locations = [...new Set(vadhyars.map((vadhyar) => vadhyar.location))];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">
        Find a Vadhyar Near You
      </h1>

      {/* Filters Section */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {/* Language Filter */}
        <select
          className="border p-2 rounded-md"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map((lang, index) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Service Filter */}
        <select
          className="border p-2 rounded-md"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">All Services</option>
          {services.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          className="border p-2 rounded-md"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Show Loader While Fetching Data */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVadhyars.length === 0 ? (
            <p className="text-center text-gray-500">
              No data found. Please check the API.
            </p>
          ) : (
            filteredVadhyars.map((vadhyar, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
              >
                {/* Avatar Image */}
                <Image
                  src={vadhyar.image}
                  alt={vadhyar.name}
                  width={200}
                  height={200}
                  priority
                  className="rounded-full w-[200px] h-[200px] mx-auto border-2 border-gray-300 object-cover"
                />

                {/* Text Content */}
                <div className="flex-grow text-left px-4 mt-3">
                  <h2 className="text-lg font-semibold">{vadhyar.name}</h2>

                  {/* Services as Buttons */}
                  <div className="mt-2 flex flex-wrap">
                    {vadhyar.services.split(",").map((service, i) => (
                      <span
                        key={i}
                        className="inline-block bg-red-200 text-red-800 text-sm font-medium px-3 py-1 rounded-md mr-2 mt-1"
                      >
                        {service.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Tags as Buttons */}
                  <div className="mt-2 flex flex-wrap">
                    {vadhyar.tags.split(",").map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mt-1"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  {vadhyar.location !== "Unknown" && (
                    <p className="text-sm text-gray-500 mt-2">
                      📍 {vadhyar.location}
                    </p>
                  )}
                </div>

                {/* WhatsApp Button */}
                <div className="mt-4 px-4">
                  <a
                    href={`https://wa.me/${vadhyar.phone}`}
                    className="bg-green-500 text-white py-2 px-4 text-center rounded w-full block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
