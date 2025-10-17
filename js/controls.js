

// Get references to the slider and value display elements
let noiseSlider = document.getElementById('noise-slider');
let noiseValue = document.getElementById('noise-value');


let gammaSlider = document.getElementById('gamma-slider');
let gammaValue = document.getElementById('gamma-value');

let kSlider = document.getElementById('k-slider');
let kValue = document.getElementById('k-value');
kSlider.value = k;
kValue.innerHTML = k;


let fextSlider = document.getElementById('fext-slider');
let fextValue = document.getElementById('fext-value');

let dtSlider = document.getElementById('dt-slider');
let dtValue = document.getElementById('dt-value');

let NSlider = document.getElementById('N-slider');
let NValue = document.getElementById('N-value');
NValue.innerHTML = N;
NSlider.value = Math.round(Math.pow(10, N));

let ioutSlider = document.getElementById('iout-slider');
let ioutValue = document.getElementById('iout-value');

let ioutTRslider = document.getElementById('ioutTR-slider');
let ioutTRValue = document.getElementById('ioutTR-value');




// Add an event listener to update the parameter and display the value
noiseSlider.addEventListener('input', () => {
    const noiseval = Math.ceil(1000 * Math.pow(10, noiseSlider.value)) / 1000;
    temperature = noiseval;
    noiseValue.textContent = noiseval;
});


gammaSlider.addEventListener('input', () => {
    const gammaval = Math.ceil(1000 * Math.pow(10, gammaSlider.value)) / 1000;
    gamma0 = gammaval;
    gammaValue.textContent = gammaval;
});


kSlider.addEventListener('input', () => {
    const kval = kSlider.value;
    k = kval;
    kValue.textContent = kval;
});



fextSlider.addEventListener('input', () => {
    const fextval = fextSlider.value;
    fext = fextval;
    fextValue.textContent = fextval;
});

dtSlider.addEventListener('input', () => {
    const dtval = Math.ceil(100000 * Math.pow(10, dtSlider.value)) / 100000;
    dt = dtval;
    dtValue.textContent = dtval;
});





NSlider.addEventListener('input', () => {
    const Nval = Math.round(Math.pow(10, NSlider.value));
    Nold = N;
    N = Nval;
    NValue.textContent = Nval;
    if (N == Nold) { } else { initializeParticles() };
});





ioutSlider.addEventListener('input', () => {
    const ioutval = Math.round(Math.pow(10, ioutSlider.value));
    iout = ioutval;
    ioutValue.textContent = ioutval;
});


ioutTRslider.addEventListener('input', () => {
    const ioutTRval = Math.round(Math.pow(10, ioutTRslider.value));
    ioutTR = ioutTRval;
    ioutTRValue.textContent = ioutTRval;
});

method1.addEventListener('change', () => {
    if (method1.checked) {
        method = "1";
    }
});

method2.addEventListener('change', () => {
    if (method2.checked) {
        method = "2";
    }
});

method3.addEventListener('change', () => {
    if (method3.checked) {
        method = "3";
    }
});

method4.addEventListener('change', () => {
    if (method4.checked) {
        method = "4";
    }
});

method5.addEventListener('change', () => {
    if (method5.checked) {
        method = "5";
    }
});

method6.addEventListener('change', () => {
    if (method6.checked) {
        method = "6";
    }
});

///%%%  FRICTION

friction1.addEventListener('change', () => {
    if (friction1.checked) {
        friction = "1";
    }
});

friction2.addEventListener('change', () => {
    if (friction2.checked) {
        friction = "2";
    }
});

friction3.addEventListener('change', () => {
    if (friction3.checked) {
        friction = "3";
    }
});

friction4.addEventListener('change', () => {
    if (friction4.checked) {
        friction = "4";
    }
});

friction5.addEventListener('change', () => {
    if (friction5.checked) {
        friction = "5";
    }
});


// for restart button
function clearCacheAndRefresh() {
    if (window.performance && window.performance.clearCache) {
        window.performance.clearCache();
    } else {
        console.log("Cache clearing not supported");
    }

    window.location.reload(true);
}