import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import useRequest from '../hooks/use-request';

const PaymentForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => {
      setIsProcessing(false);
      window.location.href = '/orders';
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
      setIsProcessing(false);
      return;
    }

    await doRequest({ token: paymentMethod.id });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        disabled={!stripe || isProcessing}
        className="btn btn-primary mt-3"
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      <div className="text-danger mt-2">{errors}</div>
    </form>
  );
};

export default PaymentForm;
