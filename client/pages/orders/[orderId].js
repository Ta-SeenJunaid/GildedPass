import { useState, useEffect, useRef } from 'react';
import PaymentForm from '../../components/paymentForm';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [hasExpired, setHasExpired] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      const totalSeconds = Math.max(Math.round(msLeft / 1000), 0);

      if (totalSeconds === 0) {
        setHasExpired(true);
        clearInterval(timerRef.current);
        return;
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    findTimeLeft();
    timerRef.current = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerRef.current);
  }, [order]);

  if (hasExpired) {
    return <div>Order Expired!</div>;
  }

  return (
    <div>
      <h1>Time left to pay: {timeLeft}</h1>
      <PaymentForm order={order} />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
