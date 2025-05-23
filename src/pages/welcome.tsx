import React from 'react';
import { motion } from 'framer-motion';

// Variants for text animation (staggering words)
const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Stagger words by 0.05 seconds
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Main App component for the welcome screen
const WelcomeScreen: React.FC = () => {
  return (
    <div className="grid min-h-screen bg-gradient-to-br from-indigo-700 to-purple-900 flex items-center justify-center p-4  relative overflow-hidden">
        <h1 className='text-center text-3xl font-extrabold text-[#00bfff]'>Sosika</h1>
      {/* Abstract Animated Background Shape */}
      <motion.div
        className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"
        initial={{ x: -300, y: -300, scale: 0.5 }}
        animate={{ x: 300, y: 300, scale: 1.2 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-3xl"
        initial={{ x: 300, y: 300, scale: 1.2 }}
        animate={{ x: -300, y: -300, scale: 0.5 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 max-w-lg w-full text-center overflow-hidden relative z-10 border border-gray-100 backdrop-filter backdrop-blur-sm bg-opacity-90">
        {/* Animated Delivery Truck Icon */}
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-green-500 rounded-full flex items-center justify-center shadow-xl"
          initial={{ y: -200, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.3,
          }}
        >
          {/* SVG for a delivery truck */}
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 462.996 462.996"  enable-background="new 0 0 462.996 462.996">
  <g>
    <path d="m459.215,105.782c-3.082-3.672-7.733-5.778-12.764-5.778h-107.821-64.692-107.82c-9.575,0-18.392,7.458-20.069,16.98l-39.925,226.423c-0.892,5.058 0.385,10.09 3.503,13.806 3.082,3.672 7.733,5.778 12.764,5.778h280.334c9.575,0 18.392-7.458 20.069-16.98l39.925-226.423c0.89-5.058-0.386-10.09-3.504-13.806zm-129.524,9.222l-8.988,50.976-.655-.36c-2.083-1.143-4.581-1.229-6.738-0.239l-8.303,3.815-6.521-3.577c-2.082-1.141-4.58-1.229-6.737-0.239l-8.308,3.816-6.521-3.576c-1.12-0.615-2.362-0.924-3.606-0.924-0.634,0-1.269,0.08-1.888,0.241l8.805-49.934h49.46zm118.255,1.981l-39.925,226.423c-0.416,2.356-2.99,4.584-5.298,4.584h-280.333c-0.344,0-0.966-0.055-1.273-0.42-0.261-0.311-0.341-0.879-0.222-1.56l39.925-226.423c0.416-2.356 2.99-4.584 5.298-4.584h98.882l-10.805,61.281c-0.484,2.747 0.596,5.535 2.804,7.24 1.337,1.032 2.953,1.563 4.583,1.563 1.063,0 2.131-0.226 3.13-0.685l8.305-3.815 6.521,3.576c2.079,1.142 4.579,1.23 6.737,0.24l8.308-3.816 6.522,3.577c2.082,1.142 4.581,1.229 6.738,0.239l8.303-3.815 6.521,3.577c2.122,1.163 4.672,1.232 6.851,0.186 2.18-1.046 3.722-3.079 4.142-5.46l11.265-63.886h101.528c0.344,0 0.966,0.055 1.273,0.42 0.259,0.309 0.339,0.878 0.22,1.558z"/>
    <path d="m119,171.504c0-4.142-3.357-7.5-7.5-7.5h-88c-4.143,0-7.5,3.358-7.5,7.5s3.357,7.5 7.5,7.5h88c4.143,0 7.5-3.358 7.5-7.5z"/>
    <path d="m95.5,260.004h-40c-4.143,0-7.5,3.358-7.5,7.5s3.357,7.5 7.5,7.5h40c4.143,0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5z"/>
    <path d="m111,219.504c0-4.142-3.357-7.5-7.5-7.5h-64c-4.143,0-7.5,3.358-7.5,7.5s3.357,7.5 7.5,7.5h64c4.143,0 7.5-3.358 7.5-7.5z"/>
    <path d="m127,123.504c0-4.142-3.357-7.5-7.5-7.5h-112c-4.143,0-7.5,3.358-7.5,7.5s3.357,7.5 7.5,7.5h112c4.143-2.84217e-14 7.5-3.358 7.5-7.5z"/>
  </g>
</svg>
        </motion.div>

        {/* Welcome Text */}
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 mt-16 sm:mt-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {"Welcome, Rider!".split(" ").map((word, i) => (
            <motion.span key={i} className="inline-block mr-2" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-600 mb-8"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {"Your journey to swift deliveries starts here.".split(" ").map((word, i) => (
            <motion.span key={i} className="inline-block mr-1" variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <motion.button
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/signup'}
          >
            <span className="relative z-10">Register</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>

          <motion.button
            className="w-full py-3 px-6 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/signin'}
          >
            <span className="relative z-10">Login</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
