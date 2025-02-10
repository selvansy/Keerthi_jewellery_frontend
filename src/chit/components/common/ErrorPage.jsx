import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


export default function ErrorPage() {

    const layout_color = useSelector((state) => state.clientForm.layoutColor);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold text-blue-400 drop-shadow-lg"
      >
        404
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg mt-2"
      >
        Oops! Looks like you're lost in space.
      </motion.p>
      
      <motion.img 
        src="https://cdn-icons-png.flaticon.com/512/3255/3255809.png" 
        alt="Lost Astronaut" 
        className="w-48 h-48 mt-6 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      <Link to="/" className="mt-6">
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          className="mt-6 px-6 py-3 text-white rounded-lg shadow-lg transition"
          style={{ backgroundColor: layout_color }} >
          Take Me Home
        </motion.button>
      </Link>
    </div>
  );
}
