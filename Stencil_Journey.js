// Main script for the portal selection hub preview
var gl;
var points = [];
var colors = [];

var rotationX = 0;
var rotationY = 0;
var zoom = 1.0;

var isDragging = false;
var previousMouseX = 0;
var previousMouseY = 0;

var modelViewMatrixLoc;
var projectionMatrixLoc;

var canvas;
var geometryRanges = null;


function addQuad(v0, v1, v2, v3, color) {
    points.push(v0); colors.push(color);
    points.push(v1); colors.push(color);
    points.push(v2); colors.push(color);
    points.push(v0); colors.push(color);
    points.push(v2); colors.push(color);
    points.push(v3); colors.push(color);
}

/**
 * Register geometry by running the generator and recording the range
 * defined by the current length of the shared points/colors arrays.
 */
function registerGeometry(container, key, generator) {
    if (!container) {
        console.warn("registerGeometry called without container for key:", key);
        return { start: points.length, count: 0 };
    }
    var start = points.length;
    if (typeof generator === "function") {
        generator();
    } else {
        console.warn("Missing geometry generator for key:", key);
    }
    var range = { start: start, count: points.length - start };
    container[key] = range;
    return range;
}

function buildCubeGeometry() {
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0)
    ];
    var darkGray = vec4(0.3, 0.3, 0.3, 1.0);
    addQuad(vertices[1], vertices[2], vertices[6], vertices[5], darkGray);
    addQuad(vertices[4], vertices[7], vertices[3], vertices[0], darkGray);
}

/** Build the four portal frame faces that form the hub cube */
function buildPortalGeometry() {
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0)
    ];
    var portalColors = [
        vec4(0.95, 0.85, 0.65, 1.0),
        vec4(0.45, 0.40, 0.35, 1.0),
        vec4(0.78, 0.64, 0.28, 1.0),
        vec4(0.97, 0.97, 0.97, 1.0)
    ];
    addQuad(vertices[0], vertices[3], vertices[2], vertices[1], portalColors[0]);
    addQuad(vertices[3], vertices[7], vertices[6], vertices[2], portalColors[1]);
    addQuad(vertices[7], vertices[4], vertices[5], vertices[6], portalColors[2]);
    addQuad(vertices[4], vertices[0], vertices[1], vertices[5], portalColors[3]);
}

/** Build the internal floor quad that sits behind each portal */
function buildInnerFloorGeometry() {
    var darkGray = vec4(0.3, 0.3, 0.3, 1.0);
    addQuad(
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        darkGray
    );
}

/** Register the stencil cube shell, portal frames, and interior floor */
function createStencilCube(range) {
    registerGeometry(range, "shell", buildCubeGeometry);
    registerGeometry(range, "portals", buildPortalGeometry);
    registerGeometry(range, "floor", buildInnerFloorGeometry);
}

/** Register desert portal assets from Portal_1.js */
function createPortalOneScene(range) {
    registerGeometry(range, "mountain", createMountain);
    registerGeometry(range, "dunes", createDesertDunes);
    registerGeometry(range, "sun", createDesertSun);
    registerGeometry(range, "sandstorm", createDesertSandstorm);
    registerGeometry(range, "cloth", createDesertCloth);
}

/** Register ruins portal assets from Portal_2.js */
function createPortalTwoScene(range) {
    registerGeometry(range, "arch", createRuinsArch);
    registerGeometry(range, "pillars", createRuinsPillars);
    registerGeometry(range, "guardian", createRuinsGuardian);
    // registerGeometry(range, "light", createRuinsLight);
}

/** Register tower portal assets from Portal_3.js */
function createPortalThreeScene(range) {
    registerGeometry(range, "entranceMask", function () { createTowerRoom("left", { mask: true }); });
    registerGeometry(range, "room", function () { createTowerRoom("left"); });
    registerGeometry(range, "entranceMaskRight", function () { createTowerRoom("right", { mask: true }); });
    registerGeometry(range, "roomRight", function () { createTowerRoom("right"); });
    registerGeometry(range, "body", createTower);
    registerGeometry(range, "platforms", createTowerPlatforms);
    registerGeometry(range, "cloths", createTowerCloths);
    registerGeometry(range, "water", createTowerWater);
}

/** Register snow portal assets from Portal_4.js */
function createPortalFourScene(range) {
    registerGeometry(range, "field", createSnowField);
    registerGeometry(range, "cliffs", createSnowCliffs);
    registerGeometry(range, "rocks", createSnowRocks);
    registerGeometry(range, "beam", createPortalLightBeam);
}

