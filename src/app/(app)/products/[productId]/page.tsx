'use client';

import Image from 'next/image';
import type { Product } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

async function getProduct(productId: string): Promise<Product | null> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch product ${productId}, status:`, res.status);
      return null;
    }
    const jsonResponse = await res.json();
    if (!jsonResponse.success || !jsonResponse.data) {
      console.error(`Failed to fetch product ${productId}, invalid response:`, jsonResponse);
      return null;
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(`Error fetching product ${productId} from ${apiUrl}:`, error);
    return null;
  }
}

const formatPrice = (price: { amount: number; currency: string }) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
  }).format(price.amount);
};

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | undefined>(undefined);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setIsMainImageLoading(true); // Reset main image loading state
      const fetchedProduct = await getProduct(params.productId);
      setProduct(fetchedProduct);
      if (fetchedProduct && fetchedProduct.images && fetchedProduct.images.length > 0) {
        setCurrentImageSrc(fetchedProduct.images[0]);
      } else {
        setCurrentImageSrc(undefined); // Handle case with no images
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [params.productId]);

  // Effect to set main image loading to false once currentImageSrc is set and product is loaded
  useEffect(() => {
    if (currentImageSrc && !isLoading) {
      // Give a brief moment for the new image to potentially load from cache or start loading
      const timer = setTimeout(() => setIsMainImageLoading(false), 50);
      return () => clearTimeout(timer);
    }
    if (!currentImageSrc && !isLoading) {
      setIsMainImageLoading(false); // No image to load
    }
  }, [currentImageSrc, isLoading]);

  const handleThumbnailClick = (imageSrc: string) => {
    setIsMainImageLoading(true);
    setCurrentImageSrc(imageSrc);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Consider adding a toast notification here for better UX
      console.log(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className='container py-10 text-center'>
        <Loader2 className='mx-auto h-12 w-12 animate-spin text-primary mb-4' />
        <p className='text-xl text-muted-foreground'>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='container py-10 text-center'>
        <AlertTriangle className='mx-auto h-12 w-12 text-destructive mb-4' />
        <h1 className='text-2xl font-semibold mb-4'>Product Not Found</h1>
        <p className='text-muted-foreground mb-6'>Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href='/'>Back to Products</Link>
        </Button>
      </div>
    );
  }

  const placeholderImg = `/placeholder.svg?width=600&height=600&query=${encodeURIComponent(product.name || 'product image')}`;
  const mainImageToDisplay = currentImageSrc || placeholderImg;

  return (
    <div className='container'>
      <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>
        {/* Image Gallery Section */}
        <div>
          <div className='aspect-square relative overflow-hidden rounded-lg border mb-4 bg-muted/30'>
            {isMainImageLoading && currentImageSrc && (
              <div className='absolute inset-0 flex items-center justify-center bg-background/50 z-10'>
                <Loader2 className='h-10 w-10 animate-spin text-primary' />
              </div>
            )}
            <Image
              src={mainImageToDisplay || '/placeholder.svg'}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-opacity duration-300 ease-in-out',
                isMainImageLoading && currentImageSrc ? 'opacity-0' : 'opacity-100',
              )}
              priority={product.images.indexOf(mainImageToDisplay) === 0} // Only priority load the very first image
              onLoad={() => setIsMainImageLoading(false)}
              onError={() => {
                setIsMainImageLoading(false);
                // Optionally set to a fallback or log error
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
                    'aspect-square relative overflow-hidden rounded-md border focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 transition-all',
                    currentImageSrc === img ? 'ring-1 ring-primary ring-offset-1' : 'hover:opacity-80',
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

        {/* Product Details Section */}
        <div className='flex flex-col'>
          <h1 className='text-3xl lg:text-4xl font-bold tracking-tight mb-3'>{product.name}</h1>
          <p className='text-2xl font-semibold text-primary mb-4'>{formatPrice(product.price)}</p>

          <Separator className='my-4' />

          <div className='mb-6'>
            <h2 className='text-xl font-semibold mb-2'>Description</h2>
            <p className='text-muted-foreground leading-relaxed'>{product.description || 'No description available.'}</p>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div className='mb-6'>
              <h2 className='text-xl font-semibold mb-2'>Categories</h2>
              <div className='flex flex-wrap gap-2'>
                {product.categories.map(categorySlug => (
                  <Badge key={categorySlug} variant='secondary' className='text-sm'>
                    {categorySlug}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className='mt-auto pt-4'>
            <Button size='lg' className='w-full' onClick={handleAddToCart}>
              <ShoppingCart className='mr-2 h-5 w-5' /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
