let stepCount = 0;
let particles = []; 
let X = []; //position array for histograms
let V = []; //velocities array for histograms


let dt = 0.001; // time increment
let L = 1.0; // system size
let k = 5; // initial spring constant for harmonic potential
let binNumber = 100; // number of Bin for histogram
let mem_width = 0.5; // domain-width for friction profile
let method = 1; // initial method
let friction = 1; //inital friction value for constant-friction method

const ddd = 0.0001; // increment for numerical derivative

let temperature = 1; // initial temperature
let gamma0 = 1.0; // initial friction for constant-friction method

let binWidth = L / binNumber; // bin width for historgam

let N = 1000; //initial particle number
let Nold = N; // save particle number, will be needed on particle number change

let fext = 0.000; //external biasing force
let ymax = 1.0; //maximum plotting y-value for histograms


let iout = 1; // initial update phase space timesteps
let ioutTR = 1; // intital update and average historgam timesteps
let ipick = 0; // pick this particle and copy to freshly created particles when particle number changes

let vlab = ''; // extra label text for velocity histogram 


