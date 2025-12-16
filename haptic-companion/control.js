window.onload = () => {
    console.log("script loaded");
    hostname = 'localhost';
    const socket = new WebSocket(`ws://${hostname}:3333`);
    window.socket = socket;
    var log = document.querySelector("#log");
    var clients = document.querySelector("#clients");
    var announce = document.querySelector("#announce");

    window.electronAPI.onUpdateCounter((value) => {
        console.log('recieved counter update');
        clients.innerHTML = value.toString();
    })

    window.electronAPI.onAnnounce((value) => {
        console.log('recieved announcement update');
        announce.innerHTML = value;
    });


    send_play = () => {
        socket.send("play");
        console.log("play");
        log.innerHTML ="sent play<br/>" + log.innerHTML;
    }

    send_pause = () => {
        socket.send("pause");
        console.log("pause");
        log.innerHTML = "sent pause<br/>"+ log.innerHTML
    }

    send_time = () => {
        time = document.querySelector("#time");
        data = {
            "time": time.value,
        }
        socket.send(JSON.stringify(data))
        console.log(`time ${time.value}`);

        log.innerHTML = `sent {time: ${time.value}}<br/>`+ log.innerHTML;
    }   

    clear_log = () => {
        log.innerHTML = '&nbsp;';
    }

    send_json = () => {
        json = document.querySelector("#json_entry").value;
        try {
            data = JSON.parse(json);
            msg = JSON.stringify(data);
            socket.send(msg)
            log.innerHTML = `sent json ${json}`+ log.innerHTML;
        } catch {
            log.innerHTML = `check your JSON format. <br/>Your param keys should be surrounded in double-quotes \"\"`+ log.innerHTML;
        }
    }

    clear_log()

    

    socket.onmessage = (event) => {
        console.log(event);
        try {
            data = JSON.parse(event.data);
            if (data.hasOwnProperty("frequency")) {
                log_msg = `json message received ${event.data}<br/>`
                console.log(log_msg);
                log.innerHTML=log_msg + log.innerHTML;
            }
            else if (data.hasOwnProperty("time")) {
                log_msg = `time received ${data["time"]}<br/>`
                console.log(log_msg);
                log.innerHTML=log_msg + log.innerHTML;
            } else {
                log_msg = `invalid message<br/>`
                console.log(log_msg);
                log.innerHTML=log_msg + log.innerHTML;

            }
        }catch {
            if(event.data === "play"){
                log_msg = "Play message received<br/>";
                console.log(log_msg);
                log.innerHTML=log_msg + log.innerHTML;
            } else if (event.data === "pause") {
                log_msg = "Pause message received<br/>";
                console.log(log_msg);
                log.innerHTML=log_msg + log.innerHTML;
            } 
        }

    }
}
