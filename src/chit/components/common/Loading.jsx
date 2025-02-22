import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Loading = () => {
  const layout_color = useSelector((state) => state.clientForm.layoutColor);

  return (
    <div className="flex justify-center items-center my-16">
      <motion.div
        className="w-12 h-12 border-4 border-solid rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          borderTopColor: layout_color, // This will be the rotating color
          borderRightColor: 'transparent', // Hide right side
          borderBottomColor: 'transparent', // Hide bottom side
          borderLeftColor: 'transparent', // Hide left side
        }}
      />
    </div>
  );
};

export default Loading;
