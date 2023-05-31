import React from 'react';
import AddNewToken from './add-new-token.component';
import ShowTokenList from './show-token-list.component';

const IntegrationPage: React.FC = () => {
  return (
    <>
      <AddNewToken />
      <ShowTokenList />
    </>
  );
};

export default IntegrationPage;
