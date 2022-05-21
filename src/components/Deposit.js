import React, { useRef } from 'react';
import * as ACTIONS from '../redux_hooks/constants';
import { Container, Form, Card, Button, Divider } from 'semantic-ui-react';

const Deposit = ({ state, dispatch }) => {
  const { web3, loading, balance, contractDbank, account, interestBalance } =
    state;
  const { SET_LOADING, SET_ERROR, SET_DEPOSIT } = ACTIONS;

  const inputRef = useRef(null); // node

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: SET_LOADING });
    try {
      await contractDbank.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(inputRef.current.value),
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
          loading={loading}
          onSubmit={handleSubmit}
          style={{
            padding: '20px',
            backgroundColor: 'rgba(242,138,28,0.2)',
          }}
        >
          <Form.Field>
            <label>
              <b>How much do you want to deposit?</b>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <input
                style={{ width: '300px' }}
                type='number'
                placeholder='0'
                step='0.01'
                ref={inputRef}
                required
              />
            </div>
            <Divider horizontal>§</Divider>
            <div>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Wallet Balance: {web3?.utils?.fromWei(balance, 'Ether')}
                <span style={{ marginRight: '20px' }}>&nbsp; ETH</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                DCTB Interest Balance:{' '}
                {web3?.utils?.fromWei(interestBalance, 'Ether')}
                <span style={{ marginRight: '20px' }}>&nbsp; DCTB</span>
              </span>
            </div>
          </Form.Field>
          <div
            style={{
              display: 'flex',
              marginBottom: '15px',
            }}
          >
            <span>Min Amount is &nbsp;</span>
            <span>0.01 ETH (1 deposit is possible at the time)</span>
          </div>
          <Button type='submit' color='teal'>
            Deposit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Deposit;
