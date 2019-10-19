
window.requestAnimFrame = (function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) { window.setTimeout(a, 1E3 / 60); }; }());

const planeObj = {};

planeObj.util = {
  rand(min, max) {
    return Math.random() * (max - min) + min;
  },
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  norm(val, min, max) {
    return (val - min) / (max - min);
  },
  lerp(norm, min, max) {
    return (max - min) * norm + min;
  },
  map(val, sMin, sMax, dMin, dMax) {
    return planeObj.util.lerp(planeObj.util.norm(val, sMin, sMax), dMin, dMax);
  },
  clamp(val, min, max) {
    return Math.min(Math.max(val, Math.min(min, max)), Math.max(min, max));
  },
  distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  angle(p1, p2) {
    return Math.atan2(p1.y - p2.y, p1.x - p2.x);
  },
  inRange(val, min, max) {
    return val >= Math.min(min, max) && val <= Math.max(min, max);
  },
  pointInRect(x, y, rect) {
    return planeObj.util.inRange(x, rect.x, rect.x + rect.width)
      && planeObj.util.inRange(y, rect.y, rect.y + rect.height);
  },
  pointInArc(p, a) {
    return this.distance(p, a) <= a.radius;
  },
  setProps(obj, props) {
    // eslint-disable-next-line guard-for-in
    for (const k in props) {
      obj[k] = props[k];
    }
  },
  multicurve(points, ctx) {
    let p0; let p1; let midx; let
      midy;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 2; i += 1) {
      p0 = points[i];
      p1 = points[i + 1];
      midx = (p0.x + p1.x) / 2;
      midy = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midx, midy);
    }
    p0 = points[points.length - 2];
    p1 = points[points.length - 1];
    ctx.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y);
  },
};

planeObj.init = function () {
  // setup
  planeObj.c = document.createElement('canvas');
  planeObj.ctx = planeObj.c.getContext('2d');
  document.body.appendChild(planeObj.c);

  // collections
  planeObj.ports = [];
  planeObj.planes = [];

  // events
  window.addEventListener('resize', planeObj.reset, false);
  window.addEventListener('click', planeObj.reset, false);
  planeObj.reset();
  planeObj.step();
};

planeObj.reset = function () {
  // dimensions
  planeObj.cw = planeObj.c.width = window.innerWidth;
  planeObj.ch = planeObj.c.height = window.innerHeight;
  planeObj.dimAvg = (planeObj.cw + planeObj.ch) / 2;

  // type / font
  planeObj.ctx.textAlign = 'center';
  planeObj.ctx.textBaseline = 'middle';
  planeObj.ctx.font = '16px monospace';

  // options / settings
  planeObj.opt = {};
  planeObj.opt.portCount = 2;
  planeObj.opt.planeCount = 1;
  planeObj.opt.portSpacingDist = planeObj.dimAvg / planeObj.opt.portCount;
  planeObj.opt.holdingDist = 5;
  planeObj.opt.approachDist = 80;
  planeObj.opt.planeDist = 20;
  planeObj.opt.pathSpacing = 15;
  planeObj.opt.pathCount = 40;
  planeObj.opt.avoidRadius = 30;
  planeObj.opt.avoidMult = 0.025;

  // collections
  planeObj.ports.length = 0;
  planeObj.planes.length = 0;

  // delta
  planeObj.lt = Date.now();
  planeObj.dt = 1;
  planeObj.et = 0;
  planeObj.tick = 0;

  // setup ports
  for (var i = 0; i < planeObj.opt.portCount; i++) {
    planeObj.ports.push(new planeObj.Port());
  }

  // setup planes
  for (var i = 0; i < planeObj.opt.planeCount; i++) {
    planeObj.planes.push(new planeObj.Plane());
  }
};

