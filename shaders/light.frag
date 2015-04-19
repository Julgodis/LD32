precision mediump float;

#define STEP_A 0.4
#define STEP_B 0.6
#define STEP_C 0.8
#define STEP_D 1.0

uniform sampler2D sampler;
uniform sampler2D sampler1;

struct LightSource
{
    vec3 position;
    float radius;
    float strength;
	vec3 color;
};

uniform mediump int lightCount;
uniform LightSource lights[10];
uniform vec2 size;

varying vec4 outColor;
varying highp vec2 outTexture;
varying vec3 outPosition;
varying float outRotation;
varying mediump float outFlip;

void main(void) 
{
	vec3 Falloff = vec3(0.4, 3.0, 20.0);
	vec4 AmbientColor = vec4(0.6, 0.6, 1.0, 0.35);
	//vec4 LightColor = vec4(1.0, 0.8, 0.6, 1.0);

	vec4 DiffuseColor = texture2D(sampler, outTexture);
	vec3 NormalMap = texture2D(sampler1, outTexture).rgb;
	vec3 Ambient = AmbientColor.rgb * AmbientColor.a;

	vec3 N = normalize(NormalMap * 2.0 - 1.0);
	N.x *= (-1.0 * outFlip) + 1.0 * (1.0 - outFlip);
	vec3 Sum = vec3(0);

	for(mediump int i = 0; i < 10; i++) 
	{
		if(i < lightCount) 
		{
			LightSource Light = lights[i];
			vec2 LightDirXY = Light.position.xy - outPosition.xy;

			if(outRotation != 0.0) {
				float xylen = length(LightDirXY);
				float angle = atan(-LightDirXY.y / xylen, LightDirXY.x / xylen) - outRotation;
				LightDirXY = xylen*vec2(cos(-angle), sin(-angle));
			}

			vec3 LightDir = vec3(LightDirXY, Light.position.z - outPosition.z);

			float D = length(LightDir) / Light.radius;
			vec3 L = normalize(LightDir);

			vec3 Diffuse = Light.color * max(dot(N, L), 0.0);

			float Attenuation = Light.strength / (1.0 + 10.0*D + 10.0*D*D);

			if (Attenuation < STEP_A) 
				Attenuation = 0.0;
			else if (Attenuation < STEP_B) 
				Attenuation = STEP_B;
			else if (Attenuation < STEP_C) 
				Attenuation = STEP_C;
			else 
				Attenuation = STEP_D;

			vec3 Intensity = Diffuse * Attenuation;
			vec3 FinalColor = DiffuseColor.rgb * Intensity;

			Sum += Intensity;
		}
	}

	gl_FragColor = outColor * vec4(DiffuseColor.rgb * (Ambient + Sum), DiffuseColor.a);
}

