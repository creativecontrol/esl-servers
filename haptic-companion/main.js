const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const myip = require('quick-local-ip');
const WebSocket = require("ws");

const port = 3333;
const wss = new WebSocket.Server({port:port});
var window = null;

var announcement = 'WebSocket Server on: ' + myip.getLocalIP4() + ':' + port.toString();
console.log(announcement);

const create_window = () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
    })

    win.loadFile('index.html');
    window = win;
    
}

app.whenReady().then(() => {
    

    wss.on("connection", (ws, req)=> {
        console.log(`new client connection ${wss.clients.size}`)

        console.log('updating web UI with client count.');
        window.webContents.send('update-counter', wss.clients.size)
        ws.on('message', (msg) => {
            sendToOthers(msg);
        });
    })

    
    function sendToOthers(data) {
        let dataJson = JSON.parse(data);
        // console.log(`freq: ${data["frequency"]}, amp: ${data["amplitude"]}`);
        wss.clients.forEach((client) => {
            let sendData = JSON.stringify(dataJson);
            console.log(`sending ws: ${sendData}`);
            client.send(sendData);
        });

    }

    create_window();

    window.webContents.once('did-finish-load', () => {
        console.log('updating webUI announce');
        window.webContents.send('update-announce', announcement);
    });

    

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});