/**
 * Build all geometry once and store draw ranges for the hub and portals.
 * Clears existing buffers before regenerating the geometry lists.
 */
function buildSceneGeometry() {
    points.length = 0;
    colors.length = 0;

    geometryRanges = {
        stencilCube: {},
        portals: {
            desert: {},
            ruins: {},
            tower: {},
            snow: {}
        }
    };

    createStencilCube(geometryRanges.stencilCube);
    createPortalOneScene(geometryRanges.portals.desert);
    createPortalTwoScene(geometryRanges.portals.ruins);
    createPortalThreeScene(geometryRanges.portals.tower);
    createPortalFourScene(geometryRanges.portals.snow);
}


/** Render the desert portal preview: dunes, sun, sandstorm, and cloth */
function drawDesertScene() {
    if (!geometryRanges || !geometryRanges.portals) {
        return;
    }
    var desert = geometryRanges.portals.desert;
    if (!desert) {
        return;
    }
    if (desert.mountain.count > 0) {
        gl.drawArrays(gl.TRIANGLES, desert.mountain.start, desert.mountain.count);
    }
    if (desert.dunes.count > 0) {
        gl.drawArrays(gl.TRIANGLES, desert.dunes.start, desert.dunes.count);
    }
    if (desert.sun.count > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, desert.sun.start, desert.sun.count);
        gl.disable(gl.BLEND);
    }
    if (desert.sandstorm.count > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, desert.sandstorm.start, desert.sandstorm.count);
        gl.disable(gl.BLEND);
    }
    if (desert.cloth.count > 0) {
        gl.drawArrays(gl.TRIANGLES, desert.cloth.start, desert.cloth.count);
    }
}

/** Render the ruins portal preview: arch, pillars, and guardian */
function drawRuinsScene() {
    if (!geometryRanges || !geometryRanges.portals) {
        return;
    }
    var ruins = geometryRanges.portals.ruins;
    if (!ruins) {
        return;
    }
    if (ruins.arch.count > 0) {
        gl.drawArrays(gl.TRIANGLES, ruins.arch.start, ruins.arch.count);
    }
    if (ruins.pillars.count > 0) {
        gl.drawArrays(gl.TRIANGLES, ruins.pillars.start, ruins.pillars.count);
    }
    if (ruins.guardian.count > 0) {
        gl.drawArrays(gl.TRIANGLES, ruins.guardian.start, ruins.guardian.count);
    }
    /*
    if (ruins.light.count > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, ruins.light.start, ruins.light.count);
        gl.disable(gl.BLEND);
    }
    */
}

/** Render the tower portal preview with depth-masked interior */
function drawTowerScene() {
    if (!geometryRanges || !geometryRanges.portals) {
        return;
    }
    var tower = geometryRanges.portals.tower;
    if (!tower) {
        return;
    }

    gl.depthRange(0.0, 0.5);
    gl.colorMask(false, false, false, false);
    gl.depthMask(true);
    gl.depthFunc(gl.ALWAYS);
    gl.depthRange(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, tower.entranceMask.start, tower.entranceMask.count);

    gl.depthFunc(gl.LESS);
    gl.colorMask(true, true, true, true);
    gl.depthRange(0.6, 1.0);
    gl.drawArrays(gl.TRIANGLES, tower.room.start, tower.room.count);

    gl.depthRange(0.0, 0.5);
    gl.colorMask(false, false, false, false);
    gl.depthMask(true);
    gl.depthFunc(gl.ALWAYS);
    gl.depthRange(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, tower.entranceMaskRight.start, tower.entranceMaskRight.count);

    gl.depthFunc(gl.LESS);
    gl.colorMask(true, true, true, true);
    gl.depthRange(0.6, 1.0);
    gl.drawArrays(gl.TRIANGLES, tower.roomRight.start, tower.roomRight.count);

    gl.depthRange(0.0, 0.5);
    if (tower.body.count > 0) {
        gl.drawArrays(gl.TRIANGLES, tower.body.start, tower.body.count);
    }
    if (tower.platforms.count > 0) {
        gl.drawArrays(gl.TRIANGLES, tower.platforms.start, tower.platforms.count);
    }
    if (tower.cloths.count > 0) {
        gl.drawArrays(gl.TRIANGLES, tower.cloths.start, tower.cloths.count);
    }

    if (tower.water.count > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        gl.drawArrays(gl.TRIANGLES, tower.water.start, tower.water.count);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
    }

    gl.depthRange(0.0, 1.0);
    gl.depthFunc(gl.LESS);
    gl.colorMask(true, true, true, true);
}

