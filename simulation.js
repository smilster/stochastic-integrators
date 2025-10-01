
function findMax(arr) {
  if (arr.length === 0) {
    return undefined; // Handle empty array case
  }

  let ymax = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > ymax) {
      ymax = arr[i];
    }
  }

  return ymax;
}




function generateGaussianRandom() {
  let u1 = Math.random();
  let u2 = Math.random();
  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0;
}

function initializeParticles() {
  X = [];
  if (N < Nold) {
    particles.splice(N)
  } else if (N > Nold) {

    for (let i = Nold; i < N; i++) {
      ipick = Math.floor(Nold * Math.random());
      particles.push({
        position: particles[ipick].position,//L/2+0.1*L*generateGaussianRandom(), // Initial position between 0 and 10
        velocity: particles[ipick].velocity,
      });
    }
  } else {
    particles = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        position: L * Math.random(),//L/2+0.1*L*generateGaussianRandom(), // Initial position between 0 and 10
        velocity: Math.sqrt(2 * dt) * generateGaussianRandom(),
      });
    }
  }
  //setTimeout(simulate, 0);
}

function myGamma(xx, vv) {
  if (friction == 1) {
    return gamma0;
  };
  if (friction == 2) {
    return 1 + 5 * Math.exp(-Math.pow(2 * (xx - L / 2) / mem_width, 6));
  }

  if (friction == 3) {
    return 1 + 10 * Math.abs(xx);
  }

  if (friction == 4) {
    return 1 + 20 * Math.pow(0.25 * vv, 2);

  }

  if (friction == 5) {
    return 1 + (19 * Math.pow(0.25 * vv, 2) + 1) * Math.exp(-Math.pow(2 * (xx - L / 2) / mem_width, 6));

  }

}

function potential(xx) {
  xx
  const U = k * Math.pow((xx - L / 2), 2) - fext * xx + 1 * Math.pow((xx - L / 2), 8);// (xx-2*L/3) * (xx-2*L/3) * (xx-1*L/3) * (xx-1*L/3) * (xx-L/2) * (xx-L/2);
  return U;
}




function force(xx) {
  const F = - (potential(xx + ddd) - potential(xx - ddd)) / 2 / ddd; //0*Math.sin(50*2*3.1415*dt*stepCount)
  return F;
}




//######### M E T H O D 1

function BrownEuler() {



  for (let i = 0; i < N; i++) {


    noise0 = Math.sqrt(2 * temperature * dt) * generateGaussianRandom();

    gamma_predict = myGamma(particles[i].position, 0)
    noise_predict = Math.sqrt(1 / gamma_predict) * noise0;
    F_predict = 1 / gamma_predict * (force(particles[i].position));
    //F_predict=-2 * k * D_predict * (particles[i].position-L/2);

    particles[i].position = particles[i].position + dt * F_predict + noise_predict;
    particles[i].velocity = F_predict / 20 + noise0 / Math.sqrt(2 * dt);






  }
}


//######### M E T H O D 2

function BrownHeun() {


  for (let i = 0; i < N; i++) {


    noise0 = Math.sqrt(2 * temperature * dt) * generateGaussianRandom();

    gamma_predict = myGamma(particles[i].position, 0)//particles[i].velocity)
    noise_predict = Math.sqrt(1 / gamma_predict) * noise0;
    F_predict = 1 / gamma_predict * (force(particles[i].position));
    x_predict = particles[i].position + dt * F_predict + noise_predict;
    v_predict = F_predict / 20 + noise0 / Math.sqrt(2 * dt)

    gamma_correct = myGamma(x_predict, 0);
    F_correct = 1 / gamma_correct * (force(x_predict));
    noise_correct = Math.sqrt(1 / gamma_correct) * noise0;

    x_correct = particles[i].position + dt * F_correct + noise_correct;// 
    v_correct = F_correct / 20 + noise0 / Math.sqrt(2 * dt);

    particles[i].position = 0.5 * (x_predict + x_correct);
    particles[i].velocity = 0.5 * (v_predict + v_correct);






  }
}


//######### M E T H O D 3

