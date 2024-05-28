import { TezosToolkit } from '@taquito/taquito';
import { Action } from '../types';
import { useEffect, useState } from 'react';


const Delegate = ({
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

    type State = `Intro` | `Select Baker` | 'Asking Confirmation' | 'Showing Confirmation';

    const [state, setState] = useState<State>(`Intro`);
    const [baker, setBaker] = useState(currentDelegate ?? '');

    useEffect(() => {
        setModalVisible(true);
    }, []);

    const delegate = async () => {
        try {
            const operation = await tezosToolkit.wallet.setDelegate({
                delegate: baker
            }).send();
            await operation.confirmation();
            setState(`Showing Confirmation`);
        } catch (error) {
            console.error(error);
        }
    }

    const step2 = () => {
        setState('Select Baker');
    }

    const goBack = () => {
        switch (state) {
            case 'Select Baker':
                setState('Intro');
                break;
            case 'Asking Confirmation':
                setState('Select Baker');
                break;
            case 'Intro':
                closeModal(false);
                break;
            default:
                break;
        }
    }

    const step3 = () => {
        if (!baker) { // TODO: Add validation for baker address
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
                {state === 'Intro' && (
                    <div className="main-container">
                        <h1>Delegate</h1>
                        <p className='center-text'>Earn rewards while retaining lower risk<br /> of your funds by delegating to a Tezos baker.</p>
                        <button className="button active full-width" onClick={() => step2()}>Continue</button>
                    </div>
                )}
                {state === 'Select Baker' && (
                    <div className="main-container">
                        <h1>Delegate</h1>
                        <div>
                            <label className="label">Available</label><br />
                            <input className="input full-width" type="text" value={availableBalance / 1000000} readOnly />
                        </div>
                        <div>
                            <label className="label">Select Baker</label><br />
                            <input className="input full-width" type="text" value={baker} onChange={e => setBaker(e.target.value)} />
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
                            <label className="label">Select Baker</label><br />
                            <input className="input full-width" value={baker} type="text" readOnly />
                        </div>
                        <button className="button active full-width" onClick={() => delegate()}>Confirm</button>
                    </div>
                )}

                {state === `Showing Confirmation` && (
                    <div className='main-container'>
                        <h1>Nicely Done</h1>
                        <p className='center-text'>You have successfully delegated your<br /> balance to the baker. You can now stake<br /> your balance.</p>
                        <button className="button active full-width" onClick={() => closeModal(true)}>Continue</button>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Delegate;
