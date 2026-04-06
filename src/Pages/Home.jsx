import React, { useState } from "react";
import axios from "axios";
import { FaPlane } from "react-icons/fa";

function App() {
  const [airport, setAirport] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("departure");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  const validate = () => {
    if (!airport || airport.length !== 3) {
      return "Enter valid IATA code (BOM)";
    }
    if (!date) return "Select date";
    return "";
  };

  const fetchFlights = async () => {
    const err = validate();
    if (err) return setError(err);

    setError("");
    setLoading(true);

    try {
      const res = await axios.get(
        "https://agami-interview-backend.onrender.com/api/flights",
        {
          params: { airport, date, type },
        },
      );

      setFlights(res.data.results);
      setPage(1);
    } catch {
      setError("Failed to fetch");
    }

    setLoading(false);
  };

  const start = (page - 1) * itemsPerPage;
  const data = flights.slice(start, start + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-900">
          <FaPlane className="text-blue-700" />
          Flight Search
        </h1>

        {/* Search Form */}
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-md flex flex-wrap gap-4 justify-center mb-8">
          <input
            type="text"
            placeholder="Airport Code (BOM)"
            value={airport}
            onChange={(e) => setAirport(e.target.value.toUpperCase())}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2 rounded-lg"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2 rounded-lg"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="departure">Departure</option>
            <option value="arrival">Arrival</option>
          </select>

          <button
            onClick={fetchFlights}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow transition"
          >
            Search Flights
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Table View */}
        <div className="hidden md:block bg-white shadow-xl rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-3">Airline</th>
                <th>Flight</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Dep Time</th>
                <th>Arr Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((f, i) => (
                <tr key={i} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3 font-medium">{f.airline}</td>
                  <td>{f.flight_number}</td>
                  <td>{f.departure}</td>
                  <td>{f.arrival}</td>
                  <td>{f.departure_time}</td>
                  <td>{f.arrival_time}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        f.status === "scheduled"
                          ? "bg-green-100 text-green-700"
                          : f.status === "delayed"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid md:hidden gap-4">
          {data.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-4 rounded-xl shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-blue-800">{f.airline}</h2>
                <span className="text-sm text-gray-500">{f.flight_number}</span>
              </div>

              <p className="text-gray-700">
                {f.departure} ➝ {f.arrival}
              </p>

              <p className="text-sm text-gray-500">
                {f.departure_time} → {f.arrival_time}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                  f.status === "scheduled"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {f.status}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ Prev
          </button>

          <span className="font-semibold text-blue-900">Page {page}</span>

          <button
            disabled={start + itemsPerPage >= flights.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
