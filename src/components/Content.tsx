import { Link } from "react-router-dom";
import './Content.css';

const Content = () => {
  return (
    <>
      <div id="dashboard-link">
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div className="content-container">
        <div className="table-container">
          <div className='account-name'>
            <p>Account Name: </p>
          </div>
          <table id="content-table">
            <tbody>
              <tr>
                <td id="amount-available">
                  <h3>Available</h3>
                  <div>content goes here</div>
                </td>
                <td id="amount-staked">
                  <h3>Staked</h3>
                  <div>content goes here</div>
                </td>
              </tr>
              <tr>
                <td id="delegation-status">
                  <h3>Delegation</h3>
                  <div>content goes here</div>
                </td>
                <td id="baker-name">
                  <h3>Baker</h3>
                  <div>content goes here</div>
                </td>
              </tr>
              <tr>
                <td id="staking-date">
                  <h3>Staked Since</h3>
                  <div>content goes here</div>
                </td>
                <td id="amount-reward">
                  <h3>Total Rewards</h3>
                  <div>content goes here</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Content;
