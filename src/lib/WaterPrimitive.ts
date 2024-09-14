import * as Cesium from 'cesium'
const WaterMaterialSource = `
uniform sampler2D texture; // 反射贴图

uniform sampler2D normalTexture; // 法线贴图
uniform float time;

uniform mat4 fixedFrameToEastNorthUpTransform; // 水面的东北天矩阵的逆矩阵

// 从顶点着色器传来的
varying vec4 v_worldPosition; // 当前像素的世界坐标
varying vec4 v_uv; // 原本的纹理坐标乘以贴图矩阵

// 可配置的参数
uniform float size; // 波纹大小（数值越大波纹越密集）
uniform vec4 waterColor; // 水面颜色
uniform float waterAlpha; // 水面透明度
uniform float rf0; // 水面反射率
uniform vec3 lightDirection; // 光照方向
uniform float sunShiny; // 光照强度
uniform float distortionScale; // 倒影的扭曲程度

vec3 sunDirection = normalize( lightDirection );
vec3 sunColor = vec3( 1.0 );


// 获取噪声
// vec4 czm_getWaterNoise(sampler2D normalMap, vec2 uv, float time, float angleInRadians)
vec4 getNoise( sampler2D normalMap, vec2 uv ) {
    vec2 uv0 = ( uv / 103.0 ) + vec2( time / 17.0, time / 29.0 );
    vec2 uv1 = uv / 107.0 - vec2( time / -19.0, time / 31.0 );
    vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
    vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
    vec4 noise = texture2D( normalMap, uv0 ) +
        texture2D( normalMap, uv1 ) +
        texture2D( normalMap, uv2 ) +
        texture2D( normalMap, uv3 );
    return noise * 0.5 - 1.0;
}

void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
    vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );  // 获得太阳对表面法线的反射向量
    float direction = max( 0.0, dot( eyeDirection, reflection ) );  // 当太阳反射方向和眼睛的方向一致时，direction 最大，为 1，当角度大于 90度时最小，最小为 0
    specularColor += pow( direction, shiny ) * sunColor * spec;
    diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
}

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);

    // 通过法线贴图计算新的表面法线
    vec2 transformedSt = materialInput.st * 2.0 - 1.0;  // [0, 1] => [-1, 1]
    vec4 noise = getNoise( normalTexture, transformedSt * size );
    vec3 surfaceNormal = normalize( noise.xzy );  // [0, +1]，Y up

    // 漫反射光
    vec3 diffuseLight = vec3( 0.0 );
    // 高光
    vec3 specularLight = vec3( 0.0 );

    // 获取视线方向（世界坐标）也就是相机视线方向，因为相机就在相机坐标系的0，0，0，而czm_inverseView获取相机视图矩阵的逆矩阵
    vec3 eye = ( czm_inverseView * vec4( vec3(0.0), 1.0 ) ).xyz;
    // 获取视线方向（水面的本地坐标）
    eye = ( fixedFrameToEastNorthUpTransform * vec4( eye, 1.0) ).xyz;
    // 当前像素的本地坐标
    vec3 world = ( fixedFrameToEastNorthUpTransform * vec4( v_worldPosition.xyz, 1.0) ).xyz;

    vec3 worldToEye = eye - world;  // east, north, up
    worldToEye = vec3( worldToEye.x, worldToEye.z, -worldToEye.y );  // Y up
    vec3 eyeDirection = normalize( worldToEye );

    float shiny = sunShiny;
    float spec = 2.0;
    float diffuse = 0.5;
    sunLight( surfaceNormal, eyeDirection, shiny, spec, diffuse, diffuseLight, specularLight );

    float distance = length( worldToEye );
    float distortionScale = distortionScale;
    vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
    vec3 reflectionSample = vec3( texture2D( texture, (v_uv.xy / v_uv.w) * 0.5 + 0.5 + distortion ) );

    float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
    float rf0 = rf0;
    float reflectance = mix( rf0, 1.0, pow( 1.0 - theta, 5.0 ) );

    vec3 waterColor = waterColor.rgb;

    // surfaceNormal 是以反射平面为 X-Y 平面的，
    // 所以 eyeDirection 也得是以反射平面为 X-Y 平面。
    vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
    vec3 albedo = mix(
        sunColor * diffuseLight * 0.3 + scatter,
        vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight,
        reflectance
    );
    material.diffuse = albedo.rgb;
    material.alpha = waterAlpha;

    return material;
}
`;
const WaterAppearanceVS = `
attribute vec3 position3DHigh;
attribute vec3 position3DLow;
attribute vec3 normal;
attribute vec2 st;
attribute float batchId;

varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;

uniform mat4 reflectorProjectionMatrix;
uniform mat4 reflectorViewMatrix;
uniform mat4 reflectMatrix;
varying vec4 v_worldPosition;  // 世界坐标
varying vec4 v_uv;             // 纹理坐标



void main()
{
    vec4 p = czm_computePosition();

    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
    v_normalEC = czm_normal * normal;                         // normal in eye coordinates
    v_st = st;


    mat4 modelView = reflectorViewMatrix * reflectMatrix * czm_model;
    modelView[3][0] = 0.0;
    modelView[3][1] = 0.0;
    modelView[3][2] = 0.0;
    v_uv = reflectorProjectionMatrix * modelView * p;
    vec4 positionMC = vec4( position3DHigh + position3DLow, 1.0 );
    v_worldPosition = czm_model * positionMC;

    gl_Position = czm_modelViewProjectionRelativeToEye * p;
}
`;

