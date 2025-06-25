import React from "react";

const DashboardSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 to-pink-300 p-10 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
        DEBUG: Patient Dashboard Loaded
      </h1>
      <h2 className="text-2xl font-semibold text-center mb-1">
        Welcome back, Alena
      </h2>
      <p className="text-center mb-8 text-gray-700">Your Kidney Care Dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Water Intake Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <h3 className="text-center text-lg font-bold text-purple-600 mb-6 relative">
            <span className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 text-2xl" role="img" aria-label="water droplet">💧</span>
            Water Intake
          </h3>
          <form className="space-y-4">
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <select className="w-full border border-gray-300 p-2 rounded">
              <option>Milliliters (ml)</option>
              <option>Ounces (oz)</option>
            </select>
            <select className="w-full border border-gray-300 p-2 rounded">
              <option>Select container</option>
              <option>Cup</option>
              <option>Bottle</option>
              <option>Glass</option>
            </select>
            <select className="w-full border border-gray-300 p-2 rounded">
              <option>Select drink</option>
              <option>Water</option>
              <option>Coffee</option>
              <option>Milk</option>
              <option>Juice</option>
            </select>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
              Add Intake
            </button>
            <button className="w-full mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded">
              See History
            </button>
          </form>
        </div>

        {/* Blood Pressure Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <h3 className="text-center text-lg font-bold text-blue-600 mb-6 relative">
            <span className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 text-2xl" role="img" aria-label="heart">🫀</span>
            Blood Pressure
          </h3>
          <form className="space-y-4">
            <input
              type="number"
              placeholder="Systolic (e.g. 120)"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <input
              type="number"
              placeholder="Diastolic (e.g. 80)"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <input
              type="number"
              placeholder="Pulse (e.g. 70)"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <input
              type="datetime-local"
              className="w-full border border-gray-300 p-2 rounded"
            />
            <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded">
              Add Reading
            </button>
            <button className="w-full mt-2 border border-sky-600 text-sky-600 hover:bg-sky-50 py-2 rounded">
              See History
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
