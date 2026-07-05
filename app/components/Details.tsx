'use client';

import About from '../sections/About';
import Experience from '../sections/Experience';
import Projects from '../sections/Projects';
import TechStack from '../sections/TechStack';

const Details = () => {
  return (
    <div className="flex-1 h-full bg-red">
      <div className="flex flex-col h-full px-4 md:px-6 py-6 pb-12 space-y-5">
        <About />
        <TechStack />
        <Experience />
        <Projects />
      </div>
    </div>
  );
};

export default Details;