/**
 * 创建一个用于占位的纹理。
 * @param {Context} context
 * @returns {Texture}
 *
 */
function createPlaceHolderTexture(context) {
    const placeholderTexture = new Cesium.Texture({
        context,
        source: {
            width: 1,
            height: 1,
            arrayBufferView: new Uint8Array([255, 0, 0, 255]),
        },
        sampler: new Cesium.Sampler({
            wrapS: Cesium.TextureWrap.REPEAT,
            wrapT: Cesium.TextureWrap.REPEAT,
            minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
            magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        }),
    });
    placeholderTexture.type = "sampler2D";

    return placeholderTexture;
}

/**
 * 获取反射向量。
 *
 * @param {Cartesian3} view 视角方向
 * @param {Cartesian3} normal 法线方向
 * @returns {Cartesian3}
 *
 */
function reflect(view, normal) {
    const scaledNormal = normal.clone();
    const reflect = view.clone();

    const scalar = 2 * Cesium.Cartesian3.dot(view, normal);
    Cesium.Cartesian3.multiplyByScalar(normal, scalar, scaledNormal);

    return Cesium.Cartesian3.subtract(view, scaledNormal, reflect);
}

/**
 * 判断一个数值是否是 2 的正整次幂
 * @param {Number} value 要判断的数值
 * @returns {Boolean}
 *
 * @ignore
 */
function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
}

/**
 * 给 Material 添加一个 Texture uniform。
 * @param {Object} options
 * @param {Context} options.context
 * @param {Material} options.material
 * @param {String} options.uniformName Uniform 名
 * @param {String} options.imgSrc 图片的地址
 * @param {TextureWrap} [options.wrapS=TextureWrap.REPEAT] 纹理参数，决定纹理坐标 S 方向上超出 [0, 1] 时如何抽样。
 * @param {TextureWrap} [options.wrapT=TextureWrap.REPEAT] 纹理参数，决定纹理坐标 T 方向上超出 [0, 1] 时如何抽样。
 * @param {TextureMinificationFilter} [options.minificationFilter=TextureMinificationFilter.LINEAR] 纹理参数，决定纹理缩小时如何抽样，
 * @param {TextureMagnificationFilter} [options.magnificationFilter=TextureMagnificationFilter.LINEAR] 纹理参数，决定纹理放大时如何抽样，
 *
 * @ignore
 */
function addTextureUniform(options) {
    const { context, material, uniformName, imgSrc } = options;
    const wrapS = options.wrapS || Cesium.TextureWrap.REPEAT;
    const wrapT = options.wrapT || Cesium.TextureWrap.REPEAT;
    const minificationFilter =
        options.minificationFilter || Cesium.TextureMinificationFilter.LINEAR;
    const magnificationFilter =
        options.magnificationFilter || Cesium.TextureMagnificationFilter.LINEAR;

    const img = new Image();
    img.src = imgSrc;
    img.addEventListener("load", () => {
        const texture = new Cesium.Texture({
            context,
            source: img,
            sampler: new Cesium.Sampler({
                wrapS,
                wrapT,
                minificationFilter,
                magnificationFilter,
            }),
        });
        texture.type = "sampler2D";
        if (isPowerOfTwo(img.width) && isPowerOfTwo(img.height)) {
            texture.generateMipmap(Cesium.MipmapHint.NICEST);
        }
        material.uniforms[uniformName] = texture;
    });
}

