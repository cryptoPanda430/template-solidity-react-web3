import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';

import Staking from './artifacts/contracts/Staking.sol/ImmeStaking.json';

import StakingToken from './artifacts/contracts/BUSD.sol/StakingToken.json';
import RewardToken from './artifacts/contracts/ImmeToken.sol/RewardToken.json';

const stakingAddress = Staking.networks['3'].address;
const sTokenAddress = StakingToken.networks['3'].address;
const rTokenAddress = RewardToken.networks['3'].address;

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
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(stakingAddress, Staking.abi, signer)
      const stakingContract = new ethers.Contract(sTokenAddress,StakingToken.abi, signer)
      try {
        await stakingContract.approve(stakingAddress,ethers.utils.parseUnits(depositAmount,18));
        await contract.deposit(ethers.utils.parseUnits(depositAmount,18))
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
