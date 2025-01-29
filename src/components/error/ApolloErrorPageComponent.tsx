import { ApolloError } from '@apollo/client';

const ApolloErrorPageComponent = ({ error }: { error: ApolloError }) => {
  return (
    <div>
      <h1>Error!</h1>
      <p>{error.message}</p>
    </div>
  );
};

export default ApolloErrorPageComponent;
