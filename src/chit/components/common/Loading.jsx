import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Loader = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  return (
    <div className={`flex justify-center items-center h-50 transition-colors duration-500`} >
      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full my-8"
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
            style={{ backgroundColor: layout_color }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
