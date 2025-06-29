import React from "react";
import WaterIntakeForm from "./WaterIntakeForm";
import WaterHistory from "./WaterHistory";
import BloodPressureForm from "./BloodPressureForm";
import BloodPressureChart from "./BloodPressureChart";

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
          <WaterIntakeForm />
          <WaterHistory />
        </div>

        {/* Blood Pressure Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <h3 className="text-center text-lg font-bold text-blue-600 mb-6 relative">
            <span className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2 text-2xl" role="img" aria-label="heart">🫀</span>
            Blood Pressure
          </h3>
          <BloodPressureForm />
          <div className="mt-6">
            <BloodPressureChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;

