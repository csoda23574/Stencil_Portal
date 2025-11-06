(function (global) {
    // Desert portal helpers: dunes, pyramids, sun effects, and floating cloth.
    function createDune(centerX, baseY, centerZ, width, height, sandColor) {
        // Build a semi-spherical dune using stacked rings with subtle color variation.
        var segments = 25;
        var rings = 8;
        for (var r = 0; r < rings; r++) {
            var t1 = r / rings;
            var t2 = (r + 1) / rings;
            var h1 = height * Math.cos(t1 * Math.PI / 2);
            var h2 = height * Math.cos(t2 * Math.PI / 2);
            var y1 = baseY + h1;
            var y2 = baseY + h2;
            var radiusX1 = width * Math.sin(t1 * Math.PI / 2);
            var radiusZ1 = width * 1.5 * Math.sin(t1 * Math.PI / 2);
            var radiusX2 = width * Math.sin(t2 * Math.PI / 2);
            var radiusZ2 = width * 1.5 * Math.sin(t2 * Math.PI / 2);
            for (var s = 0; s < segments; s++) {
                var theta1 = (s / segments) * 2 * Math.PI;
                var theta2 = ((s + 1) / segments) * 2 * Math.PI;
                var x1_1 = centerX + radiusX1 * Math.cos(theta1);
                var z1_1 = centerZ + radiusZ1 * Math.sin(theta1);
                var x1_2 = centerX + radiusX1 * Math.cos(theta2);
                var z1_2 = centerZ + radiusZ1 * Math.sin(theta2);
                var x2_1 = centerX + radiusX2 * Math.cos(theta1);
                var z2_1 = centerZ + radiusZ2 * Math.sin(theta1);
                var x2_2 = centerX + radiusX2 * Math.cos(theta2);
                var z2_2 = centerZ + radiusZ2 * Math.sin(theta2);
                var heightFactor = 1 - r / rings;
                var topColor = vec4(
                    sandColor[0] + heightFactor * 0.05,
                    sandColor[1] + heightFactor * 0.05,
                    sandColor[2] + heightFactor * 0.05,
                    1.0
                );
                points.push(vec4(x1_1, y1, z1_1, 1.0));
                colors.push(sandColor);
                points.push(vec4(x2_1, y2, z2_1, 1.0));
                colors.push(topColor);
                points.push(vec4(x2_2, y2, z2_2, 1.0));
                colors.push(topColor);
                points.push(vec4(x1_1, y1, z1_1, 1.0));
                colors.push(sandColor);
                points.push(vec4(x2_2, y2, z2_2, 1.0));
                colors.push(topColor);
                points.push(vec4(x1_2, y1, z1_2, 1.0));
                colors.push(sandColor);
            }
        }
    }

    function createDesertDunes() {
        // Scatter multiple dunes to break up the foreground.
        createDune(-0.3, -0.5, -0.2, 0.4, 0.15, vec4(0.95, 0.75, 0.45, 1.0));
        createDune(0.2, -0.5, -0.15, 0.5, 0.2, vec4(0.92, 0.70, 0.40, 1.0));
        createDune(0.0, -0.5, 0.1, 0.35, 0.12, vec4(0.98, 0.80, 0.50, 1.0));
    }

    function createMountain() {
        // Split pyramid crest to resemble the Journey-style broken monument.
        var baseY = -0.5;
        var centerZ = -0.45;
        var baseWidth = 0.5;
        var totalHeight = 0.6;
        var topGap = 0.005;
        var splitRatio = 0.9;
        var color = vec4(0.65, 0.55, 0.40, 1.0);
        var brightColor = vec4(color[0] * 1.1, color[1] * 1.1, color[2] * 1.1, 1.0);
        var darkColor = vec4(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8, 1.0);
        var splitHeight = totalHeight * splitRatio;
        var splitY = baseY + splitHeight;
        var splitWidth = baseWidth * (1.0 - splitRatio);
        var base1 = vec4(-baseWidth / 2, baseY, centerZ + baseWidth / 2, 1.0);
        var base2 = vec4(baseWidth / 2, baseY, centerZ + baseWidth / 2, 1.0);
        var base3 = vec4(baseWidth / 2, baseY, centerZ - baseWidth / 2, 1.0);
        var base4 = vec4(-baseWidth / 2, baseY, centerZ - baseWidth / 2, 1.0);
        var split1 = vec4(-splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);
        var split2 = vec4(splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);
        var split3 = vec4(splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);
        var split4 = vec4(-splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);
        points.push(base1); colors.push(brightColor);
        points.push(base2); colors.push(brightColor);
        points.push(split2); colors.push(brightColor);
        points.push(base1); colors.push(brightColor);
        points.push(split2); colors.push(brightColor);
        points.push(split1); colors.push(brightColor);
        points.push(base2); colors.push(color);
        points.push(base3); colors.push(color);
        points.push(split3); colors.push(color);
        points.push(base2); colors.push(color);
        points.push(split3); colors.push(color);
        points.push(split2); colors.push(color);
        points.push(base3); colors.push(darkColor);
        points.push(base4); colors.push(darkColor);
        points.push(split4); colors.push(darkColor);
        points.push(base3); colors.push(darkColor);
        points.push(split4); colors.push(darkColor);
        points.push(split3); colors.push(darkColor);
        points.push(base4); colors.push(color);
        points.push(base1); colors.push(color);
        points.push(split1); colors.push(color);
        points.push(base4); colors.push(color);
        points.push(split1); colors.push(color);
        points.push(split4); colors.push(color);
        var apex_L = vec4(-topGap / 2, baseY + totalHeight, centerZ, 1.0);
        var base_L1 = vec4(-topGap / 2, splitY, centerZ + splitWidth / 2, 1.0);
        var base_L2 = vec4(-splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);
        var base_L3 = vec4(-splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);
        var base_L4 = vec4(-topGap / 2, splitY, centerZ - splitWidth / 2, 1.0);
        points.push(apex_L); colors.push(brightColor);
        points.push(base_L1); colors.push(brightColor);
        points.push(base_L2); colors.push(brightColor);
        points.push(apex_L); colors.push(darkColor);
        points.push(base_L3); colors.push(darkColor);
        points.push(base_L4); colors.push(darkColor);
        points.push(apex_L); colors.push(color);
        points.push(base_L2); colors.push(color);
        points.push(base_L3); colors.push(color);
        points.push(apex_L); colors.push(color);
        points.push(base_L4); colors.push(color);
        points.push(base_L1); colors.push(color);
        var apex_R = vec4(topGap / 2, baseY + totalHeight, centerZ, 1.0);
        var base_R1 = vec4(topGap / 2, splitY, centerZ + splitWidth / 2, 1.0);
        var base_R2 = vec4(splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);
        var base_R3 = vec4(splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);
        var base_R4 = vec4(topGap / 2, splitY, centerZ - splitWidth / 2, 1.0);
        points.push(apex_R); colors.push(brightColor);
        points.push(base_R2); colors.push(brightColor);
        points.push(base_R1); colors.push(brightColor);
        points.push(apex_R); colors.push(darkColor);
        points.push(base_R4); colors.push(darkColor);
        points.push(base_R3); colors.push(darkColor);
        points.push(apex_R); colors.push(color);
        points.push(base_R3); colors.push(color);
        points.push(base_R2); colors.push(color);
        points.push(apex_R); colors.push(color);
        points.push(base_R1); colors.push(color);
        points.push(base_R4); colors.push(color);
    }

    function createDesertSandstorm() {
        // Alpha-blended quads sprinkled in front of the portal to suggest blowing sand.
        var particleCount = 150;
        var particleSize = 0.01;
        var sandColors = [
            vec4(0.9, 0.8, 0.6, 1.0),
            vec4(0.85, 0.75, 0.55, 1.0),
            vec4(0.95, 0.85, 0.65, 1.0),
            vec4(0.88, 0.78, 0.58, 1.0)
        ];
        for (var i = 0; i < particleCount; i++) {
            var x = (Math.random() - 0.5) * 0.8;
            var y = (Math.random() - 0.3) * 0.6;
            var z = -0.1 - Math.random() * 0.35;
            var colorIndex = Math.floor(Math.random() * sandColors.length);
            var particleColor = sandColors[colorIndex];
            var size = particleSize * (0.5 + Math.random() * 1.5);
            var v1 = vec4(x - size, y - size, z, 1.0);
            var v2 = vec4(x + size, y - size, z, 1.0);
            var v3 = vec4(x + size, y + size, z, 1.0);
            var v4 = vec4(x - size, y + size, z, 1.0);
            points.push(v1); colors.push(particleColor);
            points.push(v2); colors.push(particleColor);
            points.push(v3); colors.push(particleColor);
            points.push(v1); colors.push(particleColor);
            points.push(v3); colors.push(particleColor);
            points.push(v4); colors.push(particleColor);
        }
    }

    function createDesertCloth() {
        createFloatingCloth(-0.2, -0.1, 0.0, 0);
        createFloatingCloth(0.15, 0.0, -0.1, 1);
        createFloatingCloth(-0.1, 0.15, 0.15, 2);
    }

    function createFloatingCloth(x, y, z, index) {
        // Each cloth strip gets a phase offset so the sine waves do not sync perfectly.
        var clothColor = vec4(0.85, 0.15, 0.15, 1.0);
        var darkClothColor = vec4(0.65, 0.10, 0.10, 1.0);
        var segments = 15;
        var width = 0.08;
        var length = 0.25;
        for (var i = 0; i < segments; i++) {
            var t1 = i / segments;
            var t2 = (i + 1) / segments;
            var phase = index * Math.PI / 3;
            var wave1 = Math.sin(t1 * Math.PI * 3 + phase) * 0.04;
            var wave2 = Math.sin(t2 * Math.PI * 3 + phase) * 0.04;
            var z1 = z + t1 * length;
            var z2 = z + t2 * length;
            var y1 = y + wave1;
            var y2 = y + wave2;
            var x1_left = x - width / 2;
            var x1_right = x + width / 2;
            points.push(vec4(x1_left, y1, z1, 1.0));
            colors.push(clothColor);
            points.push(vec4(x1_left, y2, z2, 1.0));
            colors.push(clothColor);
            points.push(vec4(x1_right, y2, z2, 1.0));
            colors.push(clothColor);
            points.push(vec4(x1_left, y1, z1, 1.0));
            colors.push(clothColor);
            points.push(vec4(x1_right, y2, z2, 1.0));
            colors.push(clothColor);
            points.push(vec4(x1_right, y1, z1, 1.0));
            colors.push(clothColor);
            points.push(vec4(x1_right, y1, z1, 1.0));
            colors.push(darkClothColor);
            points.push(vec4(x1_right, y2, z2, 1.0));
            colors.push(darkClothColor);
            points.push(vec4(x1_left, y2, z2, 1.0));
            colors.push(darkClothColor);
            points.push(vec4(x1_right, y1, z1, 1.0));
            colors.push(darkClothColor);
            points.push(vec4(x1_left, y2, z2, 1.0));
            colors.push(darkClothColor);
            points.push(vec4(x1_left, y1, z1, 1.0));
            colors.push(darkClothColor);
        }
    }

    function createDesertSun() {
        // Combine a solid sphere and a translucent glow shell for the sun.
        var sunX = 0.0;
        var sunY = 0.3;
        var sunZ = -0.6;
        var coreRadius = 0.1;
        var glowRadius = 0.22;
        var latBands = 25;
        var longBands = 25;
        var sunCoreColor = vec4(1.0, 0.9, 0.3, 1.0);
        createSunSphere(sunX, sunY, sunZ, coreRadius, sunCoreColor, latBands, longBands);
        createSunGlow(sunX, sunY, sunZ, coreRadius, glowRadius, latBands, longBands);
    }

    function createSunSphere(centerX, centerY, centerZ, radius, color, latBands, longBands) {
        // Lat-long tessellation similar to the classic WebGL solar example.
        for (var lat = 0; lat < latBands; lat++) {
            var theta = lat * Math.PI / latBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var thetaNext = (lat + 1) * Math.PI / latBands;
            var sinThetaNext = Math.sin(thetaNext);
            var cosThetaNext = Math.cos(thetaNext);
            for (var lon = 0; lon < longBands; lon++) {
                var phi = lon * 2 * Math.PI / longBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var phiNext = (lon + 1) * 2 * Math.PI / longBands;
                var sinPhiNext = Math.sin(phiNext);
                var cosPhiNext = Math.cos(phiNext);
                var x1 = centerX + radius * cosPhi * sinTheta;
                var y1 = centerY + radius * cosTheta;
                var z1 = centerZ + radius * sinPhi * sinTheta;
                points.push(vec4(x1, y1, z1, 1.0));
                colors.push(color);
                var x2 = centerX + radius * cosPhi * sinThetaNext;
                var y2 = centerY + radius * cosThetaNext;
                var z2 = centerZ + radius * sinPhi * sinThetaNext;
                points.push(vec4(x2, y2, z2, 1.0));
                colors.push(color);
                var x3 = centerX + radius * cosPhiNext * sinThetaNext;
                var y3 = centerY + radius * cosThetaNext;
                var z3 = centerZ + radius * sinPhiNext * sinThetaNext;
                points.push(vec4(x3, y3, z3, 1.0));
                colors.push(color);
                points.push(vec4(x1, y1, z1, 1.0));
                colors.push(color);
                points.push(vec4(x3, y3, z3, 1.0));
                colors.push(color);
                var x4 = centerX + radius * cosPhiNext * sinTheta;
                var y4 = centerY + radius * cosTheta;
                var z4 = centerZ + radius * sinPhiNext * sinTheta;
                points.push(vec4(x4, y4, z4, 1.0));
                colors.push(color);
            }
        }
    }

    function createSunGlow(centerX, centerY, centerZ, innerRadius, outerRadius, latBands, longBands) {
        // The glow uses two radii to create a soft halo with alternating colors.
        for (var lat = 0; lat < latBands; lat++) {
            var theta = lat * Math.PI / latBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var thetaNext = (lat + 1) * Math.PI / latBands;
            var sinThetaNext = Math.sin(thetaNext);
            var cosThetaNext = Math.cos(thetaNext);
            for (var lon = 0; lon < longBands; lon++) {
                var phi = lon * 2 * Math.PI / longBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var phiNext = (lon + 1) * 2 * Math.PI / longBands;
                var sinPhiNext = Math.sin(phiNext);
                var cosPhiNext = Math.cos(phiNext);
                var innerColor = vec4(1.0, 0.95, 0.7, 1.0);
                var outerColor = vec4(1.0, 1.0, 1.0, 1.0);
                var x1_in = centerX + innerRadius * cosPhi * sinTheta;
                var y1_in = centerY + innerRadius * cosTheta;
                var z1_in = centerZ + innerRadius * sinPhi * sinTheta;
                var x2_in = centerX + innerRadius * cosPhi * sinThetaNext;
                var y2_in = centerY + innerRadius * cosThetaNext;
                var z2_in = centerZ + innerRadius * sinPhi * sinThetaNext;
                var x3_in = centerX + innerRadius * cosPhiNext * sinThetaNext;
                var y3_in = centerY + innerRadius * cosThetaNext;
                var z3_in = centerZ + innerRadius * sinPhiNext * sinThetaNext;
                var x4_in = centerX + innerRadius * cosPhiNext * sinTheta;
                var y4_in = centerY + innerRadius * cosTheta;
                var z4_in = centerZ + innerRadius * sinPhiNext * sinTheta;
                var x1_out = centerX + outerRadius * cosPhi * sinTheta;
                var y1_out = centerY + outerRadius * cosTheta;
                var z1_out = centerZ + outerRadius * sinPhi * sinTheta;
                var x2_out = centerX + outerRadius * cosPhi * sinThetaNext;
                var y2_out = centerY + outerRadius * cosThetaNext;
                var z2_out = centerZ + outerRadius * sinPhi * sinThetaNext;
                var x3_out = centerX + outerRadius * cosPhiNext * sinThetaNext;
                var y3_out = centerY + outerRadius * cosThetaNext;
                var z3_out = centerZ + outerRadius * sinPhiNext * sinThetaNext;
                var x4_out = centerX + outerRadius * cosPhiNext * sinTheta;
                var y4_out = centerY + outerRadius * cosTheta;
                var z4_out = centerZ + outerRadius * sinPhiNext * sinTheta;
                points.push(vec4(x1_in, y1_in, z1_in, 1.0)); colors.push(innerColor);
                points.push(vec4(x2_in, y2_in, z2_in, 1.0)); colors.push(innerColor);
                points.push(vec4(x2_out, y2_out, z2_out, 1.0)); colors.push(outerColor);
                points.push(vec4(x1_in, y1_in, z1_in, 1.0)); colors.push(innerColor);
                points.push(vec4(x2_out, y2_out, z2_out, 1.0)); colors.push(outerColor);
                points.push(vec4(x1_out, y1_out, z1_out, 1.0)); colors.push(outerColor);
                points.push(vec4(x2_in, y2_in, z2_in, 1.0)); colors.push(innerColor);
                points.push(vec4(x3_in, y3_in, z3_in, 1.0)); colors.push(innerColor);
                points.push(vec4(x3_out, y3_out, z3_out, 1.0)); colors.push(outerColor);
                points.push(vec4(x2_in, y2_in, z2_in, 1.0)); colors.push(innerColor);
                points.push(vec4(x3_out, y3_out, z3_out, 1.0)); colors.push(outerColor);
                points.push(vec4(x2_out, y2_out, z2_out, 1.0)); colors.push(outerColor);
            }
        }
    }

    global.createDune = createDune;
    global.createDesertDunes = createDesertDunes;
    global.createMountain = createMountain;
    global.createDesertSandstorm = createDesertSandstorm;
    global.createDesertCloth = createDesertCloth;
    global.createFloatingCloth = createFloatingCloth;
    global.createDesertSun = createDesertSun;
    global.createSunSphere = createSunSphere;
    global.createSunGlow = createSunGlow;
})(this);
