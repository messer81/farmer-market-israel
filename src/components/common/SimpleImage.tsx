import React from 'react';
import { Box } from '@mui/material';

interface SimpleImageProps {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: number;
  priority?: boolean;
}

const SimpleImage: React.FC<SimpleImageProps> = ({
  src,
  alt,
  height = 200,
  width,
  objectFit = 'cover',
  borderRadius = 0,
  priority = false,
}) => {
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
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          borderRadius,
          // Абсолютное позиционирование для предотвращения CLS
          position: 'absolute',
          top: 0,
          left: 0,
          // Гарантируем, что изображение не изменит размер контейнера
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // Добавляем fetchpriority для приоритетных изображений
        {...(priority && { fetchPriority: 'high' as any })}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </Box>
  );
};

export default SimpleImage; 