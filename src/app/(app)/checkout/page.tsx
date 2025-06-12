'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, ShoppingCart, CreditCard, Home, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

interface ShippingFormData {
  fullName: string;
  email: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardName: string;
}

type FormErrors = Partial<Record<keyof ShippingFormData | keyof PaymentFormData, string>>;

export default function CheckoutPage() {
  const { cartItems, getCartSubtotal, getTotalItems, isCartLoaded, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [shippingForm, setShippingForm] = useState<ShippingFormData>({
    fullName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
  });

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getCartSubtotal();
  const totalItems = getTotalItems();
  const shippingCost = totalItems > 0 ? 5.99 : 0;
  const taxRate = 0.07;
  const taxes = subtotal * taxRate;
  const grandTotal = subtotal + shippingCost + taxes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'shipping' | 'payment') => {
    const { id, value } = e.target;
    if (formType === 'shipping') {
      setShippingForm(prev => ({ ...prev, [id]: value }));
    } else {
      let processedValue = value;
      if (id === 'cardNumber') {
        processedValue = value.replace(/\D/g, '').slice(0, 19); // Allow up to 19 for potential spaces
        // Add spaces for readability (optional, can be done with a formatter library too)
        processedValue = processedValue.replace(/(.{4})/g, '$1 ').trim();
      } else if (id === 'expiryDate') {
        processedValue = value.replace(/\D/g, '').slice(0, 4);
        if (processedValue.length > 2) {
          processedValue = `${processedValue.slice(0, 2)} / ${processedValue.slice(2)}`;
        }
      } else if (id === 'cvc') {
        processedValue = value.replace(/\D/g, '').slice(0, 4);
      }
      setPaymentForm(prev => ({ ...prev, [id]: processedValue }));
    }

    if (formErrors[id as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    const shippingData = shippingForm;
    const paymentData = paymentForm;

    // Shipping Validation
    if (!shippingData.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!shippingData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!shippingData.address.trim()) errors.address = 'Street address is required.';
    if (!shippingData.city.trim()) errors.city = 'City is required.';
    if (!shippingData.state.trim()) errors.state = 'State / Province is required.';
    if (!shippingData.zip.trim()) {
      errors.zip = 'ZIP / Postal code is required.';
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingData.zip)) {
      errors.zip = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789).';
    }
    if (!shippingData.country.trim()) errors.country = 'Country is required.';

    // Payment Validation (UI Only)
    if (!paymentData.cardName.trim()) errors.cardName = 'Name on card is required.';
    const rawCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!rawCardNumber) {
      errors.cardNumber = 'Card number is required.';
    } else if (!/^\d{13,19}$/.test(rawCardNumber)) {
      errors.cardNumber = 'Please enter a valid card number (13-19 digits).';
    }

    if (!paymentData.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required.';
    } else {
      const parts = paymentData.expiryDate.split(' / ');
      if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
        errors.expiryDate = 'Format MM / YY.';
      } else {
        const month = Number.parseInt(parts[0], 10);
        const year = Number.parseInt(parts[1], 10);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (month < 1 || month > 12) {
          errors.expiryDate = 'Invalid month.';
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          errors.expiryDate = 'Card has expired.';
        }
      }
    }

    if (!paymentData.cvc.trim()) {
      errors.cvc = 'CVC is required.';
    } else if (!/^\d{3,4}$/.test(paymentData.cvc)) {
      errors.cvc = 'CVC must be 3 or 4 digits.';
    }

    return errors;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    const orderPayload = {
      products: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to place order.');

      toast({
        title: (
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-green-500' />
            <span className='font-bold'>Order Placed Successfully!</span>
          </div>
        ),
        description: `Your order #${result.data.id.substring(0, 8)} has been confirmed.`,
      });
      clearCart();
      router.push(`/orders?order_id=${result.data.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: (
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5' />
            <span className='font-bold'>Order Failed</span>
          </div>
        ),
        description: (error as Error).message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartLoaded) {
    return (
      <div className='container py-8 md:py-12 flex justify-center items-center min-h-[calc(100vh-200px)]'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='w-8 h-8 text-primary animate-spin' />
          <p className='text-muted-foreground'>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && isCartLoaded) {
    return (
      <div className='container py-12 text-center'>
        <ShoppingCart className='mx-auto h-16 w-16 text-muted-foreground mb-6' />
        <h1 className='text-3xl font-semibold mb-4'>Your Cart is Empty</h1>
        <p className='text-muted-foreground mb-8'>
          You have no items in your cart to checkout. Add some products to get started!
        </p>
        <Button asChild size='lg'>
          <Link href='/products'>Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container py-8 md:py-12'>
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center md:text-left'>Checkout</h1>
      <form onSubmit={handleSubmitOrder} noValidate>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12'>
          <div className='lg:col-span-2 space-y-8'>
            {/* Shipping Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl flex items-center gap-2'>
                  <Home className='h-6 w-6 text-primary' /> Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Full Name */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='fullName'>Full Name</Label>
                    <Input
                      id='fullName'
                      placeholder='John Doe'
                      value={shippingForm.fullName}
                      onChange={e => handleInputChange(e, 'shipping')}
                      className={cn(formErrors.fullName && 'border-destructive')}
                      aria-invalid={!!formErrors.fullName}
                      aria-describedby='fullName-error'
                    />
                    {formErrors.fullName && (
                      <p id='fullName-error' className='text-sm text-destructive mt-1'>
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>
                  {/* Email */}
                  <div className='space-y-1.5'>
                    <Label htmlFor='email'>Email Address</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='john.doe@example.com'
                      value={shippingForm.email}
                      onChange={e => handleInputChange(e, 'shipping')}
                      className={cn(formErrors.email && 'border-destructive')}
                      aria-invalid={!!formErrors.email}
                      aria-describedby='email-error'
                    />
                    {formErrors.email && (
                      <p id='email-error' className='text-sm text-destructive mt-1'>
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
                {/* Address */}
                <div className='space-y-1.5'>
                  <Label htmlFor='address'>Street Address</Label>
                  <Input
                    id='address'
                    placeholder='123 Main St'
                    value={shippingForm.address}
                    onChange={e => handleInputChange(e, 'shipping')}
                    className={cn(formErrors.address && 'border-destructive')}
                    aria-invalid={!!formErrors.address}
                    aria-describedby='address-error'
                  />
                  {formErrors.address && (
                    <p id='address-error' className='text-sm text-destructive mt-1'>
                      {formErrors.address}
                    </p>
                  )}
                </div>
                {/* Apartment */}
                <div className='space-y-1.5'>
                  <Label htmlFor='apartment'>Apartment, suite, etc. (Optional)</Label>
                  <Input
                    id='apartment'
                    placeholder='Apt 4B'
                    value={shippingForm.apartment}
                    onChange={e => handleInputChange(e, 'shipping')}
                  />
                </div>
                {/* City, State, Zip */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      placeholder='Anytown'
                      value={shippingForm.city}
                      onChange={e => handleInputChange(e, 'shipping')}
                      className={cn(formErrors.city && 'border-destructive')}
                      aria-invalid={!!formErrors.city}
                      aria-describedby='city-error'
                    />
                    {formErrors.city && (
                      <p id='city-error' className='text-sm text-destructive mt-1'>
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='state'>State / Province</Label>
                    <Input
                      id='state'
                      placeholder='CA'
                      value={shippingForm.state}
                      onChange={e => handleInputChange(e, 'shipping')}
                      className={cn(formErrors.state && 'border-destructive')}
                      aria-invalid={!!formErrors.state}
                      aria-describedby='state-error'
                    />
                    {formErrors.state && (
                      <p id='state-error' className='text-sm text-destructive mt-1'>
                        {formErrors.state}
                      </p>
                    )}
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='zip'>ZIP / Postal Code</Label>
                    <Input
                      id='zip'
                      placeholder='90210'
                      value={shippingForm.zip}
                      onChange={e => handleInputChange(e, 'shipping')}
                      className={cn(formErrors.zip && 'border-destructive')}
                      aria-invalid={!!formErrors.zip}
                      aria-describedby='zip-error'
                    />
                    {formErrors.zip && (
                      <p id='zip-error' className='text-sm text-destructive mt-1'>
                        {formErrors.zip}
                      </p>
                    )}
                  </div>
                </div>
                {/* Country */}
                <div className='space-y-1.5'>
                  <Label htmlFor='country'>Country</Label>
                  <Input
                    id='country'
                    placeholder='United States'
                    value={shippingForm.country}
                    onChange={e => handleInputChange(e, 'shipping')}
                    className={cn(formErrors.country && 'border-destructive')}
                    aria-invalid={!!formErrors.country}
                    aria-describedby='country-error'
                  />
                  {formErrors.country && (
                    <p id='country-error' className='text-sm text-destructive mt-1'>
                      {formErrors.country}
                    </p>
                  )}
                </div>
                {/* Phone */}
                <div className='space-y-1.5'>
                  <Label htmlFor='phone'>Phone Number (Optional)</Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='(555) 123-4567'
                    value={shippingForm.phone}
                    onChange={e => handleInputChange(e, 'shipping')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl flex items-center gap-2'>
                  <CreditCard className='h-6 w-6 text-primary' /> Payment Details
                </CardTitle>
                <CardDescription>Enter your payment information. For UI demonstration only.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Card Name */}
                <div className='space-y-1.5'>
                  <Label htmlFor='cardName'>Name on Card</Label>
                  <Input
                    id='cardName'
                    placeholder='John M Doe'
                    value={paymentForm.cardName}
                    onChange={e => handleInputChange(e, 'payment')}
                    className={cn(formErrors.cardName && 'border-destructive')}
                    aria-invalid={!!formErrors.cardName}
                    aria-describedby='cardName-error'
                  />
                  {formErrors.cardName && (
                    <p id='cardName-error' className='text-sm text-destructive mt-1'>
                      {formErrors.cardName}
                    </p>
                  )}
                </div>
                {/* Card Number */}
                <div className='space-y-1.5'>
                  <Label htmlFor='cardNumber'>Card Number</Label>
                  <Input
                    id='cardNumber'
                    placeholder='•••• •••• •••• ••••'
                    value={paymentForm.cardNumber}
                    onChange={e => handleInputChange(e, 'payment')}
                    className={cn(formErrors.cardNumber && 'border-destructive')}
                    aria-invalid={!!formErrors.cardNumber}
                    aria-describedby='cardNumber-error'
                    maxLength={23} /* Max length with spaces */
                  />
                  {formErrors.cardNumber && (
                    <p id='cardNumber-error' className='text-sm text-destructive mt-1'>
                      {formErrors.cardNumber}
                    </p>
                  )}
                </div>
                {/* Expiry Date & CVC */}
                <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='expiryDate'>Expiry Date</Label>
                    <Input
                      id='expiryDate'
                      placeholder='MM / YY'
                      value={paymentForm.expiryDate}
                      onChange={e => handleInputChange(e, 'payment')}
                      className={cn(formErrors.expiryDate && 'border-destructive')}
                      aria-invalid={!!formErrors.expiryDate}
                      aria-describedby='expiryDate-error'
                      maxLength={7}
                    />
                    {formErrors.expiryDate && (
                      <p id='expiryDate-error' className='text-sm text-destructive mt-1'>
                        {formErrors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='cvc'>CVC</Label>
                    <Input
                      id='cvc'
                      placeholder='•••'
                      value={paymentForm.cvc}
                      onChange={e => handleInputChange(e, 'payment')}
                      className={cn(formErrors.cvc && 'border-destructive')}
                      aria-invalid={!!formErrors.cvc}
                      aria-describedby='cvc-error'
                      maxLength={4}
                    />
                    {formErrors.cvc && (
                      <p id='cvc-error' className='text-sm text-destructive mt-1'>
                        {formErrors.cvc}
                      </p>
                    )}
                  </div>
                </div>
                <div className='mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700 flex items-start gap-2'>
                  <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-0.5' />
                  <span>
                    This is a UI demonstration only. Actual payment processing is not implemented. Do not enter real card
                    details.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Card (Right Column) */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-24'>
              <CardHeader>
                <CardTitle className='text-2xl'>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <ScrollArea className='h-[250px] pr-3 -mr-3'>
                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className='flex items-center gap-4 py-3'>
                        <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border'>
                          <Image
                            src={item.images[0] || '/placeholder.svg?width=64&height=64&query=cart+item'}
                            alt={item.name}
                            fill
                            sizes='(max-width: 768px) 10vw, 5vw'
                            className='object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium truncate'>{item.name}</p>
                          <p className='text-xs text-muted-foreground'>Qty: {item.quantity}</p>
                        </div>
                        <p className='text-sm font-medium shrink-0'>
                          {formatPrice(item.price.amount * item.quantity, item.price.currency)}
                        </p>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </ScrollArea>
                <Separator />
                <div className='space-y-1.5 text-sm'>
                  <div className='flex justify-between'>
                    <p className='text-muted-foreground'>
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </p>
                    <p className='font-medium'>{formatPrice(subtotal)}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-muted-foreground'>Shipping</p>
                    <p className='font-medium'>{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-muted-foreground'>Taxes (Est.)</p>
                    <p className='font-medium'>{formatPrice(taxes)}</p>
                  </div>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-semibold'>
                  <p>Order Total</p>
                  <p>{formatPrice(grandTotal)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type='submit' className='w-full' size='lg' disabled={isSubmitting || cartItems.length === 0}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
