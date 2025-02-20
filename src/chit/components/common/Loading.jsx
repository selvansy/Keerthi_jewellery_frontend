import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Loading = () => {

  const layout_color = useSelector((state) => state.clientForm.layoutColor);
 
  return (
    <div className="flex justify-center items-center my-16">
      <motion.div
        className="w-10 h-10 border-4 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ borderColor: layout_color }} 
      />
    </div>
  );
};

export default Loading;