planeObj.Port = function () {
  this.x = planeObj.util.rand(planeObj.cw * 0.1, planeObj.cw * 0.9);
  this.y = planeObj.util.rand(planeObj.ch * 0.1, planeObj.ch * 0.9);
  while (!this.validSpacing()) {
    this.x = planeObj.util.rand(planeObj.cw * 0.1, planeObj.cw * 0.9);
    this.y = planeObj.util.rand(planeObj.ch * 0.1, planeObj.ch * 0.9);
  }
};

planeObj.Port.prototype.validSpacing = function () {
  let spaced = true;
  let i = planeObj.ports.length;
  while (i--) {
    const otherPort = planeObj.ports[i];
    if (planeObj.util.distance(otherPort, this) < planeObj.opt.portSpacingDist) {
      spaced = false;
      break;
    }
  }
  return spaced;
};

planeObj.Port.prototype.update = function (i) {
  let j = planeObj.planes.length;
  this.approachingCount = 0;
  while (j--) {
    const plane = planeObj.planes[j];
    if (plane.destIndex == i && plane.approaching) {
      this.approachingCount++;
    }
  }
};

planeObj.Port.prototype.render = function (i) {
  planeObj.ctx.beginPath();
  planeObj.ctx.arc(this.x, this.y, 3 + (this.approachingCount + 5), 0, Math.PI * 2);
  planeObj.ctx.fillStyle = 'hsla(120, 90%, 80%, planeObj{  0.35 + Math.sin(planeObj.et / 20) * 0.2  })';
  planeObj.ctx.fill();

  planeObj.ctx.fillStyle = '#fff';
  planeObj.ctx.fillText(this.approachingCount, this.x, this.y - 30);
};

planeObj.Plane = function (opt) {
  this.originIndex = planeObj.util.randInt(0, planeObj.ports.length - 1);
  this.origin = planeObj.ports[this.originIndex];
  this.path = [];
  this.x = this.origin.x;
  this.y = this.origin.y;
  this.vx = planeObj.util.rand(-0.35, 0.35);
  this.vy = planeObj.util.rand(-0.35, 0.35);
  this.vmax = 1;
  this.accel = 0.01;
  this.decel = 0.96;
  this.angle = 0;
  this.approaching = false;
  this.holding = false;
  this.setDest();
};

planeObj.Plane.prototype.setDest = function () {
  if (this.destIndex != undefined) {
    this.originIndex = this.destIndex;
    this.origin = planeObj.ports[this.originIndex];
  }
  this.destIndex = planeObj.util.randInt(0, planeObj.ports.length - 1);
  while (this.destIndex == this.originIndex) {
    this.destIndex = planeObj.util.randInt(0, planeObj.ports.length - 1);
  }
  this.dest = planeObj.ports[this.destIndex];
  this.approaching = false;
  this.holding = false;
};

planeObj.Plane.prototype.update = function (i) {
  this.ox = this.x;
  this.oy = this.y;
  if (planeObj.tick % planeObj.opt.pathSpacing == 0) {
    this.path.push({ x: this.x, y: this.y });
  }
  if (this.path.length > planeObj.opt.pathCount) {
    this.path.shift();
  }

  this.angle = planeObj.util.angle(this.dest, this);
  this.speed = (Math.abs(this.vx) + Math.abs(this.vy)) / 2;

  if (!planeObj.util.pointInRect(this.x, this.y, {
    x: 0, y: 0, width: planeObj.cw, height: planeObj.ch,
  })) {
    this.vx *= this.decel;
    this.vy *= this.decel;
  }

  if (this.speed > 0.1) {
    if (planeObj.util.distance(this.dest, this) < planeObj.opt.approachDist) {
      this.vx *= this.decel;
      this.vy *= this.decel;
      this.approaching = true;
    }
  }

  if (planeObj.util.distance(this.dest, this) < planeObj.opt.holdingDist) {
    this.holding = true;
    this.setDest();
  }

  // plane checks
  /* var j = i;
  while( j-- ) {
    var otherPlane = planeObj.planes[ j ];
    if( planeObj.util.distance( otherPlane, this ) < planeObj.opt.avoidRadius ) {
      var angle = planeObj.util.angle( otherPlane, this );
      var changer = ( ( Math.abs( this.vx ) + Math.abs( this.vy ) + Math.abs( otherPlane.vx ) + Math.abs( otherPlane.vy ) ) / 4 ) * planeObj.opt.avoidMult;
      this.vx -= Math.cos( angle ) * changer;
      this.vy -= Math.sin( angle ) * changer;
      otherPlane.vx += Math.cos( angle ) * changer;
      otherPlane.vy += Math.sin( angle ) * changer;
    }
  } */

  this.vx += Math.cos(this.angle) * this.accel;
  this.vy += Math.sin(this.angle) * this.accel;
  if (this.speed > this.vmax) {
    this.vx *= this.decel;
    this.vy *= this.decel;
  }

  this.x += this.vx * planeObj.dt;
  this.y += this.vy * planeObj.dt;
};

