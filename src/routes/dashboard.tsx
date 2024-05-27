import { Link } from "react-router-dom";
import ConnectionHeader from "../components/connection-header";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Action } from "../types";
import { UnstakeRequestsResponse } from "@taquito/rpc";
import { formatTez } from "../helpers";
import FinalizeUnstake from "../components/finalize-unstake";
import { TezosToolkit } from "@taquito/taquito";
import { useState } from "react";

const Dashboard = ({
    address,
    wallet,
    disconnect,
    balance,
    stakedBalance,
    delegate,
    unstakeRequests,
    tezosToolkit,
    refreshData,
}: {
    address: string | undefined,
    wallet: BeaconWallet,
    disconnect: Action<void>,
    balance: number | null,
    stakedBalance: number | null,
    delegate: string | null,
    unstakeRequests: UnstakeRequestsResponse,
    tezosToolkit: TezosToolkit,
    refreshData: Action<void>,
}) => {

    type State = 'None' | 'Staking' | 'Unstaking' | 'Finalizing Unstake';
    const [state, setState] = useState<State>('None');

    const finalizeUnstake = () => {
        setState('Finalizing Unstake');
    }

    const getFinalizableBalance = () => {
        if (!unstakeRequests) {
            return 0;
        }
        return unstakeRequests.finalizable.reduce((acc, request) => acc + Number(request.amount), 0);
    }

    const finalizeUnstakeClosed = (success: boolean) => {
        setState('None');
        if (success) {
            refreshData();
        }
    }

    return (
        <div>
            <Link to="/">Connect</Link><br />
            <Link to="/delegate">Delegate</Link><br />
            <Link to="/stake">Stake</Link><br />
            <Link to="/unstake">Unstake</Link><br />
            <Link to="/finalize-unstake">Finalize Unstake</Link><br />

            <ConnectionHeader address={address} wallet={wallet} disconnect={disconnect} />
            <div className="main-container rounded-top">
                <div className="evenly-sized-items">
                    <div className="top-line">
                        <h5>Available</h5>
                        <p>{formatTez(balance)} tez</p>
                    </div>
                    <div className="top-line">
                        <h5>Staked Balance</h5>
                        <p>{formatTez(stakedBalance)} tez</p>
                    </div>
                </div>
                <div className="evenly-sized-items">
                    <div className="top-line">
                        <h5>Delegattion</h5>
                        <p>{delegate ? 'Active' : 'Not'}</p>
                    </div>
                    <div className="top-line">
                        <h5>Baker</h5>
                        <p className="wrap-words">{delegate}</p>
                    </div>
                </div>
            </div>
            <div className="main-container rounded-bottom">
                <div className="full-width">
                    <div className="split-items">
                        <span>Pending Unstake</span>
                        <span>{unstakeRequests && (unstakeRequests.finalizable.length + unstakeRequests.unfinalizable.requests.length)}</span>
                    </div>
                    {unstakeRequests && (
                        <div className="full-width">
                            <h5>Finalizable</h5>
                            {unstakeRequests.finalizable.map((request, index) => (
                                <div key={index} className="split-items top-line">
                                    <div>
                                        <p>Amount: {formatTez(request.amount)} ꜩ</p>
                                        <p>Cycle: {request.cycle}</p>
                                    </div>
                                    <button className="button accent half-parent" onClick={finalizeUnstake}>Finalize</button>
                                </div>
                            ))}
                            <h2>TODO: Show Unfinalizable</h2>
                            {/* <h5>Unfinalizable</h5>
                            <ul>
                                {unstakeRequests.unfinalizable.requests.map((request, index) => (
                                    <li key={index}>
                                        <p>Amount: {request.balance} tez</p>
                                        <p>Requester: {request.requester}</p>
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                    )}
                </div>
            </div>
            {state === 'Finalizing Unstake' && (
                <FinalizeUnstake tezosToolkit={tezosToolkit} closeModal={finalizeUnstakeClosed} finalizableBalance={getFinalizableBalance()} />
            )}
        </div>
    );
}

export default Dashboard;
