import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create a valid minimal binary GLB file for 3D meshes
function createGLBBuffer(modelName, colorRgb = [0, 240, 255]) {
  // 3D Box geometry vertices (8 vertices, 3 floats each = 24 floats = 96 bytes)
  const positions = new Float32Array([
    -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
    -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,  -0.5,  0.5, -0.5
  ]);

  // Triangle indices (12 triangles, 3 indices each = 36 indices = 72 bytes)
  const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3, // front
    1, 5, 6,  1, 6, 2, // right
    5, 4, 7,  5, 7, 6, // back
    4, 0, 3,  4, 3, 7, // left
    3, 2, 6,  3, 6, 7, // top
    4, 5, 1,  4, 1, 0  // bottom
  ]);

  const posByteLength = positions.byteLength;
  const idxByteLength = indices.byteLength;

  // Align buffer to 4 bytes
  const binBuffer = new Uint8Array(posByteLength + idxByteLength);
  binBuffer.set(new Uint8Array(positions.buffer), 0);
  binBuffer.set(new Uint8Array(indices.buffer), posByteLength);

  const r = colorRgb[0] / 255;
  const g = colorRgb[1] / 255;
  const b = colorRgb[2] / 255;

  const gltfJson = {
    asset: { version: '2.0', generator: 'GunLink 3D Model Generator' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: modelName }],
    meshes: [
      {
        name: modelName,
        primitives: [
          {
            attributes: { POSITION: 0 },
            indices: 1,
            material: 0
          }
        ]
      }
    ],
    materials: [
      {
        name: `${modelName}_Material`,
        pbrMetallicRoughness: {
          baseColorFactor: [r, g, b, 1.0],
          metallicFactor: 0.8,
          roughnessFactor: 0.2
        },
        emissiveFactor: [r * 0.5, g * 0.5, b * 0.5]
      }
    ],
    buffers: [{ byteLength: binBuffer.byteLength }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posByteLength, target: 34962 }, // ARRAY_BUFFER
      { buffer: 0, byteOffset: posByteLength, byteLength: idxByteLength, target: 34963 } // ELEMENT_ARRAY_BUFFER
    ],
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: 8,
        type: 'VEC3',
        min: [-0.5, -0.5, -0.5],
        max: [0.5, 0.5, 0.5]
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5123, // UNSIGNED_SHORT
        count: 36,
        type: 'SCALAR'
      }
    ]
  };

  const jsonString = JSON.stringify(gltfJson);
  let jsonBuffer = Buffer.from(jsonString, 'utf8');

  // Pad JSON buffer to multiple of 4
  const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
  if (jsonPadding > 0) {
    jsonBuffer = Buffer.concat([jsonBuffer, Buffer.from(' '.repeat(jsonPadding), 'utf8')]);
  }

  // Pad BIN buffer to multiple of 4
  const binPadding = (4 - (binBuffer.length % 4)) % 4;
  let paddedBinBuffer = Buffer.from(binBuffer);
  if (binPadding > 0) {
    paddedBinBuffer = Buffer.concat([paddedBinBuffer, Buffer.alloc(binPadding)]);
  }

  const totalLength = 12 + 8 + jsonBuffer.length + 8 + paddedBinBuffer.length;
  const glbHeader = Buffer.alloc(12);
  glbHeader.writeUInt32LE(0x46544c67, 0); // Magic 'glTF'
  glbHeader.writeUInt32LE(2, 4); // Version 2
  glbHeader.writeUInt32LE(totalLength, 8);

  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(jsonBuffer.length, 0);
  jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4); // Chunk type 'JSON'

  const binChunkHeader = Buffer.alloc(8);
  binChunkHeader.writeUInt32LE(paddedBinBuffer.length, 0);
  binChunkHeader.writeUInt32LE(0x0042494e, 4); // Chunk type 'BIN'

  return Buffer.concat([glbHeader, jsonChunkHeader, jsonBuffer, binChunkHeader, paddedBinBuffer]);
}

const modelsToCreate = [
  // Enemies
  { path: 'client/public/assets/models/robot/Robot.glb', name: 'Robot', color: [0, 240, 255] },
  { path: 'client/public/assets/models/zombie/Zombie.glb', name: 'Zombie', color: [34, 197, 94] },
  { path: 'client/public/assets/models/alien/Alien.glb', name: 'Alien', color: [168, 85, 247] },
  { path: 'client/public/assets/models/soldier/Soldier.glb', name: 'Soldier', color: [234, 179, 8] },
  { path: 'client/public/assets/models/animal/Hound.glb', name: 'Hound', color: [244, 63, 94] },
  { path: 'client/public/assets/models/drone/Drone.glb', name: 'Drone', color: [6, 182, 212] },
  { path: 'client/public/assets/models/boss/BossTitan.glb', name: 'BossTitan', color: [236, 72, 153] },

  // Weapons
  { path: 'client/public/assets/models/weapons/Pistol.glb', name: 'Pistol', color: [0, 240, 255] },
  { path: 'client/public/assets/models/weapons/Rifle.glb', name: 'Rifle', color: [0, 162, 255] },
  { path: 'client/public/assets/models/weapons/Shotgun.glb', name: 'Shotgun', color: [255, 42, 95] },
  { path: 'client/public/assets/models/weapons/Sniper.glb', name: 'Sniper', color: [255, 183, 0] },
  { path: 'client/public/assets/models/weapons/SMG.glb', name: 'SMG', color: [0, 240, 255] },
  { path: 'client/public/assets/models/weapons/RocketLauncher.glb', name: 'RocketLauncher', color: [255, 0, 85] },
  { path: 'client/public/assets/models/weapons/LaserGun.glb', name: 'LaserGun', color: [170, 0, 255] }
];

console.log('Generating 3D GLB models into client/public/assets/models/...');

const rootDir = path.resolve(__dirname, '../../');

modelsToCreate.forEach((item) => {
  const fullPath = path.join(rootDir, item.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const glbBuffer = createGLBBuffer(item.name, item.color);
  fs.writeFileSync(fullPath, glbBuffer);
  console.log(`✓ Created GLB model: ${item.path}`);
});

console.log('All 3D GLB models generated successfully!');
