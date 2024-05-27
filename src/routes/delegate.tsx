import { TezosToolkit } from "@taquito/taquito";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Delegate = ({ tezosToolkit }: { tezosToolkit: TezosToolkit }) => {
    const [delegate, setDelegate] = useState('');
    const navigate = useNavigate();

    const performDelegation = async () => {
        const op = await tezosToolkit.wallet.setDelegate({
            delegate: delegate
        }).send();
        await op.confirmation();
        navigate('/dashboard');
    }

    return (
        <div>
            <h1>Delegate</h1>
            <input type="text" value={delegate} onChange={(e) => setDelegate(e.target.value)} />
            <button onClick={performDelegation}>Delegate</button>
            <Link to="/dashboard">Dashboard</Link>
        </div>
    );
}

export default Delegate;