import ConnectionHeader from "../components/connection-header";
import { Action } from "../types";
import { UnstakeRequestsResponse } from "@taquito/rpc";
import { formatTez } from "../helpers";
import FinalizeUnstake from "../components/finalize-unstake";
import { TezosToolkit } from "@taquito/taquito";
import { useState } from "react";
import Stake from "../components/stake";
import Unstake from "../components/unstake";
import Delegate from "../components/delegate";
import EndDelegation from "../components/end-delegation";

const Dashboard = ({
    address,
    disconnect,
    balance,
    stakedBalance,
    delegate,
    unstakeRequests,
    tezosToolkit,
    refreshData,
}: {
    address: string | null,
    disconnect: Action<void>,
    balance: number | null,
    stakedBalance: number | null,
    delegate: string | null,
    unstakeRequests: UnstakeRequestsResponse,
    tezosToolkit: TezosToolkit,
    refreshData: Action<void>,
}) => {

    type State = 'None' | 'Staking' | 'Unstaking' | 'Finalizing Unstake' | 'Delegating' | 'Ending Delegation';
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

    const setDelegate = () => {
        setState('Delegating');
    }

    const endDelegation = () => {
        setState('Ending Delegation');
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
        <>
            <ConnectionHeader address={address} disconnect={disconnect} />
            <div className="main-container rounded-top not-too-narrow">
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
                        <div className="has-top-left-icon">
                            <span>Delegattion</span>
                            {delegate && <span className="top-left" onClick={endDelegation}>End <span className="icon">&times;</span></span>}
                        </div>
                        <p>{delegate ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className="top-line">
                        <div className="has-top-left-icon">
                            <span>Baker</span>
                            <span className="top-left" onClick={setDelegate}>{delegate ? 'Change' : 'View Bakers'} <span className="icon">✍</span></span>
                        </div>
                        <p className="wrap-words">{delegate}</p>
                    </div>
                </div>
                <div className="evenly-sized-items">
                    {delegate && (
                        <button className="button half-parent" onClick={unstake}>Unstake</button>
                    )}
                    {!delegate && (
                        <button className="button active half-parent" onClick={setDelegate}>Delegate</button>
                    )}
                    <button className={`button ${delegate ? 'active' : 'disabled'} half-parent`} onClick={stake}>Stake</button>
                </div>
            </div>
            {(getPendingUnstakeCount() > 0) && (
                <div className="main-container rounded-bottom not-too-narrow">
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
            {state === 'Delegating' && (
                <Delegate tezosToolkit={tezosToolkit} closeModal={modalClosed} availableBalance={balance ?? 0} currentDelegate={delegate} />
            )}  
            {state === 'Ending Delegation' && (
                <EndDelegation tezosToolkit={tezosToolkit} closeModal={modalClosed} availableBalance={balance ?? 0} currentDelegate={delegate} />
            )}  
        </>
    );
}

export default Dashboard;
