import React from 'react';
import { Container, Form, Card } from 'semantic-ui-react';

const Interest = ({ state }) => {
  const { web3, interestBalance } = state;
  return (
    <Container>
      <Card fluid>
        <Form
          style={{
            padding: '20px',
            backgroundColor: 'rgba(100,53,201,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Interest Balance Earn:{' '}
              {web3.utils.fromWei(interestBalance, 'Ether')}
              <span style={{ marginRight: '20px' }}>&nbsp; DCTB</span>
            </span>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Interest;
