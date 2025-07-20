import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface FlyingProductProps {
  isVisible: boolean;
  productImage: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  arcPosition?: { x: number; y: number };
  onComplete: () => void;
}

const FlyingProduct: React.FC<FlyingProductProps> = ({
  isVisible,
  productImage,
  startPosition,
  endPosition,
  arcPosition,
  onComplete,
}) => {
  // Правильная анимация с реальными координатами
  const spring = useSpring({
    from: {
      x: startPosition.x - window.innerWidth / 2 + 100, // Относительно центра экрана
      y: startPosition.y - window.innerHeight / 2 + 100,
      scale: 1,
      opacity: 1,
      rotate: 0,
    },
    to: {
      x: endPosition.x - window.innerWidth / 2 + 100,
      y: endPosition.y - window.innerHeight / 2 + 100,
      scale: 0.8,
      opacity: 0,
      rotate: 1080,
    },
    config: { 
      tension: 100,   // Среднее напряжение
      friction: 15,   // Среднее трение
      mass: 1,        // Средняя масса
      duration: 1500, // 1.5 секунды
    },
    onRest: () => {
      onComplete();
    },
    immediate: !isVisible,
  });

  if (!isVisible) {
    return null;
  }

  return (
    <animated.div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        backgroundColor: 'green',
        border: '10px solid #00FF00',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 999999,
        boxShadow: '0 0 100px rgba(0, 255, 0, 1)',
        pointerEvents: 'none',
        ...spring,
      }}
    >
      <animated.img
        src={productImage}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '20px',
          border: '3px solid white',
        }}
        alt="Flying product"
      />
      <div style={{
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#00FF00',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 999999999,
      }}>
        REACT SPRING
      </div>
    </animated.div>
  );
};

export default FlyingProduct; 