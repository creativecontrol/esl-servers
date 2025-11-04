import asyncio
from tkinter import *
from tkinter import ttk
import websockets

PORT = 3333
_websocket = None
clients = set()

async def handler(websocket):
    clients.add(websocket)
    try:
        print(f"connections {len(clients)}")
        _websocket = websocket
        async for message in websocket:
            for client in clients:
                if client != websocket:
                    await client.send(message)
    finally:
        clients.remove(websocket)

async def main():
    print(f"serving websockets on port {PORT}")
    async with websockets.serve(handler, "0.0.0.0",3333):
        await asyncio.Future()

async def send_msg(msg):
    print(f"sending message {msg} to {_websocket}")
    await _websocket.send(msg)

async def play():
    await send_msg("play")

async def pause():
    await send_msg("pause")

def ui():
    root = Tk()
    frm = ttk.Frame(root, padding=10)
    frm.grid()
    # Tk.ttk.Label(frm, text="Time").grid(column=0, row=0)
    ttk.Button(frm, text="Play", command=play).grid(column=0, row=0)
    ttk.Button(frm, text="Pause", command=pause).grid(column=0, row=1)
    root.mainloop()

if __name__ == "__main__":
    asyncio.run(main())
