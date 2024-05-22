import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Link to="/">Connect</Link><br />
            <Link to="/delegate">Delegate</Link><br />
            <Link to="/stake">Stake</Link><br />
            <Link to="/unstake">Unstake</Link><br />
            <Link to="/finalize-unstake">Finalize Unstake</Link><br />
        </div>
    );
}

export default Dashboard;
