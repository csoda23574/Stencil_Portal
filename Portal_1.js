(function (global) {
    // 사막 포털에 필요한 지형과 연출(사구, 피라미드, 태양, 천)을 생성.
    /**
     * 사구 하나 생성
     * centerX/baseY/centerZ를 중심으로 width, height를 가진 반구형 사구를 만든다.
     */
    function createDune(centerX, baseY, centerZ, width, height, sandColor) {
    // 다층 링을 쌓아 반구 형태 사구를 만들고 높이에 따라 색을 살짝 다르게 적용.
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

    /** 여러 사구 배치: 화면 전경을 다양한 크기의 사구로 채운다 */
    function createDesertDunes() {
    // 전경을 풍성하게 하기 위해 여러 개의 사구를 배치.
        createDune(-0.3, -0.5, -0.2, 0.4, 0.15, vec4(0.95, 0.75, 0.45, 1.0));
        createDune(0.2, -0.5, -0.15, 0.5, 0.2, vec4(0.92, 0.70, 0.40, 1.0));
        createDune(0.0, -0.5, 0.1, 0.35, 0.12, vec4(0.98, 0.80, 0.50, 1.0));
    }

    /** 정상이 갈라진 산 생성: 전경의 중심 구조물 */
    function createMountain() {
        // 지오메트리 파라미터
        var baseY = -0.5;           // 산 바닥면의 Y 높이(평면 위치)
        var centerZ = -0.45;        // 산의 Z 중심(카메라로부터의 거리 조절)
        var baseWidth = 0.5;        // 바닥 정사각형의 한 변 길이(산 밑변 너비)
        var totalHeight = 0.6;      // 바닥에서 정상까지의 전체 높이
        var topGap = 0.0075;         // 정상의 좌/우가 갈라지는 틈 간격(좌우 꼭짓점 x 오프셋)
        var splitRatio = 0.9;       // 정상 분리(갈라짐)가 시작되는 비율(0~1, 1에 가까울수록 꼭대기 근처)

        // 색상(면 조명 느낌 연출을 위한 밝고/어두운 변형)
        var color = vec4(0.65, 0.55, 0.40, 1.0);                                       // 기본 토색
        var brightColor = vec4(color[0] * 1.1, color[1] * 1.1, color[2] * 1.1, 1.0);   // 밝은 면(빛 받는 면)
        var darkColor = vec4(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8, 1.0);     // 어두운 면(그늘진 면)

        // 분리되는 단면(상단 잘린 지점)의 높이/크기
        var splitHeight = totalHeight * splitRatio;   // 갈라짐 높이(바닥 기준)
        var splitY = baseY + splitHeight;             // 갈라짐이 발생하는 Y 좌표
        var splitWidth = baseWidth * (1.0 - splitRatio); // 갈라진 단면의 정사각형 한 변(상단으로 갈수록 축소)

        // 하부 몸체(바닥 정사각형 → 분리 단면 정사각형) 4면을 이루는 꼭짓점들
        var base1 = vec4(-baseWidth / 2, baseY, centerZ + baseWidth / 2, 1.0);  // 바닥 정사각형 1번 꼭짓점(좌-앞)
        var base2 = vec4(baseWidth / 2, baseY, centerZ + baseWidth / 2, 1.0);   // 바닥 정사각형 2번 꼭짓점(우-앞)
        var base3 = vec4(baseWidth / 2, baseY, centerZ - baseWidth / 2, 1.0);   // 바닥 정사각형 3번 꼭짓점(우-뒤)
        var base4 = vec4(-baseWidth / 2, baseY, centerZ - baseWidth / 2, 1.0);  // 바닥 정사각형 4번 꼭짓점(좌-뒤)
        var split1 = vec4(-splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0); // 분리 단면 1번 꼭짓점(좌-앞)
        var split2 = vec4(splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);  // 분리 단면 2번 꼭짓점(우-앞)
        var split3 = vec4(splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);  // 분리 단면 3번 꼭짓점(우-뒤)
        var split4 = vec4(-splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0); // 분리 단면 4번 꼭짓점(좌-뒤)

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
    // 좌우 꼭대기 높이 각각 다르게(flatRatio_L, flatRatio_R)
    var flatRatio_L = 0.96; // 좌측 꼭대기 평평 비율
    var flatRatio_R = 0.95; // 우측 꼭대기 평평 비율
    // 꼭대기 갈라진 틈(topGap)을 평평함에 따라 자동으로 넓게 조정
    var topGap = 0.005 + (1 - Math.min(flatRatio_L, flatRatio_R)) * 0.04; // 평평할수록 더 넓게

    // 좌측 꼭대기점 및 밑변 점들
    var apex_L = vec4(-topGap / 2, baseY + totalHeight * flatRatio_L, centerZ, 1.0);   // 좌측 꼭대기점(평평하게)
    var base_L1 = vec4(-topGap / 2, splitY, centerZ + splitWidth / 2, 1.0);            // 좌측 상단 단면의 앞쪽 중앙
    var base_L2 = vec4(-splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);        // 좌측 상단 단면의 좌-앞 꼭짓점
    var base_L3 = vec4(-splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);        // 좌측 상단 단면의 좌-뒤 꼭짓점
    var base_L4 = vec4(-topGap / 2, splitY, centerZ - splitWidth / 2, 1.0);            // 좌측 상단 단면의 뒤쪽 중앙
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
    // 우측 꼭대기점 및 밑변 점들
    var apex_R = vec4(topGap / 2, baseY + totalHeight * flatRatio_R, centerZ, 1.0);    // 우측 꼭대기점(평평하게)
    var base_R1 = vec4(topGap / 2, splitY, centerZ + splitWidth / 2, 1.0);             // 우측 상단 단면의 앞쪽 중앙
    var base_R2 = vec4(splitWidth / 2, splitY, centerZ + splitWidth / 2, 1.0);         // 우측 상단 단면의 우-앞 꼭짓점
    var base_R3 = vec4(splitWidth / 2, splitY, centerZ - splitWidth / 2, 1.0);         // 우측 상단 단면의 우-뒤 꼭짓점
    var base_R4 = vec4(topGap / 2, splitY, centerZ - splitWidth / 2, 1.0);             // 우측 상단 단면의 뒤쪽 중앙
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

    /** 모래폭풍 입자 생성: 알파 블렌딩 사각형 파티클 */
    function createDesertSandstorm() {
    // 포털 앞에 alpha 블렌딩된 사각형 입자를 뿌려 모래바람을 표현.
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

    /** 천 장식 묶음 생성: 포털 주변에 3개의 천을 띄운다 */
    function createDesertCloth() {
        createFloatingCloth(-0.2, -0.1, 0.0, 0);
        createFloatingCloth(0.15, 0.0, -0.1, 1);
        createFloatingCloth(-0.1, 0.15, 0.15, 2);
    }
 
    /** 단일 천 조각 생성: 사인파 기반으로 물결치는 천 스트립 */
    function createFloatingCloth(x, y, z, index) {
    // 천 조각마다 위상 편차를 주어 물결이 동시에 움직이지 않도록 처리.
        /*
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
        */
    }
    /** 태양 생성: 본체 구와 후광 껍질을 함께 만든다 */
    function createDesertSun() {
    // 태양 본체와 반투명 광휘 껍질을 조합해 빛나는 효과를 구현.
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

    /** 구(태양 코어) 생성: 위도/경도 분할로 트라이앵글 메쉬 생성 */
    function createSunSphere(centerX, centerY, centerZ, radius, color, latBands, longBands) {
    // 위도-경도 분할 방식으로 구를 생성하는 전형적인 WebGL 접근.
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

    /** 태양 후광 생성: 내/외반지름으로 부드러운 광휘 */
    function createSunGlow(centerX, centerY, centerZ, innerRadius, outerRadius, latBands, longBands) {
    // 두 개의 반지를 사용해 번갈아가며 색을 배치하고 부드러운 후광을 만든다.
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

(function (global) {
    var PORTAL_KEY = "desert";
    var hasInitialized = false;

    function buildStandaloneGeometry() {
        var localPoints = [];
        var localColors = [];
        var previousPoints = global.points;
        var previousColors = global.colors;

        // Temporarily swap the shared buffers so the existing generators can run unchanged.
        global.points = localPoints;
        global.colors = localColors;

        try {
            createDesertDunes();
            createMountain();
            createDesertSandstorm();
            createDesertCloth();
            createDesertSun();
        } finally {
            global.points = previousPoints;
            global.colors = previousColors;
        }

        return {
            points: localPoints,
            colors: localColors,
            count: localPoints.length
        };
    }

    function initializeStandalonePortal1() {
        if (hasInitialized) {
            return;
        }

        var canvas = global.document && global.document.getElementById("gl-canvas");
        if (!canvas) {
            return;
        }

        var gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("WebGL isn't available");
            return;
        }

        hasInitialized = true;

        var rotationX = -12;
        var rotationY = 20;
        var zoom = 1.0;
        var isDragging = false;
        var previousMouseX = 0;
        var previousMouseY = 0;
        var modelViewMatrixLoc;
        var projectionMatrixLoc;

        var geometry = buildStandaloneGeometry();
        var vertexCount = geometry.count;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry.colors), gl.STATIC_DRAW);
        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry.points), gl.STATIC_DRAW);
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

        function onMouseDown(event) {
            isDragging = true;
            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
        }

        function onMouseMove(event) {
            if (!isDragging) {
                return;
            }
            var deltaX = event.clientX - previousMouseX;
            var deltaY = event.clientY - previousMouseY;
            rotationY += deltaX * 0.5;
            rotationX += deltaY * 0.5;
            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
        }

        function stopDragging() {
            isDragging = false;
        }

        function onWheel(event) {
            event.preventDefault();
            if (event.deltaY < 0) {
                zoom *= 1.1;
            } else {
                zoom *= 0.9;
            }
            zoom = Math.max(0.3, Math.min(zoom, 3.0));
        }

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", stopDragging);
        canvas.addEventListener("mouseleave", stopDragging);
        canvas.addEventListener("wheel", onWheel, { passive: false });

        function render() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            var modelViewMatrix = mat4();
            modelViewMatrix = mult(modelViewMatrix, rotate(rotationY, vec3(0, 1, 0)));
            modelViewMatrix = mult(modelViewMatrix, rotate(rotationX, vec3(1, 0, 0)));

            var zoomFactor = 1.0 / zoom;
            var projectionMatrix = ortho(-zoomFactor, zoomFactor, -zoomFactor, zoomFactor, -5.0, 5.0);

            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

            gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

            requestAnimFrame(render);
        }

        render();
    }

    function shouldAutoInitialize() {
        if (!global.document || !global.document.body) {
            return false;
        }
        return global.document.body.getAttribute("data-portal") === PORTAL_KEY;
    }

    function scheduleAutoInitialize() {
        if (!global.document) {
            return;
        }

        function onReady() {
            if (shouldAutoInitialize()) {
                initializeStandalonePortal1();
            }
        }

        if (global.document.readyState === "loading") {
            global.document.addEventListener("DOMContentLoaded", onReady);
        } else {
            onReady();
        }
    }

    if (!global.PortalStandalone) {
        global.PortalStandalone = {};
    }
    global.PortalStandalone.desert = initializeStandalonePortal1;
    global.PortalStandalone["1"] = initializeStandalonePortal1;

    scheduleAutoInitialize();
})(this);
