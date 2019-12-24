props = {
    "canvasId" : "drawCanvas",
    "clearColor" : "#777777",

    "strokeColor" : "#00FF00",

    MAXX            : 100,
    MINX            : 0,
    MAXY            : 30000,
    MINY            : -30000,
    MAX_DATA_POINTS : 2000
}

const SPEED = 100; // point per frame at 60 FPS rate

init(props);

openFile("../files/2019_11_26_15_15_18.wav");

