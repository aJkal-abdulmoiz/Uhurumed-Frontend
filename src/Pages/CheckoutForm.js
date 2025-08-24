// CheckoutForm.js
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#e53e3e',
    },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      console.log('PaymentMethod:', paymentMethod);
      setError(null);
      setSuccess(true);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_OPTIONS} />
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          marginTop: 20,
          backgroundColor: '#6772e5',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {processing ? 'Processing…' : 'Pay'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {success && (
        <div style={{ color: 'green', marginTop: 10 }}>
          Payment method created!
        </div>
      )}
    </form>
  );
}

export default CheckoutForm;
