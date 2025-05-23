import React, { useState } from 'react';

// Custom Modal Component (replaces alert())
type ModalProps = {
  message: string;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  // State variables for form inputs
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [collegeId, setCollegeId] = useState<string>('1'); // Default to '1'
  const [transportType, setTransportType] = useState<string>('foot'); // Default to 'foot'
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Click "Get My Location"');
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle getting user's location
  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setLocationStatus(`Location set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationStatus("Location access denied. Please allow location permissions.");
        }
      );
    } else {
      setLocationStatus("Geolocation is not supported by your browser.");
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    // Validate password match
    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match!");
      return;
    }

    // Validate location
    if (latitude === null || longitude === null) {
      setModalMessage("Please get your location before registering.");
      return;
    }

    setIsLoading(true); // Set loading state

    // Prepare data for backend
    const userData = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      collegeId: parseInt(collegeId),
      transportType: transportType,
      password: password,
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const response = await fetch("https://sosika-backend.onrender.com/api/deliveryPerson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage("Registration successful!");
        // Redirect after success (handled by modal close)
        window.location.assign('/signin');
      } else {
        setModalMessage(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to close the modal and handle redirection if successful
  const handleCloseModal = () => {
    setModalMessage('');
    if (modalMessage === "Registration successful!") {
      window.location.href = "index.html"; // Redirect after success
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => (window.history.length > 1 ? window.history.back() : (window.location.href = '/'))}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-md"
        >
          &#8592; Back
        </button>
      </div>

      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Sosika</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Welcome To Sosika!</h2>
      </section>

      {/* Registration Form Section */}
      <section className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="login-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div className="input">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone Number Input */}
            <div className="input">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel" // Changed to tel for phone numbers
                name="phone"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Institute Select */}
            <div className="input">
              <label htmlFor="college" className="block text-gray-700 font-medium mb-1">Institute</label>
              <select
                name="college"
                id="college"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="1">College 1</option>
                <option value="2">College 2</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Location Input */}
            <div className="input">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-1">Your Location</label>
              <button
                type="button"
                id="get-location"
                onClick={handleGetLocation}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors mb-2 shadow-sm"
              >
                Get My Location
              </button>
              <input type="hidden" name="latitude" id="latitude" value={latitude || ''} />
              <input type="hidden" name="longitude" id="longitude" value={longitude || ''} />
              <p id="location-status" className="text-sm text-gray-600">{locationStatus}</p>
            </div>

            {/* Mode of Transport Select */}
            <div className="input">
              <label htmlFor="transport-type" className="block text-gray-700 font-medium mb-1">Mode of Transport</label>
              <select
                name="transport-type"
                id="transport-type"
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="foot">Foot</option>
                <option value="bicycle">Bicycle</option>
                <option value="motocycle">Motorcycle</option>
                <option value="car">Car</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="input">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="input">
              <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="form-button">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'REGISTERING...' : 'REGISTER'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-600 mt-6">
          Already a Vendor on Sosika?{' '}
          <a href="index.html" className="text-blue-600 hover:underline">
            Login here.
          </a>
        </p>
      </section>

      {/* Custom Modal for alerts */}
      <Modal message={modalMessage} onClose={handleCloseModal} />
    </div>
  );
};

export default RegisterPage;
