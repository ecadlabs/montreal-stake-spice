import { Link } from "react-router-dom";
import ConnectionHeader from "../components/connection-header";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Action } from "../types";

const Dashboard = ({ address, wallet, disconnect }: { address: string | undefined, wallet: BeaconWallet, disconnect: Action<void> }) => {
    return (
        <div>
            <ConnectionHeader address={address} wallet={wallet} disconnect={disconnect} />
            <div className="main-container">
                <h1>Dashboard</h1>
                <div>
                    <Link to="/">Connect</Link><br />
                    <Link to="/delegate">Delegate</Link><br />
                    <Link to="/stake">Stake</Link><br />
                    <Link to="/unstake">Unstake</Link><br />
                    <Link to="/finalize-unstake">Finalize Unstake</Link><br />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
