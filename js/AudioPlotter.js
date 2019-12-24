const XINDX = 0;
const YINDX = 1;

const P0 = "p0";
const P1 = "p1";

const MAXX = "MAXX";
const MINX = "MINX";
const MAXY = "MAXY";
const MINY = "MINY";

const MAX_DATA_POINTS = "MAX_DATA_POINTS";

var ctx;
var content_width;
var content_height; 

var _props;

var lastX = 0;
var lastY = 0;

var consumedX = 0;

var dataPointsMax = 0;

var dataPoints = [];

var audioData;

var start = 0;
var end   = 1000;

function init(props){
    _props = props;

    var canvas = document.getElementById(_props["canvasId"]);
    ctx = canvas.getContext("2d");

    ctx.fillStyle = _props["clearColor"];

    content_width  = canvas.width; 
    content_height = canvas.height;
}

function clear(){
    
    ctx.fillRect(   0,
                    0,
                    content_width,
                    content_height);
}

function _map(_in, in_min, in_max, out_min, out_max){
    return (_in - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function plot(amp, diff){

    var data0 = {
        "p0" : [lastX, lastY],
        "p1" : [lastX + diff, amp]
    }
    
    lastX += diff;  
    lastY = amp;
    
    _drawLine(data0);            
}

function startPlot(data){            

  clear();

  data.forEach(function(amp){
      plot(amp, 0.1);
  });    

  start += SPEED;
  end   += SPEED;        
}

function openFile(filePath) {
  fetch(filePath)
  .then(response => response.arrayBuffer())  
  .then(buffer => {
      var _filterData = filterData(new Int16Array(buffer));        
      
      audioData = _filterData;
      startPlot(getRequiredArray(audioData, start, end));

      let myFunc = () => {            
          if(start > audioData.length){
              return;
          }

          startPlot(getRequiredArray(audioData, start, end));
      }

      setInterval(myFunc, 200);
  });
};

function _drawLine(data){
    ctx.strokeStyle = _props["strokeColor"];
    ctx.beginPath();

    var x0 = _map(  data[P0][XINDX], /** input x0 co-ord */
                    _props[MINX],
                    _props[MAXX],
                    0,
                    content_width);

    var y0 = _map(  data[P0][YINDX], /** input y0 co-ord */        
                    _props[MINY],
                    _props[MAXY],
                    content_height,
                    0);                   

    var x1 = _map(  data[P1][XINDX], /** input x1 co-ord */
                    _props[MINX],
                    _props[MAXX],
                    0,
                    content_width);

    var y1 = _map(  data[P1][YINDX], /** input y1 co-ord */                    
                    _props[MINY],
                    _props[MAXY],
                    content_height,
                    0);                    
    
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);

    ctx.stroke();
      
    if(x1 > content_width){
      lastX = 0;
    }
}

function filterData(data){

    const STEP = 80;

    const filteredData = [];    

    for(var i = 0; i < data.length; i += STEP){      
        getMinMax(getRequiredArray(data ,i, i + STEP)).forEach(ele => {
            filteredData.push(ele);
        })
    }

    return filteredData;
  }

function getRequiredArray(data, start, end){
    ret = [];
    var size = end - start;

    for(var i = start; i <= end; i++){
        ret.push(data[i]);
    }

    return ret;
}

function byteToShort(dataIn){
    ret = [];

      for(var i = 0, j = 0; i < dataIn.length; i+=2, j++){
          ret.push(byteToInt(dataIn[i], dataIn[i + 1]));
      }

    return ret;
}

function byteToInt(one, two){
  var low  = one & 0xff;
  var high = two & 0xff;

  return ( high << 8 | low );
}

function getMinMax(amps){
  var MAX = -10000;
  var MIN =  0;

  var ret = [];

  amps.forEach(amp => {
    
      if(amp > MAX){
        MAX = amp;
      } 

      if(amp < MIN){
        MIN = amp;
      }

  });

  ret.push(MIN);
  ret.push(MAX);

  return ret;
}
