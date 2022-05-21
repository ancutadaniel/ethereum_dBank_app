import React from 'react';
import * as ACTIONS from '../redux_hooks/constants';
import { Container, Form, Card, Button } from 'semantic-ui-react';

const Withdraw = ({ state, dispatch }) => {
  const { contractDbank, account, web3, dBankBalance } = state;
  const { SET_LOADING, SET_ERROR, SET_DEPOSIT } = ACTIONS;

  const handleWithdraw = async (e) => {
    e.preventDefault();
    dispatch({ type: SET_LOADING });
    try {
      await contractDbank.methods.withdraw().send({
        from: account,
      });
      dispatch({ type: SET_DEPOSIT });
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  };

  return (
    <Container>
      <Card fluid>
        <Form
          onSubmit={handleWithdraw}
          style={{
            padding: '20px',
            backgroundColor: 'rgba(33,186,69,0.2)',
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
              Dbank Contract Balance:{' '}
              {web3?.utils?.fromWei(dBankBalance, 'Ether')}
              <span style={{ marginRight: '20px' }}>&nbsp; ETH</span>
            </span>
            <Button type='submit' positive>
              Withdraw
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Withdraw;
