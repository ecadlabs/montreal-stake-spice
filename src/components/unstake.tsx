import { TezosToolkit } from '@taquito/taquito';
import { Action } from '../types';
import { useEffect, useState } from 'react';


const Unstake = ({
  tezosToolkit,
  closeModal,
  stakedBalance,
}: {
  tezosToolkit: TezosToolkit,
  closeModal: Action<boolean>,
  stakedBalance: number
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  type State = `Disclaimer` | `Asking Amount` | 'Asking Confirmation' | 'Showing Confirmation';

  const [state, setState] = useState<State>(`Disclaimer`);
  const [amount, setAmount] = useState('0');

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const unstake = async () => {
    try {
      const operation = await tezosToolkit.wallet.unstake({
        amount: Number(amount),
        mutez: false
      }).send();
      await operation.confirmation();
      setState(`Showing Confirmation`);
    } catch (error) {
      console.error(error);
    }
  }

  const step2 = () => {
    setState('Asking Amount');
  }

  const goBack = () => {
    switch (state) {
      case 'Asking Amount':
        setState('Disclaimer');
        break;
      case 'Asking Confirmation':
        setState('Asking Amount');
        break;
      case 'Disclaimer':
        closeModal(false);
        break;
      default:
        break;
    }
  }

  const step3 = () => {
    const amountToUnstake = Number(amount) * 1000000;
    if (isNaN(amountToUnstake) || amountToUnstake <= 0) {
      return;
    }
    if (amountToUnstake > stakedBalance) {
      return;
    }
    setState('Asking Confirmation');
  }

  return (
    <div className={`modal ${modalVisible && 'open'}`}>
      <div className="modal-content">
        {(state !== 'Showing Confirmation') && (
          < span className="back" onClick={() => goBack()}>←</span>
        )}
        <span className="close" onClick={() => closeModal(false)}>&times;</span>
        {state === 'Disclaimer' && (
          <div className="main-container">
            <h1>Important Notice</h1>
            <p className='center-text'>You need to unstake first and wait for the<br /> next cycle to finalize and withdraw your<br /> frozen tez back to your balance.</p>
            <button className="button active full-width" onClick={() => step2()}>I Understand</button>
          </div>
        )}
        {state === 'Asking Amount' && (
          <div className="main-container">
            <h1>Select Amount</h1>
            <div>
              <label className="label">Staked</label><br />
              <input className="input full-width" type="text" value={stakedBalance / 1000000} readOnly />
            </div>
            <div>
              <label className="label">Enter Amount</label><br />
              <input className="input full-width" type="text" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <button className="button active full-width" onClick={() => step3()}>Preview</button>
          </div>
        )}
        {state === 'Asking Confirmation' && (
          <div className="main-container">
            <h1>Confirm</h1>
            <div>
              <label className="label">Staked</label><br />
              <input className="input full-width" type="text" value={stakedBalance / 1000000} readOnly />
            </div>
            <div>
              <label className="label">Amount to Unstake</label><br />
              <input className="input full-width" value={amount} type="text" readOnly />
            </div>
            <button className="button active full-width" onClick={() => unstake()}>Confirm</button>
          </div>
        )}

        {state === `Showing Confirmation` && (
          <div className='main-container'>
            <h1>Nicely Done</h1>
            <p className='center-text'>You have requested to unfreeze your staked<br /> balance. You need to wait for the next cycle<br /> to finalise and withdraw your frozen tez.</p>
            <button className="button active full-width" onClick={() => closeModal(true)}>Continue</button>
          </div>
        )}
      </div>
    </div >
  );
}

export default Unstake;
