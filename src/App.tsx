import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Connect from './routes/connect';
import Dashboard from './routes/dashboard';
import { AccountInfo, BeaconEvent, NetworkType } from "@airgap/beacon-dapp";
import { AppendLogParams } from "./types";
import { useEffect, useState } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { UnstakeRequestsResponse } from "@taquito/rpc";

const Root = () => {

    const rpcUrl = 'https://rpc.parisnet.teztnets.com/';

    const appendLog = (params: AppendLogParams) => {
        console.log(params);
    }

    const onActiveAccountSet = async (_data: AccountInfo): Promise<void> => {
        await refreshData();
    }

    const [activeAccount, setActiveAccount] = useState<AccountInfo | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [stakedBalance, setStakedBalance] = useState<number | null>(null);
    const [delegate, setDelegate] = useState<string | null>(null);
    const [unstakeRequests, setUnstakeRequests] = useState<UnstakeRequestsResponse>(null);

    
    const createNewWallet = () => {
        return new BeaconWallet({
            name: "Staking dApp",
            network: {
                type: NetworkType.PARISNET,
                rpcUrl: rpcUrl
            }
        });
    }
    
    const [wallet, setWallet] = useState<BeaconWallet>(createNewWallet());

    const disconnectWallet = async () => {
        await wallet.clearActiveAccount();
        await wallet.disconnect();
        setWallet(createNewWallet());
        tezosToolkit?.setWalletProvider(wallet);
        navigate('/');
    }

    const [tezosToolkit, setTezosToolkit] = useState<TezosToolkit | null>(null);

    const location = window.location.pathname;

    const navigate = useNavigate();

    let expectedPath = location;

    const initateTezosToolkit = async () => {
        const wallet = createNewWallet();
        setWallet(wallet);
        await wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, onActiveAccountSet);
        const tezos = new TezosToolkit(rpcUrl);
        tezos.setWalletProvider(wallet);
        setTezosToolkit(tezos);
        await refreshData(tezos);
    }

    const refreshData = async (tezos?: TezosToolkit) => {
        if (!tezos) {
            tezos = tezosToolkit!;
        }
        const activeAccount = await wallet.client.getActiveAccount();
        setActiveAccount(activeAccount ?? null);
        if (activeAccount) {
            const balance = await tezos.tz.getBalance(activeAccount.address);
            setBalance(Number(balance));
            const delegate = await tezos.tz.getDelegate(activeAccount.address);
            setDelegate(delegate);
            const stakedBalance = await tezos.rpc.getStakedBalance(activeAccount.address);
            setStakedBalance(Number(stakedBalance));
            const unstakeRequests = await tezos.rpc.getUnstakeRequests(activeAccount.address);
            setUnstakeRequests(unstakeRequests);
            if (location === '/') {
                expectedPath = '/dashboard';
            } else {
                expectedPath = location;
            }
        } else {
            expectedPath = '/';
            setBalance(null);
            setDelegate(null);
            setStakedBalance(null);
            setUnstakeRequests(null);
        }
        if (expectedPath !== location) {
            navigate(expectedPath);
        }
    }

    useEffect(() => {
        initateTezosToolkit().then(() => {
        });
    }, []);

    return (expectedPath !== location) ? (
        <Navigate to={expectedPath} />
    ) : (
        <Routes>
            <Route path="/" element={<Connect wallet={wallet} refreshData={() => refreshData().then(() => {})} />} />
            <Route path="/dashboard" element={
                <Dashboard
                    address={activeAccount?.address}
                    wallet={wallet}
                    disconnect={disconnectWallet}
                    delegate={delegate}
                    balance={balance}
                    stakedBalance={stakedBalance}
                    unstakeRequests={unstakeRequests}
                    tezosToolkit={tezosToolkit!}
                    refreshData={initateTezosToolkit}
                />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    );
}

export default App;
