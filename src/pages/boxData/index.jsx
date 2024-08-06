// components/RainComponent.js
import { useState, useEffect, useRef } from 'react';
import styles from './rain.module.css';

const RainComponent = () => {
  const [activeToggle, setActiveToggle] = useState('splat-toggle');
  const frontRowRef = useRef(null);

  useEffect(() => {
    const makeItRain = () => {
      if (frontRowRef.current) {
        frontRowRef.current.innerHTML = '';
      }

      const incrementStep = 2; // Decrease the increment to increase the number of drops
      let increment = 0;
      let drops = "";

      while (increment < 100) {
        const randoHundo = Math.floor(Math.random() * 98) + 1;
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
        increment += incrementStep; // Use a smaller increment step

        drops += `
          <div class="${styles.drop}" style="left: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 100}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
            <div class="${styles.stem}" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
            <div class="${styles.splat}" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
          </div>`;
      }

      if (frontRowRef.current) {
        frontRowRef.current.innerHTML = drops;
      }
    };

    makeItRain();
  }, [activeToggle]);

  return (
    <div className={`${styles.container} ${styles[activeToggle]}`}>
      <div ref={frontRowRef} className={styles.rain}></div>
    </div>
  );
};

export default RainComponent;