planeObj.Plane.prototype.render = function (i) {
  if (this.approaching) {
    planeObj.ctx.strokeStyle = 'hsla(0, 80%, 50%, 1)';
  } else {
    planeObj.ctx.strokeStyle = 'hsla(180, 80%, 50%, 1)';
  }

  planeObj.ctx.beginPath();
  planeObj.ctx.moveTo(this.x, this.y);
  var angle = planeObj.util.angle({ x: this.ox, y: this.oy }, this);
  planeObj.ctx.lineWidth = 2;
  planeObj.ctx.lineTo(
    this.x - Math.cos(angle) * (3 + this.speed * 2),
    this.y - Math.sin(angle) * (3 + this.speed * 2),
  );
  planeObj.ctx.stroke();

  const pathLength = this.path.length;
  if (pathLength > 1) {
    planeObj.ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.15)';
    planeObj.ctx.lineWidth = 1;
    planeObj.ctx.beginPath();

    if (pathLength >= planeObj.opt.pathCount) {
      var angle = planeObj.util.angle(this.path[1], this.path[0]);
      const dx = this.path[0].x - this.path[1].x;
      const dy = this.path[0].y - this.path[1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      var x = this.path[0].x + Math.cos(angle) * (dist * ((planeObj.tick % planeObj.opt.pathSpacing) / planeObj.opt.pathSpacing));
      var y = this.path[0].y + Math.sin(angle) * (dist * ((planeObj.tick % planeObj.opt.pathSpacing) / planeObj.opt.pathSpacing));
    } else {
      var { x } = this.path[0];
      var { y } = this.path[0];
    }

    planeObj.ctx.moveTo(x, y);
    for (var i = 1; i < pathLength; i++) {
      const point = this.path[i];
      planeObj.ctx.lineTo(point.x, point.y);
    }
    planeObj.ctx.lineTo(this.x, this.y);
    planeObj.ctx.stroke();
  }
};

planeObj.step = function () {
  requestAnimFrame(planeObj.step);

  // clear
  planeObj.ctx.globalCompositeOperation = 'destination-out';
  planeObj.ctx.fillStyle = 'hsla(0, 0%, 0%, 1)';
  planeObj.ctx.fillRect(0, 0, planeObj.cw, planeObj.ch);
  planeObj.ctx.globalCompositeOperation = 'lighter';

  // collections
  let i;
  i = planeObj.ports.length; while (i--) { planeObj.ports[i].update(i); }
  i = planeObj.planes.length; while (i--) { planeObj.planes[i].update(i); }
  i = planeObj.ports.length; while (i--) { planeObj.ports[i].render(i); }
  i = planeObj.planes.length; while (i--) { planeObj.planes[i].render(i); }

  // delta
  const now = Date.now();
  planeObj.dt = planeObj.util.clamp((now - planeObj.lt) / (1000 / 60), 0.001, 10);
  planeObj.lt = now;
  planeObj.et += planeObj.dt;
  planeObj.tick++;
};

planeObj.init();
