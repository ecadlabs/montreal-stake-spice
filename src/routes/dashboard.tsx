import ConnectionHeader from "../components/connection-header";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Action } from "../types";
import { UnstakeRequestsResponse } from "@taquito/rpc";
import { formatTez } from "../helpers";
import FinalizeUnstake from "../components/finalize-unstake";
import { TezosToolkit } from "@taquito/taquito";
import { useState } from "react";
import Stake from "../components/stake";
import Unstake from "../components/unstake";

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

    const stake = () => {
        setState('Staking');
    }

    const unstake = () => {
        setState('Unstaking');
    }

    const finalizeUnstake = () => {
        setState('Finalizing Unstake');
    }

    const getFinalizableBalance = () => {
        if (!unstakeRequests) {
            return 0;
        }
        return unstakeRequests.finalizable.reduce((acc, request) => acc + Number(request.amount), 0);
    }

    const modalClosed = (success: boolean) => {
        setState('None');
        if (success) {
            refreshData();
        }
    }

    const getPendingUnstakeCount = () => {
        if (!unstakeRequests) {
            return 0;
        }
        return unstakeRequests.finalizable.length + unstakeRequests.unfinalizable.requests.length;
    }

    return (
        <div>
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
                <div className="evenly-sized-items">
                    {delegate && (
                        <button className="button half-parent" onClick={unstake}>Unstake</button>
                    )}
                    {!delegate && (
                        <button className="button active half-parent" onClick={() => { }}>Delegate</button>
                    )}
                    <button className={`button ${delegate ? 'active' : 'disabled'} half-parent`} onClick={stake}>Stake</button>
                </div>
            </div>
            {(getPendingUnstakeCount() > 0) && (
                <div className="main-container rounded-bottom">
                    <div className="full-width">
                        <div className="split-items">
                            <span>Pending Unstake</span>
                            <span>({getPendingUnstakeCount()})</span>
                        </div>
                        <div className="full-width">
                            {unstakeRequests?.finalizable && unstakeRequests.finalizable.map((request, index) => (
                                <div key={index} className="split-items top-line">
                                    <div>
                                        <p>Amount: {formatTez(request.amount)} ꜩ</p>
                                        <p>Cycle: {request.cycle}</p>
                                    </div>
                                    <button className="button accent half-parent" onClick={finalizeUnstake}>Finalize</button>
                                </div>
                            ))}

                            {unstakeRequests?.unfinalizable && unstakeRequests.unfinalizable.requests.map((request, index) => (
                                <div className="split-items top-line" key={index}>
                                    <p>Amount: {formatTez(request.amount)} tez</p>
                                    <p>Cycle: {request.cycle}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {state === 'Finalizing Unstake' && (
                <FinalizeUnstake tezosToolkit={tezosToolkit} closeModal={modalClosed} finalizableBalance={getFinalizableBalance()} />
            )}
            {state === 'Staking' && (
                <Stake tezosToolkit={tezosToolkit} closeModal={modalClosed} availableBalance={balance!} />
            )}
            {state === 'Unstaking' && (
                <Unstake tezosToolkit={tezosToolkit} closeModal={modalClosed} stakedBalance={stakedBalance!} />
            )}
        </div>
    );
}

export default Dashboard;
