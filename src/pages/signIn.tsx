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

const LoginPage: React.FC = () => {
  // State variables for form inputs
  const [fullName, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    setIsLoading(true); // Set loading state

    const formData = {
      fullName: fullName,
      password: password,
    };

    try {
      const response = await fetch('https://sosika-backend.onrender.com/api/deliveryPerson/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.message === "Delivery person login successful") {
        setModalMessage('Login successful!');
        // Store user data in localStorage
        localStorage.setItem('deliveryPersonName', data.deliveryPersonName);
        localStorage.setItem('deliveryPersonId', data.deliveryPersonId);
        localStorage.setItem('deliveryPersonLatitude', data.deliveryPersonLatitude);
        localStorage.setItem('deliveryPersonLongitude', data.deliveryPersonLongitude);
        // Redirect after success (handled by modal close)
        window.location.assign('/orders');
      } else {
        setModalMessage('Login failed: ' + (data.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to close the modal and handle redirection if successful
  const handleCloseModal = () => {
    setModalMessage('');
    if (modalMessage === "Login successful!") {
      window.location.href = 'home.html'; // Redirect to home page
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      {/* Welcome Section */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Sosika</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Welcome Back!</h2>
      </section>

      {/* Login Form Section */}
      <section className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="login-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="input">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
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

            {/* Submit Button */}
            <div className="form-button">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-600 mt-6">
          New on Sosika? Become a Rider Today! Sign up{' '}
          <a href="register.html" className="text-blue-600 hover:underline">
            here.
          </a>
        </p>
      </section>

      {/* Custom Modal for alerts */}
      <Modal message={modalMessage} onClose={handleCloseModal} />
    </div>
  );
};

export default LoginPage;
