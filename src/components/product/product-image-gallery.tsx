'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { Product } from '@/types/app';

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const placeholderImg = `/placeholder.svg?width=600&height=600&query=${encodeURIComponent(product.name)}`;
  const initialImage = product.images?.[0] || '';
  const [currentImageSrc, setCurrentImageSrc] = useState(initialImage);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentImageSrc(initialImage);
    setIsMainImageLoading(true);

    // Fix: check if image is already loaded from cache:
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsMainImageLoading(false);
    }
  }, [initialImage]);

  const handleThumbnailClick = (imageSrc: string) => {
    if (imageSrc !== currentImageSrc) {
      setIsMainImageLoading(true);
      setCurrentImageSrc(imageSrc);
    }
  };

  const mainImageToDisplay = currentImageSrc || placeholderImg;

  return (
    <div>
      <div className='aspect-square relative overflow-hidden rounded-lg border mb-4 bg-muted/30'>
        {isMainImageLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-background/50 z-10'>
            <Loader2 className='h-10 w-10 animate-spin text-primary' />
          </div>
        )}
        <Image
          ref={imgRef}
          src={mainImageToDisplay}
          alt={product.name}
          fill
          className={cn(
            'object-cover transition-opacity duration-300 ease-in-out',
            isMainImageLoading ? 'opacity-0' : 'opacity-100',
          )}
          priority={product.images.indexOf(mainImageToDisplay) === 0}
          onLoad={() => setIsMainImageLoading(false)}
          onError={() => {
            setIsMainImageLoading(false);
            if (currentImageSrc !== placeholderImg) setCurrentImageSrc(placeholderImg);
          }}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
      {product.images && product.images.length > 1 && (
        <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2'>
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(img)}
              className={cn(
                'aspect-square relative overflow-hidden rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all',
                currentImageSrc === img ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80',
              )}
              aria-label={`View image ${index + 1} of ${product.name}`}
            >
              <Image
                src={img || `/placeholder.svg?width=150&height=150&query=thumbnail ${index + 1}`}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 20vw, 10vw'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
