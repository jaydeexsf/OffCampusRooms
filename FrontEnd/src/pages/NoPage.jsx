import React from "react";
import { Link } from "react-router-dom"; 
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion"; 

const NoPage = () => {
  return (
    <div className="flex z-[11111111111111111111111111111111111111] absolute left-0 top-0 w-full flex-col items-center justify-center min-h-screen bg-gradient-to-r from-primary to-secondary dark:from-gray-800 dark:to-gray-900 text-white p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-center"
      >
        <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
        <p className="text-xl mt-4 mb-6">Oops! The page you’re looking for doesn’t exist.</p>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <img
            src="https://via.placeholder.com/300x200?text=Floating+404+Illustration"
            alt="404 Illustration"
            className="w-[300px] mx-auto"
          />
        </motion.div>

        <Link to="/" className="inline-block">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-8 py-4 bg-secondary shadow-md hover:bg-shadow-sm border-dark shadow-dark border-2 text-white rounded-full hover:bg-dark dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold text-lg flex items-center gap-2"
          >
            <FaHome />
            Return Home
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-12 text-center"
      >
        {/* <p className="text-lg dark:text-gray-300">
          Or explore the{" "}
          <Link to="/explore" className="underline hover:text-indigo-300">
            latest trends
          </Link>
        </p> */}
      </motion.div>
    </div>
  );
};

export default NoPage;
