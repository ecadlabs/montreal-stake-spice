import { BeaconWallet } from "@taquito/beacon-wallet";
import { useState } from "react";
import { Action } from "../types";

const ConnectionHeader = ({ address, wallet, disconnect }: { address: string | undefined, wallet: BeaconWallet, disconnect: Action<void> }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    return (
        <div className="main-container">
            <div className="split-items">
                <h2>ꜩ Tezos</h2>
                <div className="hamburger-menu" onClick={openModal}>
                    <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="butt" stroke-line-join="arcs"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </div>
            </div>

            {(modalVisible) && (
                <div className="disconnect-modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>{address}</p>
                        <button onClick={() => disconnect()}>Disconnect</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConnectionHeader;
