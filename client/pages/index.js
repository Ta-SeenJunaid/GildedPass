import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>User is signed in!!!</h1>
  ) : (
    <h1>please sign in!!!</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log('Landing Page');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
