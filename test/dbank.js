const Token = artifacts.require('Token');
const DBank = artifacts.require('DBank');

const { assert } = require('chai');
const chai = require('chai');

// Assert Styles or Expect style

chai.use(require('chai-as-promised')).should();

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

// helpers
const tokens = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
};

const EVM_REVERT = 'VM Exception while processing transaction: revert';

const wait = (s) => {
  const milliseconds = s * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

contract('DBank', async ([deployer, user]) => {
  let token, dbank;
  const interestPerSecond = 31668017; // (10% APY) for min deposit (0.01 ETH)

  before(async () => {
    // Load contracts
    token = await Token.new();
    dbank = await DBank.new(token.address);
    await token.changeMinter(dbank.address, { from: deployer });
  });

  // assert style
  describe('deployment of the contract', async () => {
    it('contract deployed successfully and has a address', async () => {
      const address = await dbank.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });

    it('should assert true', async function () {
      await Token.deployed();
      await DBank.deployed();
      return assert.isTrue(true);
    });

    it('token should have a name and symbol ', async () => {
      const name = await token.name();
      const symbol = await token.symbol();
      assert.equal(name, 'Dacether Bank', 'should have a name');
      assert.equal(symbol, 'DCTB', 'should have a symbol');
    });

    it('token should have a total supply of 0 ', async () => {
      const totalSupply = await token.totalSupply();
      assert.equal(totalSupply, '0', 'should have 0  total supply');
    });

    it('dbank should have owner role ', async () => {
      const owner = await token.owner();
      assert.equal(owner, dbank.address, 'dbank should have owner role');
    });
  });
  // assert style
  describe('should fail wrong minter', async () => {
    it('different minter should fail', async () => {
      await token.changeMinter(user, { from: deployer }).should.be.rejected;
    });

    it('token minting should be fail', async () => {
      await token.mint(user, '1', { from: deployer }).should.be.rejected;
    });
  });

  // expect style
  describe('dBank deposit', async () => {
    before(async () => {
      await dbank.deposit({ from: user, value: tokens('0.01') });
    });

    it('balance should increase', async () => {
      const userBalance = await dbank.balance(user);
      expect(Number(userBalance)).to.eq(+tokens('0.01'), 'wrong balance');
    });

    it('deposit time should > 0', async () => {
      const time = Number(await dbank.depositStart(user));
      expect(time).to.be.above(0);
    });

    it('deposit status should eq true', async () => {
      const isDeposited = await dbank.isDeposited(user);
      expect(isDeposited).to.eq(true);
    });
  });

  describe('failure', () => {
    it('depositing should be rejected', async () => {
      await dbank
        .deposit({ value: tokens('0.001'), from: user })
        .should.be.rejectedWith(EVM_REVERT); //to small amount
    });
  });

  describe('testing withdraw...', () => {
    let balance;

    before(async () => {
      await wait(2); //accruing interest
      balance = await web3.eth.getBalance(user);
      await dbank.withdraw({ from: user });
    });

    describe('success', () => {
      it('balances should decrease', async () => {
        const contractAddress = Number(
          await web3.eth.getBalance(dbank.address)
        );
        const userDbankBalance = Number(await dbank.balance(user));
        expect(contractAddress).to.eq(0);
        expect(userDbankBalance).to.eq(0);
      });

      it('user should receive ether back', async () => {
        const balanceUser = Number(await web3.eth.getBalance(user));
        expect(balanceUser).to.be.above(Number(balance));
      });

      it('user should receive proper amount of interest', async () => {
        //time synchronization problem make us check the 1-3s range for 2s deposit time
        balance = Number(await token.balanceOf(user));
        expect(balance).to.be.above(0);
        expect(balance % interestPerSecond).to.eq(0);
        expect(balance).to.be.below(interestPerSecond * 4);
      });

      it('depositor data should be resets', async () => {
        expect(Number(await dbank.depositStart(user))).to.eq(0);
        expect(Number(await dbank.balance(user))).to.eq(0);
        expect(await dbank.isDeposited(user)).to.eq(false);
      });
    });

    describe('failure', () => {
      it('withdrawing should be rejected', async () => {
        await dbank.deposit({ value: tokens('0.01'), from: user }); //0.01 ETH
        await wait(2); //accruing interest
        await dbank
          .withdraw({ from: deployer })
          .should.be.rejectedWith(EVM_REVERT); //wrong user
      });
    });
  });
});
