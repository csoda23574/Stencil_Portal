(function (global) {
    // 폐허 포털의 기둥, 아치, 수호자, 광입자를 생성하는 도우미.

    /** 사각형 두 개의 삼각형으로 분리해 push */
    function emitQuad(v1, v2, v3, v4, color) {
        points.push(v1); colors.push(color);
        points.push(v2); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v1); colors.push(color);
        points.push(v3); colors.push(color);
        points.push(v4); colors.push(color);
    }

    /** 색상에 배율을 적용(밝기 조정) */
    function scaleColor(color, factor) {
        return vec4(color[0] * factor, color[1] * factor, color[2] * factor, color[3]);
    }

    function resolveFaceColor(faceColors, key, fallback) {
        if (!faceColors) {
            return fallback;
        }
        if (faceColors.length !== undefined && faceColors.length === 4) {
            return faceColors;
        }
        if (faceColors[key]) {
            return faceColors[key];
        }
        if (faceColors.default) {
            return faceColors.default;
        }
        return fallback;
    }

    /**
     * 직육면체 생성: (x, y, z)는 중심
     * length: X축 길이, width: Z축 길이, height: Y축 길이, scale: 전체 스케일
     * faceColors는 {positiveX, negativeX, positiveY, negativeY, positiveZ, negativeZ, default} 구조의 색상 선택(선택사항)
     */
    function createHexahedron(x, y, z, length, width, height, scale, faceColors) {
        var s = scale || 1.0;
        var halfLength = (length * s) / 2;
        var halfWidth = (width * s) / 2;
        var halfHeight = (height * s) / 2;
        var defaultColor = faceColors && faceColors.default ? faceColors.default : vec4(1.0, 1.0, 1.0, 1.0);

        var front = resolveFaceColor(faceColors, "positiveZ", defaultColor);
        var back = resolveFaceColor(faceColors, "negativeZ", defaultColor);
        var right = resolveFaceColor(faceColors, "positiveX", defaultColor);
        var left = resolveFaceColor(faceColors, "negativeX", defaultColor);
        var top = resolveFaceColor(faceColors, "positiveY", defaultColor);
        var bottom = resolveFaceColor(faceColors, "negativeY", defaultColor);

        // +Z 면
        emitQuad(
            vec4(x - halfLength, y - halfHeight, z + halfWidth, 1.0),
            vec4(x + halfLength, y - halfHeight, z + halfWidth, 1.0),
            vec4(x + halfLength, y + halfHeight, z + halfWidth, 1.0),
            vec4(x - halfLength, y + halfHeight, z + halfWidth, 1.0),
            front
        );
        // -Z 면
        emitQuad(
            vec4(x + halfLength, y - halfHeight, z - halfWidth, 1.0),
            vec4(x - halfLength, y - halfHeight, z - halfWidth, 1.0),
            vec4(x - halfLength, y + halfHeight, z - halfWidth, 1.0),
            vec4(x + halfLength, y + halfHeight, z - halfWidth, 1.0),
            back
        );
        // +X 면
        emitQuad(
            vec4(x + halfLength, y - halfHeight, z + halfWidth, 1.0),
            vec4(x + halfLength, y - halfHeight, z - halfWidth, 1.0),
            vec4(x + halfLength, y + halfHeight, z - halfWidth, 1.0),
            vec4(x + halfLength, y + halfHeight, z + halfWidth, 1.0),
            right
        );
        // -X 면
        emitQuad(
            vec4(x - halfLength, y - halfHeight, z - halfWidth, 1.0),
            vec4(x - halfLength, y - halfHeight, z + halfWidth, 1.0),
            vec4(x - halfLength, y + halfHeight, z + halfWidth, 1.0),
            vec4(x - halfLength, y + halfHeight, z - halfWidth, 1.0),
            left
        );
        // +Y 면
        emitQuad(
            vec4(x - halfLength, y + halfHeight, z + halfWidth, 1.0),
            vec4(x + halfLength, y + halfHeight, z + halfWidth, 1.0),
            vec4(x + halfLength, y + halfHeight, z - halfWidth, 1.0),
            vec4(x - halfLength, y + halfHeight, z - halfWidth, 1.0),
            top
        );
        // -Y 면
        emitQuad(
            vec4(x - halfLength, y - halfHeight, z - halfWidth, 1.0),
            vec4(x + halfLength, y - halfHeight, z - halfWidth, 1.0),
            vec4(x + halfLength, y - halfHeight, z + halfWidth, 1.0),
            vec4(x - halfLength, y - halfHeight, z + halfWidth, 1.0),
            bottom
        );
    }

    /** 여러 개의 폐허 기둥을 서로 다른 파라미터로 생성 */
    function createRuinsPillars() {
    // 높이와 색이 조금씩 다른 부서진 기둥들을 묶음으로 배치.
        var pillarColor1 = vec4(0.35, 0.30, 0.25, 1.0);
        var pillarColor2 = vec4(0.30, 0.28, 0.26, 1.0);
        var pillarColor3 = vec4(0.40, 0.32, 0.25, 1.0);
        createPillar(0.15, -0.5, -0.25, 0.06, 0.35, pillarColor1);
        createPillar(0.2, -0.5, 0.0, 0.05, 0.42, pillarColor2);
        createPillar(0.1, -0.5, 0.22, 0.055, 0.38, pillarColor3);
        createPillar(-0.05, -0.5, -0.15, 0.05, 0.18, pillarColor1);
        createPillar(-0.1, -0.5, 0.15, 0.045, 0.15, pillarColor2);
    }

    /** 단일 기둥 생성: 육각 기둥으로 간소화 */
    function createPillar(x, baseY, z, radius, height, color) {
    // createPrism 로직을 그대로 반영해 육각 기둥을 직접 구성한다.
        var pillarRadius = radius || 0.1;
        var centerY = baseY + height / 2;
        var halfHeight = height / 2;
        var bottomY = centerY - halfHeight;
        var topY = centerY + halfHeight;
        var baseColor = color || vec4(0.35, 0.30, 0.25, 1.0);
        var brightColor = scaleColor(baseColor, 1.1);
        var darkColor = scaleColor(baseColor, 0.7);
        var topColor = scaleColor(baseColor, 1.05);
        var bottomColor = scaleColor(baseColor, 0.65);

        var sides = 6;
        for (var i = 0; i < sides; i++) {
            var angle1 = (i / sides) * 2 * Math.PI;
            var angle2 = ((i + 1) / sides) * 2 * Math.PI;
            var midAngle = (angle1 + angle2) / 2;
            var x1 = x + pillarRadius * Math.cos(angle1);
            var z1 = z + pillarRadius * Math.sin(angle1);
            var x2 = x + pillarRadius * Math.cos(angle2);
            var z2 = z + pillarRadius * Math.sin(angle2);
            var sideShade = Math.cos(midAngle) > 0 ? brightColor : darkColor;
            emitQuad(
                vec4(x1, bottomY, z1, 1.0),
                vec4(x2, bottomY, z2, 1.0),
                vec4(x2, topY, z2, 1.0),
                vec4(x1, topY, z1, 1.0),
                sideShade
            );
        }

        for (var j = 0; j < sides; j++) {
            var angleTop1 = (j / sides) * 2 * Math.PI;
            var angleTop2 = ((j + 1) / sides) * 2 * Math.PI;
            var xTop1 = x + pillarRadius * Math.cos(angleTop1);
            var zTop1 = z + pillarRadius * Math.sin(angleTop1);
            var xTop2 = x + pillarRadius * Math.cos(angleTop2);
            var zTop2 = z + pillarRadius * Math.sin(angleTop2);
            points.push(vec4(x, topY, z, 1.0)); colors.push(topColor);
            points.push(vec4(xTop1, topY, zTop1, 1.0)); colors.push(topColor);
            points.push(vec4(xTop2, topY, zTop2, 1.0)); colors.push(topColor);

            points.push(vec4(x, bottomY, z, 1.0)); colors.push(bottomColor);
            points.push(vec4(xTop2, bottomY, zTop2, 1.0)); colors.push(bottomColor);
            points.push(vec4(xTop1, bottomY, zTop1, 1.0)); colors.push(bottomColor);
        }
    }

    /** 아치 생성: 양쪽 기둥과 상부 곡선 보를 결합 */
    function createRuinsArch() {
    // 두 개의 기둥과 곡선 상인방으로 이루어진 아치를 구성.
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

    /** 아치 기둥 한쪽 생성(직육면체 기둥) */
    function createArchPillar(x, baseY, z, width, height, color, darkColor) {
    // 공용 hexahedron 생성기로 구성
        var centerY = baseY + height / 2;
        createHexahedron(x, centerY, z, width, width, height, 1.0, {
            positiveX: darkColor,
            negativeX: color,
            positiveZ: color,
            negativeZ: color,
            positiveY: scaleColor(color, 1.05),
            negativeY: scaleColor(color, 0.85),
            default: color
        });
    }

    /** 아치 상단 곡선 보 생성: 반원 세그먼트로 근사 */
    function createArchTop(centerX, baseY, centerZ, width, height, thickness, color, darkColor) {
    // 반원을 여러 조각으로 나눠 곡면 상단을 근사한다.
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

    /** 폐허 주변의 빛 입자/먼지 생성(알파 블렌딩 사각형) 
    function createRuinsLight() {
    // 떠다니는 사각형으로 아치 주변의 먼지와 빛기둥을 표현.
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
    */

    /** 비행 수호자 전체 생성: 머리/몸통 세그먼트/지느러미 */
    function createRuinsGuardian() {
    // 폐허를 가로지르는 뱀 형태의 비행 수호자를 여러 세그먼트로 만든다.
        var segments = 12;
        var totalLength = 0.8;
        var segmentLength = totalLength / segments;
        var baseX = 0.4;
        var baseY = 0.05;
        var baseZ = 0.0;

        createGuardianHead(0.4, 0.07, 0.025);
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

    /** 수호자 몸체의 캡슐형 세그먼트 하나 생성 */
    function createGuardianSegment(centerX, centerY, centerZ, length, width, height) {
    // 몸체 파츠를 직육면체(박스) 헬퍼로 생성
    // 공포스러운 검회색 계열로 변경
    var bodyColor = vec4(0.18, 0.19, 0.22, 1.0);      // 기본 검회색
    var darkBodyColor = vec4(0.10, 0.11, 0.13, 1.0);  // 더 어두운 검회색
    var brightColor = vec4(0.28, 0.29, 0.32, 1.0);    // 밝은 회색(빛 받는 면)
    var depth = height * 3.0;
    createHexahedron(centerX, centerY, centerZ, length, depth, width, 1.0, {
        positiveX: brightColor,
        negativeX: darkBodyColor,
        positiveZ: bodyColor,
        negativeZ: scaleColor(bodyColor, 0.9),
        positiveY: brightColor,
        negativeY: darkBodyColor,
        default: bodyColor
    });
    }

    /** 수호자 머리 생성: 테이퍼링되는 링으로 구성 */
    function createGuardianHead(centerX, centerY, centerZ) {
    // 머리 파트를 직육면체(박스) 헬퍼로 생성
    var headColor = vec4(0.18, 0.19, 0.22, 1.0);      // 기본 검회색
    var darkHeadColor = vec4(0.10, 0.11, 0.13, 1.0);  // 더 어두운 검회색
    var brightHeadColor = vec4(0.28, 0.29, 0.32, 1.0); // 밝은 회색(빛 받는 면)
    var headLength = 0.10;
    var headBaseWidth = 0.08;
    var headDepthParam = 0.12;
    var verticalHeight = headBaseWidth / 1.1;
    var depth = (headDepthParam / 1.7) * 2.0;
    createHexahedron(centerX, centerY, centerZ, headLength, depth, verticalHeight, 1.0, {
        positiveX: brightHeadColor,
        negativeX: darkHeadColor,
        positiveZ: headColor,
        negativeZ: scaleColor(headColor, 0.9),
        positiveY: brightHeadColor,
        negativeY: darkHeadColor,
        default: headColor
    });
    }

    /** 수호자 지느러미 생성: 좌/우 얇은 삼각형 */
    function createGuardianFins(centerX, centerY, centerZ, finSpan) {
    // 날개를 z축 방향으로 세운 직육면체로 생성
    var wingColor = vec4(0.7, 0.8, 0.9, 0.5); // 밝은 푸른빛 반투명 날개
    var wingLength = 0.07;  // 앞뒤로 더 짧게 (X축)
    var wingWidth = 0.02;   // 두께(얇게, Y축)
    var wingHeight = 0.22;  // 높이(더 길게, Z축)
    var brightWing = scaleColor(wingColor, 1.05);
    var darkWing = scaleColor(wingColor, 0.9);

    var leftCenterX = centerX + wingLength / 2;
    var leftCenterZ = centerZ - finSpan / 2;
    createHexahedron(leftCenterX, centerY, leftCenterZ, wingLength, wingHeight, wingWidth, 1.0, {
        positiveX: brightWing,
        negativeX: darkWing,
        positiveZ: wingColor,
        negativeZ: wingColor,
        positiveY: brightWing,
        negativeY: darkWing,
        default: wingColor
    });

    var rightCenterX = centerX + wingLength / 2;
    var rightCenterZ = centerZ + finSpan / 2;
    createHexahedron(rightCenterX, centerY, rightCenterZ, wingLength, wingHeight, wingWidth, 1.0, {
        positiveX: brightWing,
        negativeX: darkWing,
        positiveZ: wingColor,
        negativeZ: wingColor,
        positiveY: brightWing,
        negativeY: darkWing,
        default: wingColor
    });
    }

    global.createHexahedron = createHexahedron;
    global.createRuinsPillars = createRuinsPillars;
    global.createPillar = createPillar;
    global.createRuinsArch = createRuinsArch;
    global.createArchPillar = createArchPillar;
    global.createArchTop = createArchTop;
    // global.createRuinsLight = createRuinsLight;
    global.createRuinsGuardian = createRuinsGuardian;
    global.createGuardianSegment = createGuardianSegment;
    global.createGuardianHead = createGuardianHead;
    global.createGuardianFins = createGuardianFins;
})(this);
