A fairly simple http and websocket server for messge testing along with a web UI for testing.

# Installation
The following servers were developed with the following dependencies

* Python 3.12.4 or >= 3.9
* python websockets
* python venv

With Python and venv installed:
* clone the repo
* `cd esl-servers`
* `python -m venv env` (depending on your OS and how Python was installed you may need to use `python3 -m venv env`)
* `source ws_env/bin/activate`
* `pip install requirements.txt`
* read on for how to start the servers


# Websocket Server
Run the websocket server using an active virtual env

```
source env/bin/activate
python ws-server.py
```

It will run on port `3333` by default. All messages will be sent to all connected clients except the originating client. You can send any messages you like, the server does no filtering. It is up to your endpoint clients to generate and parse the messages.

# HTTP Server
Run the HTTP server in a new terminal using an active virtual env

```
source env/bin/activate
python http-server.py
```

The server will run on port `8080` by default. To use the testing Web UI open http://localhost:8080/ in a browser window. The server should also support opening the page on other devices attached to your local network using http://<your computer's IP>:8080/. You can open the testing page in separate tabs to confirm the messages arriving at the other connected clients via 

The test web UI provides 4 message types for testing.

1. `Play` button will send the string `'play'`
2. `Pause` button will send the string `'pause'`
3. `Send time` will send the string entered into the input field with the key "time" `{"time": "some string"}`
4. `Send JSON` will send whatever arbitrary JSON you enter into the input field. JSON key names must be enclosed in "double-quotes" (i.e`{"key": value}`)

All messages will be logged to the Browser Developer log and the on-screen log below the buttons.
* `Clear log` will empty the on-screen log
