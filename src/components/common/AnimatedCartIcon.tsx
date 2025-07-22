import React, { useMemo, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Badge, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

interface AnimatedCartIconProps {
  itemCount: number;
  onClick: () => void;
}

const AnimatedCartIcon = React.forwardRef<HTMLButtonElement, AnimatedCartIconProps>(
  ({ itemCount, onClick }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false);

    // Анимируем при каждом изменении количества товаров
    useEffect(() => {
      if (itemCount > 0) {
        console.log('🛒 Анимация корзины: товар добавлен, количество:', itemCount);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
    }, [itemCount]);

    // Мемоизируем конфигурацию анимации
    const animationConfig = useMemo(() => ({
      tension: 300,
      friction: 15,
      mass: 1,
    }), []);

    // Мемоизируем значения анимации
    const animationValues = useMemo(() => ({
      scale: isAnimating ? 1.15 : 1,
      rotate: isAnimating ? 180 : 0,
    }), [isAnimating]);

    const spring = useSpring({
      ...animationValues,
      config: animationConfig
    });

    return (
      <animated.div style={spring}>
        <IconButton 
          ref={ref}
          color="inherit" 
          onClick={onClick}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Badge badgeContent={itemCount} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </animated.div>
    );
  }
);

export default AnimatedCartIcon; 