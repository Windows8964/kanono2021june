exports.entityTypes = [{
  name: "Unknown Class",
  bodyShape: 0,
  barrels: [],
}, {
  name: "Coin",
  bodyShape: 8,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Square",
  bodyShape: 4,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Triangle",
  bodyShape: 3,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Pentagon",
  bodyShape: 5,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Hexagon",
  bodyShape: 6,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Bullet",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Drone",
  bodyShape: 3,
  fieldFactor: 1,
  barrels: []
}, {
  name: "Tank",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Flank Guard",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 180, offset: 0, height: 1.5, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Triple Shot",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 20, offset: 0.2, height: 1.6, width: 0.9, recoil: 1, delay: 0.5, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: -20, offset: -0.2, height: 1.6, width: 0.9, recoil: 1, delay: 0.5, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Quad Tank",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 90, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 180, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 270, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Sniper",
  bodyShape: 0,
  fieldFactor: 1.2,
  barrels: [{ angle: 0, offset: 0, height: 2.2, width: 0.9, recoil: 1, delay: 0, reload: 1.25, bullet: { damageFactor: 1.1, rangeFactor: 1.1, penFactor: 1.1, spdFactor: 1.5, sprFactor: 0.4 }, }],
}, {
  name: "Twin",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0.5, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 0.8, rangeFactor: 1, penFactor: 0.97, spdFactor: 1, }, }, { angle: 0, offset: -0.5, height: 1.8, width: 0.9, recoil: 1, delay: 0.5, reload: 1, bullet: { damageFactor: 0.8, rangeFactor: 1, penFactor: 0.97, spdFactor: 1, }, }],
}, {
  name: "Assassin",
  bodyShape: 0,
  fieldFactor: 1.4,
  barrels: [{ angle: 0, offset: 0, height: 2.5, width: 0.9, recoil: 1, delay: 0, reload: 1.4, bullet: { damageFactor: 1.2, rangeFactor: 1.2, penFactor: 1.2, spdFactor: 1.75, sprFactor: 0.3 }, }],
}, {
  name: "Ranger",
  bodyShape: 0,
  fieldFactor: 1.6,
  barrels: [{ angle: 0, offset: 0, height: 2.5, width: 0.9, recoil: 1, delay: 0, reload: 1.7, bullet: { damageFactor: 1.3, rangeFactor: 1.3, penFactor: 1.3, spdFactor: 2, sprFactor: 0.2 }, }, { canShoot: false, angle: 0, offset: 0, height: 1.3, width: 0.9, trapezoidWidth: -0.3 }],
}, {
  name: "Annihilator",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.9, width: 1.9, recoil: 10, delay: 0, reload: 4, bullet: { damageFactor: 10, rangeFactor: 2, penFactor: 2, spdFactor: 0.97, }, }],
}, {
  name: "Destroyer",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.9, width: 1.5, recoil: 7.5, delay: 0, reload: 4, bullet: { damageFactor: 10, rangeFactor: 2, penFactor: 2, spdFactor: 0.97, }, }],
}, {
  name: "Machine Gun",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 0.5, delay: 0, reload: 0.5, trapezoidWidth: 0.15, bullet: { damageFactor: 0.97, rangeFactor: 1, penFactor: 0.97, spdFactor: 1.05, sprFactor: 4 }, }],
}, {
  name: "Negev",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 1.3, recoil: 3, delay: 0, reload: 1.5, trapezoidWidth: 0.15, bullet: { damageFactor: 0.97, rangeFactor: 1.25, penFactor: 0.97, spdFactor: 1.05, sprFactor: 2 }, }],
}, {
  name: "Mothership",
  bodyShape: 16,
  fieldFactor: 1.5,
  sizeFactor: 3,
  barrels: (function(){
    let output = [];
    for (let i = 0; i < 16; i++) {
      output.push({ angle: i * (360 / 16), offset: 0, height: 1.3, width: 0.2, recoil: 1, delay: 0, reload: 1, trapezoidWidth: 0.1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, });
    };
    return output;
  })(),
}, {
  name: "Tri-Angle",
  bodyShape: 0,
  fieldFactor: 1,
  spdFactor: 1.5,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 0, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, 
            { angle: 210, offset: 0, height: 1.5, width: 0.9, recoil: 1.75, delay: 0.5, reload: 1, bullet: { damageFactor: 0.5, rangeFactor: 0.75, penFactor: 0.7, spdFactor: 1, }, }, 
            { angle: 150, offset: 0, height: 1.5, width: 0.9, recoil: 1.75, delay: 0.5, reload: 1, bullet: { damageFactor: 0.5, rangeFactor: 0.75, penFactor: 0.7, spdFactor: 1, }, }],
}, {
  name: "Dominator",
  bodyShape: 0,
  fieldFactor: 2,
  spdFactor: 0,
  sizeFactor: 16,
  hltFactor: 16,
  canMove: false,
  shell: {
    shape: 6,
    spinning: true,
    spinSpeed: 1,
    color: 8,
    size: 1.25,
  },
  barrels: [{ angle: 0, offset: 0, height: 1.6, width: 0.8, recoil: 1, delay: 0, reload: 6, bullet: { damageFactor: 10, rangeFactor: 4, penFactor: 10, spdFactor: 0.5, sprFactor: 0.5 }, }, { canShoot: false, angle: 0, offset: 0, height: 1.2, width: 0.8, trapezoidWidth: -0.45 }],
}, {
  name: "Arena Closer",
  bodyShape: 0,
  fieldFactor: 1,
  barrels: [{ angle: 0, offset: 0, height: 1.5, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 100, rangeFactor: 0.8, penFactor: 100, spdFactor: 1.5, sprFactor: 0.5, }, }],
}, {
  name: "UC0",
  bodyShape: 0,
  fieldFactor: 1,
  spdFactor: 1.25,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 0.25, delay: 0, reload: 1, bullet: { damageFactor: 0.8, rangeFactor: 0.8, penFactor: 0.8, spdFactor: 1, }, }, { angle: 180, offset: 0, height: 1.6, width: 1, recoil: 3, delay: 0, reload: 0.75, trapezoidWidth: -0.1, bullet: { damageFactor: 0.5, rangeFactor: 0.5, penFactor: 0.5, spdFactor: 0.5, }, }],
}, {
  name: "UC1",
  bodyShape: 0,
  fieldFactor: 1,
  spdFactor: 1.3,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 0.8, rangeFactor: 0.8, penFactor: 0.8, spdFactor: 1, }, }, 
    { angle: 210, offset: 0, height: 1.6, width: 0.8, recoil: 3, delay: 0, reload: 0.75, trapezoidWidth: -0.1, bullet: { damageFactor: 0.5, rangeFactor: 0.5, penFactor: 0.5, spdFactor: 0.5, }, },
    { angle: 150, offset: 0, height: 1.6, width: 0.8, recoil: 3, delay: 0, reload: 0.75, trapezoidWidth: -0.1, bullet: { damageFactor: 0.5, rangeFactor: 0.5, penFactor: 0.5, spdFactor: 0.5, }, }],
  //barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 0.25, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 180, offset: 0, height: 1.7, width: 1, recoil: 3, delay: 0, reload: 0.75, trapezoidWidth: -0.1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Minigun",
  bodyShape: 0,
  fieldFactor: 2,
  barrels: [{ angle: 0, offset: 0, height: 1.75, width: 0.9, recoil: 3, delay: 0, reload: 2, bullet: { damageFactor: 2, rangeFactor: 1.5, penFactor: 1.75, spdFactor: 2, sprFactor: 0.2 }, }, { canShoot: false, angle: 0, offset: 0, height: 1.3, width: 0.9, trapezoidWidth: -0.3 }],
}, {
  name: "Smasher",
  bodyShape: 0,
  fieldFactor: 1.25,
  spdFactor: 1.5,
  hltFactor: 2,
  shell: {
    shape: 6,
    spinning: true,
    spinSpeed: 2,
    color: 8,
    size: 1.25,
  },
  barrels: [],
  //barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 0.25, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 180, offset: 0, height: 1.7, width: 1, recoil: 3, delay: 0, reload: 0.75, trapezoidWidth: -0.1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Mega Smasher",
  bodyShape: 0,
  fieldFactor: 1.25,
  spdFactor: 1.25,
  hltFactor: 2,
  shell: {
    shape: 6,
    spinning: true,
    spinSpeed: 1.5,
    color: 8,
    size: 1.4,
  },
  barrels: [],
  //barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 0.25, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, { angle: 180, offset: 0, height: 1.7, width: 1, recoil: 3, delay: 0, reload: 0.75, trapezoidWidth: -0.1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }],
}, {
  name: "Fighter",
  bodyShape: 0,
  fieldFactor: 1,
  spdFactor: 1.5,
  barrels: [{ angle: 0, offset: 0, height: 1.8, width: 0.9, recoil: 1, delay: 0, reload: 1, bullet: { damageFactor: 1, rangeFactor: 1, penFactor: 1, spdFactor: 1, }, }, 
            { angle: 210, offset: 0, height: 1.5, width: 0.9, recoil: 1.75, delay: 0, reload: 1, bullet: { damageFactor: 0.5, rangeFactor: 0.75, penFactor: 0.7, spdFactor: 1, }, }, 
            { angle: 150, offset: 0, height: 1.5, width: 0.9, recoil: 1.75, delay: 0, reload: 1, bullet: { damageFactor: 0.5, rangeFactor: 0.75, penFactor: 0.7, spdFactor: 1, }, },
            { angle: 90, offset: 0, height: 1.5, width: 0.9, recoil: 1.75, delay: 0, reload: 1, bullet: { damageFactor: 0.5, rangeFactor: 0.75, penFactor: 0.7, spdFactor: 1, }, },
            { angle: 180 + 90, offset: 0, height: 1.5, width: 0.9, recoil: 1.75, delay: 0, reload: 1, bullet: { damageFactor: 0.5, rangeFactor: 0.75, penFactor: 0.7, spdFactor: 1, }, }],
}];

