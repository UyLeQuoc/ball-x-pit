// Input handling system

import type { InputState } from './types';

export function createInputState(): InputState {
  return {
    keys: new Set<string>(),
    mouse: {
      x: 0,
      y: 0,
      pressed: false
    }
  };
}

export function setupInputHandlers(canvas: HTMLCanvasElement, input: InputState): void {
  // Keyboard handlers
  window.addEventListener('keydown', (e) => {
    input.keys.add(e.key.toLowerCase());
    
    // Prevent default for game keys
    if (['a', 'd', 'arrowleft', 'arrowright', ' ', 'escape'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  });
  
  window.addEventListener('keyup', (e) => {
    input.keys.delete(e.key.toLowerCase());
  });
  
  // Mouse handlers
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    input.mouse.x = e.clientX - rect.left;
    input.mouse.y = e.clientY - rect.top;
  });
  
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      input.mouse.pressed = true;
      e.preventDefault();
    }
  });
  
  canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      input.mouse.pressed = false;
    }
  });
  
  canvas.addEventListener('mouseleave', () => {
    input.mouse.pressed = false;
  });
  
  // Prevent context menu
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

export function isKeyPressed(input: InputState, key: string): boolean {
  return input.keys.has(key.toLowerCase());
}

export function isMousePressed(input: InputState): boolean {
  return input.mouse.pressed;
}

export function getMousePosition(input: InputState): { x: number; y: number } {
  return { x: input.mouse.x, y: input.mouse.y };
}

export function clearMousePress(input: InputState): void {
  input.mouse.pressed = false;
}

