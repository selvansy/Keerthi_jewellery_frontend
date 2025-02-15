import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
 
const Loading = () => {
 
  const layout_color = useSelector((state) => state.clientForm.layoutColor);
 
  return (
    <div className="flex justify-center items-center ">
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ border: layout_color }}
      />
    </div>
  );
};
 
export default Loading;