/** Render the snow portal preview: snowfield, cliffs, rocks, beam */
function drawSnowScene() {
    if (!geometryRanges || !geometryRanges.portals) {
        return;
    }
    var snow = geometryRanges.portals.snow;
    if (!snow) {
        return;
    }
    if (snow.field.count > 0) {
        gl.drawArrays(gl.TRIANGLES, snow.field.start, snow.field.count);
    }
    if (snow.cliffs.count > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, snow.cliffs.start, snow.cliffs.count);
        gl.disable(gl.BLEND);
    }
    if (snow.rocks.count > 0) {
        gl.drawArrays(gl.TRIANGLES, snow.rocks.start, snow.rocks.count);
    }
    if (snow.beam && snow.beam.count > 0) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, snow.beam.start, snow.beam.count);
        gl.disable(gl.BLEND);
    }
}

/** Render the hub cube with the orbit-style camera */
function renderHubCamera() {
    var modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, rotate(rotationY, vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(rotationX, vec3(1, 0, 0)));

    var zoomFactor = 1.0 / zoom;
    var projectionMatrix = ortho(-zoomFactor, zoomFactor, -zoomFactor, zoomFactor, -10, 10);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    drawHubScene();
}

/** Draw the hub scene with stencil-masked portal previews */
function drawHubScene() {
    // 지오메트리 범위가 없으면 종료
    if (!geometryRanges || !geometryRanges.stencilCube) {
        return;
    }

    var stencilCube = geometryRanges.stencilCube;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    if (stencilCube.shell && stencilCube.shell.count > 0) {
        gl.drawArrays(gl.TRIANGLES, stencilCube.shell.start, stencilCube.shell.count);
    }

    gl.enable(gl.STENCIL_TEST);
    gl.clear(gl.STENCIL_BUFFER_BIT);

    var portalFrame = stencilCube.portals;
    var portalFaceCount = portalFrame.count / 4;
    var portalOffset = portalFrame.start;
    for (var portalIndex = 0; portalIndex < 4; portalIndex++) {
        gl.stencilFunc(gl.ALWAYS, portalIndex + 1, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        gl.drawArrays(gl.TRIANGLES, portalOffset, portalFaceCount);
        portalOffset += portalFaceCount;
    }
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    var innerFloor = stencilCube.floor;
    gl.depthRange(0.0, 0.5);
    for (var stencilValue = 1; stencilValue <= 4; stencilValue++) {
        gl.stencilFunc(gl.EQUAL, stencilValue, 0xFF);
        gl.drawArrays(gl.TRIANGLES, innerFloor.start, innerFloor.count);
    }
    gl.depthRange(0.0, 1.0);

    gl.stencilFunc(gl.EQUAL, 1, 0xFF);
    gl.depthRange(0.0, 0.5);
    drawDesertScene();
    gl.depthRange(0.0, 1.0);

    gl.stencilFunc(gl.EQUAL, 2, 0xFF);
    gl.depthRange(0.0, 0.5);
    drawRuinsScene();
    gl.depthRange(0.0, 1.0);

    gl.stencilFunc(gl.EQUAL, 3, 0xFF);
    drawTowerScene();

    gl.stencilFunc(gl.EQUAL, 4, 0xFF);
    gl.depthRange(0.0, 0.5);
    drawSnowScene();
    gl.depthRange(0.0, 1.0);

    gl.disable(gl.STENCIL_TEST);
}

/** Initialize WebGL context, buffers, shaders, and interaction hooks */
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas, { stencil: true });
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    buildSceneGeometry();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    canvas.addEventListener("mousedown", function(event) {
        isDragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    });

    canvas.addEventListener("mousemove", function(event) {
        if (!isDragging) {
            return;
        }
        var deltaX = event.clientX - previousMouseX;
        var deltaY = event.clientY - previousMouseY;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;

        rotationY += deltaX * 0.5;
        rotationX += deltaY * 0.5;
    });

    canvas.addEventListener("mouseup", function() {
        isDragging = false;
    });

    canvas.addEventListener("mouseleave", function() {
        isDragging = false;
    });

    canvas.addEventListener("wheel", function(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            zoom *= 1.1;
        } else {
            zoom *= 0.9;
        }
        zoom = Math.max(0.3, Math.min(zoom, 3.0));
    }, { passive: false });

    requestAnimFrame(render);
};

/** Frame loop: clear buffers and render the hub each tick */
function render() {
    if (!gl) {
        return;
    }

    requestAnimFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    renderHubCamera();
}