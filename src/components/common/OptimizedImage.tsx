import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

interface OptimizedImageProps {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: number;
  className?: string;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  height = 200,
  width,
  objectFit = 'cover',
  borderRadius = 0,
  className,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Предзагружаем изображение для приоритетных элементов
    if (priority && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setIsError(true);
      img.src = src;
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: width || '100%',
        height,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        // Агрессивная фиксация размеров для предотвращения CLS
        minHeight: height,
        maxHeight: height,
        minWidth: width || '100%',
        maxWidth: width || '100%',
        // Гарантируем, что контейнер не изменит размер
        boxSizing: 'border-box',
      }}
      className={className}
    >
      {/* Скелетон всегда показывается, пока изображение не загружено */}
      {!isLoaded && !isError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            borderRadius: borderRadius,
          }}
        />
      )}
      
      {!isError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            display: isLoaded ? 'block' : 'none',
            borderRadius,
            // Абсолютное позиционирование для предотвращения CLS
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            // Гарантируем, что изображение не изменит размер контейнера
            maxWidth: '100%',
            maxHeight: '100%',
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // Добавляем fetchpriority для приоритетных изображений
          {...(priority && { fetchPriority: 'high' as any })}
        />
      )}
      
      {isError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            color: '#999',
            fontSize: '12px',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 3,
            borderRadius: borderRadius,
          }}
        >
          🖼️
        </Box>
      )}
    </Box>
  );
};

export default OptimizedImage; 