import { useState, useRef, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseFlyingAnimationReturn {
  isFlying: boolean;
  flyingPosition: {
    start: Position | null;
    end: Position | null;
    arc: Position | null; // Точка дуги
  };
  productImage: string | null;
  triggerAnimation: (productImage: string, startElement: HTMLElement, endElement: HTMLElement) => void;
  resetAnimation: () => void;
}

export const useFlyingAnimation = (): UseFlyingAnimationReturn => {
  const [isFlying, setIsFlying] = useState(false);
  const [flyingPosition, setFlyingPosition] = useState<{
    start: Position | null;
    end: Position | null;
    arc: Position | null;
  }>({ start: null, end: null, arc: null });
  const [productImage, setProductImage] = useState<string | null>(null);

  const triggerAnimation = useCallback((
    image: string,
    startElement: HTMLElement,
    endElement: HTMLElement
  ) => {
    // Получаем позиции элементов
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();

    // Вычисляем позиции для анимации
    const startPos = {
      x: startRect.left + startRect.width / 2 - 50, // Центрируем изображение
      y: startRect.top + startRect.height / 2 - 50,
    };
    
    const endPos = {
      x: endRect.left + endRect.width / 2 - 25, // Центрируем в корзине
      y: endRect.top + endRect.height / 2 - 25,
    };

    // Вычисляем точку дуги (высшая точка траектории)
    const arcPos = {
      x: (startPos.x + endPos.x) / 2,
      y: Math.min(startPos.y, endPos.y) - 100, // 100px выше
    };

    setFlyingPosition({
      start: startPos,
      end: endPos,
      arc: arcPos,
    });

    setProductImage(image);
    setIsFlying(true);
  }, []);

  const resetAnimation = useCallback(() => {
    setIsFlying(false);
    setFlyingPosition({ start: null, end: null, arc: null });
    setProductImage(null);
  }, []);

  return {
    isFlying,
    flyingPosition,
    productImage,
    triggerAnimation,
    resetAnimation,
  };
}; 