function BrownOettinger() {



  for (let i = 0; i < N; i++) {


    noise0 = Math.sqrt(2 * temperature * dt) * generateGaussianRandom();

    gamma_predict = myGamma(particles[i].position, 0)
    noise_predict = Math.sqrt(1 / gamma_predict) * noise0;
    F_predict = 1 / gamma_predict * (force(particles[i].position));
    x_predict = particles[i].position + dt * F_predict + noise_predict;
    v_predict = F_predict / 20 + noise0 / Math.sqrt(2 * dt)//noise0 / Math.sqrt( 2 * dt);//F_predict  / gamma_predict  * Math.sqrt(dt)  + noise_predict / Math.sqrt(2 * dt) ;

    gamma_correct = myGamma(x_predict, 0);
    F_correct = 1 / gamma_correct * (force(x_predict));

    noise_correct = gamma_correct / gamma_predict * Math.sqrt(1 / gamma_predict) * noise0;

    v_correct = F_correct / 20 + noise0 / Math.sqrt(2 * dt);


    particles[i].position = particles[i].position + 0.5 * (F_predict + F_correct) * dt + 0.5 * (gamma_predict / gamma_correct + 1) * noise_predict;
    particles[i].velocity = 0.5 * (v_predict + v_correct);




  }
}



//######### M E T H O D 4


function LangevinEuler() {



  for (let i = 0; i < N; i++) {


    noise0 = Math.sqrt(2 * temperature * dt) * generateGaussianRandom();

    gamma_predict = myGamma(particles[i].position, particles[i].velocity)
    noise_predict = Math.sqrt(gamma_predict) * noise0;
    F_predict = - particles[i].velocity * gamma_predict + (force(particles[i].position));

    particles[i].position = particles[i].position + particles[i].velocity * dt;
    particles[i].velocity = particles[i].velocity + dt * F_predict + noise_predict;




  }
}

//######### M E T H O D 5


function LangevinHeun() {



  for (let i = 0; i < N; i++) {


    noise0 = Math.sqrt(2 * temperature * dt) * generateGaussianRandom();

    gamma_predict = myGamma(particles[i].position, particles[i].velocity)
    noise_predict = Math.sqrt(gamma_predict) * noise0;
    F_predict = - particles[i].velocity * gamma_predict + (force(particles[i].position));
    //F_predict=-2 * k * D_predict * (particles[i].position-L/2);

    x_predict = particles[i].position + particles[i].velocity * dt;
    v_predict = particles[i].velocity + dt * F_predict + noise_predict;


    gamma_correct = myGamma(x_predict, v_predict)
    noise_correct = Math.sqrt(gamma_correct) * noise0;
    F_correct = - v_predict * gamma_correct + (force(x_predict));

    x_correct = particles[i].position + v_predict * dt;
    v_correct = particles[i].velocity + dt * F_correct + noise_correct;

    particles[i].position = 0.5 * (x_predict + x_correct);
    particles[i].velocity = 0.5 * (v_predict + v_correct);



  }
}

//######### M E T H O D 5

function LangevinOettinger() {



  for (let i = 0; i < N; i++) {


    noise0 = Math.sqrt(2 * temperature * dt) * generateGaussianRandom();


    gamma_predict = myGamma(particles[i].position, particles[i].velocity)
    noise_predict = Math.sqrt(gamma_predict) * noise0;
    F_predict = - particles[i].velocity * gamma_predict + (force(particles[i].position));

    x_predict = particles[i].position + particles[i].velocity * dt;
    v_predict = particles[i].velocity + dt * F_predict + noise_predict;



    gamma_correct = myGamma(x_predict, v_predict);
    F_correct = - v_predict * gamma_correct + (force(x_predict));

    particles[i].position = particles[i].position + 0.5 * (particles[i].velocity + v_predict) * dt;
    particles[i].velocity = particles[i].velocity + 0.5 * (F_predict + F_correct) * dt + 0.5 * (gamma_correct / gamma_predict + 1) * noise_predict;



  }
}




function simulate() {

  setTimeout(() => {
    if (method == 1) {
      BrownEuler();
    };

    if (method == 2) {
      BrownHeun();
    };

    if (method == 3) {
      BrownOettinger();
    };

    if (method == 4) {
      LangevinEuler();
    };

    if (method == 5) {
      LangevinHeun();
    };

    if (method == 6) {
      LangevinOettinger();
    };

    if (method < 4) { vlab = '<b>not resolved</b>' } else { vlab = ' ' };


    v = particles.map(particle => particle.velocity);
    x = particles.map(particle => particle.position);



    X = X.concat(x);
    V = V.concat(v);
    if (stepCount % ioutTR === 0) {
      phaseSpace();

    }

    if (stepCount % iout === 0) {

      updatePositionHistogram();
      updateVelocityHistogram();

      X = [];
      V = [];

    }
    stepCount++;
  }, 0);

  requestAnimationFrame(simulate)

}


