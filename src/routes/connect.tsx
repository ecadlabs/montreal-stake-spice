import { Action } from "../types";

const Connect = ({ connectWallet }: { connectWallet: Action<void> }) => {
    return (
        <div className="main-container rounded">
            <h1>ꜩ Tezos</h1>
            <h1>Earn rewards with Tezos <br /> staking solutions</h1>
            <button className="button active" onClick={() => connectWallet()}>Connect Wallet</button>
        </div>
    );
}

export default Connect;