const renderTilesetPassState = new Cesium.Cesium3DTilePassState({
    pass: Cesium.Cesium3DTilePass.RENDER,
});

const scratchBackgroundColor = new Cesium.Color();

/**
 * 用 scene._defaultView.camera 渲染 scene 内的 Primitive 到 passStateFramebuffer。
 * @param {Scene} scene
 * @param {Framebuffer} passStateFramebuffer
 *
 * @ignore
 */
function render(scene, passStateFramebuffer) {
    const frameState = scene._frameState;
    const context = scene.context;
    const us = context.uniformState;

    const view = scene._defaultView;
    scene._view = view;

    scene.updateFrameState();
    frameState.passes.render = true;
    frameState.passes.postProcess = scene.postProcessStages.hasSelected;
    frameState.tilesetPassState = renderTilesetPassState;

    let backgroundColor = Cesium.defaultValue(scene.backgroundColor, Cesium.Color.BLACK);
    if (scene._hdr) {
        backgroundColor = Cesium.Color.clone(backgroundColor, scratchBackgroundColor);
        backgroundColor.red = Math.pow(backgroundColor.red, scene.gamma);
        backgroundColor.green = Math.pow(backgroundColor.green, scene.gamma);
        backgroundColor.blue = Math.pow(backgroundColor.blue, scene.gamma);
    }
    frameState.backgroundColor = backgroundColor;

    scene.fog.update(frameState);

    us.update(frameState);

    const shadowMap = scene.shadowMap;
    if (Cesium.defined(shadowMap) && shadowMap.enabled) {
        if (!Cesium.defined(scene.light) || scene.light instanceof Cesium.SunLight) {
            Cesium.Cartesian3.negate(us.sunDirectionWC, scene._shadowMapCamera.direction);
        } else {
            Cesium.Cartesian3.clone(scene.light.direction, scene._shadowMapCamera.direction);
        }
        frameState.shadowMaps.push(shadowMap);
    }

    scene._computeCommandList.length = 0;
    scene._overlayCommandList.length = 0;

    const viewport = view.viewport;
    viewport.x = 0;
    viewport.y = 0;
    viewport.width = context.drawingBufferWidth;
    viewport.height = context.drawingBufferHeight;

    const passState = view.passState;
    passState.framebuffer = passStateFramebuffer;
    passState.blendingEnabled = undefined;
    passState.scissorTest = undefined;
    passState.viewport = Cesium.BoundingRectangle.clone(viewport, passState.viewport);

    if (Cesium.defined(scene.globe)) {
        scene.globe.beginFrame(frameState);
    }

    scene.updateEnvironment();
    scene.updateAndExecuteCommands(passState, backgroundColor);
    scene.resolveFramebuffers(passState);

    if (Cesium.defined(scene.globe)) {
        scene.globe.endFrame(frameState);

        if (!scene.globe.tilesLoaded) {
            scene._renderRequested = true;
        }
    }

    context.endFrame();
}


// 反射相机投影矩阵裁切Bias
const clipBias = 0;

export class WaterPrimitive {

