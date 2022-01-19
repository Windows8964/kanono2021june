const config = require("./config.json");
const entityConfig = require("./entityConfig.js");
const util = require("util");
const botNames = require("./botNames.js");
const protocol = require("./protocol/protocol.js");
const Quadtree = require("./lib/quadtree.js");
const WebSocket = require('ws');
const http = require('http');
let ipBans = require("./db/ipbans.json");
const crypto = require("crypto");
const fs = require("fs");
const prefix = "---===>>> ";
const server = {
  entityTypesPacket: 0,
  fps: 30,
  level45Score: 22275,
};
var express = require('express');
const {
    clearInterval
} = require("timers");
var app = express();
var expressWs = require('express-ws')(app);

if (config.hostClient) app.use(express.static('client'));
app.get('/', function(req, res, next) {
    console.log('get route', req.testing);
    res.end();
});
app.listen(config.port);
/*const wss = new WebSocket.Server({
  port: config.port
});*/
util.lerp = function(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
};

util.rectCollide = (rect1, rect2) => {
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y) {
    return true;
  }
  return false;
};

util.getNearest = function(pos, fov = 1000) {
  let entities = {};
  let nearest = "none";
  for (let key in room.entities) {
    let entity = room.entities[key];
    var dx = pos.x - entity.x;
    var dy = pos.y - entity.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < fov) {
      entities[key] = entity;
    };
  };
  for (let key in entities) {
    if (nearest == "none") nearest = key;
    let entity = entities[key];
    var dx = pos.x - entity.x;
    var dy = pos.y - entity.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    let entity2 = entities[nearest];
    var dx2 = pos.x - entity2.x;
    var dy2 = pos.y - entity2.y;
    var distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (distance < distance2) {
      nearest = key;
    };
  };
  return nearest;
};
util.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
util.getFOV = (size) => 1.75 * (Math.sqrt(size) / 7.5);
util.getSize = function(a) {
  return 50 + ((a * a) / 100) / (a < 0 ? -1 : 1)
};
util.getScoreFromLevel = function(a) {
  return ((a - 1) * (a - 1)) * 11;
};
util.getLevelFromScore = function(a) {
  return Math.floor(Math.sqrt(a / 11) + 1);
};
util.getSpeedFromLevel = function(a) {
  return 5 + ((20 - ((a - 1) / (a / 7.5))) * 1.5);
};
util.getRandomFromRange = function(a0, a1) {
    return a0 + (Math.random() * (a1 - a0));
};
util.getBasePos = function(a, b) {
  let baseSize = room.width / room.baseSize;
  switch (room.teamBaseMode) {
    case 0: { // 2 TDM
      switch (b) {
        case 0: { // Orange, down left corner
          if (a == 0) {
            return util.lerp(-(room.width / 2) + (baseSize / 2), -(room.width / 2) + (baseSize / 2) + baseSize, 0.5);
          } else return util.lerp(room.height / 2 - baseSize - (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2) + baseSize, 0.5);
        } break;
        case 1: { // Red, up right corner
          if (a == 0) {
            return util.lerp((room.width / 2 - baseSize) - (baseSize / 2), (room.width / 2 - baseSize) - (baseSize / 2) + baseSize, 0.5);
          } else return util.lerp(-(room.height / 2) + (baseSize / 2), -(room.height / 2) + (baseSize / 2) + baseSize, 0.5);
        } break;
      };
    } break;
    case 1: {
      switch (b) {
        case 0: { // Orange, down left corner
          if (a == 0) {
            return util.lerp(-(room.width / 2) + (baseSize / 2), -(room.width / 2) + (baseSize / 2) + baseSize, 0.5); // left
          } else return util.lerp(room.height / 2 - baseSize - (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2) + baseSize, 0.5); // bottom
        } break;
        case 1: { // Red, up right corner
          if (a == 0) {
            return util.lerp((room.width / 2 - baseSize) - (baseSize / 2), (room.width / 2 - baseSize) - (baseSize / 2) + baseSize, 0.5); // right
          } else return util.lerp(-(room.height / 2) + (baseSize / 2), -(room.height / 2) + (baseSize / 2) + baseSize, 0.5); // top
        } break;
        case 2: { // Green, down right corner
          if (a == 0) {
            return util.lerp(-(room.width / 2) + (baseSize / 2), -(room.width / 2) + (baseSize / 2) + baseSize, 0.5); // left
          } else return util.lerp(-(room.height / 2) + (baseSize / 2), -(room.height / 2) + (baseSize / 2) + baseSize, 0.5); // top
        } break;
        case 3: { // Blue, down right corner
          if (a == 0) {
            return util.lerp((room.width / 2 - baseSize) - (baseSize / 2), (room.width / 2 - baseSize) - (baseSize / 2) + baseSize, 0.5); // right
          } else return util.lerp(room.height / 2 - baseSize - (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2) + baseSize, 0.5); // bottom
        } break;
      };
    } break;
  };
};
util.lerpAngle = function(a, b, x) {
  var normal = {
    x: Math.cos(a),
    y: Math.sin(a)
  };
  var normal2 = {
    x: Math.cos(b),
    y: Math.sin(b)
  };
  var res = {
    x: util.lerp(normal.x, normal2.x, x),
    y: util.lerp(normal.y, normal2.y, x)
  };
  return Math.atan2(res.y, res.x);
};

server.entityTypesPacket = protocol.encode("entityTypes", JSON.stringify(entityConfig.entityTypeMockups));

const room = {
  width: config.width,
  height: config.height,
  entities: {},
  clients: {},
  closing: false,
  tree: new Quadtree({
    x: -config.width / 2,
    y: -config.height / 2,
    width: config.width,
    height: config.height
  }, 4),
  treeRefresh: function() {
    room.tree = new Quadtree({
      x: -room.width / 2 - config.mapBorderSize,
      y: -room.height / 2 - config.mapBorderSize,
      width: room.width + config.mapBorderSize,
      height: room.height + config.mapBorderSize
    }, 4);
  },
  shapeAmount: 0,
  maxShapes: config.maxShapesDependsOnMapSize ? (config.width + config.height) / 250 : config.maxShapes,
  gm: config.gm,
  teams: (function(){
    if (config.gm == "2tdm") return 2;
    if (config.gm == "4tdm") return 4;
    if (config.gm == "2dom") return 2;
    return false;
  })(),
  teamBaseMode: (function(){
    if (config.gm == "2tdm") return 0;
    if (config.gm == "4tdm") return 1;
    if (config.gm == "2dom") return 2;
    return -1;
  })(),
  ffa: (function(){
    if (config.gm == "ffa") return true;
    return false;
  })(),
  baseSize: 0,
  lb: [],
  restart: function(){
    room.treeRefresh();
    room.entities = {};
    for (let key in room.clients) {
      room.clients[key].close();
    };
  }
};
room.baseSize = (function(){
  switch (room.teamBaseMode) {
    case -1: return 0; break;
    case 0: return 12; break;
    case 1: return 12; break;
    case 2: return 12; break;
  }
})();

