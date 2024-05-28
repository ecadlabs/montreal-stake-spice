import { TezosToolkit } from '@taquito/taquito';
import { Action } from '../types';
import { useEffect, useState } from 'react';


const EndDelegation = ({
    tezosToolkit,
    closeModal,
    availableBalance,
    currentDelegate,
}: {
    tezosToolkit: TezosToolkit,
    closeModal: Action<boolean>,
    availableBalance: number,
    currentDelegate: string | null,
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    type State = `Information` | `Show Baker` | 'Asking Confirmation' | 'Showing Confirmation';

    const [state, setState] = useState<State>(`Information`);
    const [baker, setBaker] = useState(currentDelegate ?? '');

    useEffect(() => {
        setModalVisible(true);
    }, []);

    const undelegate = async () => {
        try {
            const operation = await tezosToolkit.wallet.setDelegate({
                delegate: undefined
            }).send();
            await operation.confirmation();
            setState(`Showing Confirmation`);
        } catch (error) {
            console.error(error);
        }
    }

    const step2 = () => {
        setState('Show Baker');
    }

    const goBack = () => {
        switch (state) {
            case 'Show Baker':
                setState('Information');
                break;
            case 'Asking Confirmation':
                setState('Show Baker');
                break;
            case 'Information':
                closeModal(false);
                break;
            default:
                break;
        }
    }

    const step3 = () => {
        setState('Asking Confirmation');
    }

    return (
        <div className={`modal ${modalVisible && 'open'}`}>
            <div className="modal-content">
                {(state !== 'Showing Confirmation') && (
                    < span className="back" onClick={() => goBack()}>←</span>
                )}
                <span className="close" onClick={() => closeModal(false)}>&times;</span>
                {state === 'Information' && (
                    <div className="main-container">
                        <h1>End Delegation</h1>
                        <p className='center-text'>When you end your delegation, staked funds<br /> will be unstaked.</p>
                        <button className="button active full-width" onClick={() => step2()}>Continue</button>
                    </div>
                )}
                {state === 'Show Baker' && (
                    <div className="main-container">
                        <h1>End Delegation</h1>
                        <div>
                            <label className="label">Baker</label><br />
                            <input className="input full-width" type="text" value={baker} readOnly />
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
                            <label className="label">Baker</label><br />
                            <input className="input full-width" value={baker} type="text" readOnly />
                        </div>
                        <button className="button active full-width" onClick={() => undelegate()}>Confirm</button>
                    </div>
                )}

                {state === `Showing Confirmation` && (
                    <div className='main-container'>
                        <h1>Delegation Ended!</h1>
                        <p className='center-text'>You have successfully ended the<br /> delegation. You can start a new<br /> delegation now..</p>
                        <button className="button active full-width" onClick={() => closeModal(true)}>Continue</button>
                    </div>
                )}
            </div>
        </div >
    );
}

export default EndDelegation;