    /**
     * scene: Cesium.Scene;
     * positions: Cesium.Cartographic[]; // 水面的范围（仅用到经纬度，高程另外定义）
     * height: number; // 水面高程
     * flowDegrees?: number; // 水流方向的角度
     * normalMapUrl?: string; // 水面的法线贴图地址
     * rippleSize?: number; // 波纹大小（数值越大，波纹越密集）
     * waterColor?: Cesium.Color; // 水面的颜色
     * waterAlpha?: number; // 水面的透明度
     * reflectivity?: number; // 水面反射率（）
     * lightDirection?: Cesium.Cartesian3; // 光照方向，单位向量。原点为水面中心点，水面中心点由 options.positions 决定，X、Y、Z轴对应水面中心点的东、北、上方向。（默认为0,0,1）
     * sunShiny?: number; // 光照强度
     * distortionScale?: number; // 倒影的扭曲程度
     * @param {*} options
     */
    constructor(options) {
        this._scene = options.scene;
        this._height = options.height;
        this._flowDegrees = Cesium.defaultValue(options.flowDegrees, 0);

        // 计算边界点和中心点
        const positions = options.positions;
        const total = positions.length;
        let x = 0;
        let y = 0;
        let z = 0;
        this._positions = [];

/*        首先，对于每个位置，使用纬度和经度值计算出其对应的三维笛卡尔坐标。这是通过使用 Cesium.Cartesian3.fromRadians 方法实现的，其中纬度对应于 Y 轴，经度对应于 X 轴，高度（this._height）为固定值。这样，每个位置都被映射到球面上的一个点。
        接下来，通过迭代计算累加的向量 x、y 和 z，来表示所有位置的总体贡献。在每次迭代中，使用当前位置的纬度和经度值进行三角函数计算，并将结果累加到对应的变量中。
        x 的累加使用 Math.cos(lat) * Math.cos(lon)，表示对每个位置的纬度和经度进行余弦函数计算，然后将结果与 X 轴上的分量进行累加。
        y 的累加使用 Math.cos(lat) * Math.sin(lon)，表示对每个位置的纬度和经度进行余弦函数和正弦函数计算，然后将结果与 Y 轴上的分量进行累加。
        z 的累加使用 Math.sin(lat)，表示对每个位置的纬度进行正弦函数计算，然后将结果与 Z 轴上的分量进行累加。
        累加完成后，通过将 x、y 和 z 分别除以位置总数（total）来计算平均值。这样，x、y 和 z 分别代表了所有位置在三维空间中的平均位置。
        最后，使用 Math.atan2 函数来计算中心经度和中心纬度。
        中心经度 (centerLon) 的计算使用 Math.atan2(y, x)，该函数返回 (y, x) 向量与 X 轴之间的角度，表示经度值。
        中心纬度 (centerLat) 的计算使用 Math.atan2(z, hyp)，其中 hyp 是通过计算 x 和 y 的欧几里得范数得到的，该函数返回 (hyp, z) 向量与 Z 轴之间的角度，表示纬度值。*/

        positions.forEach((p) => {
            const lat = p.latitude;
            const lon = p.longitude;
            x += Math.cos(lat) * Math.cos(lon)
            y += Math.cos(lat) * Math.sin(lon)
            z += Math.sin(lat)
            this._positions.push(
                Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, this._height)
            );
        });

        x /= total;
        y /= total;
        z /= total;
        const centerLon = Math.atan2(y, x)
        const hyp = Math.sqrt(x * x + y * y)
        const centerLat = Math.atan2(z, hyp)

        // 获取水面中心的世界坐标
        this._reflectorWorldPosition = Cesium.Cartesian3.fromRadians(centerLon, centerLat, this._height);
        this._originalreflectorWorldPosition = this._reflectorWorldPosition.clone();
        // 计算水面中心的法向量
        this._normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(this._reflectorWorldPosition);
        // 获取水面平面
        this._waterPlane = Cesium.Plane.fromPointNormal(
            this._reflectorWorldPosition,
            this._normal
        );

        // 计算反射矩阵
        this._reflectMatrix = new Cesium.Matrix4( // 水面反射矩阵
            -2 * this._waterPlane.normal.x * this._waterPlane.normal.x + 1,
            -2 * this._waterPlane.normal.x * this._waterPlane.normal.y,
            -2 * this._waterPlane.normal.x * this._waterPlane.normal.z,
            -2 * this._waterPlane.normal.x * this._waterPlane.distance,
            -2 * this._waterPlane.normal.y * this._waterPlane.normal.x,
            -2 * this._waterPlane.normal.y * this._waterPlane.normal.y + 1,
            -2 * this._waterPlane.normal.y * this._waterPlane.normal.z,
            -2 * this._waterPlane.normal.y * this._waterPlane.distance,
            -2 * this._waterPlane.normal.z * this._waterPlane.normal.x,
            -2 * this._waterPlane.normal.z * this._waterPlane.normal.y,
            -2 * this._waterPlane.normal.z * this._waterPlane.normal.z + 1,
            -2 * this._waterPlane.normal.z * this._waterPlane.distance,
            0,
            0,
            0,
            1
        );

        // 初始化部分矩阵
        this._reflectorViewMatrix = Cesium.Matrix4.IDENTITY.clone();
        this._reflectorProjectionMatrix = Cesium.Matrix4.IDENTITY.clone();

        // 初始化Uniform变量
        this._initUniforms = {
            normalMapUrl: "/image/else/waterNormals.jpg",
            size: Cesium.defaultValue(options.rippleSize, 50.0),
            waterColor: Cesium.defaultValue(
                options.waterColor,
                Cesium.Color.fromCssColorString("#001e0f")
            ),
            waterAlpha: Cesium.defaultValue(options.waterAlpha, 0.9),
            rf0: Cesium.defaultValue(options.reflectivity, 0.3),
            lightDirection: Cesium.defaultValue(
                options.lightDirection,
                new Cesium.Cartesian3(0, 0, 1)
            ),
            sunShiny: Cesium.defaultValue(options.sunShiny, 100.0),
            distortionScale: Cesium.defaultValue(options.distortionScale, 3.7),
        };