class IDGenerator {
  constructor() {
    this.id = 0;
  }
  generateId() {
    return this.id++;
  }
};

class Barrel {
  constructor(owner, reload = 1, delay, width, height, angle, offset, recoil, damageFactor = 1, rangeFactor = 1, penFactor = 1, spdFactor = 1, sprFactor = 1, canShoot) {
    this.owner = owner;
    this.reload = reload;
    this.delay = delay;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.offset = offset;
    this.recoil = recoil;
    this.damageFactor = damageFactor;
    this.rangeFactor = rangeFactor;
    this.penFactor = penFactor;
    this.spdFactor = spdFactor;
    this.canShoot = canShoot;
    this.barrelAnimation = 0;
    this.sprFactor = sprFactor;
    this.barrelAnimationResetTime = Date.now();
    this.reloadTime = 0;
    this.delayTime = 0;
    this.coolingDown = false;
    this.previousFrame = {
      shooting: false,
      skill: {
        rld: 0,
      },
    };
  }
  shoot() {
    if ((this.reloadTime + this.delayTime) != 0) {
      return;
    };
    this.barrelAnimationResetTime = Date.now() + (3000 / server.fps);
    this.barrelAnimation = 1;
    let entity = room.entities[this.owner];
    entity.vx -= Math.cos(entity.facing + this.angle) * (this.recoil * 2.5);
    entity.vy -= Math.sin(entity.facing + this.angle) * (this.recoil * 2.5);
    this.reloadTime = this.reload * (server.fps / 2) / Math.sqrt(Math.sqrt(room.entities[this.owner].skill.rld + 1));
    let x = (entity.x + Math.cos(entity.facing + this.angle) * entity.size * this.height) + Math.cos(entity.facing + this.angle + this.offset) * entity.size;
    let y = (entity.y + Math.sin(entity.facing + this.angle) * entity.size * this.height) + Math.sin(entity.facing + this.angle + this.offset) * entity.size;
    let bullet = new Entity(x, y, "", idGenerator.generateId(), entity.size * this.width / 2, "bullet");
    bullet.define("Bullet");
    bullet.shooting = true;
    bullet.showName = false;
    bullet.showHealth = false;
    let spraySize = (((Math.random() * 2) - 1) / 10) * this.sprFactor;
    bullet.vx = (Math.cos(entity.facing + this.angle + spraySize) * (20 + room.entities[this.owner].skill.bls * 1.5)) * this.spdFactor;
    bullet.vy = (Math.sin(entity.facing + this.angle + spraySize) * (20 + room.entities[this.owner].skill.bls * 1.5)) * this.spdFactor;
    bullet.decreaseVelocity = false;
    bullet.facing = entity.facing + Math.PI + this.angle;
    bullet.team = entity.team;
    bullet.diesOnRange = true;
    bullet.canBypassBorder = true;
    bullet.health = (1 + ((room.entities[this.owner].skill.pen / 2))) * this.penFactor;
    bullet.range = 60 + ((room.entities[this.owner].skill.pen) * 2);
    bullet.range *= this.rangeFactor;
    bullet.maxHealth = bullet.health;
    bullet.owner = this.owner;
    bullet.skill = {
      rld: room.entities[this.owner].skill.rld, // Reload
      spd: 0, // Movement Speed
      dmg: room.entities[this.owner].skill.dmg, // Bullet Damage
      pen: room.entities[this.owner].skill.pen, // Bullet penetration
      bls: room.entities[this.owner].skill.bls, // Bullet Speed
      hlt: 0, // Max health
      heal: 0, // Health Regen
      bdmg: 0, // Body Damage
    };
    bullet.color = room.entities[this.owner].color;
    bullet.damage = (1 + room.entities[this.owner].skill.dmg + (((room.entities[this.owner].skill.pen * this.penFactor) + 1) / 10)) * this.damageFactor;
  }
  loop() {
    if (this.barrelAnimationResetTime < Date.now()) this.barrelAnimation = 0;
    if (this.previousFrame.shooting != room.entities[this.owner].shooting) {
      if (room.entities[this.owner].shooting) {
        this.coolingDown = true;
        this.delayTime = this.delay * (server.fps / 2) / Math.sqrt(Math.sqrt(room.entities[this.owner].skill.rld + 1));
      } else {
        this.coolingDown = false;
      };
    };
    if (this.reloadTime >= 1) {
      this.reloadTime--;
    } else {
      if (this.reloadTime != 0) this.reloadTime = 0;
    };
    if (this.coolingDown) {
      this.delayTime--;
    } else {
      if (this.delayTime != 1) this.delayTime = 1;
    };
    if (this.delayTime <= 0) {
      this.delayTime = 0;
    };
    if (room.entities[this.owner].shooting) {
      this.shoot();
    };
    /*if (this.previousFrame.skill.rld != room.entities[this.owner].skill.rld) {
      this.reloadTime = this.delay * (server.fps / 2) / Math.sqrt(Math.sqrt(room.entities[this.owner].skill.rld + 1));
    };*/
    this.previousFrame.shooting = room.entities[this.owner].shooting;
    this.previousFrame.skill.rld = room.entities[this.owner].skill.rld; 
  }
}

