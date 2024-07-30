# Data Cynical
<img src="https://i.imgur.com/wIP817g.jpeg" />
  

<div align=center>
  <hr /><br />
  <h3>Data Cynical</h3>
  <img height=256 src="https://i.imgur.com/6MKsCMJ.jpeg" />
</div>  
  
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
## Feature Overview 
<img src="https://i.imgur.com/Dwkv9W7.jpeg" />

  
## APIs
```ts
dbConnect = (connectionInfo: string) => null
dbIsConnected = () => DbConnection | false
dbDisconnect = () => null

dbQuery = (sqlQuery: string) => Table

dbDownload = (sqlQuery: string) => Csv

apiHealthCheckConnect = () => AppVersion
```