        // 创建 Framebuffer
        const context = this._scene.context;
        this._createFramebuffer(
            context,
            context.drawingBufferWidth,
            context.drawingBufferHeight,
            this._scene.highDynamicRange
        );

        this._primitive = this._createPrimitive(
            this._positions,
            this._height,
            this._flowDegrees,
        );

        this._scene.primitives.add(this._primitive);

        this.preRender = this.preRender.bind(this);
        this._scene.preRender.addEventListener(this.preRender);

        // 不使用对数深度
        this._scene.logarithmicDepthBuffer = false;

        // 替换Cesium源码，实现使用自定义投影矩阵
        Cesium.UniformState.prototype.updateFrustum = function (frustum) {
            //>>modify.start
            //>>如果有自定义的投影矩阵，则使用，否则使用原来的投影矩阵
            Cesium.Matrix4.clone(
                Cesium.defaultValue(
                    frustum.customProjectionMatrix,
                    frustum.projectionMatrix
                ),
                this._projection
            );
            this._inverseProjectionDirty = true;
            this._viewProjectionDirty = true;
            this._inverseViewProjectionDirty = true;
            this._modelViewProjectionDirty = true;
            this._modelViewProjectionRelativeToEyeDirty = true;
            //>>modify.end
            if (Cesium.defined(frustum.infiniteProjectionMatrix)) {
                Cesium.Matrix4.clone(
                    frustum.infiniteProjectionMatrix,
                    this._infiniteProjection
                );
                this._modelViewInfiniteProjectionDirty = true;
            }
            this._currentFrustum.x = frustum.near;
            this._currentFrustum.y = frustum.far;

            this._farDepthFromNearPlusOne = frustum.far - frustum.near + 1.0;
            this._log2FarDepthFromNearPlusOne = Cesium.Math.log2(
                this._farDepthFromNearPlusOne
            );
            this._oneOverLog2FarDepthFromNearPlusOne =
                1.0 / this._log2FarDepthFromNearPlusOne;

            if (Cesium.defined(frustum._offCenterFrustum)) {
                frustum = frustum._offCenterFrustum;
            }

            this._frustumPlanes.x = frustum.top;
            this._frustumPlanes.y = frustum.bottom;
            this._frustumPlanes.z = frustum.left;
            this._frustumPlanes.w = frustum.right;
        };

