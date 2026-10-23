// Block registry. Colors are per face: top, side, bottom (hex).
// Id 0 is air and is never rendered.
export const BLOCKS = {
  0: { name: 'Air', solid: false, transparent: true },
  1: { name: 'Grass', top: 0x5fb83a, side: 0x7a5a3a, bottom: 0x6b4b2f },
  2: { name: 'Dirt', top: 0x7a5a3a, side: 0x7a5a3a, bottom: 0x7a5a3a },
  3: { name: 'Stone', top: 0x7d7d7d, side: 0x737373, bottom: 0x6a6a6a },
  4: { name: 'Cobblestone', top: 0x6e6e6e, side: 0x5f5f5f, bottom: 0x555555 },
  5: { name: 'Sand', top: 0xdccb8a, side: 0xd2bf7c, bottom: 0xc7b572 },
  6: { name: 'Oak Log', top: 0xb08a4f, side: 0x6b4f2a, bottom: 0xb08a4f },
  7: { name: 'Oak Planks', top: 0xb8925a, side: 0xb8925a, bottom: 0xb8925a },
  8: { name: 'Leaves', top: 0x3f8f2a, side: 0x3f8f2a, bottom: 0x3f8f2a, transparent: true },
  9: { name: 'Water', top: 0x2e6fd1, side: 0x2e6fd1, bottom: 0x2e6fd1, transparent: true, solid: false, liquid: true },
  10: { name: 'Glass', top: 0xbfe6ff, side: 0xbfe6ff, bottom: 0xbfe6ff, transparent: true },
  11: { name: 'Bricks', top: 0x9b4a3a, side: 0x9b4a3a, bottom: 0x9b4a3a },
  12: { name: 'Snow', top: 0xf5f9ff, side: 0xe4ecf5, bottom: 0xd6e0ea },
  13: { name: 'Gravel', top: 0x8c8685, side: 0x857e7d, bottom: 0x7b7372 },
};

export const HOTBAR_BLOCKS = [1, 2, 3, 4, 5, 6, 7, 8, 11];

export function isSolid(id) {
  const b = BLOCKS[id];
  return !!b && id !== 0 && b.solid !== false;
}

export function isTransparent(id) {
  const b = BLOCKS[id];
  return !b || id === 0 || !!b.transparent;
}
