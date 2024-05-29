# Staking dApp

## Introduction

This dApp enables a user to stake their tokens and earn rewards.
The functionality provided is:

- Connecting the Wallet
- Choosing and changing the Delegate
- Staking and Unstaking tokens
- Finalizing Unstake
- Seeing Balances and Pending Unstakes

## How to run the dApp

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## What's Included

- Connecting/Disconnecting the Wallet
- Delegating to a Baker
- Staking/Unstaking Tez
- Finalizing Unstake
- Showing Balances and Pending Unstakes
- Undelegating
- Deploy to a [webpage](https://montreal-stake-spice.pages.dev)

## Next Steps

There is no specific plan to continue working on this project, but here are some ideas for future improvements.

- Error handling: currently only the happy path is implemented, and all the sad paths go to the console
- Improvements to appearance (to look closer to designs)
- Working on mobile view (it's currently only implemented for the desktop size)
- Missing features:
  - Max buttons
  - Select baker from a list
  - Baker additional info
  - Showing current Baker's nikname
  - Calculating and showing the time remaining for the funds to become finalizable
- Refactoring code to be of higher quality
- Disabling buttons when something in is progress
- Disabling buttons when the required data is not entered
- More complete input data validation
- Automated testing

## Contact Us

If you have any questions or suggestions, please feel free to contact using the repo's issues, or in Tezos Dev Slack.