        // 替换Cesium源码，实现使用自定义投影矩阵
        Cesium.PerspectiveFrustum.prototype.clone = function (result) {
            if (!Cesium.defined(result)) {
                result = new Cesium.PerspectiveFrustum();
            }

            result.aspectRatio = this.aspectRatio;
            result.fov = this.fov;
            result.near = this.near;
            result.far = this.far;

            // force update of clone to compute matrices
            result._aspectRatio = undefined;
            result._fov = undefined;
            result._near = undefined;
            result._far = undefined;

            this._offCenterFrustum.clone(result._offCenterFrustum);

            // 传递customProjectionMatrix
            result.customProjectionMatrix = this.customProjectionMatrix;

            return result;
        };
    }

    /**
     * 波纹大小（数值越大波纹越密集）
     */
    get rippleSize() {
        return this._material.uniforms.size;
    }
    set rippleSize(value) {
        this._material.uniforms.size = value;
    }

    /**
     * 水面透明度
     */
    get waterAlpha() {
        return this._material.uniforms.waterAlpha;
    }
    set waterAlpha(value) {
        this._material.uniforms.waterAlpha = value;
    }

    /**
     * 水面反射率
     */
    get reflectivity() {
        return this._material.uniforms.rf0;
    }
    set reflectivity(value) {
        this._material.uniforms.rf0 = value;
    }

    /**
     * 扭曲程度
     */
    get distortionScale() {
        return this._material.uniforms.distortionScale;
    }
    set distortionScale(value) {
        this._material.uniforms.distortionScale = value;
    }

    /**
     * 高度
     */
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;

        const rwpCa = Cesium.Cartographic.fromCartesian(this._originalreflectorWorldPosition);
        const newRwpCa = Cesium.Cartesian3.fromRadians(rwpCa.longitude, rwpCa.latitude, this._height);
        const move = Cesium.Cartesian3.subtract(newRwpCa, this._originalreflectorWorldPosition, new Cesium.Cartesian3());
        const moveMatrix4 = Cesium.Matrix4.fromTranslation(move);
        this._primitive.modelMatrix = moveMatrix4;

        this._reflectorWorldPosition = newRwpCa;
        this._normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(this._reflectorWorldPosition);
        this._waterPlane = Cesium.Plane.fromPointNormal(
            this._reflectorWorldPosition,
            this._normal
        );

        this._reflectMatrix = new Cesium.Matrix4(
            -2 * this._waterPlane.normal.x * this._waterPlane.normal.x + 1,
            -2 * this._waterPlane.normal.x * this._waterPlane.normal.y,
            -2 * this._waterPlane.normal.x * this._waterPlane.normal.z,
            -2 * this._waterPlane.normal.x * this._waterPlane.distance,
            -2 * this._waterPlane.normal.y * this._waterPlane.normal.x,
            -2 * this._waterPlane.normal.y * this._waterPlane.normal.y + 1,
            -2 * this._waterPlane.normal.y * this._waterPlane.normal.z,
            -2 * this._waterPlane.normal.y * this._waterPlane.distance,
            -2 * this._waterPlane.normal.z * this._waterPlane.normal.x,
            -2 * this._waterPlane.normal.z * this._waterPlane.normal.y,
            -2 * this._waterPlane.normal.z * this._waterPlane.normal.z + 1,
            -2 * this._waterPlane.normal.z * this._waterPlane.distance,
            0,
            0,
            0,
            1
        );
    }

    // 创建水面反射纹理
    _createReflectionWaterMaterial() {
        const context = this._scene.context;

        const placeholderTexture = createPlaceHolderTexture(context);
        const {
            normalMapUrl,
            size ,
            waterColor,
            waterAlpha,
            rf0,
            lightDirection,
            sunShiny,
            distortionScale,
        } = this._initUniforms;

        const texture = Cesium.Texture.fromFramebuffer({
            context,
            framebuffer: this._colorFramebuffer,
        });
        texture.type = "sampler2D";

        const initUniforms = {
            size: size,
            waterColor: waterColor,
            waterAlpha: waterAlpha,
            rf0: rf0,
            lightDirection: lightDirection,
            sunShiny: sunShiny,
            distortionScale: distortionScale,
            normalTexture: placeholderTexture,
            texture: texture,
            time: 0,
            fixedFrameToEastNorthUpTransform: Cesium.Matrix4.toArray(
                this._getFixedFrameToEastNorthUpTransformFromWorldMatrix()
            ),
        };
        const material = new Cesium.Material({
            fabric: {
                type: "ReflectionWater",
                uniforms: initUniforms,
                source: WaterMaterialSource,
            },
            translucent: false,
            minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
            magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        });

        addTextureUniform({
            context,
            material,
            uniformName: "normalTexture",
            imgSrc: normalMapUrl,
        });
        return material;
    }

    // 更新反射相机和贴图矩阵
    _updateVirtualCamera(camera) {
        let lookAtPosition = new Cesium.Cartesian3(0, 0, -1);
        let target = new Cesium.Cartesian3();

        // 先克隆当前的相机作为反射相机
        this._virtualCamera = Cesium.Camera.clone(
            camera,
            this._virtualCamera
        );

        // 获取相机的世界坐标
        const cameraWorldPosition = camera.positionWC.clone(); // 获得相机的世界坐标

        // 获得相机指向反射面的向量
        let view = Cesium.Cartesian3.subtract(
            this._reflectorWorldPosition,
            cameraWorldPosition,
            new Cesium.Cartesian3()
        );

        // 避免在背向反射面的时候进行渲染
        if (Cesium.Cartesian3.dot(view, this._normal) > 0) {
            return false;
        }

        // 获取视线反射方向的反方向
        view = reflect(view, this._normal);
        Cesium.Cartesian3.negate(view, view);

        // ============================反射相机位置============================
        // view 为镜像相机的世界坐标
        Cesium.Cartesian3.add(view, this._reflectorWorldPosition, view);
        // 设置范摄像机的位置
        this._virtualCamera.position = view.clone();
        // ============================反射相机位置============================

        // ============================反射相机视线方向============================
        // 获取当前相机看向的点位
        Cesium.Cartesian3.add(
            camera.directionWC,
            cameraWorldPosition,
            lookAtPosition
        );

        // 计算反射相机看向的点位
        Cesium.Cartesian3.subtract(
            this._reflectorWorldPosition,
            lookAtPosition,
            target
        );
        target = reflect(target, this._normal);
        Cesium.Cartesian3.negate(target, target);
        Cesium.Cartesian3.add(target, this._reflectorWorldPosition, target);

        // 设置反射相机的视线方向
        this._virtualCamera.direction = Cesium.Cartesian3.subtract(
            target,
            this._virtualCamera.position,
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.normalize(
            this._virtualCamera.direction,
            this._virtualCamera.direction
        );
        // ============================反射相机视线方向============================

        // ============================反射相机上方向============================
        // 获取当前相机的上方向
        Cesium.Cartesian3.add(camera.upWC, cameraWorldPosition, lookAtPosition);

        // 计算反射相机上方向的点位
        Cesium.Cartesian3.subtract(
            this._reflectorWorldPosition,
            lookAtPosition,
            target
        );
        target = reflect(target, this._normal);
        Cesium.Cartesian3.negate(target, target);
        Cesium.Cartesian3.add(target, this._reflectorWorldPosition, target);

        // 设置反射相机的上方向
        this._virtualCamera.up = Cesium.Cartesian3.subtract(
            target,
            this._virtualCamera.position,
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.normalize(this._virtualCamera.up, this._virtualCamera.up);
        // ============================反射相机上方向============================

        this._reflectorProjectionMatrix = this._virtualCamera.frustum.projectionMatrix;
        this._reflectorViewMatrix = this._virtualCamera.viewMatrix;

        // 计算反射相机的投影矩阵（用来裁切水面下的模型，不修改会导致水面下的模型也倒影在水面上）
        // 计算水面的平面
        const reflectorPlane = Cesium.Plane.fromPointNormal(
            this._reflectorWorldPosition,
            this._normal
        );
        Cesium.Plane.transform(
            reflectorPlane,
            this._virtualCamera.viewMatrix,
            reflectorPlane
        );

        // 视图坐标下的水面
        const clipPlane = new Cesium.Cartesian4(
            reflectorPlane.normal.x,
            reflectorPlane.normal.y,
            reflectorPlane.normal.z,
            reflectorPlane.distance
        );

        // 拷贝当前反射相机的投影矩阵
        const projectionMatrix = Cesium.Matrix4.clone(
            this._virtualCamera.frustum.projectionMatrix
        );

        const q = new Cesium.Cartesian4(
            (Math.sign(clipPlane.x) + projectionMatrix[8]) / projectionMatrix[0],
            (Math.sign(clipPlane.y) + projectionMatrix[9]) / projectionMatrix[5],
            -1,
            (1.0 + projectionMatrix[10]) / projectionMatrix[14]
        );

        Cesium.Cartesian4.multiplyByScalar(
            clipPlane,
            2.0 / Cesium.Cartesian4.dot(clipPlane, q),
            clipPlane
        );

        projectionMatrix[2] = clipPlane.x;
        projectionMatrix[6] = clipPlane.y;
        projectionMatrix[10] = clipPlane.z + 1.0 - clipBias;
        projectionMatrix[14] = clipPlane.w;

        this._virtualCamera.frustum.customProjectionMatrix =
            Cesium.Matrix4.clone(projectionMatrix); // TODO: 要改源码

        return true;
    }

    preRender(scene) {
        // 保存原来的状态
        const currnetDefaultViewCamera = scene._defaultView.camera;
        const currentShadowMap = scene.shadowMap;
        const currentGlobe = scene.globe.show;
        const currentShowSkirts = scene.globe.showSkirts;

        // 更新虚拟相机
        if (!this._updateVirtualCamera(scene._defaultView.camera)) {
            // 背向反射面
            this._primitive.show = false;
            return;
        }

        // 设置状态
        this._primitive.show = false;
        scene._defaultView.camera = this._virtualCamera;
        scene.shadowMap = undefined;
        scene.globe.show = false;
        scene.globe.showSkirts = false;

        // resize 时重新创建 framebuffer
        const context = scene.context;
        const width = context.drawingBufferWidth;
        const height = context.drawingBufferHeight;
        const hdr = scene.highDynamicRange;
        this._createFramebuffer(context, width, height, hdr);

        // 渲染到指定的 framebuffer
        render(scene, this._colorFramebuffer);

        const appearance = this._primitive.appearance;

        // 设置该 framebuffer 的 color attachments 0 为 sampler2D uniform
        const texture = Cesium.Texture.fromFramebuffer({
            context,
            framebuffer: this._colorFramebuffer,
        });
        texture.type = "sampler2D";

        // 设置 uniform
        this._material.uniforms.texture = texture;
        this._material.uniforms.time = performance.now() / 1000.0;
        this._material.uniforms.fixedFrameToEastNorthUpTransform =
            Cesium.Matrix4.toArray(
                this._getFixedFrameToEastNorthUpTransformFromWorldMatrix()
            );
        appearance.uniforms.reflectMatrix = Cesium.Matrix4.toArray(
            this._reflectMatrix
        );
        appearance.uniforms.reflectorProjectionMatrix = Cesium.Matrix4.toArray(
            this._reflectorProjectionMatrix
        );
        appearance.uniforms.reflectorViewMatrix = Cesium.Matrix4.toArray(
            this._reflectorViewMatrix
        );

        // 复原状态
        this._primitive.show = true;
        scene._defaultView.camera = currnetDefaultViewCamera;
        scene.shadowMap = currentShadowMap;
        scene.globe.show = currentGlobe;
        scene.globe.showSkirts = currentShowSkirts;
    }

    // 创建水面primitive
    _createPrimitive(positions, extrudedHeight, flowDegrees) {
        const material = this._createReflectionWaterMaterial();
        this._material = material;

        const appearance = new Cesium.MaterialAppearance({
            material,
            vertexShaderSource: WaterAppearanceVS,
            translucent: true,
        });
        appearance.uniforms = {};
        appearance.uniforms.reflectMatrix = Cesium.Matrix4.toArray(
            this._reflectMatrix
        );
        appearance.uniforms.reflectorProjectionMatrix = Cesium.Matrix4.toArray(
            this._reflectorProjectionMatrix
        );
        appearance.uniforms.reflectorViewMatrix = Cesium.Matrix4.toArray(
            this._reflectorViewMatrix
        );
        const primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(positions),
                    perPositionHeight: true,
                    extrudedHeight,
                    stRotation: Cesium.Math.toRadians(flowDegrees),
                    closeTop: true,
                    closeBottom: false,
                    vertexFormat: Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
                }),
            }),
            appearance,
            asynchronous: false,
        });
        return primitive;
    }

    // 获取当前水面模型位置的东北天矩阵的逆矩阵
    _getFixedFrameToEastNorthUpTransformFromWorldMatrix() {
        const eastNorthUpToFixedFrameTransform =
            Cesium.Transforms.eastNorthUpToFixedFrame(this._reflectorWorldPosition);

        const fixedFrameToEastNorthUpTransform = Cesium.Matrix4.inverse(
            eastNorthUpToFixedFrameTransform,
            new Cesium.Matrix4()
        );
        return fixedFrameToEastNorthUpTransform;
    }

    // 创建 Framebuffer
    _createFramebuffer(context, width, height, hdr) {
        const colorTexture = this._colorTexture;
        if (
            Cesium.defined(colorTexture) &&
            colorTexture.width === width &&
            colorTexture.height === height &&
            this._hdr === hdr
        ) {
            return;
        }

        this._destroyResource();

        this._hdr = hdr;

        const pixelDatatype = hdr
            ? context.halfFloatingPointTexture
                ? Cesium.PixelDatatype.HALF_FLOAT
                : Cesium.PixelDatatype.FLOAT
            : Cesium.PixelDatatype.UNSIGNED_BYTE;
        this._colorTexture = new Cesium.Texture({
            context,
            width,
            height,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype,
            sampler: new Cesium.Sampler({
                wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
                wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
                minificationFilter: Cesium.TextureMinificationFilter.LINEAR,
                magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
            }),
        });

        this._depthStencilTexture = new Cesium.Texture({
            context,
            width,
            height,
            pixelFormat: Cesium.PixelFormat.DEPTH_STENCIL,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT_24_8,
        });

        this._colorFramebuffer = new Cesium.Framebuffer({
            context,
            colorTextures: [this._colorTexture],
            depthStencilTexture: this._depthStencilTexture,
            destroyAttachments: false,
        });
    }

    // 移除贴图
    _destroyResource() {
        this._colorTexture && this._colorTexture.destroy();
        this._depthStencilTexture && this._depthStencilTexture.destroy();
        this._colorFramebuffer && this._colorFramebuffer.destroy();

        this._colorTexture = undefined;
        this._depthStencilTexture = undefined;
        this._colorFramebuffer = undefined;
    }
}
