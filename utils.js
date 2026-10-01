
function randint(l, r) {
  return l + floor(random(0, r-l+1));
}

const dirX = [0, 0, -1, 1];
const dirY = [1, -1, 0, 0];

/*
 * @name Star
 * @arialabel Grey background with three white shapes rotating with black outlines. From left to right, a 3-pointed star, a 40-pointed shape, and a 5-pointed star
 * @description The star() function created for this example is capable of
 * drawing a wide range of different forms. Try placing different numbers
 * into the star() function calls within draw() to explore.
 */
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
