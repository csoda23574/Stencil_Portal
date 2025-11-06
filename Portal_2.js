(function (global) {
    // Ruins portal geometry: pillars, archway, guardian creature, and light particles.
    function createRuinsPillars() {
        // Cluster of broken pillars placed with slightly different heights and tones.
        var pillarColor1 = vec4(0.35, 0.30, 0.25, 1.0);
        var pillarColor2 = vec4(0.30, 0.28, 0.26, 1.0);
        var pillarColor3 = vec4(0.40, 0.32, 0.25, 1.0);
        createPillar(0.15, -0.5, -0.25, 0.06, 0.35, pillarColor1);
        createPillar(0.2, -0.5, 0.0, 0.05, 0.42, pillarColor2);
        createPillar(0.1, -0.5, 0.22, 0.055, 0.38, pillarColor3);
        createPillar(-0.05, -0.5, -0.15, 0.05, 0.18, pillarColor1);
        createPillar(-0.1, -0.5, 0.15, 0.045, 0.15, pillarColor2);
    }

    function createPillar(x, baseY, z, radius, height, color) {
        // Build a low-poly column and shade alternate sides for simple lighting.
        var segments = 12;
        var darkColor = vec4(color[0] * 0.7, color[1] * 0.7, color[2] * 0.7, 1.0);
        var topY = baseY + height;
        for (var i = 0; i < segments; i++) {
            var theta1 = (i / segments) * 2 * Math.PI;
            var theta2 = ((i + 1) / segments) * 2 * Math.PI;
            var x1 = x + radius * Math.cos(theta1);
            var z1 = z + radius * Math.sin(theta1);
            var x2 = x + radius * Math.cos(theta2);
            var z2 = z + radius * Math.sin(theta2);
            var sideColor = (i < segments / 2) ? color : darkColor;
            points.push(vec4(x1, baseY, z1, 1.0)); colors.push(sideColor);
            points.push(vec4(x1, topY, z1, 1.0)); colors.push(sideColor);
            points.push(vec4(x2, topY, z2, 1.0)); colors.push(sideColor);
            points.push(vec4(x1, baseY, z1, 1.0)); colors.push(sideColor);
            points.push(vec4(x2, topY, z2, 1.0)); colors.push(sideColor);
            points.push(vec4(x2, baseY, z2, 1.0)); colors.push(sideColor);
        }
        var center = vec4(x, topY, z, 1.0);
        for (var j = 0; j < segments; j++) {
            var t1 = (j / segments) * 2 * Math.PI;
            var t2 = ((j + 1) / segments) * 2 * Math.PI;
            var xTop1 = x + radius * Math.cos(t1);
            var zTop1 = z + radius * Math.sin(t1);
            var xTop2 = x + radius * Math.cos(t2);
            var zTop2 = z + radius * Math.sin(t2);
            points.push(center); colors.push(color);
            points.push(vec4(xTop1, topY, zTop1, 1.0)); colors.push(color);
            points.push(vec4(xTop2, topY, zTop2, 1.0)); colors.push(color);
        }
    }

    function createRuinsArch() {
        // Standing archway composed of two columns and a curved lintel.
        var archColor = vec4(0.38, 0.32, 0.28, 1.0);
        var darkArchColor = vec4(0.28, 0.24, 0.20, 1.0);
        var centerX = 0.3;
        var baseY = -0.5;
        var centerZ = -0.05;
        var width = 0.3;
        var height = 0.35;
        var thickness = 0.08;
        createArchPillar(centerX, baseY, centerZ - width / 2, thickness, height * 0.8, archColor, darkArchColor);
        createArchPillar(centerX, baseY, centerZ + width / 2, thickness, height * 0.8, archColor, darkArchColor);
        createArchTop(centerX, baseY + height * 0.8, centerZ, width, height * 0.2, thickness, archColor, darkArchColor);
    }

    function createArchPillar(x, baseY, z, width, height, color, darkColor) {
        // Extrude a rectangular prism with lit and shaded faces.
        var halfW = width / 2;
        var v1 = vec4(x - halfW, baseY, z - halfW, 1.0);
        var v2 = vec4(x - halfW, baseY, z + halfW, 1.0);
        var v3 = vec4(x + halfW, baseY, z + halfW, 1.0);
        var v4 = vec4(x + halfW, baseY, z - halfW, 1.0);
        var v5 = vec4(x - halfW, baseY + height, z - halfW, 1.0);
        var v6 = vec4(x - halfW, baseY + height, z + halfW, 1.0);
        var v7 = vec4(x + halfW, baseY + height, z + halfW, 1.0);
        var v8 = vec4(x + halfW, baseY + height, z - halfW, 1.0);
        points.push(v1); colors.push(color);
        points.push(v5); colors.push(color);
        points.push(v6); colors.push(color);
        points.push(v1); colors.push(color);
        points.push(v6); colors.push(color);
        points.push(v2); colors.push(color);
        points.push(v4); colors.push(darkColor);
        points.push(v3); colors.push(darkColor);
        points.push(v7); colors.push(darkColor);
        points.push(v4); colors.push(darkColor);
        points.push(v7); colors.push(darkColor);
        points.push(v8); colors.push(darkColor);
        points.push(v1); colors.push(color);
        points.push(v4); colors.push(color);
        points.push(v8); colors.push(color);
        points.push(v1); colors.push(color);
        points.push(v8); colors.push(color);
        points.push(v5); colors.push(color);
        points.push(v2); colors.push(color);
        points.push(v6); colors.push(color);
        points.push(v7); colors.push(color);
        points.push(v2); colors.push(color);
        points.push(v7); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v5); colors.push(color);
        points.push(v6); colors.push(color);
        points.push(v7); colors.push(color);
        points.push(v5); colors.push(color);
        points.push(v7); colors.push(color);
        points.push(v8); colors.push(color);
    }

    function createArchTop(centerX, baseY, centerZ, width, height, thickness, color, darkColor) {
        // Approximate a curved top by stepping through semi-circular segments.
        var segments = 8;
        var halfW = width / 2;
        var halfT = thickness / 2;
        for (var i = 0; i < segments - 1; i++) {
            var angle1 = Math.PI * (i / segments);
            var angle2 = Math.PI * ((i + 1) / segments);
            var z1 = centerZ + halfW * Math.cos(angle1);
            var y1 = baseY + height * Math.sin(angle1);
            var z2 = centerZ + halfW * Math.cos(angle2);
            var y2 = baseY + height * Math.sin(angle2);
            var v1f = vec4(centerX - halfT, y1, z1, 1.0);
            var v2f = vec4(centerX - halfT, y2, z2, 1.0);
            var v3f = vec4(centerX - halfT, baseY, z2, 1.0);
            var v4f = vec4(centerX - halfT, baseY, z1, 1.0);
            points.push(v1f); colors.push(color);
            points.push(v2f); colors.push(color);
            points.push(v3f); colors.push(color);
            points.push(v1f); colors.push(color);
            points.push(v3f); colors.push(color);
            points.push(v4f); colors.push(color);
            var v1b = vec4(centerX + halfT, y1, z1, 1.0);
            var v2b = vec4(centerX + halfT, y2, z2, 1.0);
            var v3b = vec4(centerX + halfT, baseY, z2, 1.0);
            var v4b = vec4(centerX + halfT, baseY, z1, 1.0);
            points.push(v1b); colors.push(darkColor);
            points.push(v4b); colors.push(darkColor);
            points.push(v3b); colors.push(darkColor);
            points.push(v1b); colors.push(darkColor);
            points.push(v3b); colors.push(darkColor);
            points.push(v2b); colors.push(darkColor);
        }
    }

    function createRuinsLight() {
        // Floating quads serve as dust motes and beams around the arch.
        var particleCount = 80;
        var particleSize = 0.008;
        var lightColors = [
            vec4(1.0, 0.8, 0.3, 1.0),
            vec4(0.9, 0.7, 0.2, 1.0),
            vec4(1.0, 0.9, 0.5, 1.0),
            vec4(0.7, 0.85, 1.0, 1.0)
        ];
        for (var i = 0; i < particleCount; i++) {
            var x = -0.3 + Math.random() * 0.5;
            var y = -0.5 + Math.random() * 0.5;
            var z = (Math.random() - 0.5) * 0.6;
            var colorIndex = Math.floor(Math.random() * lightColors.length);
            var particleColor = lightColors[colorIndex];
            var size = particleSize * (0.5 + Math.random() * 1.5);
            var v1 = vec4(x, y - size, z - size, 1.0);
            var v2 = vec4(x, y - size, z + size, 1.0);
            var v3 = vec4(x, y + size, z + size, 1.0);
            var v4 = vec4(x, y + size, z - size, 1.0);
            points.push(v1); colors.push(particleColor);
            points.push(v2); colors.push(particleColor);
            points.push(v3); colors.push(particleColor);
            points.push(v1); colors.push(particleColor);
            points.push(v3); colors.push(particleColor);
            points.push(v4); colors.push(particleColor);
        }
    }

    function createRuinsGuardian() {
        // Build a segmented flying guardian that snakes through the ruins.
        var segments = 12;
        var totalLength = 0.8;
        var segmentLength = totalLength / segments;
        var baseZ = 0.0;
        var baseX = 0.4;
        var baseY = 0.05;
        createGuardianHead(baseX, baseY, baseZ);
        for (var i = 0; i < segments; i++) {
            var t = i / segments;
            var x = baseX - t * totalLength;
            var waveY = Math.sin(t * Math.PI) * 0.08;
            var y = baseY + waveY;
            var waveZ = Math.sin(t * Math.PI * 2) * 0.05;
            var z = baseZ + waveZ;
            var size;
            if (t < 0.2) {
                size = 0.3 + t * 2.0;
            } else if (t < 0.7) {
                size = 0.7;
            } else {
                size = 0.7 - (t - 0.7) * 2.0;
            }
            var width = 0.06 * size;
            var height = 0.04 * size;
            createGuardianSegment(x, y, z, segmentLength * 1.2, width, height);
        }
        createGuardianFins(baseX - totalLength * 0.3, baseY + 0.04, baseZ, 0.3);
        createGuardianFins(baseX - totalLength * 0.6, baseY + 0.02, baseZ, 0.25);
    }

    function createGuardianSegment(centerX, centerY, centerZ, length, width, height) {
        // Capsule segment with simple rim lighting to convey curvature.
        var bodyColor = vec4(0.38, 0.32, 0.28, 1.0);
        var darkBodyColor = vec4(0.25, 0.20, 0.16, 1.0);
        var brightColor = vec4(0.45, 0.38, 0.32, 1.0);
        var circleSegments = 8;
        for (var s = 0; s < circleSegments; s++) {
            var theta1 = (s / circleSegments) * 2 * Math.PI;
            var theta2 = ((s + 1) / circleSegments) * 2 * Math.PI;
            var y1_front = centerY + width * Math.cos(theta1);
            var z1_front = centerZ + height * Math.sin(theta1);
            var y2_front = centerY + width * Math.cos(theta2);
            var z2_front = centerZ + height * Math.sin(theta2);
            var backScale = 0.95;
            var y1_back = centerY + width * backScale * Math.cos(theta1);
            var z1_back = centerZ + height * backScale * Math.sin(theta1);
            var y2_back = centerY + width * backScale * Math.cos(theta2);
            var z2_back = centerZ + height * backScale * Math.sin(theta2);
            var xFront = centerX - length / 2;
            var xBack = centerX + length / 2;
            var color;
            if (theta1 < Math.PI * 0.4 || theta1 > Math.PI * 1.6) {
                color = brightColor;
            } else if (theta1 > Math.PI * 0.6 && theta1 < Math.PI * 1.4) {
                color = darkBodyColor;
            } else {
                color = bodyColor;
            }
            points.push(vec4(xFront, y1_front, z1_front, 1.0)); colors.push(color);
            points.push(vec4(xBack, y1_back, z1_back, 1.0)); colors.push(color);
            points.push(vec4(xBack, y2_back, z2_back, 1.0)); colors.push(color);
            points.push(vec4(xFront, y1_front, z1_front, 1.0)); colors.push(color);
            points.push(vec4(xBack, y2_back, z2_back, 1.0)); colors.push(color);
            points.push(vec4(xFront, y2_front, z2_front, 1.0)); colors.push(color);
        }
    }

    function createGuardianHead(centerX, centerY, centerZ) {
        // Layered rings taper into a sharp head to lead the guardian.
        var headColor = vec4(0.40, 0.34, 0.30, 1.0);
        var darkHeadColor = vec4(0.28, 0.22, 0.18, 1.0);
        var brightHeadColor = vec4(0.48, 0.40, 0.34, 1.0);
        var headLength = 0.10;
        var headBaseWidth = 0.08;
        var segments = 6;
        var rings = 5;
        for (var r = 0; r < rings; r++) {
            var t1 = r / rings;
            var t2 = (r + 1) / rings;
            var scale1 = 1.0 - t1 * t1;
            var scale2 = 1.0 - t2 * t2;
            var x1 = centerX - t1 * headLength;
            var x2 = centerX - t2 * headLength;
            for (var s = 0; s < segments; s++) {
                var theta1 = (s / segments) * 2 * Math.PI;
                var theta2 = ((s + 1) / segments) * 2 * Math.PI;
                var zScale1_1 = Math.sin(theta1) > 0 ? 1.3 : 0.5;
                var zScale1_2 = Math.sin(theta2) > 0 ? 1.3 : 0.5;
                var y1_1 = centerY + headBaseWidth * scale1 * Math.cos(theta1);
                var z1_1 = centerZ + headBaseWidth * scale1 * zScale1_1 * Math.sin(theta1);
                var y1_2 = centerY + headBaseWidth * scale1 * Math.cos(theta2);
                var z1_2 = centerZ + headBaseWidth * scale1 * zScale1_2 * Math.sin(theta2);
                var zScale2_1 = Math.sin(theta1) > 0 ? 1.3 : 0.5;
                var zScale2_2 = Math.sin(theta2) > 0 ? 1.3 : 0.5;
                var y2_1 = centerY + headBaseWidth * scale2 * Math.cos(theta1);
                var z2_1 = centerZ + headBaseWidth * scale2 * zScale2_1 * Math.sin(theta1);
                var y2_2 = centerY + headBaseWidth * scale2 * Math.cos(theta2);
                var z2_2 = centerZ + headBaseWidth * scale2 * zScale2_2 * Math.sin(theta2);
                var color;
                if (theta1 < Math.PI * 0.3 || theta1 > Math.PI * 1.7) {
                    color = brightHeadColor;
                } else if (theta1 > Math.PI * 0.7 && theta1 < Math.PI * 1.3) {
                    color = darkHeadColor;
                } else {
                    color = headColor;
                }
                points.push(vec4(x1, y1_1, z1_1, 1.0)); colors.push(color);
                points.push(vec4(x2, y2_1, z2_1, 1.0)); colors.push(color);
                points.push(vec4(x2, y2_2, z2_2, 1.0)); colors.push(color);
                points.push(vec4(x1, y1_1, z1_1, 1.0)); colors.push(color);
                points.push(vec4(x2, y2_2, z2_2, 1.0)); colors.push(color);
                points.push(vec4(x1, y1_2, z1_2, 1.0)); colors.push(color);
            }
        }
        var tipX = centerX - headLength;
        var tipPoint = vec4(tipX, centerY, centerZ, 1.0);
        for (var j = 0; j < segments; j++) {
            var phi1 = (j / segments) * 2 * Math.PI;
            var phi2 = ((j + 1) / segments) * 2 * Math.PI;
            var zScaleTiny1 = Math.sin(phi1) > 0 ? 1.3 : 0.5;
            var zScaleTiny2 = Math.sin(phi2) > 0 ? 1.3 : 0.5;
            var y1 = centerY + headBaseWidth * 0.05 * Math.cos(phi1);
            var z1 = centerZ + headBaseWidth * 0.05 * zScaleTiny1 * Math.sin(phi1);
            var y2 = centerY + headBaseWidth * 0.05 * Math.cos(phi2);
            var z2 = centerZ + headBaseWidth * 0.05 * zScaleTiny2 * Math.sin(phi2);
            var headShade = (phi1 < Math.PI * 0.5 || phi1 > Math.PI * 1.5) ? brightHeadColor : darkHeadColor;
            points.push(vec4(tipX + 0.01, y1, z1, 1.0)); colors.push(headShade);
            points.push(tipPoint); colors.push(headShade);
            points.push(vec4(tipX + 0.01, y2, z2, 1.0)); colors.push(headShade);
        }
    }

    function createGuardianFins(centerX, centerY, centerZ, finSpan) {
        // Pair of thin tris add motion-suggesting fins to the guardian.
        var finColor = vec4(0.35, 0.30, 0.26, 1.0);
        var darkFinColor = vec4(0.22, 0.18, 0.14, 1.0);
        var finLength = 0.10;
        var finWidth = 0.04;
        var leftTip = vec4(centerX - finLength, centerY - finWidth, centerZ - finSpan / 2, 1.0);
        var leftBase1 = vec4(centerX, centerY + finWidth, centerZ - finWidth * 2, 1.0);
        var leftBase2 = vec4(centerX, centerY - finWidth, centerZ - finWidth * 2, 1.0);
        points.push(leftTip); colors.push(finColor);
        points.push(leftBase1); colors.push(finColor);
        points.push(leftBase2); colors.push(finColor);
        points.push(leftTip); colors.push(darkFinColor);
        points.push(leftBase2); colors.push(darkFinColor);
        points.push(leftBase1); colors.push(darkFinColor);
        var rightTip = vec4(centerX - finLength, centerY - finWidth, centerZ + finSpan / 2, 1.0);
        var rightBase1 = vec4(centerX, centerY + finWidth, centerZ + finWidth * 2, 1.0);
        var rightBase2 = vec4(centerX, centerY - finWidth, centerZ + finWidth * 2, 1.0);
        points.push(rightTip); colors.push(finColor);
        points.push(rightBase2); colors.push(finColor);
        points.push(rightBase1); colors.push(finColor);
        points.push(rightTip); colors.push(darkFinColor);
        points.push(rightBase1); colors.push(darkFinColor);
        points.push(rightBase2); colors.push(darkFinColor);
    }

    global.createRuinsPillars = createRuinsPillars;
    global.createPillar = createPillar;
    global.createRuinsArch = createRuinsArch;
    global.createArchPillar = createArchPillar;
    global.createArchTop = createArchTop;
    global.createRuinsLight = createRuinsLight;
    global.createRuinsGuardian = createRuinsGuardian;
    global.createGuardianSegment = createGuardianSegment;
    global.createGuardianHead = createGuardianHead;
    global.createGuardianFins = createGuardianFins;
})(this);
