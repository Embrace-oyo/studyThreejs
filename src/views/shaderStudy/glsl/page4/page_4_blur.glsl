varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel0;



const int   c_samplesX    = 15;// must be odd
const int   c_samplesY    = 15;// must be odd
const float c_textureSize = 512.0;

const int   c_halfSamplesX = c_samplesX / 2;
const int   c_halfSamplesY = c_samplesY / 2;
const float c_pixelSize = (1.0 / c_textureSize);


float Gaussian (float sigma, float x)
{
    return exp(-(x*x) / (2.0 * sigma*sigma));
}

vec3 BlurredPixel (in vec2 uv)
{
    float c_sigmaX      =  (sin(iTime*2.0)*0.5 + 0.5) * 5.0;
    float c_sigmaY      =  c_sigmaX;

    float total = 0.0;
    vec3 ret = vec3(0);

    for (int iy = 0; iy < c_samplesY; ++iy)
    {
        float fy = Gaussian (c_sigmaY, float(iy) - float(c_halfSamplesY));
        float offsety = float(iy-c_halfSamplesY) * c_pixelSize;
        for (int ix = 0; ix < c_samplesX; ++ix)
        {
            float fx = Gaussian (c_sigmaX, float(ix) - float(c_halfSamplesX));
            float offsetx = float(ix-c_halfSamplesX) * c_pixelSize;
            total += fx * fy;
            ret += texture(iChannel0, uv + vec2(offsetx, offsety)).rgb * fx*fy;
        }
    }
    return ret / total;
}

void main() {
    vec2 uv = v_uv;
    gl_FragColor = vec4(BlurredPixel(uv), 1.0);
}