exports.stringEntityTypes = {};
exports.upgradeTree = {
  Tank: {
    tier1: ["Twin", "Sniper", "Machine Gun", "Flank Guard"],//, "Mothership", "Dominator", "Arena Closer"],
    tier2: ["Smasher"]
  },
  Smasher: {
    tier3: ["Mega Smasher"],
  },
  Sniper: {
    tier2: ["Assassin"],
    tier3: ["Minigun"],
  },
  "Flank Guard": {
    tier2: ["Quad Tank", "Triple Shot", "Tri-Angle", "UC0"],
  },
  "Tri-Angle": {
    tier3: ["UC1"],
  },
  UC0: {
    tier3: ["UC1"],
  },
  Twin: {
    tier2: ["Quad Tank", "Triple Shot"],
  },
  Assassin: {
    tier3: ["Ranger"],
  },
  "Machine Gun": {
    tier2: ["Destroyer"],
    tier3: ["Negev"],
  },
  Destroyer: {
    tier3: ["Annihilator"],
  },
};
exports.entityTypeMockups = [];
// EntityTypes Helper
for (let key in exports.entityTypes) {
  if (!(exports.entityTypes[key].name in exports.upgradeTree)) {
    exports.upgradeTree[exports.entityTypes[key].name] = {tier1:[],tier2:[],tier3:[]};
  } else {
    if (exports.upgradeTree[exports.entityTypes[key].name].tier1 == undefined) exports.upgradeTree[exports.entityTypes[key].name].tier1 = [];
    if (exports.upgradeTree[exports.entityTypes[key].name].tier2 == undefined) exports.upgradeTree[exports.entityTypes[key].name].tier2 = [];
    if (exports.upgradeTree[exports.entityTypes[key].name].tier3 == undefined) exports.upgradeTree[exports.entityTypes[key].name].tier3 = [];
  };
  exports.stringEntityTypes[exports.entityTypes[key].name] = key;
  exports.entityTypes[key].id = key;
  try {
    for (let i = 0; i < exports.entityTypes[key].barrels.length; i++) {
      exports.entityTypes[key].barrels[i].angle = exports.entityTypes[key].barrels[i].angle * Math.PI / 180;
      if (exports.entityTypes[key].barrels[i].canShoot == undefined) exports.entityTypes[key].barrels[i].canShoot = true;
    }
  } catch (e) {}
  let entityMockup = {};
  entityMockup.name = exports.entityTypes[key].name;
  if (entityMockup.name.startsWith("UC")) {
    entityMockup.name = "Unnamed Class"  
  }
  entityMockup.bodyShape = exports.entityTypes[key].bodyShape;
  entityMockup.barrels = [];
  if (exports.entityTypes[key].shell != undefined) entityMockup.shell = exports.entityTypes[key].shell;
  for (let key2 in exports.entityTypes[key].barrels) {
    let barrel = exports.entityTypes[key].barrels[key2];
    entityMockup.barrels.push({
      width: barrel.width,
      height: barrel.height,
      angle: barrel.angle,
      offset: barrel.offset,
      trapezoidWidth: barrel.trapezoidWidth || 0,
    });
  };
  exports.entityTypeMockups.push(entityMockup);
};
for (let key in exports.upgradeTree) {
  for (let key2 in exports.upgradeTree[key]) {
    for (let key3 in exports.upgradeTree[key][key2]) {
      exports.upgradeTree[key][key2][key3] = parseInt(exports.stringEntityTypes[exports.upgradeTree[key][key2][key3]]);
    };
  };
};
function convertDiepToKanono(tank) {
  for (let i = 0; i < tank.barrels.length; i++) {
    tank.barrels[i].height  = tank.barrels[i].size;
    delete tank.barrels[i].size;
    tank.barrels[i].height /= 50;
    tank.barrels[i].width /= 50;
    tank.barrels[i].offset /= 50;
  }
  return tank;
}