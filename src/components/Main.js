import React from 'react';
import { Container, Tab } from 'semantic-ui-react';
import Deposit from './Deposit';
import Interest from './Interest';
import Withdraw from './Withdraw';

const Main = ({ state, dispatch }) => {
  const { loading } = state;

  const panes = [
    {
      menuItem: 'Deposit',
      render: () => (
        <Tab.Pane loading={loading}>
          <Deposit state={state} dispatch={dispatch} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Withdraw',
      render: () => (
        <Tab.Pane loading={loading}>
          <Withdraw state={state} dispatch={dispatch} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Interest',
      render: () => (
        <Tab.Pane loading={loading}>
          <Interest state={state} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container>
      <Tab panes={panes} />
    </Container>
  );
};

export default Main;
