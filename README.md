# Data Cynical
<img src="https://i.imgur.com/wIP817g.jpeg" />
  
## Download App or Run From Source
### Download
1. Visit releases at `https://github.com/arksouthern/data-cynical/releases/latest`.
2. See if your platform is supported.
3. Download, then run the application.
### Run From Source
1. Download repo / source as zip file or clone repo.
2. Extract if downloaded as zip.
3. Install Node JS if not already installed.
4. Open the folder `destination`, then `release`.
5. In the folder, run:
```sh
npm i
```
6. Finally, to start the app, run:
```sh
npx tsx index.ts
```

## APIs
```ts
dbConnect = (connectionInfo: string) => null
dbIsConnected = () => boolean
dbDisconnect = () => null

dbQuery = (sqlQuery: string) => Table

dbDownload = (sqlQuery: string) => Csv

connect = () => AppVersion
```
