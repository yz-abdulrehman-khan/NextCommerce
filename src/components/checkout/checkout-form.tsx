'use client';

import { useForm, type FieldConfig } from '@/hooks/use-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Home, Loader2 } from 'lucide-react';

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

export type CheckoutFormData = ShippingFormData & PaymentFormData;

interface CheckoutFormProps {
  isSubmitting: boolean;
  onSubmit: (data: CheckoutFormData) => void;
}

// Define field configurations for validation and formatting
const shippingFields: FieldConfig<ShippingFormData> = {
  fullName: { required: 'Full name is required.' },
  email: {
    required: 'Email is required.',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
  },
  address: { required: 'Street address is required.' },
  apartment: {}, // Optional
  city: { required: 'City is required.' },
  state: { required: 'State / Province is required.' },
  zip: {
    required: 'ZIP / Postal code is required.',
    pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789).' },
  },
  country: { required: 'Country is required.', defaultValue: 'United States' },
  phone: {}, // Optional
};

const paymentFields: FieldConfig<PaymentFormData> = {
  cardName: { required: 'Name on card is required.' },
  cardNumber: {
    required: 'Card number is required.',
    pattern: { value: /^\d{13,19}$/, message: 'Please enter a valid card number (13-19 digits).' },
    format: value =>
      value
        .replace(/\D/g, '')
        .slice(0, 19)
        .replace(/(.{4})/g, '$1 ')
        .trim(),
  },
  expiryDate: {
    required: 'Expiry date is required.',
    validate: value => {
      const parts = value.split(' / ');
      if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) return 'Format MM / YY.';
      const month = Number.parseInt(parts[0], 10);
      const year = Number.parseInt(parts[1], 10);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (month < 1 || month > 12) return 'Invalid month.';
      if (year < currentYear || (year === currentYear && month < currentMonth)) return 'Card has expired.';
      return true;
    },
    format: value => {
      const v = value.replace(/\D/g, '').slice(0, 4);
      return v.length > 2 ? `${v.slice(0, 2)} / ${v.slice(2)}` : v;
    },
  },
  cvc: {
    required: 'CVC is required.',
    pattern: { value: /^\d{3,4}$/, message: 'CVC must be 3 or 4 digits.' },
    format: value => value.replace(/\D/g, '').slice(0, 4),
  },
};

export function CheckoutForm({ isSubmitting, onSubmit }: CheckoutFormProps) {
  const { register, handleSubmit, errors } = useForm<CheckoutFormData>({
    ...shippingFields,
    ...paymentFields,
  });

  return (
    <form id='checkout-form' onSubmit={handleSubmit(onSubmit)} noValidate className='lg:col-span-2 space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl flex items-center gap-2'>
            <Home className='h-6 w-6 text-primary' /> Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input id='fullName' placeholder='John Doe' {...register('fullName')} />
              {errors.fullName && (
                <p id='fullName-error' className='text-sm text-destructive mt-1'>
                  {errors.fullName}
                </p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='email'>Email Address</Label>
              <Input id='email' type='email' placeholder='john.doe@example.com' {...register('email')} />
              {errors.email && (
                <p id='email-error' className='text-sm text-destructive mt-1'>
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='address'>Street Address</Label>
            <Input id='address' placeholder='123 Main St' {...register('address')} />
            {errors.address && (
              <p id='address-error' className='text-sm text-destructive mt-1'>
                {errors.address}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='apartment'>Apartment, suite, etc. (Optional)</Label>
            <Input id='apartment' placeholder='Apt 4B' {...register('apartment')} />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='city'>City</Label>
              <Input id='city' placeholder='Anytown' {...register('city')} />
              {errors.city && (
                <p id='city-error' className='text-sm text-destructive mt-1'>
                  {errors.city}
                </p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='state'>State / Province</Label>
              <Input id='state' placeholder='CA' {...register('state')} />
              {errors.state && (
                <p id='state-error' className='text-sm text-destructive mt-1'>
                  {errors.state}
                </p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='zip'>ZIP / Postal Code</Label>
              <Input id='zip' placeholder='90210' {...register('zip')} />
              {errors.zip && (
                <p id='zip-error' className='text-sm text-destructive mt-1'>
                  {errors.zip}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='country'>Country</Label>
            <Input id='country' placeholder='United States' {...register('country')} />
            {errors.country && (
              <p id='country-error' className='text-sm text-destructive mt-1'>
                {errors.country}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='phone'>Phone Number (Optional)</Label>
            <Input id='phone' type='tel' placeholder='(555) 123-4567' {...register('phone')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-2xl flex items-center gap-2'>
            <CreditCard className='h-6 w-6 text-primary' /> Payment Details
          </CardTitle>
          <CardDescription>Enter your payment information. For UI demonstration only.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-1.5'>
            <Label htmlFor='cardName'>Name on Card</Label>
            <Input id='cardName' placeholder='John M Doe' {...register('cardName')} />
            {errors.cardName && (
              <p id='cardName-error' className='text-sm text-destructive mt-1'>
                {errors.cardName}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='cardNumber'>Card Number</Label>
            <Input id='cardNumber' placeholder='•••• •••• •••• ••••' {...register('cardNumber')} maxLength={23} />
            {errors.cardNumber && (
              <p id='cardNumber-error' className='text-sm text-destructive mt-1'>
                {errors.cardNumber}
              </p>
            )}
          </div>
          <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='expiryDate'>Expiry Date</Label>
              <Input id='expiryDate' placeholder='MM / YY' {...register('expiryDate')} maxLength={7} />
              {errors.expiryDate && (
                <p id='expiryDate-error' className='text-sm text-destructive mt-1'>
                  {errors.expiryDate}
                </p>
              )}
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='cvc'>CVC</Label>
              <Input id='cvc' placeholder='•••' {...register('cvc')} maxLength={4} />
              {errors.cvc && (
                <p id='cvc-error' className='text-sm text-destructive mt-1'>
                  {errors.cvc}
                </p>
              )}
            </div>
          </div>
          <div className='mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-700 flex items-start gap-2'>
            <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-0.5' />
            <span>
              This is a UI demonstration only. Actual payment processing is not implemented. Do not enter real card details.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* This button is primarily for mobile/smaller screens. Desktop uses button in OrderSummary. */}
      <Button type='submit' className='w-full lg:hidden' size='lg' disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
            Placing Order...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  );
}
