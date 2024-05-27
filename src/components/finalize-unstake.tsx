import { TezosToolkit } from "@taquito/taquito";
import { Action } from "../types";
import { useEffect, useState } from "react";

const FinalizeUnstake = ({
  tezosToolkit,
  closeModal,
  finalizableBalance,
}: {
  tezosToolkit: TezosToolkit,
  closeModal: Action<boolean>,
  finalizableBalance: number
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  type State = `Asking to finalize unstake` | `Showing Confirmation`;

  const [state, setState] = useState<State>(`Asking to finalize unstake`);

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const finalizeUnstake = async () => {
    try {
      const operation = await tezosToolkit.wallet.finalizeUnstake({}).send();
      await operation.confirmation();
      setState(`Showing Confirmation`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`modal ${modalVisible && 'open'}`}>
      <div className="modal-content">
        <span className="close" onClick={() => closeModal(false)}>&times;</span>
        {state === `Asking to finalize unstake` && (
          <div className="main-container">
            <h1>Finalize</h1>
            <div>
              <label className="label">Available</label><br />
              <input className="input" type="text" value={finalizableBalance / 1000000} readOnly />
            </div>
            <button className="button active full-width" onClick={() => finalizeUnstake()}>Finalize</button>
          </div>
        )}
        {state === `Showing Confirmation` && (
          <>
            <p>Nicely Done</p>
            <p>You have successfully finalized your unstake, the balance will appear under your available balance.</p>
            <p>Finalize Unstake Confirmed</p>
          </>
        )}
      </div>
    </div>
  );
}

export default FinalizeUnstake;
