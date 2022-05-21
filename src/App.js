import { reducer } from './redux_hooks/redux';
import React, { useCallback, useEffect, useReducer } from 'react';
import { defaultState } from './redux_hooks/state';
import * as ACTIONS from './redux_hooks/constants';
import getWeb3 from './utils/getWeb3';

import DBank from '../src/build/abi/DBank.json';
import Token from '../src/build/abi/Token.json';
import MainMenu from './components/Menu';

import { Container, Divider, Message, Icon, Button } from 'semantic-ui-react';
import Main from './components/Main';

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { account, errors, reloadData } = state;
  const { SET_WEB3, SET_ERROR } = ACTIONS;

  const loadWeb3 = useCallback(async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const [owner] = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const newDbankData = await DBank.networks[getNetworkId];
        const newTokenData = await Token.networks[getNetworkId];

        // check contract deployed networks
        if (newDbankData && newTokenData) {
          // get contract deployed address
          const contractDbankAddress = newDbankData.address;
          const contractTokenAddress = newTokenData.address;
          // create a new instance of the contract - on that specific address
          const contractDBankData = await new web3.eth.Contract(
            DBank.abi,
            contractDbankAddress
          );
          const contractTokenData = await new web3.eth.Contract(
            Token.abi,
            contractTokenAddress
          );

          const ownerBalance = await web3.eth.getBalance(owner);
          const dBankBalance = await web3.eth.getBalance(contractDbankAddress);
          const interestBalance = await contractTokenData.methods
            .balanceOf(owner)
            .call();

          dispatch({
            type: SET_WEB3,
            value: {
              web3: web3,
              contractDbank: contractDBankData,
              contractToken: contractTokenData,
              account: owner,
              loading: false,
              reloadData: false,
              balance: ownerBalance,
              dBankAddress: contractDbankAddress,
              tokenAddress: contractTokenAddress,
              dBankBalance,
              interestBalance,
            },
          });
        } else {
          alert('Smart contract not deployed to selected network');
        }
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  }, [SET_WEB3, SET_ERROR]);

  useEffect(() => {
    reloadData && loadWeb3();
  }, [reloadData, loadWeb3]);

  useEffect(() => {
    loadWeb3();
  }, [loadWeb3]);

  return (
    <div className='App'>
      <MainMenu account={account} />
      <Main state={state} dispatch={dispatch} />
      <Container>
        <Divider horizontal>§</Divider>
        {errors && (
          <Message negative>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Message.Header>Code: {errors?.code}</Message.Header>
              <Button
                style={{
                  padding: '0px',
                  background: 'none',
                  color: 'red',
                  marginRight: '0px',
                }}
                onClick={() => dispatch({ type: SET_ERROR, value: null })}
              >
                <Icon name='close' />
              </Button>
            </div>
            <p style={{ wordBreak: 'break-word' }}>{errors?.message}</p>
          </Message>
        )}
      </Container>
    </div>
  );
};

export default App;
