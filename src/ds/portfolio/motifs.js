/**
 * The eight stamped symbols a book can carry, drawn with canvas 2D. Shared by the
 * spine and cover textures in ShelfBooks and the emblem in BookSpread, so the
 * symbol on the shelf is the one at the top of the open book. No three.js here.
 *
 * Draws motif `motif` (0-7) centred in the square at (x, y) of side `size`.
 */
export function drawMotif(context, motif, x, y, size, color) {
  context.save();
  context.translate(x + size / 2, y + size / 2);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = Math.max(2, size * 0.035);

  if (motif === 0) {
    for (let index = -2; index <= 2; index += 1) {
      context.beginPath();
      context.arc(0, 0, size * (0.12 + index * 0.035), 0, Math.PI * 2);
      context.stroke();
    }
  } else if (motif === 1) {
    context.rotate(Math.PI / 4);
    for (let index = -1; index <= 1; index += 1) {
      context.strokeRect(-size * (0.24 + index * 0.055), -size * (0.24 + index * 0.055), size * (0.48 + index * 0.11), size * (0.48 + index * 0.11));
    }
  } else if (motif === 2) {
    for (let index = 0; index < 6; index += 1) {
      context.rotate(Math.PI / 3);
      context.beginPath();
      context.roundRect(-size * 0.045, -size * 0.36, size * 0.09, size * 0.28, size * 0.04);
      context.fill();
    }
    context.beginPath();
    context.arc(0, 0, size * 0.11, 0, Math.PI * 2);
    context.fill();
  } else if (motif === 3) {
    context.beginPath();
    for (let index = 0; index < 12; index += 1) {
      const radius = index % 2 ? size * 0.17 : size * 0.35;
      const angle = -Math.PI / 2 + (index * Math.PI) / 6;
      if (index === 0) context.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    context.closePath();
    context.stroke();
  } else if (motif === 4) {
    for (let row = -2; row <= 2; row += 1) {
      for (let column = -2; column <= 2; column += 1) {
        if ((row + column) % 2 === 0) {
          context.beginPath();
          context.arc(column * size * 0.13, row * size * 0.13, size * 0.035, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
  } else if (motif === 5) {
    for (let index = -2; index <= 2; index += 1) {
      context.beginPath();
      context.moveTo(-size * 0.34, index * size * 0.12);
      context.bezierCurveTo(-size * 0.12, index * size * 0.12 - size * 0.11, size * 0.12, index * size * 0.12 + size * 0.11, size * 0.34, index * size * 0.12);
      context.stroke();
    }
  } else if (motif === 6) {
    context.beginPath();
    context.moveTo(0, -size * 0.37);
    context.lineTo(size * 0.34, size * 0.28);
    context.lineTo(-size * 0.34, size * 0.28);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.arc(0, size * 0.02, size * 0.11, 0, Math.PI * 2);
    context.fill();
  } else {
    context.rotate(Math.PI / 4);
    context.fillRect(-size * 0.035, -size * 0.36, size * 0.07, size * 0.72);
    context.fillRect(-size * 0.36, -size * 0.035, size * 0.72, size * 0.07);
    context.beginPath();
    context.arc(0, 0, size * 0.25, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}
