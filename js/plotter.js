
function changePositionHistLayout(maxValue) {
  let layoutPositionHist = {
    showlegend: false,
    height: 250,
    width: 250,
    xaxis: {
      range: [0, L],
      title: '<b>Position</b>',
      showgrid: false,
      dtick: 0.25,
      zeroline: false,
      showline: false,
      linewidth: 0
    },
    yaxis: {
      range: [0.02, Math.max(1.2 * maxValue, 3)],
      showgrid: false,
      dtick: 1,

    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    }
  };
  return layoutPositionHist;
}



function changeVelocityHistLayout(maxValue) {
  let layoutVelocityHist = {
    showlegend: false,
    height: 250,
    width: 250,
    yaxis: {
      range: [-4, 4],
      title: '<b>Velocity</b>',
      zeroline: false,
      showgrid: false,

      showline: false,
    },
    xaxis: {
      range: [0.04, Math.max(1.2 * maxValue, 6)],
      dtick: 1,
      showgrid: false,


    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    annotations: [
      {
        x: 0.1, // x-coordinate relative to the x-axis data
        y: 0.5, // y-coordinate relative to the y-axis data
        xref: 'paper',
        yref: 'paper',
        text: vlab,
        showarrow: false,
        font: {
          size: 20, // Increase font size
          color: 'rgba(220,10,100, 0.75)'
        },
      }
    ]

  };
  return layoutVelocityHist;
}


//     
//############################
//  UPDATE HIST

function updatePositionHistogram() {


  // initialize Histogram

  const positionBins = d3.histogram()
    .domain([0, L])
    .thresholds(binNumber)
    (X);
  X = [];


  const positionHistogram = positionBins.map(bin => ({
    x0: bin.x0,
    x1: bin.x1,
    histValue: bin.length,
    probability: Math.exp(- 1 / temperature * potential((bin.x0 + bin.x1) / 2)),
    friction: myGamma((bin.x0 + bin.x1) / 2, 2),
  }));




  let histBins = positionHistogram.map(bin => (bin.x0 + bin.x1) / 2)
  let histValues = positionHistogram.map(bin => bin.histValue)



  const histNorm = histValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * binWidth;

  for (let j = 0; j < binNumber; j++) {
    histValues[j] = histValues[j] / histNorm;
  }





  let probabilityValues = positionHistogram.map(bin => bin.probability)
  const probabilityNorm = probabilityValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * binWidth;

  for (let j = 0; j < binNumber; j++) {
    probabilityValues[j] = probabilityValues[j] / probabilityNorm;
  }



  let frictionValues = positionHistogram.map(bin => bin.friction)

  for (let j = 0; j < binNumber; j++) {
    frictionValues[j] = 0.1 + frictionValues[j] * 0.2;
  }

  let maxValue = findMax(probabilityValues);
  layout = changePositionHistLayout(1.1 * maxValue);

  //d

  const simulation = {
    x: histBins,
    y: histValues,
    type: 'line',
    marker: {
      color: 'rgba(220,10,100, 0.75)',
      line: {
        color: 'rgba(58,0,0, 1.0)',
        width: 0.1
      }
    },
    name: 'simulation',
  };

  const probability = {
    x: histBins,
    y: probabilityValues,
    type: 'line',
    marker: {
      color: 'rgba(0,0,1, 1)',

    },
    name: 'theory',
  };

  const frictionProfile = {
    x: histBins,
    y: frictionValues,
    type: 'line',
    marker: {
      color: 'rgba(10,150,10, 0.75)',
      line: {
        color: 'rgba(58,0,0, 1.0)',
        width: 0.1
      }
    },
    name: 'friction',
  };

  Plotly.newPlot('xhist', [probability, frictionProfile, simulation], layout, { staticPlot: true });
  // !!! newPlot is actually very slow, restyle should be preferred update function

}



//############################
//  UPDATE HIST

function updateVelocityHistogram() {


  // initialize Histogram

  const velocityBins = d3.histogram()
    .domain([-5, 5])
    .thresholds(1.2 * binNumber)
    (V);
  V = [];

  const velocityHistogram = velocityBins.map(bin => ({
    x0: bin.x0,
    x1: bin.x1,
    histValue: bin.length,
    probability: Math.exp(- 1 / temperature / 2 * Math.pow((bin.x0 + bin.x1) / 2, 2)),
    friction: myGamma(L / 2, (bin.x0 + bin.x1) / 2),
  }));




  let histBins = velocityHistogram.map(bin => (bin.x0 + bin.x1) / 2)
  let histValues = velocityHistogram.map(bin => bin.histValue)



  const histNorm = histValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * binWidth;

  for (let j = 0; j < binNumber; j++) {
    histValues[j] = histValues[j] / histNorm;
  }





  let probabilityValues = velocityHistogram.map(bin => bin.probability)
  const probabilityNorm = probabilityValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0) * binWidth;

  for (let j = 0; j < binNumber; j++) {
    probabilityValues[j] = probabilityValues[j] / probabilityNorm;
  }



  let frictionValues = velocityHistogram.map(bin => bin.friction)

  for (let j = 0; j < binNumber; j++) {
    frictionValues[j] = 0.3 + frictionValues[j] * 0.3;
  }


  let maxValue = findMax(probabilityValues);
  layout = changeVelocityHistLayout(maxValue);



  const simulation = {
    x: histValues,
    y: histBins,
    type: 'line',
    marker: {
      color: 'rgba(220,10,100, 0.75)',
      line: {
        color: 'rgba(58,0,0, 1.0)',
        width: 0.1
      }
    },
    name: 'simulation',
  };
  const probability = {
    x: probabilityValues,
    y: histBins,
    type: 'line',
    marker: {
      color: 'rgba(0,0,1, 1)',

    },
    name: 'theory',
  };

  const frictionProfile = {
    x: frictionValues,
    y: histBins,
    type: 'line',
    marker: {
      color: 'rgba(10,150,10, 0.75)',
      line: {
        color: 'rgba(58,0,0, 1.0)',
        width: 0.1
      }
    },
    name: 'friction',
  };


  if (method < 4) {
    Plotly.newPlot('vhist', [probability, frictionProfile], layout, { staticPlot: true });
  } else {
    Plotly.newPlot('vhist', [probability, frictionProfile, simulation], layout, { staticPlot: true });
  }
  // !!! newPlot is actually very slow, restyle should be preferred update function

}


// PHASE SPACE  

function phaseSpace() {
  x.splice(1024);
  v.splice(1024);


  Plotly.newPlot('scatter',
    [{
      x: x,
      y: v,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 6,
        color: 'rgba(220,10,100, 1)',
        opacity: Math.max(0.8 - N / 500, 0.1)
      },
    }], {
    xaxis: {
      range: [0, L],
      showgrid: true,
      dtick: 0.125,
      showticklabels: false,
      zeroline: false,
      showline: false,
      linecolor: 'black',
      linewidth: 2
    },
    yaxis: {
      //     title: 'Velocity',
      range: [-4, 4],
      showgrid: true,
      dtick: 1,
      showticklabels: false,
      zeroline: false,
      showline: false,
      linecolor: 'black',
      linewidth: 2
    },
    height: 246,
    width: 246,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    }
  }, { staticPlot: true });

}
