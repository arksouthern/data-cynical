# Data Cynical
| App | Features |
| --- | -------- |
| ![image](https://i.imgur.com/wIP817g.jpeg) | &bull; Supporting SQLite, PostgreSQL, MySQL, SQL Server. <br><br> &bull; Rich: Graphing, CSV, automatic column prefixing. <br><br> &bull; Define SQL macros, aliases, functions. <br><br> &bull; The first CTE-oriented SQL editor. |
| | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
  

<div align=center>
  <hr /><br />
  <h3>Data Cynical</h3>
  <img height=256 src="https://i.imgur.com/6MKsCMJ.jpeg" />
</div>  
  
## Get Started
### Option 1. Git Clone &amp; Run
1. Clone the repo.
2. Make sure Node JS is installed.
3. Open a command prompt to the folder, then run:
```sh
npm install
```
4. Click [Data Cynical](http://arksouthern.com/app/data-cynical)
5. In the app, click "Launch"
### Option 2. Download This Repo
1. Download &amp; extract the repo.
2. Make sure Node JS is installed.
3. Open a command prompt to the folder, then run:
```sh
npm install
```
4. Click [Data Cynical](http://arksouthern.com/app/data-cynical)
5. In the app, click "Launch"
### Option 3. Download Executable (2023 Instructions)
1. Visit releases at `https://github.com/arksouthern/data-cynical/releases/latest`.
2. See if your platform is supported.
3. Download, then run the application.
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
