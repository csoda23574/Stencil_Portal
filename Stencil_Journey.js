// 포털 선택 허브와 포털 내부 탐험을 모두 제어하는 메인 스크립트.
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

var renderMode = "hub";
var activePortal = 0;

var portalCamera = {
    position: [0, 0, 2],
    yaw: 0,
    pitch: 0
};

var portalMovement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    fast: false
};

var portalScale = 1.8;
var basePortalSpeed = 1.2;
var previousFrameTime = 0;

// 각 포털 환경 진입 시 적용할 카메라 위치, 각도, 스케일 기본값.
var portalConfigs = {
    1: { position: [0, 0.1, 1.8], yaw: 0, pitch: -10, scale: 2.0 },
    2: { position: [0.2, 0.1, 1.9], yaw: -15, pitch: -8, scale: 2.0 },
    3: { position: [0, 0.15, 2.2], yaw: 0, pitch: -12, scale: 1.8 },
    4: { position: [0, 0.12, 1.9], yaw: 10, pitch: -8, scale: 2.1 }
};

/** 값 제한: value를 [minValue, maxValue] 범위로 클램프한다 */
function clamp(value, minValue, maxValue) {
    return Math.min(Math.max(value, minValue), maxValue);
}

/** 벡터 합: 3차원 벡터 a+b 반환 */
function addVec3(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/** 스칼라 곱: 3차원 벡터 v*scalar 반환 */
function scaleVec3(v, scalar) {
    return [v[0] * scalar, v[1] * scalar, v[2] * scalar];
}

/** 벡터 길이: 3차원 벡터의 유클리드 노름 */
function lengthVec3(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

/** 정규화: 3차원 벡터를 단위벡터로 변환 */
function normalizeVec3(v) {
    var len = lengthVec3(v);
    if (len === 0) {
        return [0, 0, 0];
    }
    return scaleVec3(v, 1 / len);
}

/** 각도→라디안 변환 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function addQuad(v0, v1, v2, v3, color) {
    points.push(v0); colors.push(color);
    points.push(v1); colors.push(color);
    points.push(v2); colors.push(color);
    points.push(v0); colors.push(color);
    points.push(v2); colors.push(color);
    points.push(v3); colors.push(color);
}

/**
 * 지오메트리 등록: 생성기(generator)를 실행해 현재 points/ colors 길이 기준으로
 * 시작 오프셋과 개수를 계산하여 container[key]에 범위로 저장.
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

/** 포털 프레임(앞/옆/뒤/옆) 면 4개를 큐브 형태로 생성 */
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

/** 포털 내부 바닥(하단 면) 생성 */
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

/** 허브의 스텐실 큐브: 외피, 포털 프레임, 내부 바닥을 등록 */
function createStencilCube(range) {
    registerGeometry(range, "shell", buildCubeGeometry);
    registerGeometry(range, "portals", buildPortalGeometry);
    registerGeometry(range, "floor", buildInnerFloorGeometry);
}

/** Portal_1.js 사막 자원 등록 */
function createPortalOneScene(range) {
    registerGeometry(range, "mountain", createMountain);
    registerGeometry(range, "dunes", createDesertDunes);
    registerGeometry(range, "sun", createDesertSun);
    registerGeometry(range, "sandstorm", createDesertSandstorm);
    registerGeometry(range, "cloth", createDesertCloth);
}

/** Portal_2.js 폐허 자원 등록 */
function createPortalTwoScene(range) {
    registerGeometry(range, "arch", createRuinsArch);
    registerGeometry(range, "pillars", createRuinsPillars);
    registerGeometry(range, "guardian", createRuinsGuardian);
    // registerGeometry(range, "light", createRuinsLight);
}

/** Portal_3.js 타워 자원 등록 */
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

/** Portal_4.js 설원 자원 등록 */
function createPortalFourScene(range) {
    registerGeometry(range, "field", createSnowField);
    registerGeometry(range, "cliffs", createSnowCliffs);
    registerGeometry(range, "rocks", createSnowRocks);
    registerGeometry(range, "beam", createPortalLightBeam);
}

/**
 * 전체 지오메트리 빌드: 버퍼 비우고 스텐실 큐브 및 각 포털 장면을
 * 순서대로 생성하여 geometryRanges에 등록
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

/** 현재 포털 카메라의 yaw/pitch로부터 시선 방향 벡터 계산 */
function getPortalLookDirection() {
    var yawRad = degToRad(portalCamera.yaw);
    var pitchRad = degToRad(portalCamera.pitch);
    var direction = [
        Math.cos(pitchRad) * Math.sin(yawRad),
        Math.sin(pitchRad),
        -Math.cos(pitchRad) * Math.cos(yawRad)
    ];
    return normalizeVec3(direction);
}

/** 포털 카메라 이동 입력 상태 초기화 */
function resetPortalMovement() {
    portalMovement.forward = false;
    portalMovement.backward = false;
    portalMovement.left = false;
    portalMovement.right = false;
    portalMovement.up = false;
    portalMovement.down = false;
    portalMovement.fast = false;
}

/** 허브에서 지정한 포털(1~4)로 진입하며 카메라 상태 초기화 */
function enterPortal(portalId) {
    if (!geometryRanges || !geometryRanges.portals) {
        return;
    }
    var config = portalConfigs[portalId] || { position: [0, 0.1, 1.8], yaw: 0, pitch: -10, scale: 1.9 };
    renderMode = "portal";
    activePortal = portalId;
    portalCamera.position = config.position.slice();
    portalCamera.yaw = config.yaw;
    portalCamera.pitch = config.pitch;
    portalScale = config.scale;
    resetPortalMovement();
    previousFrameTime = 0;
}

/** 포털 모드에서 허브 모드로 복귀 */
function exitPortal() {
    renderMode = "hub";
    activePortal = 0;
    resetPortalMovement();
}

/** 키다운 처리: 허브=숫자 선택, 포털=이동/가속/상하/ESC */
function handleKeyDown(event) {
    if (renderMode === "hub") {
        switch (event.code) {
        case "Digit1":
        case "Numpad1":
            enterPortal(1);
            event.preventDefault();
            break;
        case "Digit2":
        case "Numpad2":
            enterPortal(2);
            event.preventDefault();
            break;
        case "Digit3":
        case "Numpad3":
            enterPortal(3);
            event.preventDefault();
            break;
        case "Digit4":
        case "Numpad4":
            enterPortal(4);
            event.preventDefault();
            break;
        default:
            break;
        }
        return;
    }

    switch (event.code) {
    case "Escape":
        exitPortal();
        event.preventDefault();
        break;
    case "ArrowUp":
        portalMovement.forward = true;
        event.preventDefault();
        break;
    case "ArrowDown":
        portalMovement.backward = true;
        event.preventDefault();
        break;
    case "ArrowLeft":
        portalMovement.left = true;
        event.preventDefault();
        break;
    case "ArrowRight":
        portalMovement.right = true;
        event.preventDefault();
        break;
    case "KeyE":
        portalMovement.up = true;
        event.preventDefault();
        break;
    case "KeyQ":
        portalMovement.down = true;
        event.preventDefault();
        break;
    case "ShiftLeft":
    case "ShiftRight":
        portalMovement.fast = true;
        break;
    default:
        break;
    }
}

/** 키업 처리: 포털 모드에서 이동/가속/상하 해제 */
function handleKeyUp(event) {
    if (renderMode !== "portal") {
        return;
    }
    switch (event.code) {
    case "ArrowUp":
        portalMovement.forward = false;
        break;
    case "ArrowDown":
        portalMovement.backward = false;
        break;
    case "ArrowLeft":
        portalMovement.left = false;
        break;
    case "ArrowRight":
        portalMovement.right = false;
        break;
    case "KeyE":
        portalMovement.up = false;
        break;
    case "KeyQ":
        portalMovement.down = false;
        break;
    case "ShiftLeft":
    case "ShiftRight":
        portalMovement.fast = false;
        break;
    default:
        break;
    }
}

/** 화살표, Q/E, Shift로 포털 내부 자유비행 카메라 위치 갱신 */
function updatePortalCamera(deltaTime) {
    var speedMultiplier = portalMovement.fast ? 2.0 : 1.0;
    var moveDistance = basePortalSpeed * speedMultiplier * deltaTime;

    var yawRad = degToRad(portalCamera.yaw);
    var forward = [Math.sin(yawRad), 0, -Math.cos(yawRad)];
    var right = [Math.cos(yawRad), 0, Math.sin(yawRad)];

    var moveVector = [0, 0, 0];

    if (portalMovement.forward) {
        moveVector = addVec3(moveVector, forward);
    }
    if (portalMovement.backward) {
        moveVector = addVec3(moveVector, scaleVec3(forward, -1));
    }
    if (portalMovement.right) {
        moveVector = addVec3(moveVector, right);
    }
    if (portalMovement.left) {
        moveVector = addVec3(moveVector, scaleVec3(right, -1));
    }

    if (lengthVec3(moveVector) > 0.0001) {
        moveVector = normalizeVec3(moveVector);
        moveVector = scaleVec3(moveVector, moveDistance);
        portalCamera.position = addVec3(portalCamera.position, moveVector);
    }

    if (portalMovement.up) {
        portalCamera.position[1] += moveDistance;
    }
    if (portalMovement.down) {
        portalCamera.position[1] -= moveDistance;
    }

    portalCamera.position[1] = clamp(portalCamera.position[1], -0.4, 1.6);
}

/** 사막 포털 렌더링: 피라미드/사구/태양/모래폭풍/천 */
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

/** 폐허 포털 렌더링: 아치/기둥/수호자/빛 입자 */
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

/** 타워 포털 렌더링: 내부 마스크/룸/타워/플랫폼/천/수면 */
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

/** 설원 포털 렌더링: 눈밭/절벽(블렌딩)/암석/광선 */
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

/** 허브 카메라로 기본 큐브(허브) 렌더링 */
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

/** 허브 장면 그리기: 스텐실 설정 후 각 포털 내부 장면 미리보기 */
function drawHubScene() {
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

/** 포털 카메라 구성 및 포털 내부 장면 렌더링 */
function renderPortalCamera() {
    var direction = getPortalLookDirection();
    var target = addVec3(portalCamera.position, direction);
    var viewMatrix = lookAt(portalCamera.position, target, [0, 1, 0]);
    var modelViewMatrix = viewMatrix;
    if (portalScale !== 1) {
        modelViewMatrix = mult(modelViewMatrix, scalem(portalScale, portalScale, portalScale));
    }

    var aspect = canvas.width / canvas.height;
    var projectionMatrix = perspective(55, aspect, 0.05, 15.0);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    drawPortalEnvironment(activePortal);
}

/** 포털 ID→렌더 함수 매핑 */
var portalSceneDrawers = {
    1: drawDesertScene,
    2: drawRuinsScene,
    3: drawTowerScene,
    4: drawSnowScene
};

/** 포털 ID에 해당하는 장면을 렌더 */
function drawPortalEnvironment(portalId) {
    gl.disable(gl.STENCIL_TEST);
    gl.depthMask(true);
    gl.depthFunc(gl.LESS);
    gl.depthRange(0.0, 1.0);
    gl.colorMask(true, true, true, true);

    var drawer = portalSceneDrawers[portalId];
    if (typeof drawer === "function") {
        drawer();
    }
}

/** onload 초기화: GL 컨텍스트/프로그램/버퍼/입력 이벤트 설정 */
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

        if (renderMode === "hub") {
            rotationY += deltaX * 0.5;
            rotationX += deltaY * 0.5;
        } else {
            portalCamera.yaw += deltaX * 0.4;
            portalCamera.pitch += deltaY * 0.4;
            portalCamera.pitch = clamp(portalCamera.pitch, -85, 85);
        }
    });

    canvas.addEventListener("mouseup", function() {
        isDragging = false;
    });

    canvas.addEventListener("mouseleave", function() {
        isDragging = false;
    });

    canvas.addEventListener("wheel", function(event) {
        event.preventDefault();
        if (renderMode === "hub") {
            if (event.deltaY < 0) {
                zoom *= 1.1;
            } else {
                zoom *= 0.9;
            }
            zoom = Math.max(0.3, Math.min(zoom, 3.0));
        } else if (renderMode === "portal") {
            var direction = getPortalLookDirection();
            var step = event.deltaY < 0 ? 0.35 : -0.35;
            portalCamera.position = addVec3(portalCamera.position, scaleVec3(direction, step));
            portalCamera.position[1] = clamp(portalCamera.position[1], -0.4, 1.6);
        }
    }, { passive: false });

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    requestAnimFrame(render);
};

/** 프레임 루프: 입력 반영, 버퍼 클리어, 현재 모드 렌더 */
function render(currentTime) {
    if (!gl) {
        return;
    }

    requestAnimFrame(render);

    if (!previousFrameTime) {
        previousFrameTime = currentTime;
    }
    var deltaTime = (currentTime - previousFrameTime) / 1000;
    previousFrameTime = currentTime;

    if (renderMode === "portal") {
        updatePortalCamera(deltaTime);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    if (renderMode === "hub") {
        renderHubCamera();
    } else {
        renderPortalCamera();
    }
}
