export const LEVELS = [
  {
    id: 1,
    title: 'First Launch',
    hint: 'Drag a to change arc width. Drag h to move the peak left or right.',
    target: { x: 9, y: 1.8, radius: 0.45 },
    defaultParams: { a: -0.14, h: 4.5 },
    starThresholds: [2, 6], // ≤2 moves = 3★, ≤6 = 2★, more = 1★
  },
  {
    id: 2,
    title: 'High Shelf',
    hint: 'The pig is elevated. Move h left so the arc peaks sooner, then tune a.',
    target: { x: 6.5, y: 4.0, radius: 0.45 },
    defaultParams: { a: -0.18, h: 4.5 },
    starThresholds: [2, 6],
  },
  {
    id: 3,
    title: 'Long Shot',
    hint: 'Far and elevated. Push h right so the peak is near the middle of the flight.',
    target: { x: 9, y: 3.2, radius: 0.40 },
    defaultParams: { a: -0.08, h: 6.5 },
    starThresholds: [2, 6],
  },
];
