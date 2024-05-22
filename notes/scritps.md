## To create the react app
```
npm create vite@latest montreal-stake-spice -- --template react-ts
cd montreal-stake-spice
npm install
npm run dev
```

## To upgrade all dependencies
```
npm install -g npm-check-updates
ncu -u
npm install
```
Here we get a version conflict, se we need to downgrade `eslint` to `8.x`

## To add Taquito and Beacon SDK
```
npm i @taquito/taquito@20.0.0-RC.0 @taquito/beacon-wallet@20.0.0-RC.0 @airgap/beacon-dapp
```

## To add routing
```
npm install react-router-dom localforage match-sorter sort-by
```


