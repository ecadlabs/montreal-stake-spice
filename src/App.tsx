import {
    BrowserRouter,
    createBrowserRouter,
    Navigate,
    Route,
    RouterProvider,
    Routes,
    useNavigate,
} from "react-router-dom";
import Connect from './routes/connect';
import Dashboard from './routes/dashboard';
import Delegate from './routes/delegate';
import EndDelegation from './routes/end-delegation';
import Stake from './routes/stake';
import Unstake from './routes/unstake';
import FinalizeUnstake from './routes/finalize-unstake';
import { AccountInfo, BeaconEvent, NetworkType } from "@airgap/beacon-dapp";
import { AppendLogParams } from "./types";
import { useEffect, useState } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";

const Root = () => {

    const rpcUrl = 'https://rpc.parisnet.teztnets.com/';

    const appendLog = (params: AppendLogParams) => {
        console.log(params);
    }

    const onActiveAccountSet = async (data: AccountInfo): Promise<void> => {
        appendLog({ message: `Active account set: ${data.address}`, kind: 'info', data });
    }

    const [activeAccount, setActiveAccount] = useState<AccountInfo | null>(null);

    const [wallet, setWallet] = useState<BeaconWallet>(new BeaconWallet({
        name: "Staking dApp",
        network: {
            type: NetworkType.PARISNET,
            rpcUrl: rpcUrl
        }
    }));

    const createNewWallet = () => {
        return new BeaconWallet({
            name: "Staking dApp",
            network: {
                type: NetworkType.PARISNET,
                rpcUrl: rpcUrl
            }
        });
    }

    const disconnectWallet = async () => {
        await wallet.clearActiveAccount();
        await wallet.disconnect();
        setWallet(createNewWallet());
        tezosToolkit?.setWalletProvider(wallet);
        navigate('/');
    }

    const [tezosToolkit, setTezosToolkit] = useState<TezosToolkit | null>(null);

    const location = window.location.pathname;

    useEffect(() => {
        console.log(`Location: ${location}`);
    }, [location]);

    const navigate = useNavigate();

    let expectedPath = location;

    const initateTezosToolkit = async () => {
        const wallet = new BeaconWallet({
            name: "Staking dApp",
            network: {
                type: NetworkType.PARISNET,
                rpcUrl: rpcUrl
            }
        });
        await wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, onActiveAccountSet);
        const aliceTezosToolkit = new TezosToolkit(rpcUrl);
        aliceTezosToolkit.setWalletProvider(wallet);
        const activeAccount = await wallet.client.getActiveAccount();
        setActiveAccount(activeAccount ?? null);
        console.log(activeAccount);
        if (activeAccount) {
            if (location === '/') {
                expectedPath = '/dashboard';
            } else {
                expectedPath = location;
            }
        } else {
            expectedPath = '/';
        }
        if (expectedPath !== location) {
            navigate(expectedPath);
        }
        console.log(`expectedPath: ${expectedPath}`);
    }

    useEffect(() => {
        initateTezosToolkit().then(() => {
        });
    }, []);

    return (expectedPath !== location) ? (
        <Navigate to={expectedPath} />
    ) : (
        <Routes>
            <Route path="/" element={<Connect wallet={wallet} />} />
            <Route path="/dashboard" element={<Dashboard address={activeAccount?.address} wallet={wallet} disconnect={disconnectWallet} />} />
            <Route path="/delegate" element={<Delegate />} />
            <Route path="/end-delegation" element={<EndDelegation />} />
            <Route path="/stake" element={<Stake />} />
            <Route path="/unstake" element={<Unstake />} />
            <Route path="/finalize-unstake" element={<FinalizeUnstake />} />
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