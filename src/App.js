import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';

import Staking from './artifacts/contracts/Staking.sol/ImmeStaking.json';

import StakingToken from './artifacts/contracts/BUSD.sol/StakingToken.json';
import RewardToken from './artifacts/contracts/ImmeToken.sol/RewardToken.json';

const stakingAddress = '0xBc44DbCf0990C3A1a42330E5De1f304dcb1d892d';
const sTokenAddress = '0xAD3E28dA2B1480cdB2D79C70764458AaBa1c57F3'; //StakingToken.networks['3'].address;
const rTokenAddress = '0x9ad38251cD6B157B32C4D913b03165781bd2d019';

const UNISWAPV2_ROUTER02_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const UNISWAPV2_ROUTER02_ABI = [{ "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }]

const DAI_ADDRESS = "0xad6d458402f60fd3bd25163575031acdce07538d";
const WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
const BUSD_ADDRESS = "0x16c550a97ad2ae12c0c8cf1cc3f8db4e0c45238f";


function App() {
  const [poolAmount, setPoolAmount] = useState();
  const [coolDown, setCoolDown] = useState();
  const [depositAmount, setDepositAmount] = useState();

  async function settingPool() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakingAddress, Staking.abi, signer)
      const rewardContract = new ethers.Contract(rTokenAddress,RewardToken.abi, signer)
      try {
        await rewardContract.approve(stakingAddress,ethers.utils.parseUnits(poolAmount,18));
        debugger;
        let a = await rewardContract.allowance(stakingAddress, rTokenAddress)
        await contract.deposit(ethers.utils.parseUnits(poolAmount,18));
        console.log("Pool deposit")
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // async function settingCoolDown() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(stakingAddress, Staking.abi, signer)
  //     try {
  //       await contract.setCoolDownTime(coolDown)
  //       console.log("Setting CoolDown")
  //     } catch (err) {
  //       console.log("Error: ", err)
  //     }
  //   }
  // }

  // async function ownerWithdraw() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(stakingAddress, Staking.abi, signer)
  //     try {
  //       await contract.backWithdraw()
  //       console.log("Owner Withdraw")
  //     } catch (err) {
  //       console.log("Error: ", err)
  //     }
  //   }
  // }

  async function stake() {
    if (typeof window.ethereum !== 'undefined') {
      debugger;
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      
      const signer = provider.getSigner()
      const accounts = await window.ethereum.enable();
      console.log('accounts: ', accounts);
      console.log('provider: ', provider);

      const contract = new ethers.Contract(stakingAddress, Staking.abi, signer)
      const stakingContract = new ethers.Contract(sTokenAddress,StakingToken.abi, signer)
      const uniswap = new ethers.Contract(
        UNISWAPV2_ROUTER02_ADDRESS,
        UNISWAPV2_ROUTER02_ABI,
        signer,
      );
      try {
        let amountEthFromDAI = await uniswap.getAmountsOut(
          100,
          [sTokenAddress, rTokenAddress]
        )
      
      console.log("Amount of ETH from DAI: ", amountEthFromDAI[1].toString());

        await stakingContract.approve(stakingAddress,ethers.utils.parseUnits(depositAmount,18));
        await contract.staking(ethers.utils.parseUnits(depositAmount,18))
        console.log("Deposit")
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }


  async function unstake() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakingAddress, Staking.abi, signer)
      try {
        await contract.unstake()
        console.log("unstake")
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Admin Panel</p>
        <div>
          <input onChange={e=> setPoolAmount(e.target.value)} placeholder="Pool amount" />
          <button onClick={settingPool}> Pool Deposit</button>
        </div>
        {/* <div>
          <input onChange={e=> setCoolDown(e.target.value)} placeholder='Setting T' />
          <button onClick={settingCoolDown}>CoolDown Setting</button>
        </div> */}
        <div>
          {/* <button onClick={ownerWithdraw}> Owner Withdraw</button> */}
        </div>

        <p>User Panel</p>
        <div>
          <input onChange={e=> setDepositAmount(e.target.value)} placeholder="Deposit Amount" />
          <button onClick={ stake}> Stake</button>
        </div>

        <div>
          <button onClick={unstake}>Unstake</button>
        </div>
      </header>
    </div>
  );
}

export default App;
