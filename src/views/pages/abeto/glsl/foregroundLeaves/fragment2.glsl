#define outPos pc_fragColor
uniform sampler2D tTexture1;

layout(location = 1) out highp vec4 outVel;
uniform sampler2D tTexture2;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform sampler2D tVel;

varying vec2 vUv;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float treadmill(float p, float margin){ float n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec2 treadmill(vec2 p, vec2 margin){ vec2 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec3 treadmill(vec3 p, vec3 margin){ vec3 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec4 treadmill(vec4 p, vec4 margin){ vec4 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }

void main() {
    ivec2 uv = ivec2(gl_FragCoord.xy);
    vec4 currentPos = texelFetch(tTexture1, uv, 0);
    vec4 currentVel = texelFetch(tTexture2, uv, 0);

    // add some velocity so leaves fall
    currentVel.x += (sin(time * 0.2 + currentPos.w * 12.8947) + sign(currentPos.w - 0.5)) * 0.00025 * dtRatio;
    currentVel.y -= 0.0005 * max(0.2, fract(currentPos.w * 31.342)) * dtRatio;
    currentVel.z = 0.0;

    // add fluid sim interaction
    const float pushForce = 0.001;
    vec4 wPos = uModelMatrix * vec4(currentPos.xyz, 1.0);
    vec4 vPos = uViewMatrix * wPos;
    vec4 posProjected = uProjMatrix * vPos;
    vec2 uvScreen = (posProjected.xy / posProjected.w + 1.0) * 0.5;
    vec2 vel = texture2D(tVel, uvScreen).xy;

    /*
    // since the camera is on -z, there's no need to calculate up and right vectors of camera
    vec3 up = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);
    vec3 right = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
    vec3 disp = (right * vel.x + up * vel.y);
    */
    currentVel.xy += vel * pushForce * dtRatio;

    // store rotation in alpha
    currentVel.a += length(vel) * pushForce * 3.5 * dtRatio;

    // friction
    currentVel.xyz *= exp2(log2(0.9) * dtRatio);

    // add vel to position
    currentPos.xyz += currentVel.xyz * dtRatio;

    // treadmill position
    currentPos.xy = treadmill(currentPos.xy, vec2(5.0, 6.0));

    outVel = currentVel;
    outPos = currentPos;
}
