(function (global) {
    // Snow portal geometry: cliffs, rocks, undulating snowfield, and portal light beam.

    /** 사각형을 두 개의 삼각형으로 나눠 push */
    function emitQuad(v1, v2, v3, v4, color) {
        points.push(v1); colors.push(color);
        points.push(v2); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v1); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v4); colors.push(color);
    }

    /** 꼭짓점별 색상을 적용하며 사각형 push */
    function emitQuadColored(v1, c1, v2, c2, v3, c3, v4, c4) {
        points.push(v1); colors.push(c1);
        points.push(v2); colors.push(c2);
        points.push(v3); colors.push(c3);
        points.push(v1); colors.push(c1);
        points.push(v3); colors.push(c3);
        points.push(v4); colors.push(c4);
    }

    function createSnowCliffs() {
        // Layered front and back cliff faces framing the snow portal.
        var frontCliffColor = vec4(0.7, 0.85, 0.95, 0.85);
        var frontCliffDark = vec4(0.5, 0.65, 0.8, 0.8);
        var xOffset = 0.24;
        var zFrontOffset = -0.15;
        var cliffScaleY = 2.8;
        var cliffScaleYBack = 3.4;
        var cliffScaleZFront = 1.7;
        // SnowField의 가장 하단 높이와 cliff의 하단 정점 높이 맞춤
        var snowFieldBaseY = -0.5 + 0.0005;
        var frontCliffVertices = [
            vec4(-0.08 + xOffset, snowFieldBaseY, (0.5 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(-0.04 + xOffset, 0.2 * cliffScaleY, (0.5 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(0.0 + xOffset, 0.35 * cliffScaleY, (0.35 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(0.04 + xOffset, 0.15 * cliffScaleY, (0.2 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(0.08 + xOffset, snowFieldBaseY, (0.15 + zFrontOffset) * cliffScaleZFront, 1.0)
        ];
        for (var i = 1; i < frontCliffVertices.length - 1; i++) {
            points.push(frontCliffVertices[0]); colors.push(frontCliffColor);
            points.push(frontCliffVertices[i]); colors.push(frontCliffDark);
            points.push(frontCliffVertices[i + 1]); colors.push(frontCliffColor);
        }
        var backCliffColor = vec4(0.8, 0.9, 1.0, 0.8);
        var backCliffDark = vec4(0.6, 0.7, 0.85, 0.75);
        var zBackOffset = 0.18;
        var cliffScaleZBack = 1.7;
        var backCliffVertices = [
            vec4(-0.08 + xOffset, snowFieldBaseY, (-0.5 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(-0.04 + xOffset, 0.18 * cliffScaleYBack, (-0.5 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(0.0 + xOffset, 0.33 * cliffScaleYBack, (-0.35 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(0.04 + xOffset, 0.13 * cliffScaleYBack, (-0.2 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(0.08 + xOffset, snowFieldBaseY, (-0.15 + zBackOffset) * cliffScaleZBack, 1.0)
        ];
        for (var j = 1; j < backCliffVertices.length - 1; j++) {
            points.push(backCliffVertices[0]); colors.push(backCliffColor);
            points.push(backCliffVertices[j]); colors.push(backCliffDark);
            points.push(backCliffVertices[j + 1]); colors.push(backCliffColor);
        }
    }

    function createGravestones(config) {
        // Build a single gravestone with the provided dimensions and alignment.
        config = config || {};
        var center = config.center || vec3(0.0, 0.0, 0.0);
        var width = config.width !== undefined ? config.width : 0.058;
        var depth = config.depth !== undefined ? config.depth : 0.02;
        var height = config.height !== undefined ? config.height : 0.1495;
        var color = config.color || vec4(0.55, 0.54, 0.52, 1.0);
        var topScaleX = config.topScaleX !== undefined ? config.topScaleX : 1.0;
        var topScaleZ = config.topScaleZ !== undefined ? config.topScaleZ : 1.0;
        var leanX = config.leanX || 0.0;
        var leanZ = config.leanZ || 0.0;

        var halfWidthBottom = width / 2;
        var halfDepthBottom = depth / 2;
        var halfWidthTop = halfWidthBottom * topScaleZ;
        var halfDepthTop = halfDepthBottom * topScaleX;
        var yBottom = center[1] - height / 2;
        var yTop = center[1] + height / 2;

        var vertices = [
            vec4(center[0] - halfDepthBottom, yBottom, center[2] - halfWidthBottom, 1.0),
            vec4(center[0] + halfDepthBottom, yBottom, center[2] - halfWidthBottom, 1.0),
            vec4(center[0] + halfDepthTop + leanX, yTop, center[2] - halfWidthTop + leanZ, 1.0),
            vec4(center[0] - halfDepthTop + leanX, yTop, center[2] - halfWidthTop + leanZ, 1.0),
            vec4(center[0] - halfDepthBottom, yBottom, center[2] + halfWidthBottom, 1.0),
            vec4(center[0] + halfDepthBottom, yBottom, center[2] + halfWidthBottom, 1.0),
            vec4(center[0] + halfDepthTop + leanX, yTop, center[2] + halfWidthTop + leanZ, 1.0),
            vec4(center[0] - halfDepthTop + leanX, yTop, center[2] + halfWidthTop + leanZ, 1.0)
        ];

        var faces = [
            [0, 1, 2, 3],
            [5, 4, 7, 6],
            [4, 0, 3, 7],
            [1, 5, 6, 2],
            [3, 2, 6, 7],
            [4, 5, 1, 0]
        ];

        for (var i = 0; i < faces.length; i++) {
            var idx = faces[i];
            emitQuad(vertices[idx[0]], vertices[idx[1]], vertices[idx[2]], vertices[idx[3]], color);
        }
    }

    function createSnowRocks(config) {
        // Generate a single noise-distorted rock at a specified location.
        config = config || {};
        var center = config.center || vec3(0.0, -0.24, 0.0);
        var radius = config.radius !== undefined ? config.radius : 0.09;
        var color = config.color || vec4(0.78, 0.75, 0.72, 1.0);
        var roughness = config.roughness !== undefined ? config.roughness : 0.11;
        var wobble = config.wobble !== undefined ? config.wobble : 0.08;
        var latitudeBands = config.latitudeBands || 18;
        var longitudeBands = config.longitudeBands || 18;
        var seed = config.seed !== undefined ? config.seed : 1234;

        function rockNoise(seed, x, y, z) {
            var wobbleTerm = 1.0 + wobble * Math.sin(seed * 0.13 + x * 2.3 + y * 1.7 + z * 2.1);
            var randomTerm = 1.0 + roughness * (Math.abs(Math.sin(seed * 3.7 + x * 11.7 + y * 19.3 + z * 13.9)) - 0.5);
            return Math.max(0.7, wobbleTerm * randomTerm);
        }

        for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var thetaNext = (latNumber + 1) * Math.PI / latitudeBands;
            var sinThetaNext = Math.sin(thetaNext);
            var cosThetaNext = Math.cos(thetaNext);

            for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var phiNext = (longNumber + 1) * 2 * Math.PI / longitudeBands;
                var sinPhiNext = Math.sin(phiNext);
                var cosPhiNext = Math.cos(phiNext);

                var n1 = rockNoise(seed, cosPhi * sinTheta, cosTheta, sinPhi * sinTheta);
                var x1 = center[0] + radius * cosPhi * sinTheta * n1;
                var y1 = center[1] + radius * cosTheta * n1;
                var z1 = center[2] + radius * sinPhi * sinTheta * n1;
                points.push(vec4(x1, y1, z1, 1.0)); colors.push(color);

                var n2 = rockNoise(seed, cosPhi * sinThetaNext, cosThetaNext, sinPhi * sinThetaNext);
                var x2 = center[0] + radius * cosPhi * sinThetaNext * n2;
                var y2 = center[1] + radius * cosThetaNext * n2;
                var z2 = center[2] + radius * sinPhi * sinThetaNext * n2;
                points.push(vec4(x2, y2, z2, 1.0)); colors.push(color);

                var n3 = rockNoise(seed, cosPhiNext * sinThetaNext, cosThetaNext, sinPhiNext * sinThetaNext);
                var x3 = center[0] + radius * cosPhiNext * sinThetaNext * n3;
                var y3 = center[1] + radius * cosThetaNext * n3;
                var z3 = center[2] + radius * sinPhiNext * sinThetaNext * n3;
                points.push(vec4(x3, y3, z3, 1.0)); colors.push(color);

                points.push(vec4(x1, y1, z1, 1.0)); colors.push(color);
                points.push(vec4(x3, y3, z3, 1.0)); colors.push(color);

                var n4 = rockNoise(seed, cosPhiNext * sinTheta, cosTheta, sinPhiNext * sinTheta);
                var x4 = center[0] + radius * cosPhiNext * sinTheta * n4;
                var y4 = center[1] + radius * cosTheta * n4;
                var z4 = center[2] + radius * sinPhiNext * sinTheta * n4;
                points.push(vec4(x4, y4, z4, 1.0)); colors.push(color);
            }
        }
    }

    function createSnowField() {
        // Height-mapped snow sheet with a vertical skirt to seal the edges.
        var baseY = -0.24;
        var amp = 0.06;
        var floorY = -0.5 + 0.0005;
        var nx = 36;
        var nz = 28;
        var minX = -0.45;
        var maxX = 0.35;
        var minZ = -0.45;
        var maxZ = 0.45;
        function heightFn(x, z) {
            // Blend sinusoids for gentle drifts across the field.
            var h1 = Math.sin(x * 6.0) * 0.5 + Math.cos(z * 5.0) * 0.5;
            var h2 = Math.sin((x + z) * 3.0) * 0.3;
            var h = (h1 + h2) * 0.5;
            return baseY + amp * h;
        }
        var dx = (maxX - minX) / nx;
        var dz = (maxZ - minZ) / nz;
        function snowColor(y) {
            // Slightly tint snow brighter at higher elevations.
            var t = (y - (baseY - amp)) / (2 * amp);
            t = Math.max(0.0, Math.min(1.0, t));
            var r = 0.92 + 0.05 * t;
            var g = 0.94 + 0.04 * t;
            var b = 0.98 + 0.01 * t;
            return vec4(r, g, b, 1.0);
        }
        for (var ix = 0; ix < nx; ix++) {
            for (var iz = 0; iz < nz; iz++) {
                var x0 = minX + ix * dx;
                var x1 = x0 + dx;
                var z0 = minZ + iz * dz;
                var z1 = z0 + dz;
                var y00 = heightFn(x0, z0);
                var y10 = heightFn(x1, z0);
                var y11 = heightFn(x1, z1);
                var y01 = heightFn(x0, z1);
                var c00 = snowColor(y00);
                var c10 = snowColor(y10);
                var c11 = snowColor(y11);
                var c01 = snowColor(y01);
                var v00 = vec4(x0, y00, z0, 1.0);
                var v10 = vec4(x1, y10, z0, 1.0);
                var v11 = vec4(x1, y11, z1, 1.0);
                var v01 = vec4(x0, y01, z1, 1.0);
                emitQuadColored(v00, c00, v10, c10, v11, c11, v01, c01);
            }
        }
        function skirtColor(y) {
            // Fade the vertical skirt toward ground white.
            var t = (y - floorY) / Math.max(0.0001, (baseY + amp - floorY));
            t = Math.max(0.0, Math.min(1.0, t));
            var r = 0.90 + 0.06 * t;
            var g = 0.92 + 0.05 * t;
            var b = 0.96 + 0.03 * t;
            return vec4(r, g, b, 1.0);
        }
        for (var iz1 = 0; iz1 < nz; iz1++) {
            var z0 = minZ + iz1 * dz;
            var z1 = z0 + dz;
            var y0 = heightFn(minX, z0);
            var y1 = heightFn(minX, z1);
            var c0 = skirtColor(y0);
            var c1 = skirtColor(y1);
            var cb = skirtColor(floorY);
            var vTop0 = vec4(minX, y0, z0, 1.0);
            var vTop1 = vec4(minX, y1, z1, 1.0);
            var vBottom1 = vec4(minX, floorY, z1, 1.0);
            var vBottom0 = vec4(minX, floorY, z0, 1.0);
            emitQuadColored(vTop0, c0, vTop1, c1, vBottom1, cb, vBottom0, cb);
        }
        for (var iz2 = 0; iz2 < nz; iz2++) {
            var z0r = minZ + iz2 * dz;
            var z1r = z0r + dz;
            var y0r = heightFn(maxX, z0r);
            var y1r = heightFn(maxX, z1r);
            var c0r = skirtColor(y0r);
            var c1r = skirtColor(y1r);
            var cbr = skirtColor(floorY);
            var vTop0r = vec4(maxX, y0r, z0r, 1.0);
            var vTop1r = vec4(maxX, y1r, z1r, 1.0);
            var vBottom0r = vec4(maxX, floorY, z0r, 1.0);
            var vBottom1r = vec4(maxX, floorY, z1r, 1.0);
            emitQuadColored(vTop0r, c0r, vBottom0r, cbr, vBottom1r, cbr, vTop1r, c1r);
        }
        for (var ix2 = 0; ix2 < nx; ix2++) {
            var x0 = minX + ix2 * dx;
            var x1 = x0 + dx;
            var y0f = heightFn(x0, minZ);
            var y1f = heightFn(x1, minZ);
            var c0f = skirtColor(y0f);
            var c1f = skirtColor(y1f);
            var cbf = skirtColor(floorY);
            var vTop0f = vec4(x0, y0f, minZ, 1.0);
            var vTop1f = vec4(x1, y1f, minZ, 1.0);
            var vBottom1f = vec4(x1, floorY, minZ, 1.0);
            var vBottom0f = vec4(x0, floorY, minZ, 1.0);
            emitQuadColored(vTop0f, c0f, vTop1f, c1f, vBottom1f, cbf, vBottom0f, cbf);
        }
        for (var ix3 = 0; ix3 < nx; ix3++) {
            var x0b = minX + ix3 * dx;
            var x1b = x0b + dx;
            var y0b = heightFn(x0b, maxZ);
            var y1b = heightFn(x1b, maxZ);
            var c0b = skirtColor(y0b);
            var c1b = skirtColor(y1b);
            var cbb = skirtColor(floorY);
            var vTop0b = vec4(x0b, y0b, maxZ, 1.0);
            var vTop1b = vec4(x1b, y1b, maxZ, 1.0);
            var vBottom0b = vec4(x0b, floorY, maxZ, 1.0);
            var vBottom1b = vec4(x1b, floorY, maxZ, 1.0);
            emitQuadColored(vTop0b, c0b, vBottom0b, cbb, vBottom1b, cbb, vTop1b, c1b);
        }
    }

    function createPortalLightBeam() {
        // Alpha-blended quad to spotlight the portal exit.
        var beamColor = vec4(1.0, 1.0, 1.0, 0.7);
        var xCenter = 0.38;
        var yBottom = -0.5;
        var yTop = 1.0;
        var zCenter = 0.0;
        var beamDepth = 0.22;
        var v1 = vec4(xCenter, yBottom, zCenter - beamDepth, 1.0);
        var v2 = vec4(xCenter, yTop, zCenter - beamDepth, 1.0);
        var v3 = vec4(xCenter, yTop, zCenter + beamDepth, 1.0);
        var v4 = vec4(xCenter, yBottom, zCenter + beamDepth, 1.0);
        emitQuad(v1, v2, v3, v4, beamColor);
    }

    global.createSnowCliffs = createSnowCliffs;
    global.createGravestones = createGravestones;
    global.createSnowRocks = createSnowRocks;
    global.createSnowField = createSnowField;
    global.createPortalLightBeam = createPortalLightBeam;
})(this);