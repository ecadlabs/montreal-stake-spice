import { NetworkType } from "@airgap/beacon-dapp";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { useNavigate } from "react-router-dom";

const Connect = ({ wallet }: { wallet: BeaconWallet }) => {

    const navigate = useNavigate();

    const connectWallet = async () => {
        await wallet.requestPermissions({
            network: {
                type: NetworkType.PARISNET,
            },
        });
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
