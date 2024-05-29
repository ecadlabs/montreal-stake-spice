import Connect from './routes/connect';
import Dashboard from './routes/dashboard';
import { AccountInfo, BeaconEvent, NetworkType } from "@airgap/beacon-dapp";
import { useEffect, useRef, useState } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { UnstakeRequestsResponse } from "@taquito/rpc";

type RefData = {
    tezosToolkit?: TezosToolkit,
    wallet?: BeaconWallet,
}

const Root = () => {

    const rpcUrl = 'https://rpc.parisnet.teztnets.com/';

    const onActiveAccountSet = async (_data: AccountInfo): Promise<void> => {
        setActiveAccount(_data.address);
        console.log(`Active account set: ${_data.address}`);
        setTimeout(() => {
            refreshData(_data.address);
        }, 10);
    }

    const [activeAccount, setActiveAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [stakedBalance, setStakedBalance] = useState<number | null>(null);
    const [delegate, setDelegate] = useState<string | null>(null);
    const [unstakeRequests, setUnstakeRequests] = useState<UnstakeRequestsResponse>(null);

    const tezosRefs = useRef<RefData>({});

    const createNewWallet = () => {
        console.log('Creating new wallet');
        return new BeaconWallet({
            name: "Staking dApp",
            network: {
                type: NetworkType.PARISNET,
                rpcUrl: rpcUrl
            }
        });
    }

    const connectWallet = async () => {
        await tezosRefs.current.wallet!.requestPermissions({
            network: {
                type: NetworkType.PARISNET,
            },
        });
        refreshData();
    }

    const disconnectWallet = async () => {
        await tezosRefs.current.wallet?.clearActiveAccount();
        await tezosRefs.current.wallet?.disconnect();
        await initateTezosToolkit();
    }

    const initateTezosToolkit = async () => {
        const wallet = createNewWallet();
        tezosRefs.current.wallet = wallet;
        await wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, onActiveAccountSet);
        const activeAccount = await wallet.client.getActiveAccount();
        setActiveAccount(activeAccount?.address ?? null);
        const tezos = new TezosToolkit(rpcUrl);
        tezos.setWalletProvider(wallet);
        tezosRefs.current.tezosToolkit = tezos;
        await refreshData();
    }

    const refreshData = async (account?: string | null | undefined) => {
        const tezos = tezosRefs.current.tezosToolkit;
        if (!account) {
            account = activeAccount;
        }
        console.log(`Active account: ${account}`)
        if (tezos && account) {
            const balance = await tezos.tz.getBalance(account);
            setBalance(Number(balance));
            const delegate = await tezos.tz.getDelegate(account);
            setDelegate(delegate);
            const stakedBalance = await tezos.rpc.getStakedBalance(account);
            setStakedBalance(Number(stakedBalance));
            const unstakeRequests = await tezos.rpc.getUnstakeRequests(account);
            setUnstakeRequests(unstakeRequests);
        } else {
            setBalance(null);
            setDelegate(null);
            setStakedBalance(null);
            setUnstakeRequests(null);
        }
    }

    useEffect(() => {
        console.log('Initiating Tezos toolkit');
        initateTezosToolkit().then(() => {
        });
    }, []);

    return activeAccount ? <Dashboard
        address={activeAccount ?? null}
        disconnect={disconnectWallet}
        delegate={delegate}
        balance={balance}
        stakedBalance={stakedBalance}
        unstakeRequests={unstakeRequests}
        tezosToolkit={tezosRefs.current.tezosToolkit!}
        refreshData={() => refreshData()}
    /> : <Connect connectWallet={connectWallet} />;
}

function App() {
    return (
        <Root />
    );
}

export default App;