class Entity {
  constructor(x, y, name, id, size = 10, type = "tank", connection = null, hasSpawnAnimation = false) {
    this.godMode = false;
    this.scoreLock = null;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.canMove = true;
    this.name = name;
    this.id = id;
    this.team = this.id;
    this.facing = 0;
    this.input = [0, 0, 0, 0];
    this.speed = 15;
    this.size = size;
    this.level = 1;
    this.maxLevel = 45;
    this.fieldFactor = 1;
    this.score = 0;
    this.fov = 1;
    this.class = 0;
    this.decreaseVelocity = true;
    this.showName = true;
    this.showHealth = true;
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.type = type;
    this.range = 60;
    this.shooting = false;
    this.barrels = [];
    this.orbitAngle = Math.random() * (Math.PI * 2);
    this.gottenUpgrades = {
      tier1: false,
      tier2: false,
      tier3: false,
    };
    this.upgradesToGet = {
      tier1: [],
      tier2: [],
      tier3: [],
    };
    this.diesOnRange = false;
    this.color = 9;
    this.moveDirection = Math.random() * (Math.PI * 2);
    this.connection = connection;
    this.addSize = 0;
    this.dieTime = 5;
    this.alpha = 1;
    this.canBypassBorder = false;
    this.onDeath = function() {};
    this.hasAI = false;
    this.AISettings = {
      fov: -1,
      ignoresOwnTeam: true,
      attacksDefaultTeam: true,
      runs: true,
    };
    this.lastCollided = null;
    this.lastHurtedEnemy = null;
    this.value = 0;
    this.gaveScore = false;
    this.owner = null;
    this.collides = true;
    this.damages = true;
    this.damage = 1;
    this.barrelFlash = 0;
    this.getPointsOn = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 32, 33, 35, 37, 39, 41, 43, 45];
    this.skill = {
      rld: 0, // Reload
      spd: 0, // Movement Speed
      dmg: 0, // Bullet Damage
      pen: 0, // Bullet penetration
      bls: 0, // Bullet Speed
      hlt: 0, // Max health
      heal: 0, // Health Regen
      bdmg: 0, // Body Damage
    };
    this.previousFrame = {
      health: 0,
      level: -1,
      score: -1,
      skill: {
        spd: 0, // Movement Speed
        hlt: 0,
        bdmg: 0,
      },
      class: this.class,
      dieTime: this.dieTime
    };
    this.healTime = Date.now() + 10000;
    this.barrelFlashResetTime = 0;
    this.upgrades = [];
    this.hasSpawnAnimation = false;
    this.spawnAnimation = 0;
    if (hasSpawnAnimation) {
      this.hasSpawnAnimation = true;
      this.alpha = 1;
      this.spawnAnimation = -30;
    };
    if (this.type == "tank") {
      switch (room.teams) {
        case 2: {
          this.color = Math.round(util.getRandomFromRange(9, 10));
          this.team = this.color == 9 ? 1 : 0;
        } break;
        case 4: {
          this.team = Math.floor(Math.random() * 4);
          this.color = [10, 9, 11, 6][this.team];
        } break;
      };
      if (room.ffa == false) {
        switch (room.teamBaseMode) {
          case 1:
          case 0: {
            let baseSize = room.width / room.baseSize;
            switch (this.team) {
              case 0: { // Orange
                this.x = util.getRandomFromRange(-(room.width / 2) + (baseSize / 2), -(room.width / 2) + (baseSize / 2) + baseSize); // left
                this.y = util.getRandomFromRange(room.height / 2 - baseSize - (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2) + baseSize); // bottom
              } break;
              case 1: { // Red
                this.x = util.getRandomFromRange((room.width / 2 - baseSize) - (baseSize / 2), (room.width / 2 - baseSize) - (baseSize / 2) + baseSize); // right
                this.y = util.getRandomFromRange(-(room.height / 2) + (baseSize / 2), -(room.height / 2) + (baseSize / 2) + baseSize); // up
              } break;
              case 2: { // Green
                this.x = util.getRandomFromRange(-(room.width / 2) + (baseSize / 2), -(room.width / 2) + (baseSize / 2) + baseSize); // left
                this.y = util.getRandomFromRange(-(room.height / 2) + (baseSize / 2), -(room.height / 2) + (baseSize / 2) + baseSize); // up
              } break;
              case 3: { // Blue
                this.x = util.getRandomFromRange((room.width / 2 - baseSize) - (baseSize / 2), (room.width / 2 - baseSize) - (baseSize / 2) + baseSize); // right
                this.y = util.getRandomFromRange(room.height / 2 - baseSize - (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2) + baseSize); // bottom
              } break;
            };
          } break;
        };
      };
    };
    this.goToBase = false;
    this.factor = {
      size: 1,
      speed: 1,
      health: 1,
    };
    this.showsOnLeaderboard = false;
    if (this.type == "tank") this.define("Tank");
    room.entities[this.id] = this;
  }
  define(id) {
    this.barrelFlash = 1;
    this.barrelFlashResetTime = 1;
    if (typeof id == "string") {
      id = entityConfig.stringEntityTypes[id];
    };
    this.class = id;
    this.barrels = [];
    for (let i = 0; i < entityConfig.entityTypes[id].barrels.length; i++) {
      let barrel = entityConfig.entityTypes[id].barrels[i];
      this.barrels.push(new Barrel(this.id, barrel.reload, barrel.delay, barrel.width, barrel.height / 3, barrel.angle, barrel.offset, barrel.recoil, barrel.bullet == undefined ? 1 : barrel.bullet.damageFactor, barrel.bullet == undefined ? 1 : barrel.bullet.rangeFactor, barrel.bullet == undefined ? 1 : barrel.bullet.penFactor, barrel.bullet == undefined ? 1 : barrel.bullet.spdFactor, barrel.bullet == undefined ? 1 : barrel.bullet.sprFactor, barrel.canShoot));
    };
    this.gottenUpgrades = {
      tier1: false,
      tier2: false,
      tier3: false,
    };
    this.upgrades = [];
    if (this.connection != null) this.connection.send(protocol.encode("upgradeReset"));
    this.upgradesToGet = entityConfig.upgradeTree[entityConfig.entityTypes[this.class].name];
    this.fieldFactor = entityConfig.entityTypes[id].fieldFactor || 1;
    this.factor.size = entityConfig.entityTypes[id].sizeFactor || 1;
    this.factor.speed = entityConfig.entityTypes[id].spdFactor || 1;
    this.canMove = entityConfig.entityTypes[id].canMove;
    this.factor.health = entityConfig.entityTypes[id].hltFactor || 1;
    this.fov = util.getFOV(this.size) * this.fieldFactor;
  };
  kill() {
    this.hasSpawnAnimation = false;
    this.dying = true;
  };
  loop() {
    if (this.godMode) {
      if (this.maxHealth != this.health) this.health = this.maxHealth;
    };
    if (this.scoreLock != null) {
      if (this.previousFrame.score != this.score) this.score = this.scoreLock;
    };
    if (this.hasSpawnAnimation) {
      this.spawnAnimation--
    };
    if (this.hasAI) {
      let entities = [];
      for (let key in room.entities) {
        if (key != this.id && (this.AISettings.ignoresOwnTeam ? room.entities[key].team != this.team : true) && (this.AISettings.attacksDefaultTeam ? room.entities[key].team != -1 : true) && room.entities[key].type == "tank") {
          entities.push({
            id: key,
            x: room.entities[key].x,
            y: room.entities[key].y,
            vx: room.entities[key].vx,
            vy: room.entities[key].vy,
          });
        };
      };
      let thisPos = {x: this.x, y: this.y};
      entities.sort(function(a, b) { return util.distance(thisPos, a) - util.distance(thisPos, b); });
      let entity = entities[0];
      if (entity != undefined) {
        this.facing = util.lerpAngle(this.facing, Math.atan2(entity.y + (entity.vy * 8) - this.y, entity.x + (entity.vx * 8) - this.x), 0.45);
        this.vx = util.lerp(this.vx, Math.cos(this.facing) * this.speed, 0.1);
        this.vy = util.lerp(this.vy, Math.sin(this.facing) * this.speed, 0.1);
        this.shooting = true;
      } else {
        this.shooting = false;
        this.facing+=0.025;
      };
    }
    if (this.type == "bDrone") {
      this.orbitAngle += 0.05;
      if (Math.random() > 0.999) this.orbitAngle += Math.PI
      if (this.orbitAngle > Math.PI * 2) this.orbitAngle -= Math.PI * 2;
      let entities = [];
      for (let key in room.entities) {
        if (key != this.id && room.entities[key].team != this.team && room.entities[key].team != -1 && room.entities[key].type == "tank") {
          entities.push({
            id: key,
            x: room.entities[key].x,
            y: room.entities[key].y,
          });
        };
      };
      let thisPos = {x: this.x, y: this.y};
      entities.sort(function(a, b) { return util.distance(thisPos, a) - util.distance(thisPos, b); });
      let baseSize = room.width / room.baseSize;
      if (this.goToBase) {
        entities = [{x: util.getBasePos(0, this.team) + (Math.cos(this.orbitAngle) * 300), y: util.getBasePos(1, this.team) + (Math.sin(this.orbitAngle) * 300)}];
      };
      if (!this.goToBase) {
        if (entities.length == 0) {
          entities = [{x: util.getBasePos(0, this.team) + (Math.cos(this.orbitAngle) * 300), y: util.getBasePos(1, this.team) + (Math.sin(this.orbitAngle) * 300)}];
        } else if (util.distance(thisPos, entities[0]) > 3000) {
          entities = [{x: util.getBasePos(0, this.team) + (Math.cos(this.orbitAngle) * 300), y: util.getBasePos(1, this.team) + (Math.sin(this.orbitAngle) * 300)}];
        };
      };
      if (util.distance({x: util.getBasePos(0, this.team), y: util.getBasePos(1, this.team)}, thisPos) > 3000) {
        this.goToBase = true;
        entities = [{x: util.getBasePos(0, this.team) + (Math.cos(this.orbitAngle) * 300), y: util.getBasePos(1, this.team) + (Math.sin(this.orbitAngle) * 300)}];
      };
      if (util.distance({x: util.getBasePos(0, this.team), y: util.getBasePos(1, this.team)}, thisPos) < 500) {
        this.goToBase = false;
      };
      let entity = entities[0];
      this.facing = util.lerpAngle(this.facing, Math.atan2(entity.y - this.y, entity.x - this.x) + Math.PI, 0.45);
      this.vx = util.lerp(this.vx, Math.cos(this.facing + Math.PI) * this.speed, 0.1);
      this.vy = util.lerp(this.vy, Math.sin(this.facing + Math.PI) * this.speed, 0.1);
    };
    if (this.barrelFlashResetTime == 0) this.barrelFlash = 0;
    if (this.barrelFlashResetTime != 0) this.barrelFlashResetTime = 0;
    for (let key in this.skill) {
      if (this.skill[key] >= 9) {
        this.skill[key] = 8;
      };
    };
    for (let key in this.barrels) {
      if (this.barrels[key].canShoot) this.barrels[key].loop();
    };
    this.health += (1 / this.maxHealth) * (this.skill.heal / 500);
    // 10 second heal system
    if (this.health <= 0) this.kill();
    if (this.health < this.previousFrame.health) this.healTime = Date.now() + 10000; // Wait for 10 seconds to heal
    if (this.health != this.previousFrame.health) {
      // Check if our health is more than our max health. if it is, make our health our max health.
      if (this.health > this.maxHealth) this.health = this.maxHealth;
    };
    this.previousFrame.health = this.health;
    if (this.healTime < Date.now()) this.health += 0.1;
    if (this.type == "food") {
      this.moveDirection += 0.005;
      if (this.moveDirection > Math.PI * 2) this.moveDirection -= Math.PI * 2;
      this.facing += 0.01;
      if (this.facing > Math.PI * 2) this.facing -= Math.PI * 2;
      this.vx += Math.cos(this.moveDirection) / 8;
      this.vy += Math.sin(this.moveDirection) / 8;
    };
    if (this.score != this.previousFrame.score) {
      this.level = util.getLevelFromScore(this.score);
    };
    if (this.skill.hlt != this.previousFrame.skill.hlt && this.type == "tank" && this.previousFrame.class != this.class) {
      let previousHealth = this.health / this.maxHealth
      this.maxHealth = 10 + ((this.skill.hlt * this.skill.hlt) / 50);
      this.maxHealth *= this.factor.health;
      this.health = this.maxHealth / previousHealth;
    };
    if (this.skill.bdmg != this.previousFrame.skill.bdmg && this.type == "tank") {
      this.damage = 1 + (this.skill.bdmg * this.skill.bdmg)
    };
    if (this.type == "tank") {
      if (this.level != this.previousFrame.level || this.skill.spd != this.previousFrame.skill.spd || this.upgradesToGet != this.previousFrame.upgradesToGet) {
        if (this.upgradesToGet.tier1.length != 0) {
          if (this.level >= config.tierConfig.tier1 && !this.gottenUpgrades.tier1) {
            this.gottenUpgrades.tier1 = true;
            for (let i = 0; i < this.upgradesToGet.tier1.length; i++) {
              this.upgrades.push(this.upgradesToGet.tier1[i]);
              if (this.connection != null) this.connection.send(protocol.encode("upgrade", this.upgradesToGet.tier1[i]));
            };
          };
        };
        if (this.upgradesToGet.tier2.length != 0) {
          if (this.level >= config.tierConfig.tier2 && !this.gottenUpgrades.tier2) {
            this.gottenUpgrades.tier2 = true;
            for (let i = 0; i < this.upgradesToGet.tier2.length; i++) {
              this.upgrades.push(this.upgradesToGet.tier2[i]);
              if (this.connection != null) this.connection.send(protocol.encode("upgrade", this.upgradesToGet.tier2[i]));
            };
          };
        };
        if (this.upgradesToGet.tier3.length != 0) {
          if (this.level >= config.tierConfig.tier3 && !this.gottenUpgrades.tier3) {
            this.gottenUpgrades.tier3 = true;
            for (let i = 0; i < this.upgradesToGet.tier3.length; i++) {
              this.upgrades.push(this.upgradesToGet.tier3[i]);
              if (this.connection != null) this.connection.send(protocol.encode("upgrade", this.upgradesToGet.tier3[i]));
            };
          };
        };
        if (this.level > this.maxLevel) {
          this.level = this.maxLevel;
        };
        this.fov = util.getFOV(this.size) * this.fieldFactor;
        this.speed = (util.getSpeedFromLevel(this.level) * ((this.skill.spd / 10) + 1)) * this.factor.speed;
        this.size = (util.getSize(this.level) * this.factor.size) + this.addSize;
      };
    };
    if (this.previousFrame.dieTime != this.dieTime && this.type == "tank") {
      this.size = (util.getSize(this.level) * this.factor.size) + this.addSize;
    };
    this.previousFrame.upgradesToGet = this.upgradesToGet;
    this.previousFrame.score = this.score;
    this.previousFrame.skill.spd = this.skill.spd;
    this.previousFrame.skill.hlt = this.skill.hlt;
    this.previousFrame.skill.bdmg = this.skill.bdmg;
    this.previousFrame.class = this.class;
    this.previousFrame.level = this.level;
    this.previousFrame.dieTime = this.dieTime;
    if (this.decreaseVelocity) {
      this.vx = util.lerp(this.vx, 0, 0.1);
      this.vy = util.lerp(this.vy, 0, 0.1);
    };
    if (this.input[0]) this.vx = util.lerp(this.vx, -this.speed, 0.1);
    if (this.input[1]) this.vx = util.lerp(this.vx, this.speed, 0.1);
    if (this.input[2]) this.vy = util.lerp(this.vy, -this.speed, 0.1);
    if (this.input[3]) this.vy = util.lerp(this.vy, this.speed, 0.1);
    if (this.diesOnRange) {
      this.range--;
      if (this.range < 0) {
        this.kill();
      };
    };
    if (this.canMove != false) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      if (this.vx != 0) this.vx = 0;
      if (this.vy != 0) this.vy = 0;
    }
    if (!this.canBypassBorder) {
      if (this.x > (room.width - room.width / 2) + config.mapBorderSize) this.x = (room.width - room.width / 2) + config.mapBorderSize;
      if (this.y > (room.height - room.height / 2) + config.mapBorderSize) this.y = (room.height - room.height / 2) + config.mapBorderSize;
      if (this.x < -room.width / 2 - config.mapBorderSize) this.x = -room.width / 2 - config.mapBorderSize;
      if (this.y < -room.height / 2 - config.mapBorderSize) this.y = -room.height / 2 - config.mapBorderSize;
    };
    if (this.dying) {
      this.collides = false;
      this.damages = false;
      this.shooting = false;
      this.dieTime--;
      this.alpha = this.dieTime / 5;
      this.type == "tank" ? this.addSize += 4 : this.size += 4;
      if (!this.gaveScore) {
        let killer = room.entities[this.lastHurtedEnemy];
        if (killer != undefined) {
          if (room.entities[killer.owner] != undefined) {
            if (this.type == "food") {
              room.entities[killer.owner].score += this.value;
            } else if (this.type == "tank") {
              if (this.score > server.level45Score) {
                room.entities[killer.owner].score += server.level45Score;
              } else room.entities[killer.owner].score += this.score;
              if (room.entities[killer.owner].connection != null) {
                room.entities[killer.owner].connection.send(protocol.encode("kill"));
              }
            };
          } else if (this.type == "food") {
            killer.score += this.value;
          } else if (this.type == "tank") {
            if (this.score > server.level45Score) {
              killer.score += server.level45Score;
            } else killer.score += this.score;
            if (killer.connection != null) {
              killer.connection.send(protocol.encode("kill"));
            };
          };
        };
        this.gaveScore = true;
      };
      if (this.dieTime < 0) {
        if (this.type == "food") room.shapeAmount--;
        if (this.connection != null) this.connection.spawned = false, this.connection.dead = true, this.connection.send(protocol.encode("death", room.entities[this.lastHurtedEnemy] == undefined ? 0 : (room.entities[room.entities[this.lastHurtedEnemy].owner] == undefined ? room.entities[this.lastHurtedEnemy].class : room.entities[room.entities[this.lastHurtedEnemy].owner].class))), this.connection.send(protocol.encode("upgradeReset"));
        delete room.entities[this.id];
        return;
      };
    };
  }
}
const idGenerator = new IDGenerator();
app.ws('/server', function(ws, req) {
  ws.on('error', function() {});
  ws.ip = req.headers['x-forwarded-for'] == undefined ? req.connection.remoteAddress : req.headers['x-forwarded-for'].split(",")[0];
  if (ipBans.includes(crypto.createHash("sha256").update(ws.ip).digest("hex"))) {
    ws.terminate();
    return;
  };
  ws.binaryType = "arraybuffer";
  ws.camera = {
    x: 0,
    y: 0,
    fov: 2,
  };
  ws.liveTime = 250;
  ws.id = idGenerator.generateId();
  ws.ban = function() {
    // kick the player
    ws.close();
    if (!ipBans.includes(crypto.createHash("sha256").update(ws.ip).digest("hex"))) {
      ipBans.push(crypto.createHash("sha256").update(ws.ip).digest("hex"));
      // write the ip to database
      fs.writeFile("./db/ipbans.json", JSON.stringify(ipBans), function writeJSON(err) {
        if (err) return console.log(err);
      });
    };
  };
  ws.onclose = function() {
    delete room.clients[ws.id];
    if (config.mapChangesToPlayerAmount) {
      room.width = 1000 + (Object.keys(room.clients).length * 500);
      room.height = room.width;
      room.maxShapes = 
      broadcastRoom();
    };
  };
  room.clients[ws.id] = ws;
  console.log(prefix + "INFO: A client just connected.");
  if (config.mapChangesToPlayerAmount) {
    room.width = 1000 + (Object.keys(room.clients).length * 500);
    room.height = room.width;
    room.maxShapes = 
    broadcastRoom();
  };
  ws.on('message', function incoming(message) {
    if (!(message instanceof ArrayBuffer)) {
      console.log(prefix + "WARNING: Got sent non-binary packet.");
      ws.ban();
      return;
    };
    ws.warnings = 0;
    message = protocol.decode(message)
    let type = message[0];
    message.shift();
    switch (type) {
      case "unknown": {
        console.log(prefix + "WARNING: Got sent a unknown packet.");
        ws.ban();
        return;
      }
      break;
    case "error": {
      console.log(prefix + "WARNING: A packet has encountered a error while getting decoded.");
      ws.ban();
      return;
    }
    break;
    case "input": {
      if (ws.spawned) {
        room.entities[ws.id].input = [message[0], message[1], message[2], message[3]];
        room.entities[ws.id].facing = message[4];
        room.entities[ws.id].shooting = message[5];
      };
    }
    break;
    case "spawn": {
      if (!ws.spawned) {
        if (message[0].length > 24) {
          console.log(prefix + "INFO: A client connected with a name longer than 24 letters.");
          ws.close();
          return;
        };
        ws.spawned = true;
        console.log(prefix + "INFO: A client is spawning... Name: " + message[0]);
        ws.send(protocol.encode("goingInGame"));
        let player = new Entity((Math.random() * room.width) - room.width / 2, (Math.random() * room.height) - room.height / 2, message[0], ws.id, 50, "tank", ws);
        player.showsOnLeaderboard = true;
        ws.team = player.team;
        ws.send(protocol.encode("playerId", ws.id));
        room.treeRefresh();
        broadcastRoom();
        broadcastMessage(message[0] + " has joined the game!")
      } else {
        console.log(prefix + "WARNING: A client is trying to spawn while already spawned. Name: " + message[0]);
        ws.close();
        return;
      };
    }
    break;
    case "terminal": {
      let args = message[0].split(' ');
      if (args[0] == "login") {
        if (ws.loggedIn) {
          ws.send(protocol.encode("terminalOutput", "You are already logged in."));
          return;
        };
        if (config.terminalAccessConfig.includes(args[1])) {
          console.log(prefix + "INFO: A client just logged in the terminal with the key " + args[1]);
          ws.loggedIn = true;
          ws.send(protocol.encode("terminalOutput", "Succesfully logged in!"));
        } else {
          console.log(prefix + "INFO: A client just failed logging in to the terminal.");
          ws.send(protocol.encode("terminalOutput", "You've entered a invalid key. Please make sure you entered it right."));
        };
        return;
      };
      if (ws.loggedIn) {
        switch (args[0]) {
          case "eval":
            try {
              let output = eval(message[0].slice(5));
              ws.send(protocol.encode("terminalOutput", "Output: " + output));
            } catch (e) {
              ws.send(protocol.encode("terminalOutput", "Output: " + e));
            }
            break;
          case "setScore":
            if (ws.spawned) {
              room.entities[ws.id].score = message[0].slice(9);
            };
            break;
          case "setTank":
            if (ws.spawned) {
              room.entities[ws.id].define(message[0].slice(8));
            };
            break;
          case "broadcast":
            broadcastMessage(message[0].slice(10));
            break;
          case "playerList":
            let output = "";
            for (let key in room.entities) {
              if (room.entities[key].connection != null) {
                output += room.entities[key].name + ", " + key + "\n";
              };
            };
            ws.send(protocol.encode("terminalOutput", output));
            break;
          case "ban":
            for (let key in room.clients) {
              if (room.clients[key].id == message[0].slice(4)) {
                room.clients[key].ban();
              };
            };
            break;
        };
      } else ws.send(protocol.encode("terminalOutput", "You're not logged in!"));
    }
    break;
    case "levelUp": {
      if (ws.spawned) {
          if (config.publicCheatingLevel >= 1) {
            if (room.entities[ws.id].score <= util.getScoreFromLevel(room.entities[ws.id].maxLevel)) {
                room.entities[ws.id].level++;
                room.entities[ws.id].score = util.getScoreFromLevel(room.entities[ws.id].level);
            };
          };
      };
    }
    break;
    case "skillUpgrade": {
      if (ws.spawned) {
        //room.entities[ws.id].stats.spd++;
        switch (message[0]) {
          case 0:
            room.entities[ws.id].skill.spd++;
            break;
          case 1:
            room.entities[ws.id].skill.rld++;
            break;
          case 2:
            room.entities[ws.id].skill.dmg++;
            break;
          case 3:
            room.entities[ws.id].skill.pen++;
            break;
          case 4:
            room.entities[ws.id].skill.bls++;
            break;
          case 6:
            room.entities[ws.id].skill.bdmg++;
            break;
          case 6:
            room.entities[ws.id].skill.hlt++;
            break;
          case 7:
            room.entities[ws.id].skill.heal++;
            break;
        };
      };
      /*room.entities[ws.id].level++;
      room.entities[ws.id].score = util.getScoreFromLevel(room.entities[ws.id].level);*/
    }
    break;
    case "upgrade": {
      if (ws.spawned) {
        if (message[0] > room.entities[ws.id].upgrades.length - 1) {
          return;
        } else room.entities[ws.id].define(room.entities[ws.id].upgrades[message[0]]);
      };
    }
    break;
    case "livingAlert": {
      ws.liveTime = 250;
    }
    break;
    };
  });
  ws.send(protocol.encode("roomInfo", room.width, room.height, room.gm));
  ws.send(server.entityTypesPacket);
  console.log(prefix + "INFO: Sent entityTypes packet.");
});
console.log("Server started at port " + config.port);
console.log("Map Width: " + room.width);
console.log("Map Height: " + room.height);
setTimeout(()=>{
for (let i = 0; i < 0; i++) {
  let bruh = new Entity((Math.random() * room.width) - room.width / 2, (Math.random() * room.height) - room.height / 2, botNames.botNames[i], idGenerator.generateId(), 50);
  bruh.shooting = true;
  bruh.hasAI = true;
  //bruh.define("Annihilator");
  bruh.showsOnLeaderboard = true;
  bruh.skill.rld = 8;
  bruh.skill.dmg = 8;
  bruh.skill.pen = 8;
  bruh.skill.bls = 8;
  bruh.skill.spd = 8;
  bruh.score = 22275;
};
}, 3000);
for (let i = 0; i < 0; i++) {
  for (let i2 = -1; i2 < 2; i2++) {
    let position = (function(){
      let x = i2 * 1000;
      let y = (-room.height / 2) - 300;
      //(-room.height / 2) - 300
      if (i == 1) {
        x = i2 * 1000;
        y = -((-room.height / 2) - 300);
      };
      if (i == 2) {
        x = (-room.height / 2) - 300;
        y = i2 * 1000;
      };
      if (i == 3) {
        x = -((-room.height / 2) - 300);
        y = i2 * 1000;
      };
      return {
        x: x,
        y: y,
      }
    })();
    let arenaCloser = new Entity(position.x, position.y, "Arena Closer", idGenerator.generateId(), 50);
    arenaCloser.scoreLock = 0;
    //arenaCloser.shooting = true;
    arenaCloser.hasAI = true;
    arenaCloser.define("Arena Closer");
    arenaCloser.skill.spd = 8;
    arenaCloser.showHealth = false;
    arenaCloser.skill.rld = 8;
    arenaCloser.skill.dmg = 8;
    arenaCloser.skill.pen = 8;
    arenaCloser.skill.bls = 8;
    arenaCloser.score = 0;
    arenaCloser.team = -1;
    arenaCloser.color = 12 + Math.round(Math.random() * 3);
    arenaCloser.factor.size = 3;
    arenaCloser.canBypassBorder = true;
    arenaCloser.godMode = true;
  };
};
let baseCount = room.teamBaseMode == -1 ? 0 : [2, 4][room.teamBaseMode];
for (let i = 0; i < baseCount; i++) {
  for (let i2 = 0; i2 < 4; i2++) {
    let baseSize = room.width / room.baseSize;
    let baseDrone = new Entity(util.getBasePos(0, i) + util.getRandomFromRange(-100, 100), util.getBasePos(1, i) + util.getRandomFromRange(-100, 100), "", idGenerator.generateId(), 20, "drone");
    baseDrone.team = i;
    baseDrone.color = [10, 9, 11, 6][i];
    baseDrone.type = "bDrone";
    baseDrone.godMode = true;
    baseDrone.speed = 20;
    baseDrone.fov = 4;
    baseDrone.define("Drone");
    baseDrone.showName = false;
    baseDrone.showHealth = false;
  };
};
function gameLoop() {
  room.tree.clear();
  if (room.shapeAmount < room.maxShapes) {
    room.shapeAmount++;
    let choose = Math.round(Math.random() * 3);
    let alpha = Math.random() > 0.9;
    let superAlpha = alpha ? Math.random() > 0.9 : false;
    let shapes = ["Square", "Triangle", "Pentagon", "Hexagon"]
    let spawnPosition = [(Math.random() * room.width) - room.width / 2, (Math.random() * room.height) - room.height / 2];
    if (alpha) {
      spawnPosition = [util.getRandomFromRange(-room.width / 10, room.width / 10), util.getRandomFromRange(-room.height / 10, room.height / 10)];
    }
    let shape = new Entity(spawnPosition[0], spawnPosition[1], "", idGenerator.generateId(), (40 + (choose * 15)) * (alpha ? 2 : 1) * (superAlpha ? 2 : 1), "food", null, true);
    shape.team = -1;
    shape.define(shapes[choose]);
    shape.color = 12 + choose;
    shape.showName = false;
    shape.facing = Math.random() * (Math.PI * 2);
    shape.maxHealth = (((choose + 1) * (choose + 1)) * 5) * (alpha ? 50 : 1) * (superAlpha ? 5 : 1);
    shape.health = shape.maxHealth;
    shape.value = (((choose + 1) * (choose + 1)) * 25) * (alpha ? 5 : 1) * (superAlpha ? 10 : 1);
  };
  for (let key in room.entities) {
    room.tree.insert({
      x: room.entities[key].x,
      y: room.entities[key].y,
      size: room.entities[key].size,
      width: room.entities[key].size,
      height: room.entities[key].size,
      id: room.entities[key].id,
    });
    room.entities[key].loop();
  };
  for (let key in room.entities) {
    let entity = room.entities[key];
    let candidates = room.tree.retrieve({
      x: entity.x,
      y: entity.y,
      radius: entity.size,
      width: entity.size,
      height: entity.size,
    });
    for (let candidate in candidates) {
      let candidateEntity = candidates[candidate];

      var dx = candidateEntity.x - entity.x;
      var dy = candidateEntity.y - entity.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      /*room.entities[candidate].size / 2;
      entity.size / 2;*/
      if (distance < (candidateEntity.size + entity.size) && candidateEntity.id != entity.id) {
        let angle = Math.atan2(entity.y - candidateEntity.y, entity.x - candidateEntity.x);
        if (room.entities[candidateEntity.id] != undefined) {
          let damage = false;
          let collide = false;
          if (room.entities[candidateEntity.id].team != entity.team) damage = true, collide = true;
          if (room.entities[candidateEntity.id].team != entity.team && room.entities[candidateEntity.id].type == "bullet" && entity.type == "bullet") damage = true, collide = true;
          if (room.entities[candidateEntity.id].team == entity.team && room.entities[candidateEntity.id].type == "food" && entity.type == "food") damage = false, collide = true;
          if (room.entities[candidateEntity.id].team == entity.team && room.entities[candidateEntity.id].type == "bDrone" && entity.type == "bDrone") damage = false, collide = true;
          if (room.entities[candidateEntity.id].team == entity.team && room.entities[candidateEntity.id].type == "tank" && entity.type == "tank") damage = false, collide = true;
          if (collide && (room.entities[candidateEntity.id].collides && entity.collides)) {
            room.entities[candidateEntity.id].vx -= Math.cos(angle) / 2.5;
            room.entities[candidateEntity.id].vy -= Math.sin(angle) / 2.5;
            entity.vx += Math.cos(angle) / 2.5;
            entity.vy += Math.sin(angle) / 2.5;
          };
          if (damage && (room.entities[candidateEntity.id].damages && entity.damages)) {
            room.entities[candidateEntity.id].lastHurtedEnemy = entity.id;
            entity.lastHurtedEnemy = candidateEntity.id;
            if (room.entities[candidateEntity.id].team != entity.team) {
              entity.health -= room.entities[candidateEntity.id].damage / Math.sqrt(Math.sqrt(entity.damage));
              room.entities[candidateEntity.id].health -= entity.damage / Math.sqrt(Math.sqrt(room.entities[candidateEntity.id].damage));
            };
          };
        };
      };
      /*room.entities[candidate].size * 2;
      entity.size * 2;*/
    };
  };
  for (let key in room.clients) {
    let entities = [];
    if (room.clients[key].spawned) {
      if (room.clients[key].team != room.entities[room.clients[key].id].team) room.clients[key].team = room.entities[room.clients[key].id].team;
      room.clients[key].camera.x = room.entities[room.clients[key].id].x;
      room.clients[key].camera.y = room.entities[room.clients[key].id].y;
      room.clients[key].camera.fov = room.entities[room.clients[key].id].fov;
    } else if (room.clients[key].dead) {
      room.clients[key].camera.fov = 2;
    } else {
      room.clients[key].camera.x = 0;
      room.clients[key].camera.y = 0;
      room.clients[key].camera.fov = 3;
    };
    let candidates = room.tree.retrieve({
      x: room.clients[key].camera.x - room.clients[key].camera.fov * 1777 / 1.5,
      y: room.clients[key].camera.y - room.clients[key].camera.fov * 1000 / 1.5,
      width: room.clients[key].camera.fov * 3555 / 1.5,
      height: room.clients[key].camera.fov * 2000 / 1.5
    });
    for (let candidate in candidates) {
      let candidateEntity = candidates[candidate];
      //{x: room.clients[i].camera.x - room.clients[i].camera.fov * 1777.77778, y: room.clients[i].camera.y - room.clients[i].camera.fov * 1000, width: room.clients[i].camera.fov * 3555.55556, height: room.clients[i].camera.fov * 2000}
      if (room.entities[candidateEntity.id] != undefined) {
        let barrels = [];
        for (let i = 0; i < room.entities[candidateEntity.id].barrels.length; i++) {
          barrels.push(room.entities[candidateEntity.id].barrels[i].barrelAnimation);
        };
        entities.push({
          x: room.entities[candidateEntity.id].x,
          y: room.entities[candidateEntity.id].y,
          name: room.entities[candidateEntity.id].showName ? room.entities[candidateEntity.id].name : "",
          id: room.entities[candidateEntity.id].id,
          facing: room.entities[candidateEntity.id].facing,
          size: room.entities[candidateEntity.id].size,
          level: room.entities[candidateEntity.id].level,
          score: room.entities[candidateEntity.id].score,
          class: room.entities[candidateEntity.id].class,
          color: room.ffa ? (room.entities[candidateEntity.id].team == room.clients[key].team ? 10 : room.entities[candidateEntity.id].color) : room.entities[candidateEntity.id].color,
          showHealth: room.entities[candidateEntity.id].showHealth,
          showName: room.entities[candidateEntity.id].showName,
          barrels: barrels,
          alpha: room.entities[candidateEntity.id].alpha,
          vx: room.entities[candidateEntity.id].vx,
          vy: room.entities[candidateEntity.id].vy,
          health: room.entities[candidateEntity.id].showHealth ? (room.entities[candidateEntity.id].health / room.entities[candidateEntity.id].maxHealth) : 0,
          barrelFlash: room.entities[candidateEntity.id].barrelFlash
        });
      };
    };
    room.clients[key].send(protocol.encode("entities", entities));
    room.clients[key].send(protocol.encode("camera", room.clients[key].camera.x, room.clients[key].camera.y, room.clients[key].camera.fov));
    room.clients[key].liveTime--;
    room.clients[key].warnings--;
    if (room.clients[key].warnings > 50) {
      if (room.clients[key].spawned) room.entities[room.clients[key].id].kill();
      room.clients[key].spawned = false;
      room.clients[key].close();
      console.log(prefix + "WARNING: Kicked a client for having more than 50 warnings.");
      delete room.clients[key];
    };
    if (room.clients[key].liveTime < 0) {
      if (room.clients[key].spawned) room.entities[room.clients[key].id].kill();
      room.clients[key].spawned = false;
      room.clients[key].close();
      console.log("A client disconnected for inactivity.");
      delete room.clients[key];
    };
  };
};
function broadcastRoom() {
  for (let key in room.clients) {
    room.clients[key].send(protocol.encode("roomInfo", room.width, room.height, room.gm));
  };
};

