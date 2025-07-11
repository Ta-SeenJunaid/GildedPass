import 'bootstrap/dist/css/bootstrap.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import buildClient from '../api/build-client';
import Header from '../components/header';

const stripePromise = loadStripe(
  'pk_test_51RhCH7PuKVx1Uxkqmk9Wfs8jKcNxmoiYW7zrRN5eDNFCgtD5yKMptHgyG60RQ8dMenPX5xCq8UNn3WRM32E0WtdP00VhIFGkvW'
);

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Elements stripe={stripePromise}>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </Elements>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { pageProps, ...data };
};

export default AppComponent;
