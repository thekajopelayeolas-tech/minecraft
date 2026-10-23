import { BLOCKS } from './blocks.js';
import { Inventory, HOTBAR_SIZE, INVENTORY_SIZE, matchRecipe, craft } from './inventory.js';

const hex = (c) => '#' + c.toString(16).padStart(6, '0');

function makeSlot(keyLabel = '') {
  const el = document.createElement('div');
  el.className = 'slot';
  el.innerHTML = `<span class="key">${keyLabel}</span><div class="swatch"></div><span class="count"></span>`;
  return el;
}

// Draws a stack (or an empty slot) inside a slot element.
function paint(el, stack, active = false) {
  el.classList.toggle('active', active);
  el.querySelector('.swatch').style.background = stack ? hex(BLOCKS[stack.id].top) : 'transparent';
  el.querySelector('.count').textContent = stack && stack.count > 1 ? String(stack.count) : '';
}

export function createUI(inventory) {
  const hotbarEl = document.getElementById('hotbar');
  const healthEl = document.getElementById('health');
  const invEl = document.getElementById('inventory');
  const mainEl = document.getElementById('inv-main');
  const rowEl = document.getElementById('inv-hotbar');
  const craftEl = document.getElementById('inv-craft');
  const outEl = document.getElementById('inv-output');

  const craftGrid = [null, null, null, null];
  let cursor = null; // stack held by the mouse while the inventory is open
  let selected = 0;
  let shownHealth = null;

  const cursorEl = makeSlot();
  cursorEl.classList.add('floating');
  cursorEl.style.display = 'none';
  document.getElementById('app').appendChild(cursorEl);

  function refresh() {
    hotbarSlots.forEach((el, i) => paint(el, inventory.get(i), i === selected));
    rowSlots.forEach((el, i) => paint(el, inventory.get(i), i === selected));
    mainSlots.forEach((el, k) => paint(el, inventory.get(HOTBAR_SIZE + k)));
    craftSlots.forEach((el, i) => paint(el, craftGrid[i]));
    const recipe = matchRecipe(craftGrid);
    paint(outSlot, recipe ? recipe.output : null);
    if (cursor) {
      paint(cursorEl, cursor);
      cursorEl.style.display = 'block';
    } else {
      cursorEl.style.display = 'none';
    }
  }

  function clickInventory(index) {
    cursor = Inventory.clickSlot(inventory.slots, index, cursor);
    refresh();
  }

  // Hotbar HUD (always visible): 9 slots showing the first 9 inventory stacks.
  const hotbarSlots = [];
  for (let i = 0; i < HOTBAR_SIZE; i++) {
    const el = makeSlot(String((i + 1) % 10));
    hotbarEl.appendChild(el);
    hotbarSlots.push(el);
  }

  // Inventory screen: main grid, hotbar row, 2x2 craft grid, and output.
  const mainSlots = [];
  for (let k = 0; k < INVENTORY_SIZE - HOTBAR_SIZE; k++) {
    const el = makeSlot();
    el.addEventListener('mousedown', () => clickInventory(HOTBAR_SIZE + k));
    mainEl.appendChild(el);
    mainSlots.push(el);
  }
  const rowSlots = [];
  for (let i = 0; i < HOTBAR_SIZE; i++) {
    const el = makeSlot(String((i + 1) % 10));
    el.addEventListener('mousedown', () => clickInventory(i));
    rowEl.appendChild(el);
    rowSlots.push(el);
  }
  const craftSlots = [];
  for (let i = 0; i < 4; i++) {
    const el = makeSlot();
    el.addEventListener('mousedown', () => {
      // Left click places one item per cell (like Minecraft's crafting grid).
      const cell = craftGrid[i];
      if (cursor && (!cell || cell.id === cursor.id)) {
        craftGrid[i] = { id: cursor.id, count: (cell ? cell.count : 0) + 1 };
        cursor.count -= 1;
        if (cursor.count <= 0) cursor = null;
      } else if (!cursor && cell) {
        // Taking an item from the grid returns it to the cursor.
        cursor = { id: cell.id, count: cell.count };
        craftGrid[i] = null;
      }
      refresh();
    });
    craftEl.appendChild(el);
    craftSlots.push(el);
  }
  const outSlot = makeSlot();
  outSlot.addEventListener('mousedown', () => {
    const recipe = matchRecipe(craftGrid);
    if (!recipe) return;
    // Crafting only happens when the output fits and the held stack is compatible.
    if (cursor && (cursor.id !== recipe.output.id || cursor.count + recipe.output.count > 64)) return;
    if (craft(craftGrid, inventory)) refresh();
  });
  outEl.appendChild(outSlot);

  document.addEventListener('mousemove', (e) => {
    cursorEl.style.left = e.clientX + 'px';
    cursorEl.style.top = e.clientY + 'px';
  });

  function renderHealth(health, max) {
    if (health === shownHealth) return;
    shownHealth = health;
    healthEl.innerHTML = '';
    for (let i = 0; i < max / 2; i++) {
      const left = health - i * 2;
      const heart = document.createElement('span');
      heart.className = 'heart ' + (left >= 2 ? 'full' : left === 1 ? 'half' : 'empty');
      heart.textContent = '\u2665';
      healthEl.appendChild(heart);
    }
  }

  function open() {
    invEl.classList.remove('hidden');
    refresh();
  }

  // Returns anything held by the mouse or left in the crafting grid to the inventory.
  function close() {
    if (cursor) {
      inventory.add(cursor.id, cursor.count);
      cursor = null;
    }
    craftGrid.forEach((stack, i) => {
      if (stack) {
        inventory.add(stack.id, stack.count);
        craftGrid[i] = null;
      }
    });
    invEl.classList.add('hidden');
    refresh();
  }

  function setSelected(i) {
    selected = i;
    refresh();
  }

  refresh();
  return { refresh, setSelected, renderHealth, open, close };
}