function broadcastMessage(m) {
  for (let key in room.clients) {
    room.clients[key].send(protocol.encode("message", m));
  };
};

function leaderboardLoop() {
  let tanks = [];
  for (let key in room.entities) {
    if (room.entities[key].showsOnLeaderboard) {
      let tank = room.entities[key];
      tanks.push({
        id: key,
        score: tank.score,
        name: tank.name,
        class: tank.class,
        color: tank.color,
      });
    };
  };
  tanks.sort(function(a, b) {
    return b.score - a.score;
  });
  let lb = [];
  for (let i = 0; i < (tanks.length > 10 ? 10 : tanks.length); i++) {
    lb.push(tanks[i]);
  };
  for (let key in room.clients) {
    room.clients[key].send(protocol.encode("lb", lb));
  };
};
for (let i = 0; i < 0; i++) {
  let choose = 0;
  let alpha = false;
  let shape = new Entity((Math.random() * room.width) - room.width / 2, (Math.random() * room.height) - room.height / 2, "", idGenerator.generateId(), (40 + (choose * 15)) * (alpha ? 2 : 1), "tank", null, true);
  shape.team = -1;
  shape.define("Coin");
  shape.color = 12;
  shape.score = 22275;
  shape.showName = false;
  shape.facing = Math.random() * (Math.PI * 2);
  shape.maxHealth = (((choose + 1) * (choose + 1)) * 5) * (alpha ? 50 : 1);
  shape.health = (((choose + 1) * (choose + 1)) * 5) * (alpha ? 50 : 1);
  shape.value = (((choose + 1) * (choose + 1)) * 25) * (alpha ? 5 : 1);
};
//setTimeout(()=>{room.restart()}, 15000);
setInterval(leaderboardLoop, 1000 / server.fps);
setInterval(gameLoop, 1000 / server.fps);
//setInterval(function(){broadcastMessage("Test.")}, 2000);