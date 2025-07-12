import React from 'react';
import Hero from '../components/Hero';
import Text from '../components/Text';
import RotatingText from '../components/RotatingText';
import { motion } from 'framer-motion'; // ✅ Import motion
import { GlowingEffect } from '../components/ui/Glowing-effect';
import { PinContainer } from '../components/3Dpin';
import { Link } from 'react-router-dom';
import { FeaturesSectionDemo } from '../components/BentoGrid';
import { MultiStepLoaderDemo } from '../components/loader';

const Home = () => {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="relative w-full h-screen ">
      {/* Hero as full-screen background */}
      <Hero />

      {/* Main heading text positioned near top */}
      <div className="absolute top-[15vh] left-1/2 transform -translate-x-1/2 z-10">
        <Text
          text="Inside a Walmart Store?"
          delay={250}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-7xl font-bold text-white text-center"
        />
      </div>

      {/* 👇 Convert this to motion.div */}
      <motion.div
        className="absolute top-[30vh] left-[60vh] transform -translate-x-1/2 z-10 flex items-center space-x-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
      >

        <h1 className="font-bold text-3xl font-orbitron text-white">
          Struggling to find
        </h1>



        <RotatingText
          texts={['Fresh Section', 'Trial Room', 'Billing Counter']}
          mainClassName="px-4 sm:px-6 md:px-8 bg-cyan-300 text-black font-orbitron font-bold text-3xl overflow-hidden py-1 sm:py-2 md:py-3 justify-center rounded-lg"
          staggerFrom="first"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-1 sm:pb-1.5 md:pb-2"
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </motion.div>
      {/* <div>
        <Link to="/home">
      <PinContainer
        title="Navigate Freely"
        href="https://your-link.com"
        containerClassName="my-8 absolute top-[35vh] left-[70vh] min-w-[110px]"
        className="text-white text-lg "
      >
        <div>

          <h2 className="text-xl font-bold min-w-[140px]  "> Smart Store Assistant</h2>
          <p>We are here to help</p>
        </div>
      </PinContainer>
      </Link>
      </div> */}
 

      <motion.div className='absolute top-[60vh] left-[10vh]'
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}>
        <FeaturesSectionDemo/>
      </motion.div>

      <motion.div className='absolute top-[20vh] left-[80vh] z-20' 
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}>
        <MultiStepLoaderDemo/>
      </motion.div>
    </div>
  );
};

export default Home;
