import { TezosToolkit } from '@taquito/taquito';
import { Action } from '../types';
import { useEffect, useState } from 'react';


const Stake = ({
  tezosToolkit,
  closeModal,
  availableBalance,
}: {
  tezosToolkit: TezosToolkit,
  closeModal: Action<boolean>,
  availableBalance: number
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  type State = `Disclaimer` | `Asking Amount` | 'Asking Confirmation' | 'Showing Confirmation';

  const [state, setState] = useState<State>(`Disclaimer`);
  const [agree, setAgree] = useState(false);
  const [amount, setAmount] = useState('0');

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const stake = async () => {
    try {
      const operation = await tezosToolkit.wallet.stake({
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
    if (agree) {
      setState('Asking Amount');
    }
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
    const amountToStake = Number(amount) * 1000000;
    if (isNaN(amountToStake) || amountToStake <= 0) {
      return;
    }
    if (amountToStake > availableBalance) {
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
            <h1>Disclaimer</h1>
            <p className='center-text'>By staking, you put your balance at risk and <br /> may lose all your money.</p>
            <div>
              <input type='checkbox' id='agree' name='agree' checked={agree} onChange={() => setAgree(!agree)} />
              <label htmlFor='agree'>I confirm that I have read and agreed<br /> with the Terms of Service.</label>
            </div>
            <button className="button active full-width" onClick={() => step2()}>Continue</button>
          </div>
        )}
        {state === 'Asking Amount' && (
          <div className="main-container">
            <h1>Select Amount</h1>
            <div>
              <label className="label">Available</label><br />
              <input className="input full-width" type="text" value={availableBalance / 1000000} readOnly />
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
              <label className="label">Available</label><br />
              <input className="input full-width" type="text" value={availableBalance / 1000000} readOnly />
            </div>
            <div>
              <label className="label">Enter Amount</label><br />
              <input className="input full-width" value={amount} type="text" readOnly />
            </div>
            <button className="button active full-width" onClick={() => stake()}>Confirm</button>
          </div>
        )}

        {state === `Showing Confirmation` && (
          <div className='main-container'>
            <h1>Nicely Done</h1>
            <p className='center-text'>You have successfully staked your<br/> balance to the baker.</p>
            <button className="button active full-width" onClick={() => closeModal(true)}>Continue</button>
          </div>
        )}
      </div>
    </div >
  );
}

export default Stake;
