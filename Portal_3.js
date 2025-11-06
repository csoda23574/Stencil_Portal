(function (global) {
    // Tower portal geometry: spiral tower, platforms, cloth banners, water, and interior masks.
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
            points.push(vec4(x1, baseY, z1, 1.0)); colors.push(towerColor2);
            points.push(vec4(x2, baseY, z2, 1.0)); colors.push(towerColor2);
            points.push(vec4(x2, band1Y1, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, baseY, z1, 1.0)); colors.push(towerColor2);
            points.push(vec4(x2, band1Y1, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band1Y1, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band1Y1, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band1Y1, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band1Y2, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band1Y1, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band1Y2, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band1Y2, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band1Y2, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band1Y2, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band2Y1, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band1Y2, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band2Y1, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band2Y1, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band2Y1, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band2Y1, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band2Y2, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band2Y1, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band2Y2, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band2Y2, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band2Y2, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band2Y2, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band3Y1, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band2Y2, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band3Y1, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band3Y1, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x1, band3Y1, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band3Y1, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band3Y2, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band3Y1, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x2, band3Y2, z2, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band3Y2, z1, 1.0)); colors.push(bandColor);
            points.push(vec4(x1, band3Y2, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, band3Y2, z2, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, topY, z2, 1.0)); colors.push(towerColor3);
            points.push(vec4(x1, band3Y2, z1, 1.0)); colors.push(towerColor1);
            points.push(vec4(x2, topY, z2, 1.0)); colors.push(towerColor3);
            points.push(vec4(x1, topY, z1, 1.0)); colors.push(towerColor3);
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
            points.push(vec4(centerX, topY, centerZ, 1.0)); colors.push(color);
            points.push(vec4(x1, topY, z1, 1.0)); colors.push(color);
            points.push(vec4(x2, topY, z2, 1.0)); colors.push(color);
            points.push(vec4(x1, topY, z1, 1.0)); colors.push(color);
            points.push(vec4(x1, bottomY, z1, 1.0)); colors.push(color);
            points.push(vec4(x2, bottomY, z2, 1.0)); colors.push(color);
            points.push(vec4(x1, topY, z1, 1.0)); colors.push(color);
            points.push(vec4(x2, bottomY, z2, 1.0)); colors.push(color);
            points.push(vec4(x2, topY, z2, 1.0)); colors.push(color);
        }
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
            var dirX = x2 - x1;
            var dirY = y2 - y1;
            var dirZ = z2 - z1;
            var dirLength = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
            var normDirX = dirX / dirLength;
            var normDirY = dirY / dirLength;
            var normDirZ = dirZ / dirLength;
            var edgeOffset1 = platformSize;
            var edgeOffset2 = platformSize;
            var edge1X = x1 + normDirX * edgeOffset1;
            var edge1Y = y1 + normDirY * edgeOffset1 + platformThickness;
            var edge1Z = z1 + normDirZ * edgeOffset1;
            var edge2X = x2 - normDirX * edgeOffset2;
            var edge2Y = y2 - normDirY * edgeOffset2 + platformThickness;
            var edge2Z = z2 - normDirZ * edgeOffset2;
            var perpX = -normDirZ;
            var perpZ = normDirX;
            var perpLength = Math.sqrt(perpX * perpX + perpZ * perpZ);
            if (perpLength > 0.001) {
                perpX /= perpLength;
                perpZ /= perpLength;
            }
            var p1 = vec4(edge1X - perpX * clothWidth, edge1Y, edge1Z - perpZ * clothWidth, 1.0);
            var p2 = vec4(edge1X + perpX * clothWidth, edge1Y, edge1Z + perpZ * clothWidth, 1.0);
            var p3 = vec4(edge2X + perpX * clothWidth, edge2Y, edge2Z + perpZ * clothWidth, 1.0);
            var p4 = vec4(edge2X - perpX * clothWidth, edge2Y, edge2Z - perpZ * clothWidth, 1.0);
            points.push(p1); colors.push(clothColor);
            points.push(p2); colors.push(clothColor);
            points.push(p3); colors.push(clothColor);
            points.push(p1); colors.push(clothColor);
            points.push(p3); colors.push(clothColor);
            points.push(p4); colors.push(clothColor);
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
        points.push(v4); colors.push(waterDepthColor);
        points.push(v5); colors.push(waterDepthColor);
        points.push(v6); colors.push(waterDepthColor);
        points.push(v4); colors.push(waterDepthColor);
        points.push(v6); colors.push(waterDepthColor);
        points.push(v7); colors.push(waterDepthColor);
        points.push(v0); colors.push(waterDepthColor);
        points.push(v4); colors.push(waterDepthColor);
        points.push(v7); colors.push(waterDepthColor);
        points.push(v0); colors.push(waterDepthColor);
        points.push(v7); colors.push(waterDepthColor);
        points.push(v3); colors.push(waterDepthColor);
        points.push(v1); colors.push(waterDepthColor);
        points.push(v2); colors.push(waterDepthColor);
        points.push(v6); colors.push(waterDepthColor);
        points.push(v1); colors.push(waterDepthColor);
        points.push(v6); colors.push(waterDepthColor);
        points.push(v5); colors.push(waterDepthColor);
        points.push(v3); colors.push(waterSurfaceColor);
        points.push(v7); colors.push(waterSurfaceColor);
        points.push(v6); colors.push(waterSurfaceColor);
        points.push(v3); colors.push(waterSurfaceColor);
        points.push(v6); colors.push(waterSurfaceColor);
        points.push(v2); colors.push(waterSurfaceColor);
    }

    function createTowerRoom() {
        // Left wall alcove geometry for the tower interior.
        var nicheInnerColor = vec4(0.97, 0.92, 0.73, 1.0);
        var nicheShadowColor = vec4(0.88, 0.82, 0.64, 1.0);
        var wallX = -0.5;
        var nicheDepth = 0.18;
        var nicheWidth = 0.22;
        var nicheHeight = 0.20;
        var centerY = 0.10;
        var centerZ = 0.02;
        var frontInset = 0.05;
        var frontX = wallX - frontInset;
        var backX = frontX - nicheDepth;
        var minY = centerY - nicheHeight / 2;
        var maxY = centerY + nicheHeight / 2;
        var minZ = centerZ - nicheWidth / 2;
        var maxZ = centerZ + nicheWidth / 2;
        var ri0 = vec4(frontX, minY, minZ, 1.0);
        var ri1 = vec4(frontX, minY, maxZ, 1.0);
        var ri2 = vec4(frontX, maxY, maxZ, 1.0);
        var ri3 = vec4(frontX, maxY, minZ, 1.0);
        var b0 = vec4(backX, minY, minZ, 1.0);
        var b1 = vec4(backX, minY, maxZ, 1.0);
        var b2 = vec4(backX, maxY, maxZ, 1.0);
        var b3 = vec4(backX, maxY, minZ, 1.0);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(b0); colors.push(nicheShadowColor);
        points.push(b3); colors.push(nicheShadowColor);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(b3); colors.push(nicheShadowColor);
        points.push(ri3); colors.push(nicheInnerColor);
        points.push(ri1); colors.push(nicheInnerColor);
        points.push(ri2); colors.push(nicheInnerColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(ri1); colors.push(nicheInnerColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(b1); colors.push(nicheShadowColor);
        points.push(ri3); colors.push(nicheInnerColor);
        points.push(b3); colors.push(nicheShadowColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(ri3); colors.push(nicheInnerColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(ri2); colors.push(nicheInnerColor);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(ri1); colors.push(nicheInnerColor);
        points.push(b1); colors.push(nicheShadowColor);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(b1); colors.push(nicheShadowColor);
        points.push(b0); colors.push(nicheShadowColor);
    }

    function createTowerEntranceMask() {
        // Black rectangle to punch a doorway opening on the left wall.
        var wallX = -0.5;
        var nicheWidth = 0.22;
        var nicheHeight = 0.20;
        var centerY = 0.10;
        var centerZ = 0.02;
        var frontInset = 0.05;
        var frontX = wallX - frontInset;
        var minY = centerY - nicheHeight / 2;
        var maxY = centerY + nicheHeight / 2;
        var minZ = centerZ - nicheWidth / 2;
        var maxZ = centerZ + nicheWidth / 2;
        var maskColor = vec4(0.0, 0.0, 0.0, 1.0);
        var v0 = vec4(frontX, minY, minZ, 1.0);
        var v1 = vec4(frontX, minY, maxZ, 1.0);
        var v2 = vec4(frontX, maxY, maxZ, 1.0);
        var v3 = vec4(frontX, maxY, minZ, 1.0);
        points.push(v0); colors.push(maskColor);
        points.push(v1); colors.push(maskColor);
        points.push(v2); colors.push(maskColor);
        points.push(v0); colors.push(maskColor);
        points.push(v2); colors.push(maskColor);
        points.push(v3); colors.push(maskColor);
    }

    function createTowerRoomRight() {
        // Mirrored alcove on the right wall to balance the interior.
        var nicheInnerColor = vec4(0.97, 0.92, 0.73, 1.0);
        var nicheShadowColor = vec4(0.88, 0.82, 0.64, 1.0);
        var wallX = 0.5;
        var nicheDepth = 0.18;
        var nicheWidth = 0.22;
        var nicheHeight = 0.20;
        var centerY = 0.02;
        var centerZ = 0.02;
        var frontInset = 0.05;
        var frontX = wallX + frontInset;
        var backX = frontX + nicheDepth;
        var minY = centerY - nicheHeight / 2;
        var maxY = centerY + nicheHeight / 2;
        var minZ = centerZ - nicheWidth / 2;
        var maxZ = centerZ + nicheWidth / 2;
        var ri0 = vec4(frontX, minY, minZ, 1.0);
        var ri1 = vec4(frontX, minY, maxZ, 1.0);
        var ri2 = vec4(frontX, maxY, maxZ, 1.0);
        var ri3 = vec4(frontX, maxY, minZ, 1.0);
        var b0 = vec4(backX, minY, minZ, 1.0);
        var b1 = vec4(backX, minY, maxZ, 1.0);
        var b2 = vec4(backX, maxY, maxZ, 1.0);
        var b3 = vec4(backX, maxY, minZ, 1.0);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(b0); colors.push(nicheShadowColor);
        points.push(b3); colors.push(nicheShadowColor);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(b3); colors.push(nicheShadowColor);
        points.push(ri3); colors.push(nicheInnerColor);
        points.push(ri1); colors.push(nicheInnerColor);
        points.push(ri2); colors.push(nicheInnerColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(ri1); colors.push(nicheInnerColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(b1); colors.push(nicheShadowColor);
        points.push(ri3); colors.push(nicheInnerColor);
        points.push(b3); colors.push(nicheShadowColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(ri3); colors.push(nicheInnerColor);
        points.push(b2); colors.push(nicheShadowColor);
        points.push(ri2); colors.push(nicheInnerColor);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(ri1); colors.push(nicheInnerColor);
        points.push(b1); colors.push(nicheShadowColor);
        points.push(ri0); colors.push(nicheInnerColor);
        points.push(b1); colors.push(nicheShadowColor);
        points.push(b0); colors.push(nicheShadowColor);
    }

    function createTowerEntranceMaskRight() {
        // Mask for the right doorway opening used in the stencil pass.
        var wallX = 0.5;
        var nicheWidth = 0.22;
        var nicheHeight = 0.20;
        var centerY = 0.02;
        var centerZ = 0.02;
        var frontInset = 0.05;
        var frontX = wallX + frontInset;
        var minY = centerY - nicheHeight / 2;
        var maxY = centerY + nicheHeight / 2;
        var minZ = centerZ - nicheWidth / 2;
        var maxZ = centerZ + nicheWidth / 2;
        var maskColor = vec4(0.0, 0.0, 0.0, 1.0);
        var v0 = vec4(frontX, minY, minZ, 1.0);
        var v1 = vec4(frontX, minY, maxZ, 1.0);
        var v2 = vec4(frontX, maxY, maxZ, 1.0);
        var v3 = vec4(frontX, maxY, minZ, 1.0);
        points.push(v0); colors.push(maskColor);
        points.push(v1); colors.push(maskColor);
        points.push(v2); colors.push(maskColor);
        points.push(v0); colors.push(maskColor);
        points.push(v2); colors.push(maskColor);
        points.push(v3); colors.push(maskColor);
    }

    global.createTower = createTower;
    global.createTowerPlatforms = createTowerPlatforms;
    global.createOctagonPlatform = createOctagonPlatform;
    global.createTowerCloths = createTowerCloths;
    global.createTowerWater = createTowerWater;
    global.createTowerRoom = createTowerRoom;
    global.createTowerEntranceMask = createTowerEntranceMask;
    global.createTowerRoomRight = createTowerRoomRight;
    global.createTowerEntranceMaskRight = createTowerEntranceMaskRight;
})(this);
