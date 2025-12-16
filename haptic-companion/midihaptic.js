// Max 4 Live node.script
const Max = require('max-api');
const Websocket = require('ws');

const socket = new Websocket("ws://localhost:3333");

Max.post("MIDI Haptics loaded");
socket.addEventListener("open", (event) => {
	Max.post("websocket connection opened");
} )

socket.addEventListener("")

const freq_min = 0.0;
const freq_max = 20000.0;
const amp_min = 0.0;
const amp_max = 1.0;

var min_freq = 0.0;

Max.addHandler("min_freq", (val)=>{
	if((val>=freq_min) && (val<=freq_max)){
		min_freq = val;
	} else {
		Max.post(`ERROR: min_freq should be between ${freq_min} and ${freq_max}`);
	}
});
var max_freq = 10000.0;
Max.addHandler("max_freq", (val)=>{

	if((val>=freq_min) && (val <= freq_max)){
		max_freq = val;
	} else {
		Max.post(`ERROR: max_freq should be between ${freq_min} and ${freq_max}`);
	}
});

var min_amp = 0.0;
Max.addHandler("min_amp", (val)=>{
	if((val>=amp_min) && (val <= amp_max)){
		min_amp = val;
	} else {
		Max.post(`ERROR: min_amp should be between ${amp_min} and ${amp_max}`);
	}
});
var max_amp = 1.0;
Max.addHandler("max_amp", (val)=>{
	if((val>=amp_min) && (val <= amp_max)){
		max_amp = val;
	} else {
		Max.post(`ERROR: max_amp should be between ${amp_min} and ${amp_max}`);
	}
});

var min_midi = 0;
var max_midi = 127;

function scale(value, minIn, maxIn, minOut, maxOut) {
	return ((value - minIn)/(maxIn-minIn) * (maxOut-minOut)+ minOut);
	}

function mtof(_freq){
	let conversion = scale(_freq, min_midi, max_midi, min_freq, max_freq);
	return conversion;
	}
function mtoa(_amp){
	let conversion = scale(_amp, min_midi, max_midi, min_amp, max_amp);
	return conversion
	}

Max.addHandler(Max.MESSAGE_TYPES.LIST, async (...args) => {
	Max.post("received list " + args.join(", ") + "\n");
	Max.post(`freq: ${args[1]} amp ${args[2]}`)
	let freq = args[1];
	let amp = args[2];
	let tyme = 0;
	let data = {
		"frequency": mtof(freq),
		"amplitude": mtoa(amp),
		"time": tyme // or can I get this from the midi message to make a complete pattern?
		}
	let out = JSON.stringify(data);
	socket.send(out);
	Max.post(`sending ${out}`);

});