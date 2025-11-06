(function (global) {
    // 설원 포털에 필요한 절벽, 바위, 기복 있는 눈밭, 포털 조명을 생성.
    function createSnowCliffs() {
    // 포털을 감싸는 앞/뒤 절벽을 여러 층으로 구성.
        var frontCliffColor = vec4(0.7, 0.85, 0.95, 0.85);
        var frontCliffDark = vec4(0.5, 0.65, 0.8, 0.8);
        var xOffset = 0.24;
        var zFrontOffset = -0.15;
        var cliffScaleY = 2.8;
        var cliffScaleYBack = 3.4;
        var cliffScaleZFront = 1.7;
        var frontCliffVertices = [
            vec4(-0.08 + xOffset, -0.5 * cliffScaleY, (0.5 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(-0.04 + xOffset, 0.2 * cliffScaleY, (0.5 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(0.0 + xOffset, 0.35 * cliffScaleY, (0.35 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(0.04 + xOffset, 0.15 * cliffScaleY, (0.2 + zFrontOffset) * cliffScaleZFront, 1.0),
            vec4(0.08 + xOffset, -0.5 * cliffScaleY, (0.15 + zFrontOffset) * cliffScaleZFront, 1.0)
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
            vec4(-0.08 + xOffset, -0.5 * cliffScaleYBack, (-0.5 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(-0.04 + xOffset, 0.18 * cliffScaleYBack, (-0.5 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(0.0 + xOffset, 0.33 * cliffScaleYBack, (-0.35 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(0.04 + xOffset, 0.13 * cliffScaleYBack, (-0.2 + zBackOffset) * cliffScaleZBack, 1.0),
            vec4(0.08 + xOffset, -0.5 * cliffScaleYBack, (-0.15 + zBackOffset) * cliffScaleZBack, 1.0)
        ];
        for (var j = 1; j < backCliffVertices.length - 1; j++) {
            points.push(backCliffVertices[0]); colors.push(backCliffColor);
            points.push(backCliffVertices[j]); colors.push(backCliffDark);
            points.push(backCliffVertices[j + 1]); colors.push(backCliffColor);
        }
    }

    function createSnowRocks() {
    // 묘비와 불규칙한 바위를 노이즈로 조형해 다양성을 확보.
        function createGravestones() {
            // 눈밭 주변에 간단한 직사각형 묘비를 배치.
            var baseY = -0.24;
            var gravestoneHeight = 0.13 * 1.15;
            var gravestoneWidth = 0.04 * 1.10;
            var gravestoneDepth = 0.02;
            var minX = -0.45;
            var maxX = 0.35;
            var minZ = -0.45;
            var maxZ = 0.45;
            var xs = [minX + 0.36, minX + 0.36, maxX - 0.36, maxX - 0.36];
            var zs = [
                minZ + 0.36 + (Math.random() - 0.5) * 0.04 + 0.03,
                maxZ - 0.36 + (Math.random() - 0.5) * 0.04 + 0.06 + 0.08,
                minZ + 0.36 + (Math.random() - 0.5) * 0.04,
                maxZ - 0.36 + (Math.random() - 0.5) * 0.04
            ];
            var color = vec4(0.55, 0.54, 0.52, 1.0);
            for (var i = 0; i < 4; i++) {
                var cx = xs[i];
                var cz = zs[i];
                var cy = baseY + gravestoneHeight / 2.0;
                var d = gravestoneDepth / 2.0;
                var h = gravestoneHeight / 2.0;
                var w = gravestoneWidth / 2.0;
                var v = [
                    vec4(cx - d, cy - h, cz - w, 1.0),
                    vec4(cx + d, cy - h, cz - w, 1.0),
                    vec4(cx + d, cy + h, cz - w, 1.0),
                    vec4(cx - d, cy + h, cz - w, 1.0),
                    vec4(cx - d, cy - h, cz + w, 1.0),
                    vec4(cx + d, cy - h, cz + w, 1.0),
                    vec4(cx + d, cy + h, cz + w, 1.0),
                    vec4(cx - d, cy + h, cz + w, 1.0)
                ];
                var faces = [
                    [0, 1, 2, 3],
                    [5, 4, 7, 6],
                    [4, 0, 3, 7],
                    [1, 5, 6, 2],
                    [3, 2, 6, 7],
                    [4, 5, 1, 0]
                ];
                for (var f = 0; f < faces.length; f++) {
                    var idx = faces[f];
                    points.push(v[idx[0]]); colors.push(color);
                    points.push(v[idx[1]]); colors.push(color);
                    points.push(v[idx[2]]); colors.push(color);
                    points.push(v[idx[0]]); colors.push(color);
                    points.push(v[idx[2]]); colors.push(color);
                    points.push(v[idx[3]]); colors.push(color);
                }
            }
        }
        createGravestones();
        var baseY = -0.24;
        var minX = -0.45;
        var maxX = 0.35;
        var minZ = -0.45;
        var maxZ = 0.45;
        var x1 = minX + (maxX - minX) * (1 / 3) - 0.08;
        var x2 = minX + (maxX - minX) * (1 / 2) - 0.08;
        var x3 = minX + (maxX - minX) * (1.2) + 0.08 - 0.25 - 0.125;
        var rocks = [
            { center: vec3(x1, baseY - 0.09 * 0.2, minZ + 0.13), radius: 0.09, color: vec4(0.78, 0.75, 0.72, 1.0) },
            { center: vec3(x2, baseY - 0.07 * 0.2, minZ + 0.13), radius: 0.07, color: vec4(0.72, 0.68, 0.65, 1.0) },
            { center: vec3(x3, baseY - 0.11 * 0.2, maxZ - 0.13), radius: 0.11, color: vec4(0.80, 0.77, 0.74, 1.0) }
        ];
        var latitudeBands = 18;
        var longitudeBands = 18;
        function rockNoise(seed, x, y, z) {
            // 구가 완벽히 둥글어 보이지 않도록 결정적 흔들림을 더한다.
            var curve = 0.98 + 0.08 * Math.sin(seed * 0.1 + x * 2.3 + y * 1.7 + z * 2.1);
            var rand = 0.97 + 0.11 * (Math.abs(Math.sin(seed * 1000 + x * 13.7 + y * 17.3 + z * 19.1)));
            return curve * rand;
        }
        for (var r = 0; r < rocks.length; r++) {
            var c = rocks[r].center;
            var radius = rocks[r].radius;
            var rockColor = rocks[r].color;
            var seed = 1234 + r * 777;
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
                    var x1 = c[0] + radius * cosPhi * sinTheta * n1;
                    var y1 = c[1] + radius * cosTheta * n1;
                    var z1 = c[2] + radius * sinPhi * sinTheta * n1;
                    points.push(vec4(x1, y1, z1, 1.0)); colors.push(rockColor);
                    var n2 = rockNoise(seed, cosPhi * sinThetaNext, cosThetaNext, sinPhi * sinThetaNext);
                    var x2 = c[0] + radius * cosPhi * sinThetaNext * n2;
                    var y2 = c[1] + radius * cosThetaNext * n2;
                    var z2 = c[2] + radius * sinPhi * sinThetaNext * n2;
                    points.push(vec4(x2, y2, z2, 1.0)); colors.push(rockColor);
                    var n3 = rockNoise(seed, cosPhiNext * sinThetaNext, cosThetaNext, sinPhiNext * sinThetaNext);
                    var x3 = c[0] + radius * cosPhiNext * sinThetaNext * n3;
                    var y3 = c[1] + radius * cosThetaNext * n3;
                    var z3 = c[2] + radius * sinPhiNext * sinThetaNext * n3;
                    points.push(vec4(x3, y3, z3, 1.0)); colors.push(rockColor);
                    points.push(vec4(x1, y1, z1, 1.0)); colors.push(rockColor);
                    points.push(vec4(x3, y3, z3, 1.0)); colors.push(rockColor);
                    var n4 = rockNoise(seed, cosPhiNext * sinTheta, cosTheta, sinPhiNext * sinTheta);
                    var x4 = c[0] + radius * cosPhiNext * sinTheta * n4;
                    var y4 = c[1] + radius * cosTheta * n4;
                    var z4 = c[2] + radius * sinPhiNext * sinTheta * n4;
                    points.push(vec4(x4, y4, z4, 1.0)); colors.push(rockColor);
                }
            }
        }
    }

    function createSnowField() {
    // 하이트 맵 기반 눈판 위에 수직 스커트를 추가해 가장자리를 덮는다.
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
            // 사인파를 섞어 부드러운 눈 언덕을 만든다.
            var h1 = Math.sin(x * 6.0) * 0.5 + Math.cos(z * 5.0) * 0.5;
            var h2 = Math.sin((x + z) * 3.0) * 0.3;
            var h = (h1 + h2) * 0.5;
            return baseY + amp * h;
        }
        var dx = (maxX - minX) / nx;
        var dz = (maxZ - minZ) / nz;
        function snowColor(y) {
            // 고도가 높을수록 눈 색을 조금 더 밝게 조정.
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
                points.push(vec4(x0, y00, z0, 1.0)); colors.push(c00);
                points.push(vec4(x1, y10, z0, 1.0)); colors.push(c10);
                points.push(vec4(x1, y11, z1, 1.0)); colors.push(c11);
                points.push(vec4(x0, y00, z0, 1.0)); colors.push(c00);
                points.push(vec4(x1, y11, z1, 1.0)); colors.push(c11);
                points.push(vec4(x0, y01, z1, 1.0)); colors.push(c01);
            }
        }
        function skirtColor(y) {
            // 스커트가 바닥 근처에서 자연스럽게 흰색으로 사라지도록 처리.
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
            points.push(vec4(minX, y0, z0, 1.0)); colors.push(c0);
            points.push(vec4(minX, y1, z1, 1.0)); colors.push(c1);
            points.push(vec4(minX, floorY, z1, 1.0)); colors.push(cb);
            points.push(vec4(minX, y0, z0, 1.0)); colors.push(c0);
            points.push(vec4(minX, floorY, z1, 1.0)); colors.push(cb);
            points.push(vec4(minX, floorY, z0, 1.0)); colors.push(cb);
        }
        for (var iz2 = 0; iz2 < nz; iz2++) {
            var z0r = minZ + iz2 * dz;
            var z1r = z0r + dz;
            var y0r = heightFn(maxX, z0r);
            var y1r = heightFn(maxX, z1r);
            var c0r = skirtColor(y0r);
            var c1r = skirtColor(y1r);
            var cbr = skirtColor(floorY);
            points.push(vec4(maxX, y0r, z0r, 1.0)); colors.push(c0r);
            points.push(vec4(maxX, floorY, z1r, 1.0)); colors.push(cbr);
            points.push(vec4(maxX, y1r, z1r, 1.0)); colors.push(c1r);
            points.push(vec4(maxX, y0r, z0r, 1.0)); colors.push(c0r);
            points.push(vec4(maxX, floorY, z0r, 1.0)); colors.push(cbr);
            points.push(vec4(maxX, floorY, z1r, 1.0)); colors.push(cbr);
        }
        for (var ix2 = 0; ix2 < nx; ix2++) {
            var x0 = minX + ix2 * dx;
            var x1 = x0 + dx;
            var y0f = heightFn(x0, minZ);
            var y1f = heightFn(x1, minZ);
            var c0f = skirtColor(y0f);
            var c1f = skirtColor(y1f);
            var cbf = skirtColor(floorY);
            points.push(vec4(x0, y0f, minZ, 1.0)); colors.push(c0f);
            points.push(vec4(x1, y1f, minZ, 1.0)); colors.push(c1f);
            points.push(vec4(x1, floorY, minZ, 1.0)); colors.push(cbf);
            points.push(vec4(x0, y0f, minZ, 1.0)); colors.push(c0f);
            points.push(vec4(x1, floorY, minZ, 1.0)); colors.push(cbf);
            points.push(vec4(x0, floorY, minZ, 1.0)); colors.push(cbf);
        }
        for (var ix3 = 0; ix3 < nx; ix3++) {
            var x0b = minX + ix3 * dx;
            var x1b = x0b + dx;
            var y0b = heightFn(x0b, maxZ);
            var y1b = heightFn(x1b, maxZ);
            var c0b = skirtColor(y0b);
            var c1b = skirtColor(y1b);
            var cbb = skirtColor(floorY);
            points.push(vec4(x0b, y0b, maxZ, 1.0)); colors.push(c0b);
            points.push(vec4(x1b, floorY, maxZ, 1.0)); colors.push(cbb);
            points.push(vec4(x1b, y1b, maxZ, 1.0)); colors.push(c1b);
            points.push(vec4(x0b, y0b, maxZ, 1.0)); colors.push(c0b);
            points.push(vec4(x0b, floorY, maxZ, 1.0)); colors.push(cbb);
            points.push(vec4(x1b, floorY, maxZ, 1.0)); colors.push(cbb);
        }
    }

    function createPortalLightBeam() {
    // 포털 출구를 강조하기 위한 알파 블렌딩 광선.
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
        points.push(v1); colors.push(beamColor);
        points.push(v2); colors.push(beamColor);
        points.push(v3); colors.push(beamColor);
        points.push(v1); colors.push(beamColor);
        points.push(v3); colors.push(beamColor);
        points.push(v4); colors.push(beamColor);
    }

    global.createSnowCliffs = createSnowCliffs;
    global.createSnowRocks = createSnowRocks;
    global.createSnowField = createSnowField;
    global.createPortalLightBeam = createPortalLightBeam;
})(this);
