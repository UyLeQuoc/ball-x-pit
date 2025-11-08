// Utility functions

import type { Vector2, Rectangle } from './types';

export function distance(a: Vector2, b: Vector2): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(v: Vector2): Vector2 {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function multiply(v: Vector2, scalar: number): Vector2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function add(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function circleRectCollision(
  circlePos: Vector2,
  radius: number,
  rect: Rectangle
): boolean {
  const closestX = Math.max(rect.x, Math.min(circlePos.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circlePos.y, rect.y + rect.height));
  
  const dx = circlePos.x - closestX;
  const dy = circlePos.y - closestY;
  
  return (dx * dx + dy * dy) < (radius * radius);
}

export function circleCircleCollision(
  pos1: Vector2,
  radius1: number,
  pos2: Vector2,
  radius2: number
): boolean {
  return distance(pos1, pos2) < (radius1 + radius2);
}

export function rectRectCollision(a: Rectangle, b: Rectangle): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function angleBetween(a: Vector2, b: Vector2): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

export function rotateVector(v: Vector2, angle: number): Vector2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos
  };
}

export function reflectVector(v: Vector2, normal: Vector2): Vector2 {
  const dot = v.x * normal.x + v.y * normal.y;
  return {
    x: v.x - 2 * dot * normal.x,
    y: v.y - 2 * dot * normal.y
  };
}

export function getColumnFromX(x: number, columnWidth: number): number {
  return Math.floor(x / columnWidth);
}

export function getXFromColumn(column: number, columnWidth: number): number {
  return column * columnWidth + columnWidth / 2;
}

export function calculateXPRequired(level: number, baseXP: number, scaling: number): number {
  return Math.floor(baseXP * Math.pow(scaling, level - 1));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

