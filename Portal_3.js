(function (global) {
    function emitQuad(v1, v2, v3, v4, color) {
        points.push(v1); colors.push(color);
        points.push(v2); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v1); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v4); colors.push(color);
    }

    /** 사각형에 각 꼭짓점별 색상을 지정해 push */
    function emitQuadColored(v1, c1, v2, c2, v3, c3, v4, c4) {
        points.push(v1); colors.push(c1);
        points.push(v2); colors.push(c2);
        points.push(v3); colors.push(c3);
        points.push(v1); colors.push(c1);
        points.push(v3); colors.push(c3);
        points.push(v4); colors.push(c4);
    }

    function createTower() {
        // Cylindrical main tower with decorative horizontal bands and shading.
        var towerColor1 = vec4(0.35, 0.30, 0.28, 1.0);
        var towerColor2 = vec4(0.28, 0.24, 0.22, 1.0);
        var towerColor3 = vec4(0.42, 0.36, 0.32, 1.0);
        var bandColor = vec4(0.95, 0.85, 0.4, 1.0);
        var radius = 0.12;
        var height = 0.9;
        var baseY = -0.5;
        var topY = baseY + height;
        var segments = 12;
        var centerZ = 0.0;
        var band1Y1 = baseY + height * 0.14;
        var band1Y2 = baseY + height * 0.32;
        var band2Y1 = baseY + height * 0.41;
        var band2Y2 = baseY + height * 0.59;
        var band3Y1 = baseY + height * 0.68;
        var band3Y2 = baseY + height * 0.86;
        for (var i = 0; i < segments; i++) {
            var theta1 = (i / segments) * 2 * Math.PI;
            var theta2 = ((i + 1) / segments) * 2 * Math.PI;
            var x1 = radius * Math.cos(theta1);
            var z1 = radius * Math.sin(theta1) + centerZ;
            var x2 = radius * Math.cos(theta2);
            var z2 = radius * Math.sin(theta2) + centerZ;

            var base1 = vec4(x1, baseY, z1, 1.0);
            var base2 = vec4(x2, baseY, z2, 1.0);
            var band1Low1 = vec4(x1, band1Y1, z1, 1.0);
            var band1Low2 = vec4(x2, band1Y1, z2, 1.0);
            var band1High1 = vec4(x1, band1Y2, z1, 1.0);
            var band1High2 = vec4(x2, band1Y2, z2, 1.0);
            var band2Low1 = vec4(x1, band2Y1, z1, 1.0);
            var band2Low2 = vec4(x2, band2Y1, z2, 1.0);
            var band2High1 = vec4(x1, band2Y2, z1, 1.0);
            var band2High2 = vec4(x2, band2Y2, z2, 1.0);
            var band3Low1 = vec4(x1, band3Y1, z1, 1.0);
            var band3Low2 = vec4(x2, band3Y1, z2, 1.0);
            var band3High1 = vec4(x1, band3Y2, z1, 1.0);
            var band3High2 = vec4(x2, band3Y2, z2, 1.0);
            var top1 = vec4(x1, topY, z1, 1.0);
            var top2 = vec4(x2, topY, z2, 1.0);

            emitQuadColored(base1, towerColor2, base2, towerColor2, band1Low2, towerColor1, band1Low1, towerColor1);
            emitQuad(band1Low1, band1Low2, band1High2, band1High1, bandColor);
            emitQuad(band1High1, band1High2, band2Low2, band2Low1, towerColor1);
            emitQuad(band2Low1, band2Low2, band2High2, band2High1, bandColor);
            emitQuad(band2High1, band2High2, band3Low2, band3Low1, towerColor1);
            emitQuad(band3Low1, band3Low2, band3High2, band3High1, bandColor);
            emitQuadColored(band3High1, towerColor1, band3High2, towerColor1, top2, towerColor3, top1, towerColor3);
        }
        var topCenter = vec4(0.0, topY, centerZ, 1.0);
        for (var j = 0; j < segments; j++) {
            var phi1 = (j / segments) * 2 * Math.PI;
            var phi2 = ((j + 1) / segments) * 2 * Math.PI;
            var tx1 = radius * Math.cos(phi1);
            var tz1 = radius * Math.sin(phi1) + centerZ;
            var tx2 = radius * Math.cos(phi2);
            var tz2 = radius * Math.sin(phi2) + centerZ;
            points.push(topCenter); colors.push(towerColor3);
            points.push(vec4(tx1, topY, tz1, 1.0)); colors.push(towerColor1);
            points.push(vec4(tx2, topY, tz2, 1.0)); colors.push(towerColor1);
        }
    }

    function createTowerPlatforms() {
        // Spiral ring of octagonal platforms climbing the tower exterior.
        var platformColor = vec4(0.25, 0.20, 0.18, 1.0);
        var towerRadius = 0.12;
        var platformSize = 0.08;
        var platformThickness = 0.02;
        var numPlatforms = 8;
        var height = 0.9;
        var baseY = -0.5;
        var centerZ = 0.0;
        var totalRotation = Math.PI * 3;
        for (var i = 3; i < numPlatforms; i++) {
            var t = i / (numPlatforms - 1);
            var y = baseY + height * t * 0.85;
            var angle = (i / numPlatforms) * totalRotation;
            var platformDistance = towerRadius + platformSize * 3.0;
            var platformX = platformDistance * Math.cos(angle);
            var platformZ = platformDistance * Math.sin(angle) + centerZ;
            createOctagonPlatform(platformX, y, platformZ, platformSize, platformThickness, angle, platformColor);
        }
    }

    function createOctagonPlatform(centerX, centerY, centerZ, size, thickness, rotation, color) {
        // Single rotated octagonal slab with top and side faces.
        var segments = 8;
        var topY = centerY + thickness;
        var bottomY = centerY;
        for (var i = 0; i < segments; i++) {
            var theta1 = rotation + (i / segments) * 2 * Math.PI;
            var theta2 = rotation + ((i + 1) / segments) * 2 * Math.PI;
            var x1 = centerX + size * Math.cos(theta1);
            var z1 = centerZ + size * Math.sin(theta1);
            var x2 = centerX + size * Math.cos(theta2);
            var z2 = centerZ + size * Math.sin(theta2);
            var top1 = vec4(x1, topY, z1, 1.0);
            var top2 = vec4(x2, topY, z2, 1.0);
            var bottom1 = vec4(x1, bottomY, z1, 1.0);
            var bottom2 = vec4(x2, bottomY, z2, 1.0);
            points.push(vec4(centerX, topY, centerZ, 1.0)); colors.push(color);
            points.push(top1); colors.push(color);
            points.push(top2); colors.push(color);
            emitQuad(top1, top2, bottom2, bottom1, color);
        }
    }

    function createClothBetweenPlatforms(x1, y1, z1, x2, y2, z2, platformSize, platformThickness, clothWidth, color) {
        // Derive platform edge points and emit a single cloth strip between them.
        var dirX = x2 - x1;
        var dirY = y2 - y1;
        var dirZ = z2 - z1;
        var dirLength = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        if (dirLength < 0.0001) {
            return;
        }
        var normDirX = dirX / dirLength;
        var normDirY = dirY / dirLength;
        var normDirZ = dirZ / dirLength;
        var edge1X = x1 + normDirX * platformSize;
        var edge1Y = y1 + normDirY * platformSize + platformThickness;
        var edge1Z = z1 + normDirZ * platformSize;
        var edge2X = x2 - normDirX * platformSize;
        var edge2Y = y2 - normDirY * platformSize + platformThickness;
        var edge2Z = z2 - normDirZ * platformSize;
        var perpX = -normDirZ;
        var perpZ = normDirX;
        var perpLength = Math.sqrt(perpX * perpX + perpZ * perpZ);
        if (perpLength > 0.0001) {
            perpX /= perpLength;
            perpZ /= perpLength;
        }
        var p1 = vec4(edge1X - perpX * clothWidth, edge1Y, edge1Z - perpZ * clothWidth, 1.0);
        var p2 = vec4(edge1X + perpX * clothWidth, edge1Y, edge1Z + perpZ * clothWidth, 1.0);
        var p3 = vec4(edge2X + perpX * clothWidth, edge2Y, edge2Z + perpZ * clothWidth, 1.0);
        var p4 = vec4(edge2X - perpX * clothWidth, edge2Y, edge2Z - perpZ * clothWidth, 1.0);
        emitQuad(p1, p2, p3, p4, color);
    }

    function createTowerCloths() {
        // Connect neighboring platforms with draped cloth strips.
        var clothColor = vec4(0.7, 0.25, 0.25, 1.0);
        var towerRadius = 0.12;
        var platformSize = 0.08;
        var numPlatforms = 8;
        var height = 0.9;
        var baseY = -0.5;
        var centerZ = 0.0;
        var totalRotation = Math.PI * 3;
        for (var i = 3; i < numPlatforms - 1; i++) {
            var t1 = i / (numPlatforms - 1);
            var y1 = baseY + height * t1 * 0.85;
            var angle1 = (i / numPlatforms) * totalRotation;
            var platformDistance = towerRadius + platformSize * 3.0;
            var x1 = platformDistance * Math.cos(angle1);
            var z1 = platformDistance * Math.sin(angle1) + centerZ;
            var t2 = (i + 1) / (numPlatforms - 1);
            var y2 = baseY + height * t2 * 0.85;
            var angle2 = ((i + 1) / numPlatforms) * totalRotation;
            var x2 = platformDistance * Math.cos(angle2);
            var z2 = platformDistance * Math.sin(angle2) + centerZ;
            var clothWidth = 0.04;
            var platformThickness = 0.02;
            createClothBetweenPlatforms(
                x1, y1, z1,
                x2, y2, z2,
                platformSize,
                platformThickness,
                clothWidth,
                clothColor
            );
        }
    }

    function createTowerWater() {
        // Shallow reflective pool beneath the tower using layered quads.
        var waterSurfaceColor = vec4(0.85, 0.65, 0.3, 0.4);
        var waterDepthColor = vec4(0.9, 0.75, 0.4, 0.15);
        var numPlatforms = 8;
        var height = 0.9;
        var baseY = -0.5;
        var t = 3 / (numPlatforms - 1);
        var lowestPlatformY = baseY + height * t * 0.85;
        var minX = -0.5, maxX = 0.5;
        var minY = baseY;
        var maxY = lowestPlatformY;
        var minZ = -0.5, maxZ = 0.5;
        var v0 = vec4(minX, minY, minZ, 1.0);
        var v1 = vec4(maxX, minY, minZ, 1.0);
        var v2 = vec4(maxX, maxY, minZ, 1.0);
        var v3 = vec4(minX, maxY, minZ, 1.0);
        var v4 = vec4(minX, minY, maxZ, 1.0);
        var v5 = vec4(maxX, minY, maxZ, 1.0);
        var v6 = vec4(maxX, maxY, maxZ, 1.0);
        var v7 = vec4(minX, maxY, maxZ, 1.0);
        emitQuad(v4, v5, v6, v7, waterDepthColor);
        emitQuad(v0, v4, v7, v3, waterDepthColor);
        emitQuad(v1, v2, v6, v5, waterDepthColor);
        emitQuad(v3, v7, v6, v2, waterSurfaceColor);
    }

    function createTowerRoom(side, options) {
        // Interior alcove carved into the tower wall, optionally emitting the doorway mask.
        side = side || "left";
        options = options || {};

        var emittingMask = options.mask === true;
        var nicheInnerColor = vec4(0.97, 0.92, 0.73, 1.0);
        var nicheShadowColor = vec4(0.88, 0.82, 0.64, 1.0);
        var maskColor = vec4(0.0, 0.0, 0.0, 1.0);
        var nicheDepth = 0.18;
        var nicheWidth = 0.22;
        var nicheHeight = 0.20;
        var centerZ = 0.02;
        var frontInset = 0.05;

        var isRight = side === "right";
        var wallX = isRight ? 0.5 : -0.5;
        var centerY = isRight ? 0.02 : 0.10;
        var facing = isRight ? 1 : -1;
        var frontX = wallX + facing * frontInset;
        var backX = frontX + facing * nicheDepth;
        var minY = centerY - nicheHeight / 2;
        var maxY = centerY + nicheHeight / 2;
        var minZ = centerZ - nicheWidth / 2;
        var maxZ = centerZ + nicheWidth / 2;

        if (emittingMask) {
            var maskV0 = vec4(frontX, minY, minZ, 1.0);
            var maskV1 = vec4(frontX, minY, maxZ, 1.0);
            var maskV2 = vec4(frontX, maxY, maxZ, 1.0);
            var maskV3 = vec4(frontX, maxY, minZ, 1.0);
            emitQuad(maskV0, maskV1, maskV2, maskV3, maskColor);
            return;
        }

        var ri0 = vec4(frontX, minY, minZ, 1.0);
        var ri1 = vec4(frontX, minY, maxZ, 1.0);
        var ri2 = vec4(frontX, maxY, maxZ, 1.0);
        var ri3 = vec4(frontX, maxY, minZ, 1.0);
        var b0 = vec4(backX, minY, minZ, 1.0);
        var b1 = vec4(backX, minY, maxZ, 1.0);
        var b2 = vec4(backX, maxY, maxZ, 1.0);
        var b3 = vec4(backX, maxY, minZ, 1.0);

        emitQuadColored(ri0, nicheInnerColor, b0, nicheShadowColor, b3, nicheShadowColor, ri3, nicheInnerColor);
        emitQuadColored(ri1, nicheInnerColor, ri2, nicheInnerColor, b2, nicheShadowColor, b1, nicheShadowColor);
        emitQuadColored(ri3, nicheInnerColor, b3, nicheShadowColor, b2, nicheShadowColor, ri2, nicheInnerColor);
        emitQuadColored(ri0, nicheInnerColor, ri1, nicheInnerColor, b1, nicheShadowColor, b0, nicheShadowColor);
    }

    global.createTower = createTower;
    global.createTowerPlatforms = createTowerPlatforms;
    global.createOctagonPlatform = createOctagonPlatform;
    global.createTowerCloths = createTowerCloths;
    global.createTowerWater = createTowerWater;
    global.createTowerRoom = createTowerRoom;
})(this);