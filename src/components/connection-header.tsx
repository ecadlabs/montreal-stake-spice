import { useState } from "react";
import { Action } from "../types";

const ConnectionHeader = ({ address, disconnect }: { address: string | null, disconnect: Action<void> }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    return (
        <div className="main-container rounded not-too-narrow">
            <div className="split-items">
                <h2>ꜩ Tezos</h2>
                <div className="hamburger-menu" onClick={openModal}>
                    <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-line-join="arcs"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </div>
            </div>

            {(modalVisible) && (
                <div className={`modal ${modalVisible && 'open'}`}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="main-container">
                            <p>{address}</p>
                            <button className="button accent full-width" onClick={() => disconnect()}>Disconnect</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConnectionHeader;
