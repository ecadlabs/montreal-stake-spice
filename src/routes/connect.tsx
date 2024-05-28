import { NetworkType } from "@airgap/beacon-dapp";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { useNavigate } from "react-router-dom";
import { Action } from "../types";

const Connect = ({ wallet, refreshData }: { wallet: BeaconWallet, refreshData: Action<void> }) => {

    const navigate = useNavigate();

    const connectWallet = async () => {
        await wallet.requestPermissions({
            network: {
                type: NetworkType.PARISNET,
            },
        });
        refreshData();
        navigate('/dashboard');
    }

    return (
        <div className="main-container rounded">
            <h1>ꜩ Tezos</h1>
            <h1>Earn rewards with Tezos <br /> staking solutions</h1>
            <button className="button active" onClick={connectWallet}>Connect Wallet</button>
        </div>
    );
}

export default Connect;
