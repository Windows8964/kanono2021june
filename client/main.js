import {
    protocol as protocolDictionary
} from "./protocol/protocol.js";
(function () {
    const protocol = protocolDictionary;
    const canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext("2d");
    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };
    ctx.imageSmoothingEnabled = false;
    let ws;
    const util = {};
    let entityTypes = [];
    const offCanvas = {};
    const config = {
        language: "en",
        font: "Overpass",
        screenRatio: 1,
        screenWidth: 0,
        screenHeight: 0,
        spacing: 30,
        gameStates: {
            unknown: -1,
            connecting: 0,
            goingToLoadingET: 1,
            goingToMenu: 2,
            menu: 3,
            goingInGame: 4,
            ingame: 5,
            goingToMenuFromDeath: 6,
        },
        gameState: 0,
        disconnected: false,
        spawned: false,
        mouse: {
            x: 0,
            y: 0,
            pressing: false,
        },
        gridSize: 40,
        entityTypesLoaded: false,
        selectedServer: 0,
        sendInput: false,
        messages: [],
        changelogTime: (function () {
            let duration = Date.now() - window.changelogDate;
            let seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
                days = Math.floor(duration * 1.1574074074074074e-8),
                dateString = (days == 0 ? "" : days + " day" + (days == 1 ? "" : "s") + " ") + (hours == 0 ? "" : hours + " hour" + (hours == 1 ? "" : "s") + " ") + (minutes == 0 ? "" : minutes + " minute" + (minutes == 1 ? "" : "s") + " ") // + (seconds == 0 ? "" : (minutes == 0 ? "" : " ") + seconds + " seconds");
            return dateString;
        })(),
        guiCornerRadius: 10,
        guiAlpha: 0.65,
        leaderboardWidth: 275,
        diepTheme: false,
        /*mapConfig: [{
            color: 3,
            position: {
                x: 0,
                y: 0,
            },
            size: 10,
        }]*/
    };
    const room = {
        width: 0,
        height: 0,
        rwidth: 1000,
        rheight: 1000,
        gm: "ffa",
        entities: {},
        grid: document.createElement("canvas"),
        canvas: document.createElement("canvas"),
        lb: [],
        lbScores: [],
    };
    room.ctx = room.canvas.getContext("2d");
    // Draw the grid
    room.gridContext = room.grid.getContext("2d");
    room.grid.width = 1000;
    room.grid.height = 1000;
    room.gridContext.lineWidth = 4;
    room.gridContext.strokeStyle = "#000000";
    for (let i = -1; i < room.grid.width / config.gridSize + 1; i++) {
        room.gridContext.moveTo(i * config.gridSize, 0);
        room.gridContext.lineTo(i * config.gridSize, room.grid.height);
    };
    for (let i = -1; i < room.grid.width / config.gridSize + 1; i++) {
        room.gridContext.moveTo(0, i * config.gridSize);
        room.gridContext.lineTo(room.grid.width, i * config.gridSize);
    };
    room.gridContext.stroke();
    room.gridPattern = room.gridContext.createPattern(room.grid, 'repeat');
    class IDGenerator {
        constructor() {
            this.id = 0;
        }
        generateId() {
            return this.id++;
        }
    };
    let Upgrade = class {
        constructor(tank = 0, x = 0, color = 0, index = 0) {
            this.tank = tank;
            this.x = x;
            this.color = color;
            this.dying = false;
            this.animation = 0;
            this.size = 1;
            this.index = index;
            player.upgrades[player.upgradeIds.generateId()] = this;
        };
    };
    let player = {
        reset: function () {
            player = {
                joined: false,
                reset: player.reset,
                connectingWarn: false,
                connectingWarningTime: Date.now() + 6000,
                position: {
                    x: 0,
                    y: 0,
                    rx: 0,
                    ry: 0,
                    vx: 0,
                    vy: 0,
                },
                camera: {
                    position: {
                        x: 0,
                        y: 0,
                        rx: 0,
                        ry: 0,
                    },
                    rfov: 1,
                    fov: 1,
                    ratio: 1,
                },
                facing: 0,
                score: 0,
                level: 1,
                // Left, Right, Up, Down
                input: [0, 0, 0, 0],
                speed: 5,
                id: -1,
                tank: "",
                livingAlertInterval: 0,
                dead: false,
                skill: [{
                    name: "Movement Speed",
                    max: 8,
                    count: 0,
                }, {
                    name: "Reload",
                    max: 8,
                    count: 0,
                }, {
                    name: "Bullet Damage",
                    max: 8,
                    count: 0,
                }, {
                    name: "Bullet Penetration",
                    max: 8,
                    count: 0,
                }, {
                    name: "Bullet Speed",
                    max: 8,
                    count: 0,
                }, {
                    name: "Body Damage",
                    max: 8,
                    count: 0,
                }, {
                    name: "Max Health",
                    max: 8,
                    count: 0,
                }, {
                    name: "Health Regen",
                    max: 8,
                    count: 0,
                }],
                resetSkill: function () {
                    this.skill = [{
                        name: "Movement Speed",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Reload",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Bullet Damage",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Bullet Penetration",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Bullet Speed",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Body Damage",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Max Health",
                        max: 8,
                        count: 0,
                    }, {
                        name: "Health Regen",
                        max: 8,
                        count: 0,
                    }]
                },
                upgradeSkill: function (skill) {
                    if (player.skill[skill].count < player.skill[skill].max) {
                        player.skill[skill].count++;
                        player.skillPoints--;
                        ws.send(protocol.encode("skillUpgrade", skill));
                    };
                },
                skillPoints: 64,
                upgrades: {},
                upgradeCount: 0,
                upgradeIds: new IDGenerator(),
                upgradeReset: function () {
                    player.upgradeCount = 0;
                    for (let key in player.upgrades) {
                        player.upgrades[key].dying = true;
                    };
                },
                mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                spawn: function () {
                    if ((config.gameState == config.gameStates.menu || player.dead) && config.spawned == false) elements.name.disabled = true, config.spawned = true, ws.send(protocol.encode("spawn", elements.name.value)), localStorage.setItem("name", elements.name.value);
                },
                autoFire: false,
                kills: 0,
                deathMessage: "",
            }
        },
    };
    player.reset();
    let animations = {
        reset: function () {
            animations = {
                reset: animations.reset,
                connecting: 1,
                menu: 1,
                disconnected: 0,
                menuSlide: 0,
                menuBGAlpha: 1,
                loadingET: 0,
                servers: 0,
                rservers: 0,
                deathScreen: 0,
                skill: 0,
                skillX: 0,
                skillXSize: 500,
                skillHover: 0,
                tankSpin: 0,
                upgrade: 0,
                upgradeWidth: 0,
                lbWidth: 50,
                killsMenu: 0,
                menuFadeIn: 1,
                connectingGrid: 0,
                connectingWarn: 0,
            };
        },
    };
    animations.reset();
    const elements = {
        name: document.getElementById("nameInput"),
        terminal: document.getElementById("terminal"),
        terminalInput: document.getElementById("terminalInput"),
        terminalOutput: document.getElementById("terminalOutput"),
        terminalExit: document.getElementById("terminalExit"),
    };
    // Util
    util.fullScreenCanvas = function () {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        room.canvas.width = window.innerWidth * window.devicePixelRatio;
        room.canvas.height = window.innerHeight * window.devicePixelRatio;
        config.screenWidth = canvas.width;
        config.screenHeight = canvas.height;
    };

    util.drawText = function (ctx, content, x, y, size, align = "center", stroke = true) {
        /*if (config.language == "tr") {
            if (content.startsWith != undefined) {
                if (content.startsWith("Died to a")) content = content.slice(10) + "a öldün";
                if (content.startsWith("Score: ")) content = "Skor: " + content.slice(7);
            };
            if (content == "(Enter to respawn)") content = "(Yeniden başlamak için entere bas)";
            if (content == "Leaderboard") content = "Lidersırası";
            if (content == "Health Regen") content = "Hayat Yenilenme";
            if (content == "Max Health") content = "Maximum Hayat";
            if (content == "Body Damage") content = "Gövde Hasarı";
            if (content == "Bullet Speed") content = "Mermi Hızı";
            if (content == "Bullet Penetration") content = "Mermi Penetrasyonu";
            if (content == "Bullet Damage") content = "Mermi Hasarı";
            if (content == "Reload") content = "Yenileme";
            if (content == "Movement Speed") content = "Haraket Hızı";
        };
        if (config.language == "zh") {
            if (content.startsWith != undefined) {
                if (content.startsWith("Died to a")) content = content.slice(10) + "a öldün";
                if (content.startsWith("Score: ")) content = "Skor: " + content.slice(7);
            };
            if (content == "(Enter to respawn)") content = "(Yeniden başlamak için entere bas)";
            if (content == "Leaderboard") content = "排行榜";
            if (content == "Health Regen") content = "再生";
            if (content == "Max Health") content = "最大健康";
            if (content == "Body Damage") content = "";
            if (content == "Bullet Speed") content = "";
            if (content == "Bullet Penetration") content = "";
            if (content == "Bullet Damage") content = "";
            if (content == "Reload") content = "";
            if (content == "Movement Speed") content = "";
        };*/
        ctx.textAlign = align;
        ctx.font = "900 " + size + "px " + config.font;
        if (stroke) {
            ctx.save();
            ctx.lineJoin = "round";
            ctx.fillStyle = colors[3];
            ctx.strokeStyle = colors[3];
            ctx.lineWidth = size / 5;
            ctx.strokeText(content, x, y);
        };
        //ctx.fillText(content, x, y + size / 16);
        ctx.restore();
        ctx.fillText(content, x, y);
    };

    // https://github.com/mattdesl/lerp
    util.lerp = function (v0, v1, t) {
        let old = t;
        t /= config.fps / 60;
        if (isNaN(t) || t == Infinity || t > 1) t = old;
        return v0 * (1 - t) + v1 * t;
    };

    util.roundRect = function (ctx, x, y, width, height, radius) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {
                tl: radius,
                tr: radius,
                br: radius,
                bl: radius
            };
        } else {
            var defaultRadius = {
                tl: 0,
                tr: 0,
                br: 0,
                bl: 0
            };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
    };

    util.lerpAngle = function (a, b, x) {
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

    util.drawPolygon = function (ctx, x, y, radius, sides, angle) {
        if (sides < 3) return;
        ctx.beginPath();
        var a = (Math.PI * 2) / sides;
        for (let i = 0; i < sides; i++) {
            let theta = (i / sides) * 2 * Math.PI;
            let x2 = x + radius * Math.cos(theta + angle);
            let y2 = y + radius * Math.sin(theta + angle);
            ctx.lineTo(x2, y2);
        };
        ctx.closePath();
    };

    // https://gist.github.com/jedfoster/7939513
    util.mixColors = function (colorA, colorB, amount) {
        const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
        const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
        const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
        const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
        const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
        return '#' + r + g + b;
    };

    util.drawTrapezoid = function (ctx, x, y, width, height, level = 0) {
        let yAdd = level > 0 ? (level * width) : 0;
        let backYAdd = level < 0 ? (-level * width) : 0;
        ctx.moveTo(x, y - backYAdd);
        ctx.lineTo(x + width, y - yAdd);
        ctx.lineTo(x + width, y + height + yAdd);
        ctx.lineTo(x, y + height + backYAdd);
        ctx.lineTo(x, y - backYAdd);
    };

    util.drawEntity = function (ctx, x, y, entity, changeColor, size = 50, borderSize = 7.5, barrelAnimation = true, alpha = 1) {
        let oldCtx;
        let drawRatio = ctx.getTransform().a;
        let pos;
        if (alpha != 1) {
            oldCtx = ctx;
            ctx = room.ctx;
            room.ctx.resetTransform();
            room.canvas.width = size * 4;
            room.canvas.height = size * 4;
            //room.ctx.scale(1 / player.camera.ratio, 1 / player.camera.ratio);
            room.canvas.width *= drawRatio;
            room.canvas.height *= drawRatio;
            room.ctx.scale(drawRatio, drawRatio);
            room.ctx.clearRect(0, 0, room.canvas.width, room.canvas.height);
            room.ctx.lineJoin = "round";
            pos = {
                x: x,
                y: y,
            };
            x = size * 2;
            y = size * 2;
        };
        ctx.lineWidth = borderSize;
        if (entityTypes[entity.class].shell != undefined) {
            let shell = entityTypes[entity.class].shell
            ctx.fillStyle = colors[shell.color];
            ctx.strokeStyle = darkColors[shell.color];
            if (entity.barrelFlash > 0.05) {
                ctx.fillStyle = util.mixColors(colors[shell.color], "#ffffff", entity.barrelFlash);
                ctx.strokeStyle = util.mixColors(darkColors[shell.color], "#ffffff", entity.barrelFlash);
            };
            if (changeColor != undefined) {
                ctx.fillStyle = changeColor;
                ctx.strokeStyle = changeColor;
            };
            ctx.beginPath();
            util.drawPolygon(ctx, x, y, size * shell.size, shell.shape, animations.tankSpin * shell.spinSpeed)
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        };
        ctx.fillStyle = colors[7];
        ctx.strokeStyle = darkColors[7];

        if (entity.barrelFlash > 0.05) {
            ctx.fillStyle = util.mixColors(colors[7], "#ffffff", entity.barrelFlash);
            ctx.strokeStyle = util.mixColors(darkColors[7], "#ffffff", entity.barrelFlash);
        };
        if (changeColor != undefined) {
            ctx.fillStyle = changeColor;
            ctx.strokeStyle = changeColor;
        };
        for (let i2 = 0; i2 < entityTypes[entity.class].barrels.length; i2++) {
            let barrel = entityTypes[entity.class].barrels[i2];
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(entity.facing + barrel.angle);
            ctx.translate(-x, -y);
            ctx.beginPath();
            if (barrelAnimation) {
                util.drawTrapezoid(ctx, x - ((entity.barrels[i2] * size) / 8), y - (barrel.width * size) / 2 + barrel.offset * size, barrel.height * size, barrel.width * size, barrel.trapezoidWidth);
            } else util.drawTrapezoid(ctx, x, y - (barrel.width * size) / 2 + barrel.offset * size, barrel.height * size, barrel.width * size, barrel.trapezoidWidth);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = colors[entity.color];
        ctx.strokeStyle = darkColors[entity.color];
        if (changeColor != undefined) {
            ctx.fillStyle = changeColor;
            ctx.strokeStyle = changeColor;
        };
        ctx.beginPath();
        if (entityTypes[entity.class].bodyShape != 0) {
            util.drawPolygon(ctx, x, y, size + (size / entityTypes[entity.class].bodyShape), entityTypes[entity.class].bodyShape, entity.facing + (Math.PI / entityTypes[entity.class].bodyShape));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // stroke
            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.arc(x, y, size + ctx.lineWidth / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            // fill
            ctx.beginPath();
            ctx.arc(x, y, size - ctx.lineWidth / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        };
        ctx.fillStyle = colors[0];
        if (entity.id != player.id && entity.showName == true) {
            util.drawText(ctx, entity.name, x, y - size * 2, size);
            if (entity.score != 0) util.drawText(ctx, entity.score, x, y - size * 1.35, size / 1.35);
        };
        if (entity.showHealth) {
            if (entity.rhealth >= 1) {
                entity.healthAlpha = util.lerp(entity.healthAlpha, 0, 0.1);
            } else entity.healthAlpha = util.lerp(entity.healthAlpha, 1, 0.1);
            ctx.save();
            ctx.globalAlpha = entity.healthAlpha;
            // Draw health BG
            ctx.beginPath();
            ctx.moveTo(x - size, y + size + 40);
            ctx.lineTo(x + size, y + size + 40);
            ctx.closePath();
            ctx.lineWidth = 15;
            ctx.strokeStyle = colors[3];
            ctx.stroke();
            // Draw health
            ctx.beginPath();
            ctx.moveTo(x - size, y + size + 40);
            ctx.lineTo(x - size + (size * entity.health * 2), y + size + 40);
            ctx.closePath();
            ctx.lineWidth = 8.5;
            ctx.strokeStyle = lightColors[entity.color];
            ctx.stroke();
            ctx.restore();
        };
        if (alpha != 1) {
            ctx = oldCtx;
            ctx.globalAlpha = alpha;
            ctx.drawImage(room.canvas, pos.x - size * 2, pos.y - size * 2, room.canvas.width * (1 / drawRatio), room.canvas.height * (1 / drawRatio));
            ctx.globalAlpha = 1;
        };
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
    util.drawUpgrade = function (upgrade, x, y, color) {
        let beingHovered = false;
        if (util.rectCollide({
            x: config.mouse.x,
            y: config.mouse.y,
            width: 1,
            height: 1
        }, {
            x: x * config.screenRatio,
            y: y * config.screenRatio,
            width: 100 * config.screenRatio,
            height: 100 * config.screenRatio
        })) {
            if (document.body.style.cursor != "pointer") document.body.style.cursor = "pointer";
            beingHovered = true;
            upgrade.size = util.lerp(upgrade.size, 1.1, 0.1);
        } else upgrade.size = util.lerp(upgrade.size, 1, 0.1);
        ctx.lineWidth = 10;
        ctx.strokeStyle = colors[8];
        util.roundRect(ctx, x, y, 100, 100, config.guiCornerRadius);
        if (beingHovered) {
            ctx.fillStyle = lightGuiColors[color];
        } else ctx.fillStyle = guiColors[color];
        ctx.stroke();
        ctx.fill();
        let bottomSpacing = 5
        util.roundRect(ctx, x, y + 50, 100, 50, {
            bl: config.guiCornerRadius,
            br: config.guiCornerRadius
        });
        if (beingHovered) {
            ctx.fillStyle = guiColors[color];
        } else ctx.fillStyle = darkGuiColors[color];
        ctx.fill();
        util.drawEntity(ctx, x + 50, y + 50, {
            class: upgrade.tank,
            showHealth: false,
            showName: false,
            color: 10,
            facing: animations.tankSpin
        }, undefined, 20 * upgrade.size, 3 * upgrade.size, false);
        util.drawText(ctx, entityTypes[upgrade.tank].name, x + 50, y + 95, 14, "center");
    };
    let colors = ["#ffffff" /* Real white */, "#000000" /* Real black */, "#f3f6fb" /* White */, "#2F2C30" /* Black */, "#e7e7e7" /* Grid */, "#bfbfbf" /* Dark grid */, "#72d3fe" /* Blue */, "#a3a7b0" /* Grey */, "#525252" /* Border grey */, "#ff6961" /* Red */, "#ffb347" /* Orange */, "#89e894" /* Green */, "#ffea61" /* Yellow */, "#f7665f" /* Triangle red */, "#9ea3f5" /* Pentagon blue */, "#b6fba4" /* Light green */, "#ff0000" /* Full red */, "#222222" /* Dark grey */];
    let guiColors = [colors[6], colors[11], colors[9], colors[12], colors[14], "#966fd6", "#ff9cee", "#ffdfd3"];
    let darkColors = [];
    let lightColors = [];
    let lightGuiColors = [];
    let darkGuiColors = [];
    for (let i = 0; i < colors.length; i++) { // Automatically make a dark version of every color.
        darkColors.push(util.mixColors(colors[i], "#000000", 0.25))
        //darkColors.push("#525252");
    };
    for (let i = 0; i < colors.length; i++) { // Automatically make a light version of every color.
        lightColors.push(util.mixColors(colors[i], "#ffffff", 0.5))
    };
    for (let i = 0; i < guiColors.length; i++) { // Automatically make a dark version of every guicolor.
        darkGuiColors.push(util.mixColors(guiColors[i], "#000000", 0.1))
    };
    for (let i = 0; i < guiColors.length; i++) { // Automatically make a light version of every guicolor.
        lightGuiColors.push(util.mixColors(guiColors[i], "#ffffff", 0.2))
    };
    function sendInput() {
        ws.send(protocol.encode("input", player.input[0], player.input[1], player.input[2], player.input[3], player.facing, config.mouse.pressing));
    };

    document.body.onkeydown = function (e) {
        if (elements.terminal.style.display == "none") {
            switch (e.keyCode) {
                case 65:
                    player.input[0] = true;
                    break;
                case 68:
                    player.input[1] = true;
                    break;
                case 87:
                    player.input[2] = true;
                    break;
                case 83:
                    if (config.gameState == config.gameStates.ingame || config.gameState == config.gameStates.goingInGame || document.activeElement.id == config.gameStates.nameInput) {
                        player.input[3] = true;
                    } /*else {
                        if (config.selectedServer == window.servers.length - 1) config.selectedServer = -1;
                        config.selectedServer++;
                        config.gameState = config.gameStates.unknown;
                        console.log(window.servers[config.selectedServer].wsLink);
                        reset();
                        if (ws != undefined) {
                            ws.onclose = function () { };
                            ws.close();
                        }
                        connect(window.servers[config.selectedServer].wsLink);
                    };*/
                    break;
                case 79:
                    elements.terminal.style.display = "block";
                    break;
                case 75:
                    ws.send(protocol.encode("levelUp"));
                    break;
                case 13:
                    if (config.gameState == config.gameStates.menu || config.gameState == config.gameStates.goingToMenuFromDeath || config.gameState == config.gameStates.goingToMenu) {
                        player.spawn();
                    };
                    if (player.dead) {
                        animations.menuBGAlpha = 0;
                        animations.menuFadeIn = 0;
                        player.dead = 2;
                        config.gameState = config.gameStates.goingToMenuFromDeath;
                        animations.menuSlide = 0;
                        animations.menu = 1;
                        elements.name.disabled = false;
                        //console.log(animations.menuSlide)
                    };
                    break;
                case 56:
                    player.upgradeSkill(0);
                    break;
                case 55:
                    player.upgradeSkill(1);
                    break;
                case 54:
                    player.upgradeSkill(2);
                    break;
                case 53:
                    player.upgradeSkill(3);
                    break;
                case 52:
                    player.upgradeSkill(4);
                    break;
                case 51:
                    player.upgradeSkill(5);
                    break;
                case 50:
                    player.upgradeSkill(6);
                    break;
                case 49:
                    player.upgradeSkill(7);
                    break;
                case 69:
                    player.autoFire = !player.autoFire;
                    config.mouse.pressing = player.autoFire;
                    break;
            };
        } else {
            switch (e.keyCode) {
                case 13:
                    ws.send(protocol.encode("terminal", elements.terminalInput.value));
                    elements.terminalInput.value = "";
                    break;
            }
        };
    };

    document.body.onkeyup = function (e) {
        switch (e.keyCode) {
            case 65:
                player.input[0] = false;
                break;
            case 68:
                player.input[1] = false;
                break;
            case 87:
                player.input[2] = false;
                break;
            case 83:
                player.input[3] = false;
                break;
        };
    };

    document.body.onmousemove = function (e) {
        config.mouse.x = e.clientX * window.devicePixelRatio;
        config.mouse.y = e.clientY * window.devicePixelRatio;
        //skillHover
        if (config.mouse.x < (animations.rservers == 1 ? 250 : 10)) {
            animations.rservers = 1;
        } else animations.rservers = 0;
        if (config.mouse.x < (animations.skillHover == 1 ? 255 : 10) && config.mouse.y > (config.screenHeight - config.spacing * config.screenRatio - (player.skill.length * 30 * config.screenRatio) - 15 * config.screenRatio)) {
            animations.skillHover = 1;
        } else animations.skillHover = 0;
    };
    document.body.onmousedown = function (e) {
        if (player.skillPoints != 0) {
            for (let i = 0; i < player.skill.length; i++) {
                let dx = config.mouse.x - (config.spacing * config.screenRatio + 250 * config.screenRatio + 20 * config.screenRatio);
                let dy = config.mouse.y - (config.screenHeight - config.spacing * config.screenRatio - i * 30 * config.screenRatio - 25 * config.screenRatio);
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 12.5 * config.screenRatio && player.skillPoints > 0) {
                    player.upgradeSkill(i);
                    return;
                };
            };
        };
        for (let key in player.upgrades) {
            let upgrade = player.upgrades[key];
            let x = ((50 + (upgrade.x) * 120) * upgrade.animation) - (150 * (-upgrade.animation + 1));
            let y = 50 + 40;
            if (util.rectCollide({
                x: config.mouse.x,
                y: config.mouse.y,
                width: 1,
                height: 1
            }, {
                x: x * config.screenRatio,
                y: y * config.screenRatio,
                width: 100 * config.screenRatio,
                height: 100 * config.screenRatio
            })) {
                ws.send(protocol.encode("upgrade", upgrade.index));
                return;
            };
        };
        if (config.gameState == config.gameStates.menu && player.mobile) {
            if (util.rectCollide({
                x: config.mouse.x,
                y: config.mouse.y,
                width: 1,
                height: 1
            }, {
                x: config.screenWidth / 2 + 160 * config.screenRatio,
                y: (config.screenHeight / 2 - 50 * config.screenRatio - animations.menu * 400 * config.screenRatio) - animations.menuSlide * config.screenHeight / 1.5,
                width: 35 * config.screenRatio,
                height: 35 * config.screenRatio
            })) {
                player.spawn();
                return;
            };
        };
        config.mouse.pressing = true;
    };

    document.body.onmouseup = function () {
        config.mouse.pressing = false;
    };
    window.onresize = function () {
        util.fullScreenCanvas(canvas);
    };
    canvas.ontouchmove = function (e) {
        e.preventDefault();
        config.mouse.x = e.touches[0].clientX * window.devicePixelRatio;
        config.mouse.y = e.touches[0].clientY * window.devicePixelRatio;
        //skillHover
        if (config.mouse.x < (animations.rservers == 1 ? 250 : 10)) {
            animations.rservers = 1;
        } else animations.rservers = 0;
        if (config.mouse.x < (animations.skillHover == 1 ? 255 : 10) && config.mouse.y > (config.screenHeight - config.spacing * config.screenRatio - (player.skill.length * 30 * config.screenRatio) - 15 * config.screenRatio)) {
            animations.skillHover = 1;
        } else animations.skillHover = 0;
        config.mouse.pressing = true;
    };
    document.body.ontouchend = function () {
        config.mouse.pressing = false;
        elements.name.value = " ";
    };
    document.body.ontouchstart = function (e) {
        console.log(e)
        elements.name.value += e.eventPhase + " ";
        //    config.mouse.pressing = true;
        if (player.mobile) {
            if (player.dead) {
                animations.menuBGAlpha = 0;
                animations.menuFadeIn = 0;
                player.dead = 2;
                config.gameState = config.gameStates.goingToMenuFromDeath;
                animations.menuSlide = 0;
                animations.menu = 1;
                elements.name.disabled = false;
                //console.log(animations.menuSlide)
            };
        };
    };
    util.fullScreenCanvas(canvas);
    let lastFrameTime = performance.now();
    let avgfps = [];
    const avgfpsLimit = 25;
    const loop = function () {
        if (!config.mouse.pressing && player.autoFire) config.mouse.pressing = true;
        let delta = performance.now() - lastFrameTime;
        let fps = Math.min(1000 / delta, 60);
        lastFrameTime = performance.now();
        avgfps.push(fps);
        let total = 0;
        for (let i = 0; i < avgfps.length; i++) {
            total += avgfps[i];
        }
        let average = total / avgfps.length;
        config.fps = average;
        if (avgfps.length > 25) {
            avgfps.shift();
        }
        player.camera.ratio = ((config.screenWidth + config.screenHeight) / 3000) / player.camera.fov;
        config.screenRatio = ((config.screenHeight / Math.max(1080, config.screenHeight)) + (config.screenWidth / Math.min(1920, config.screenWidth))) / 2;
        if (player.mobile) config.screenRatio *= 1.25;
        ctx.resetTransform();
        if (config.gameState == config.gameStates.ingame || config.gameState == config.gameStates.goingInGame || config.gameState == config.gameStates.menu || config.gameState == config.gameStates.goingToMenuFromDeath) {
            elements.name.style.display = "none";
            player.facing = Math.atan2(config.mouse.y - config.screenHeight / 2 - (player.position.y - player.camera.position.y) * player.camera.ratio, config.mouse.x - config.screenWidth / 2 - (player.position.x - player.camera.position.x) * player.camera.ratio);
            if (config.sendInput) sendInput();
            room.width = util.lerp(room.width, room.rwidth, 0.1);
            room.height = util.lerp(room.height, room.rheight, 0.1);
            player.camera.position.x = util.lerp(player.camera.position.x, player.camera.position.rx, 0.05);
            player.camera.position.y = util.lerp(player.camera.position.y, player.camera.position.ry, 0.05);
            player.camera.fov = util.lerp(player.camera.fov, player.camera.rfov, 0.025);
            //player.position.vx = util.lerp(player.position.vx, 0, 0.1);
            //player.position.vy = util.lerp(player.position.vy, 0, 0.1);
            if (player.input[0]) player.position.vx = util.lerp(player.position.vx, -player.speed, 0.1);
            if (player.input[1]) player.position.vx = util.lerp(player.position.vx, player.speed, 0.1);
            if (player.input[2]) player.position.vy = util.lerp(player.position.vy, -player.speed, 0.1);
            if (player.input[3]) player.position.vy = util.lerp(player.position.vy, player.speed, 0.1);
            ctx.fillStyle = colors[5];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.translate((config.screenWidth / 2) - player.camera.position.x * player.camera.ratio, (config.screenHeight / 2) - player.camera.position.y * player.camera.ratio);
            ctx.scale(player.camera.ratio, player.camera.ratio);
            ctx.fillStyle = colors[4];
            ctx.fillRect(-(room.width / 2), -(room.height / 2), room.width, room.height);
            ctx.globalAlpha = 0.25;
            switch (room.gm) {
                case "2tdm": {
                    let baseSize = room.width / 12;
                    // draw orange base
                    ctx.fillStyle = colors[10];
                    ctx.fillRect(-(room.width / 2) + (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2), baseSize, baseSize);
                    // draw red base
                    ctx.fillStyle = colors[9];
                    ctx.fillRect((room.width / 2 - baseSize) - (baseSize / 2), -(room.height / 2) + (baseSize / 2), baseSize, baseSize);
                }
                    break;
                case "4tdm": {
                    let baseSize = room.width / 12;
                    // draw orange base
                    ctx.fillStyle = colors[10];
                    ctx.fillRect(-(room.width / 2) + (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2), baseSize, baseSize);
                    // draw red base
                    ctx.fillStyle = colors[9];
                    ctx.fillRect((room.width / 2 - baseSize) - (baseSize / 2), -(room.height / 2) + (baseSize / 2), baseSize, baseSize);
                    // draw green base
                    ctx.fillStyle = colors[11];
                    ctx.fillRect(-(room.width / 2) + (baseSize / 2), -(room.height / 2) + (baseSize / 2), baseSize, baseSize);
                    // draw blue base
                    ctx.fillStyle = colors[6];
                    ctx.fillRect((room.width / 2 - baseSize) - (baseSize / 2), room.height / 2 - baseSize - (baseSize / 2), baseSize, baseSize);
                } break;
            };
            ctx.globalAlpha = 0.025;
            ctx.fillStyle = room.gridPattern;
            let addSize = 100000
            ctx.fillRect(Math.round((-(room.width / 2) - addSize / 2) / player.camera.ratio) * player.camera.ratio, Math.round((-(room.height / 2) - addSize / 2) / player.camera.ratio) * player.camera.ratio, room.width + addSize, room.height + addSize);
            ctx.globalAlpha = 1;
            ctx.lineJoin = "round";
            ctx.lineWidth = 7.5;
            for (let key in room.entities) {
                let entity = room.entities[key];
                let changeFullColor = false;
                let changeColor = "#ffffff";
                if (entity.damageAnimation != 0) changeFullColor = true;
                if (entity.damageAnimation == 1) changeColor = colors[16];
                if (entity.damageAnimation == 2) changeColor = colors[16];
                if (entity.damageAnimation == 3) changeColor = colors[0];
                if (entity.damageAnimation == 4) changeColor = colors[0];
                // interpolate.
                entity.facing = util.lerpAngle(entity.facing, entity.rfacing, 0.25);
                //entity.rvx = util.lerp(entity.rvx, 0, 0.025);
                //entity.rvy = util.lerp(entity.rvy, 0, 0.025);
                entity.vx = util.lerp(entity.vx, entity.rvx, 0.03);
                entity.vy = util.lerp(entity.vy, entity.rvy, 0.03);
                entity.x = util.lerp(entity.x, entity.rx + entity.vx * 4, 0.1);
                entity.y = util.lerp(entity.y, entity.ry + entity.vy * 4, 0.1);
                entity.size = util.lerp(entity.size, entity.rsize, 0.1);
                entity.alpha = util.lerp(entity.alpha, entity.ralpha, 0.1);
                entity.health = util.lerp(entity.health, entity.rhealth, 0.5);
                entity.barrelFlash = util.lerp(entity.barrelFlash, entity.rbarrelFlash, 0.25);
                if (entity.health < 0) entity.health = 0;
                for (let i2 = 0; i2 < entity.barrels.length; i2++) {
                    entity.barrels[i2] = util.lerp(entity.barrels[i2], entity.rbarrels[i2], 0.25);
                };
                if (entity.id == player.id) {
                    player.tank = entityTypes[entity.class];
                    player.tank.id = entity.class;
                    player.level = entity.level;
                    player.score = entity.score;
                    entity.facing = player.facing;
                    player.position.x = entity.x;
                    player.position.y = entity.y;
                };
                util.drawEntity(ctx, entity.x, entity.y, entity, changeFullColor ? changeColor : undefined, entity.size, 7.5, true, entity.alpha);
                if (entity.damageAnimation == 4) entity.damageAnimation = 0;
                if (entity.damageAnimation == 3) entity.damageAnimation = 4;
                if (entity.damageAnimation == 2) entity.damageAnimation = 3;
                if (entity.damageAnimation == 1) entity.damageAnimation = 2;
                ctx.lineWidth = 7.5;
            };
            ctx.globalAlpha = 1;
            ctx.resetTransform();
            // Draw GUI
            ctx.scale(config.screenRatio, config.screenRatio);
            config.screenWidth /= config.screenRatio;
            config.screenHeight /= config.screenRatio;
            // Draw score-level board
            ctx.globalAlpha = config.guiAlpha;
            ctx.fillStyle = colors[3];
            util.roundRect(ctx, (config.screenWidth / 2) - 200, config.screenHeight - (elements.name.value == "" ? 60 : 110) - config.spacing, 400, elements.name.value == "" ? 60 : 110, 10);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.font = "90px " + config.font;
            ctx.fillStyle = colors[2];
            util.drawText(ctx, "Score: " + player.score, config.screenWidth / 2, config.screenHeight - 10 - config.spacing, 20, "center");
            util.drawText(ctx, "Lvl " + player.level + " " + player.tank.name, config.screenWidth / 2, config.screenHeight - 40 - config.spacing, 18, "center");
            util.drawText(ctx, elements.name.value, config.screenWidth / 2, config.screenHeight - 72.5 - config.spacing, 40, "center");
            // Draw killCount
            ctx.globalAlpha = config.guiAlpha;
            ctx.fillStyle = colors[3];
            animations.killsMenu = util.lerp(animations.killsMenu, player.kills == 0 ? 0 : 1, 0.1);
            util.roundRect(ctx, (config.screenWidth) - 400 - config.spacing, (config.spacing * animations.killsMenu) - (30 * (-animations.killsMenu + 1)), 80, 30, config.guiCornerRadius);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = colors[2];
            util.drawText(ctx, player.kills + " Kill" + (player.kills == 1 ? "" : "s"), (config.screenWidth) - 400 - config.spacing + 40, (config.spacing * animations.killsMenu) - (30 * (-animations.killsMenu + 1)) + 20, 18, "center");
            // Draw minimap
            ctx.globalAlpha = 0.75;
            ctx.fillStyle = colors[4];
            ctx.fillRect(config.screenWidth - 200 - config.spacing, config.screenHeight - 200 - config.spacing, 200, 200);
            ctx.globalAlpha = 0.25;
            switch (room.gm) {
                case "2tdm": {
                    let baseSize = 200 / 12;
                    // draw orange base
                    ctx.fillStyle = colors[10];
                    ctx.fillRect(config.screenWidth - 200 - config.spacing + (baseSize / 2), config.screenHeight - baseSize - (baseSize / 2) - config.spacing, baseSize, baseSize);
                    // draw red base
                    ctx.fillStyle = colors[9];
                    ctx.fillRect(config.screenWidth - 200 - config.spacing + 200 - baseSize - (baseSize / 2), config.screenHeight - 200 + (baseSize / 2) - config.spacing, baseSize, baseSize);
                }
                    break;
                case "4tdm": {
                    let baseSize = 200 / 12;
                    // draw orange base
                    ctx.fillStyle = colors[10];
                    ctx.fillRect(config.screenWidth - 200 - config.spacing + (baseSize / 2), config.screenHeight - baseSize - (baseSize / 2) - config.spacing, baseSize, baseSize);
                    // draw red base
                    ctx.fillStyle = colors[9];
                    ctx.fillRect(config.screenWidth - 200 - config.spacing + 200 - baseSize - (baseSize / 2), config.screenHeight - 200 + (baseSize / 2) - config.spacing, baseSize, baseSize);
                    // draw green base
                    ctx.fillStyle = colors[11];
                    ctx.fillRect(config.screenWidth - 200 - config.spacing + (baseSize / 2), config.screenHeight - 200 + (baseSize / 2) - config.spacing, baseSize, baseSize);
                    // draw blue base
                    ctx.fillStyle = colors[6];
                    ctx.fillRect(config.screenWidth - 200 - config.spacing + 200 - baseSize - (baseSize / 2), config.screenHeight - baseSize - (baseSize / 2) - config.spacing, baseSize, baseSize);
                }
                    break;
            };
            ctx.lineWidth = 5;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = colors[8];
            ctx.strokeRect(config.screenWidth - 200 - config.spacing, config.screenHeight - 200 - config.spacing, 200, 200);
            ctx.beginPath()
            ctx.arc((config.screenWidth - 200 - config.spacing) + (player.position.x / (room.rwidth / 200)) + (room.rwidth / (room.rwidth / 100)), (config.screenHeight - 200 - config.spacing) + (player.position.y / (room.rheight / 200)) + (room.rheight / (room.rheight / 100)), 3, 0, 2 * Math.PI);
            ctx.closePath()
            ctx.fillStyle = colors[3];
            ctx.fill();
            /*for (let key in room.entities) {
                let entity = room.entities[key];
                ctx.beginPath()
                ctx.arc((config.screenWidth - 200 - config.spacing) + (entity.x / (room.rwidth / 200)) + (room.rwidth / (room.rwidth / 100)), (config.screenHeight - 200 - config.spacing) + (entity.y / (room.rheight / 200)) + (room.rheight / (room.rheight / 100)), entity.size / (room.rheight / (room.rheight / 100)), 0, 2 * Math.PI);
                ctx.closePath()
                ctx.fillStyle = colors[entity.color];
                ctx.fill();
            };*/
            ctx.fillStyle = colors[2];
            util.drawText(ctx, "kanono.io", config.screenWidth - config.spacing, config.screenHeight - 210 - config.spacing, 25, "right");
            // Draw skills
            animations.skill = util.lerp(animations.skill, (config.gameState == config.gameStates.goingInGame || config.gameState == config.gameStates.ingame) ? (animations.skillHover == 0 ? (player.skillPoints == 0 ? 0 : 1) : 1) : 0, 0.05);
            animations.skillX = animations.skill * animations.skillXSize;
            ctx.translate(-animations.skillXSize + animations.skillX, 0);
            if (document.body.style.cursor != "default") document.body.style.cursor = "default";
            if (animations.skillX > 10) {
                ctx.fillStyle = colors[3];
                ctx.globalAlpha = config.guiAlpha;
                util.roundRect(ctx, config.spacing, config.screenHeight - config.spacing - (player.skill.length * 30) - 15, 255, player.skill.length * 30 + 10, config.guiCornerRadius);
                ctx.fill();
                ctx.fillStyle = colors[0];
                for (let i = 0; i < player.skill.length; i++) {
                    let skill = player.skill[i];
                    ctx.fillStyle = colors[0];
                    ctx.lineWidth = 12.5 * 2;
                    ctx.strokeStyle = colors[0];
                    ctx.globalAlpha = 0.1;
                    // Draw bg
                    ctx.beginPath();
                    ctx.moveTo(config.spacing + 20, config.screenHeight - config.spacing - i * 30 - 25);
                    ctx.lineTo(config.spacing + 20 + 215, config.screenHeight - config.spacing - i * 30 - 25);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                    // Draw amount
                    ctx.strokeStyle = guiColors[i];
                    ctx.beginPath();
                    ctx.moveTo(config.spacing + 20, config.screenHeight - config.spacing - i * 30 - 25);
                    ctx.lineTo(config.spacing + 20 + (215 * (skill.count / skill.max)), config.screenHeight - config.spacing - i * 30 - 25);
                    ctx.closePath();
                    ctx.stroke();
                    if (player.skillPoints == 0 && (!skill.count >= skill.max)) ctx.fillStyle = colors[7];
                    if (skill.count >= skill.max) ctx.fillStyle = guiColors[i];
                    util.drawText(ctx, skill.name, config.spacing + 17.5, config.screenHeight - config.spacing - i * 30 - 19, 20, "left");
                    util.drawText(ctx, skill.count, config.spacing + 250 - 10, config.screenHeight - config.spacing - i * 30 - 19, 20, "right");
                    ctx.fillStyle = colors[0];
                    ctx.globalAlpha = config.guiAlpha;
                    let dx = config.mouse.x - (config.spacing + 250 + 20) * config.screenRatio;
                    let dy = config.mouse.y - (config.screenHeight - config.spacing - i * 30 - 25) * config.screenRatio;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    ctx.fillStyle = colors[3];
                    if (distance < 12.5 * config.screenRatio && !(skill.count >= skill.max) && player.skillPoints != 0) {
                        if (document.body.style.cursor != "pointer") document.body.style.cursor = "pointer";
                        ctx.fillStyle = colors[17];
                    };
                    ctx.beginPath();
                    ctx.arc(config.spacing + 250 + 20, config.screenHeight - config.spacing - i * 30 - 25, 12.5, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = colors[0];
                    if (skill.count >= skill.max || player.skillPoints == 0) ctx.fillStyle = colors[7];
                    util.drawText(ctx, "+", config.spacing + 250 + 20, config.screenHeight - config.spacing - i * 30 - 18, 20, "center");
                    util.drawText(ctx, "[" + (-i + 8) + "]", config.spacing + 250 + 50, config.screenHeight - config.spacing - i * 30 - 18, 20, "center");
                };
                if (player.skillPoints >= 2) util.drawText(ctx, "x" + player.skillPoints, config.spacing + 250 + 20, config.screenHeight - config.spacing - 8 * 30 - 18, 20, "center");
            };
            ctx.translate(-(-animations.skillXSize + animations.skillX), 0);
            // Draw messages
            /*for (let i = 0; i < config.messages.length; i++) {
                ctx.fillStyle = colors[3];
                let message = config.messages[i];
                if (message.time < Date.now()) {
                    message.dissapearing = true;
                };
                if (message.dissapearing) {
                    message.alpha = util.lerp(message.alpha, 0, 0.1);
                    if (message.y < 0.05) {
                        message.y = 0;
                        config.messages.shift();
                    };
                };
                util.roundRect(ctx, config.screenWidth / 2 - message.width / 2 - 10, config.spacing + i * 50, message.width + 20, 40, 10);
                ctx.globalAlpha = config.guiAlpha * message.alpha;
                ctx.fill();
                ctx.globalAlpha = 1 * message.alpha;
                ctx.fillStyle = colors[0];
                util.drawText(ctx, message.content, config.screenWidth / 2, (config.spacing + i * 50) + 32, 32, "center", false);
            };*/
            ctx.globalAlpha = 1;
            // Draw upgrades
            animations.tankSpin += 0.01;
            if (player.upgradeCount == 0) {
                animations.upgrade = util.lerp(animations.upgrade, 0, 0.1);
            } else animations.upgrade = util.lerp(animations.upgrade, 1, 0.1);
            animations.upgradeWidth = util.lerp(animations.upgradeWidth, (player.upgradeCount * 120) + 20, 0.1);
            util.roundRect(ctx, config.spacing + ((animations.upgrade * 300) - 300), config.spacing, (animations.upgradeWidth), 100 + 40 + 40, config.guiCornerRadius);
            ctx.fillStyle = colors[3];
            ctx.globalAlpha = config.guiAlpha;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = colors[0];
            util.drawText(ctx, "Upgrades", (config.spacing + animations.upgradeWidth / 2) + (((animations.upgrade * 300) - 300)), config.spacing + 32, 28, "center")
            //if (document.body.style.cursor != "default") document.body.style.cursor = "default";
            for (let key in player.upgrades) {
                let upgrade = player.upgrades[key];
                if (upgrade.dying) {
                    upgrade.animation = util.lerp(upgrade.animation, 0, 0.1);
                    if (upgrade.animation < 0.05) delete player.upgrades[key];
                } else upgrade.animation = util.lerp(upgrade.animation, 1, 0.1);
                util.drawUpgrade(upgrade, (((config.spacing + 20) + (upgrade.x) * 120) * upgrade.animation) - (150 * (-upgrade.animation + 1)), config.spacing + 60, upgrade.color)
            };
            // draw leaderboard
            animations.lbWidth = util.lerp(animations.lbWidth, 60 + (room.lb.length * 30), 0.1);
            util.roundRect(ctx, config.screenWidth - (config.leaderboardWidth) - config.spacing, config.spacing, config.leaderboardWidth, animations.lbWidth, config.guiCornerRadius);
            ctx.fillStyle = colors[3];
            ctx.globalAlpha = config.guiAlpha;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = colors[0];
            util.drawText(ctx, "Leaderboard", config.screenWidth - (config.leaderboardWidth / 2) - config.spacing, 30 + config.spacing, 30)
            for (let i = 0; i < room.lb.length; i++) {
                let tank = room.lb[i];
                ctx.globalAlpha = 0.1;
                ctx.lineWidth = 25;
                ctx.strokeStyle = colors[0];
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.moveTo(config.screenWidth - (config.leaderboardWidth / 2) - 110 - config.spacing, 60 + i * 30 + config.spacing);
                ctx.lineTo(config.screenWidth - (config.leaderboardWidth / 2) + 110 - config.spacing, 60 + i * 30 + config.spacing);
                ctx.closePath();
                ctx.stroke();
                ctx.globalAlpha = 0.9;
                // actually draw the thing
                ctx.strokeStyle = colors[tank.color];
                ctx.beginPath();
                ctx.moveTo(config.screenWidth - (config.leaderboardWidth / 2) - 110 - config.spacing, 60 + i * 30 + config.spacing);
                ctx.lineTo(config.screenWidth - (config.leaderboardWidth / 2) + (110 * (tank.percentage * 2 - 1)) - config.spacing, 60 + i * 30 + config.spacing);
                ctx.closePath();
                ctx.stroke();
                if (tank.percentage == 0) {
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.beginPath();
                    ctx.arc(config.screenWidth - (config.leaderboardWidth / 2) - 110 - config.spacing, 60 + i * 30 + config.spacing, 25 / 2, 0, 2 * Math.PI)
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = colors[0];
                };
                ctx.globalAlpha = 1;
                ctx.globalAlpha = 1;
                util.drawText(ctx, tank.name + " - " + tank.score, config.screenWidth - (config.leaderboardWidth / 2) - config.spacing, 65 + i * 30 + config.spacing, 20)
                // draw the tank
                util.drawEntity(ctx, config.screenWidth - 310 - config.spacing, 60 + i * 30 + config.spacing, {
                    class: tank.class,
                    showHealth: false,
                    showName: false,
                    color: tank.color,
                    facing: -Math.PI / 4
                }, undefined, 10, 1, false);
            };
            config.screenWidth *= config.screenRatio;
            config.screenHeight *= config.screenRatio;
            ctx.resetTransform();
        } else if (config.gameState == config.gameStates.connecting || config.gameState == config.gameStates.goingToMenu || config.gameState == config.gameStates.goingToLoadingET) {
            if (elements.name.style.display == "block") elements.name.style.display = "none";
            if (config.gameState == config.gameStates.goingToMenu) {
                animations.connecting = util.lerp(animations.connecting, 1, 0.05);
                animations.loadingET = util.lerp(animations.loadingET, 0, 0.05);
                if (animations.connecting > 0.99 && animations.loadingET < 0.01) {
                    config.gameState = config.gameStates.menu;
                };
            } else animations.connecting = util.lerp(animations.connecting, 0, 0.05);
            if (config.gameState == config.gameStates.goingToLoadingET) {
                animations.loadingET = util.lerp(animations.loadingET, 1, 0.05);
                if (config.entityTypesLoaded) config.gameState = config.gameStates.goingToMenu;
            };
            if (player.connectingWarn) {
                animations.connectingWarn = util.lerp(animations.connectingWarn, 1, 0.05);
            };
            if (player.connectingWarningTime < Date.now()) {
                if (!player.connectingWarn) player.connectingWarn = true;
            };
            ctx.scale(config.screenRatio, config.screenRatio);
            config.screenWidth /= config.screenRatio;
            config.screenHeight /= config.screenRatio;
            ctx.fillStyle = colors[7];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.globalAlpha = 0.025 * (-animations.connecting + 1);
            ctx.fillStyle = room.gridPattern;
            animations.connectingGrid += 2;
            if (animations.connectingGrid > config.gridSize) {
                animations.connectingGrid = 0;
            };
            ctx.save();
            ctx.translate(0, animations.connectingGrid);
            ctx.fillRect(0, -animations.connectingGrid, config.screenWidth, config.screenHeight);
            ctx.restore();
            ctx.globalAlpha = animations.loadingET;
            ctx.fillStyle = colors[0];
            util.drawText(ctx, "Loading the game assets...", config.screenWidth / 2, (config.screenHeight / 2 - 300) + animations.loadingET * 200, 30, "center");
            ctx.globalAlpha = 1;
            ctx.fillStyle = colors[0];
            util.drawText(ctx, "Connecting...", config.screenWidth / 2, config.screenHeight / 2 - animations.connecting * 200, 75, "center");
            ctx.globalAlpha = animations.connectingWarn;
            util.drawText(ctx, "Try switching to http or https if you cannot connect", config.screenWidth / 2, config.screenHeight / 2 + animations.connectingWarn * 50, 20, "center");
            // animations.connectingWarn
            /*if (config.selectedServer == 0) {
                util.drawText(ctx, "Warning: You might need to use http for this server.", config.screenWidth / 2, config.screenHeight / 2 + 48 - animations.connecting * 200, 30, "center");
                ctx.fillStyle = colors[9];
                util.drawText(ctx, "This server might be outdated.", config.screenWidth / 2, config.screenHeight / 2 + 75 - animations.connecting * 200, 24, "center");
            };*/
            ctx.fillStyle = colors[0];
            config.screenWidth *= config.screenRatio;
            config.screenHeight *= config.screenRatio;
            ctx.resetTransform();
            ctx.globalAlpha = animations.connecting;
            ctx.fillStyle = colors[2];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.globalAlpha = 1;
        };
        if (config.gameState == config.gameStates.menu || config.gameState == config.gameStates.goingInGame || config.gameState == config.gameStates.goingToMenuFromDeath) {
            if (config.gameState == config.gameStates.goingInGame) {
                animations.menuSlide = util.lerp(animations.menuSlide, 1, 0.05);
                animations.menuBGAlpha = util.lerp(animations.menuBGAlpha, 0, 0.05);
                if (animations.menuSlide > 0.99 && animations.menuBGAlpha < 0.01) config.gameState = config.gameStates.ingame, config.sendInput = true;
            } else animations.menuBGAlpha = util.lerp(animations.menuBGAlpha, 1, 0.05);
            if (elements.name.style.display == "none") elements.name.style.display = "block";
            animations.menu = util.lerp(animations.menu, 0, 0.05);
            if (config.gameState == config.gameStates.goingToMenuFromDeath) {
                if (animations.menu < 0.01) config.gameState = config.gameStates.menu;
            };
            ctx.scale(config.screenRatio, config.screenRatio);
            config.screenWidth /= config.screenRatio;
            config.screenHeight /= config.screenRatio;
            ctx.fillStyle = colors[8];
            ctx.globalAlpha = animations.menuBGAlpha / 2;
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.globalAlpha = -animations.menuSlide + 1; // Draw Changelog
            ctx.fillStyle = colors[0];
            util.drawText(ctx, "Changelog", config.screenWidth - config.spacing - 25, config.spacing + 10, 20, "right");
            util.drawText(ctx, config.changelogTime == "" ? "Updated just now" : "Updated " + config.changelogTime + "ago", config.screenWidth - config.spacing - 25, config.spacing + 40, 18, "right");
            for (let i = 0; i < window.changelog.length; i++) {
                util.drawText(ctx, window.changelog[i] + " -", config.screenWidth - config.spacing - 25, config.spacing + 70 + (i * 30), 12.5, "right");
            };
            ctx.globalAlpha = 1;
            util.drawText(ctx, "kanono!" + (window.beta ? " (opensource edition)" : ""), config.screenWidth / 2, (config.screenHeight / 2 - 100 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 60, "center");
            if (player.mobile) util.drawText(ctx, "NOTE: Mobile version of kanono.io is not finished yet.", config.screenWidth / 2, (config.screenHeight / 2 - 180 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 15, "center");
            if (!player.mobile) util.drawText(ctx, "(Enter to start)", config.screenWidth / 2, (config.screenHeight / 2 + 25 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 15, "center");
            util.drawText(ctx, "Current server: " + window.servers[config.selectedServer].name + " (S to switch)", config.screenWidth / 2, (30) - animations.menuSlide * config.screenHeight / 1.5, 15, "center");
            animations.servers = util.lerp(animations.servers, animations.rservers, 0.05);
            ctx.globalAlpha = config.guiAlpha * (-animations.menuSlide + 1);
            ctx.fillStyle = colors[3];
            util.roundRect(ctx, (animations.servers * 525) - 560, config.screenHeight / 2 - 180, 350, 125 + window.servers.length * 100, 20);
            ctx.fill();
            ctx.globalAlpha = -animations.menuSlide + 1;
            ctx.fillStyle = colors[0];
            util.drawText(ctx, "Servers", (animations.servers * 525) - 500, config.screenHeight / 2 + -1 * 100, 75, "left");
            for (let i = 0; i < window.servers.length; i++) {
                util.drawText(ctx, window.servers[i].name + (config.selectedServer == i ? " <" : ""), (animations.servers * 525) - 500, config.screenHeight / 2 + i * 100, 50, "left");
            };
            if (player.mobile) {
                ctx.fillStyle = darkColors[10];
                util.roundRect(ctx, config.screenWidth / 2 + 160, (config.screenHeight / 2 - 48 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 35, 35, 5);
                ctx.fill();
                ctx.fillStyle = colors[10];
                util.roundRect(ctx, config.screenWidth / 2 + 160, (config.screenHeight / 2 - 50 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 35, 35, 5);
                ctx.fill();
                ctx.fillStyle = colors[0];
                util.drawPolygon(ctx, config.screenWidth / 2 + 160 + (35 / 2), (config.screenHeight / 2 - 50 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5 + (35 / 2), 10, 3, 0);
                ctx.fill();
            };
            ctx.fillStyle = colors[8];
            util.roundRect(ctx, config.screenWidth / 2 - 150, (config.screenHeight / 2 - 48 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 300, 35, 5);
            ctx.fill();
            ctx.fillStyle = colors[2];
            util.roundRect(ctx, config.screenWidth / 2 - 150, (config.screenHeight / 2 - 50 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5, 300, 35, 5);
            ctx.fill();
            elements.name.style.top = (((config.screenHeight / 2 - 50 - animations.menu * 400) - animations.menuSlide * config.screenHeight / 1.5) * config.screenRatio) / window.devicePixelRatio + "px";
            elements.name.style.left = ((config.screenWidth / 2 - 150) * config.screenRatio) / window.devicePixelRatio + "px";
            elements.name.style.width = (300 * config.screenRatio) / window.devicePixelRatio + "px"
            elements.name.style.height = (35 * config.screenRatio) / window.devicePixelRatio + "px"
            elements.name.style.fontSize = (35 * config.screenRatio) / window.devicePixelRatio + "px"
            config.screenWidth *= config.screenRatio;
            config.screenHeight *= config.screenRatio;
            ctx.resetTransform();
            animations.menuFadeIn = util.lerp(animations.menuFadeIn, 0, 0.05);
            ctx.globalAlpha = animations.menuFadeIn;
            ctx.fillStyle = colors[2];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.globalAlpha = 1;
        };
        if (player.dead || player.dead == 2) {
            if (player.dead == 2) {
                animations.deathScreen = util.lerp(animations.deathScreen, 0, 0.05);
                if (animations.deathScreen < 0.05) player.dead = false;
            } else animations.deathScreen = util.lerp(animations.deathScreen, 1, 0.05);
            ctx.globalAlpha = animations.deathScreen / 2;
            ctx.fillStyle = colors[1];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.globalAlpha = animations.deathScreen;
            ctx.fillStyle = colors[2];
            //util.drawText(ctx, player.deathMessage, config.screenWidth / 2, config.screenHeight / 2 - 50 - 400 - -animations.deathScreen * 400, 10, "center");
            util.drawText(ctx, "Died to a " + entityTypes[player.killerType].name, config.screenWidth / 2, config.screenHeight / 2 - 100 - 400 - -animations.deathScreen * 400, 10, "center");
            util.drawText(ctx, "Score: " + player.score, (config.screenWidth / 2) - 150, config.screenHeight / 2 - 50 - 400 - -animations.deathScreen * 400, 20, "left");
            util.drawText(ctx, "Level " + player.level + " " + player.tank.name, (config.screenWidth / 2) - 150, config.screenHeight / 2 - 400 - -animations.deathScreen * 400, 20, "left");
            util.drawText(ctx, "Kills: " + player.kills, (config.screenWidth / 2) - 150, config.screenHeight / 2 + 50 - 400 - -animations.deathScreen * 400, 20, "left");
            util.drawText(ctx, "(Enter to respawn)", config.screenWidth / 2, config.screenHeight / 2 + 100 - 400 - -animations.deathScreen * 400, 10, "center");
            // offCanvas.deathIcon
            ctx.globalAlpha *= 0.9
            ctx.drawImage(offCanvas.deathIcon.canvas, config.screenWidth / 2, config.screenHeight / 2 - 50 - 400 - -animations.deathScreen * 400)
            ctx.globalAlpha = 1;
            /*animations.deathScreen = util.lerp(animations.deathScreen, 1, 0.05);
            ctx.globalAlpha = animations.deathScreen / 4;
            ctx.fillStyle = colors[1];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);*/
        };
        if (config.disconnected) {
            config.gameState = config.gameStates.unknown;
            animations.disconnected = util.lerp(animations.disconnected, 1, 0.05);
            ctx.globalAlpha = animations.disconnected / 2;
            ctx.fillStyle = colors[1];
            ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
            ctx.globalAlpha = animations.disconnected;
            ctx.fillStyle = colors[2];
            util.drawText(ctx, "Disconnected", config.screenWidth / 2, config.screenHeight / 2 - 400 - -animations.disconnected * 400, 60, "center");
            util.drawText(ctx, "Reconnecting...", config.screenWidth / 2, config.screenHeight / 2 + 50 - 400 - -animations.disconnected * 400, 30, "center");
            ctx.globalAlpha = 1;
        };
        ctx.scale(config.screenRatio, config.screenRatio);
        ctx.fillStyle = colors[0];
        util.drawText(ctx, Math.floor(config.fps) + " FPS", 10, 15, 15, "left");
        ctx.resetTransform();
        requestAnimationFrame(loop);
    };

    loop();
    //if (player.mobile) document.body.requestFullscreen();
    function reset() {
        if (config.gameState != config.gameStates.connecting) {
            player.reset();
            room.entities = {};
            config.gameState = config.gameStates.connecting;
            animations.reset();
            config.spawned = false;
            elements.name.disabled = false;
            clearTimeout(player.livingAlertInterval);
        };
    };

    function connect(server) {
        console.log("Connecting to " + server);
        ws = new WebSocket(server);
        ws.onopen = function () {
            ws.binaryType = "arraybuffer";
            if (config.entityTypesLoaded) {
                config.gameState = config.gameStates.goingToMenu;
            } else config.gameState = config.gameStates.goingToLoadingET;
            player.livingAlertInterval = setInterval(function () {
                ws.send(protocol.encode("livingAlert"))
            }, 1000 / 15);
        };
        ws.onclose = function () {
            reset();
            connect(server);
        };
        ws.onmessage = function (message) {
            message = protocol.decode(message.data)
            let type = message[0];
            message.shift();
            switch (type) {
                case "roomInfo":
                    room.rwidth = message[0];
                    room.rheight = message[1];
                    room.gm = message[2];
                    break;
                case "playerId":
                    player.id = message[0];
                    break;
                case "goingInGame":
                    console.log("%cWelcome to kanono.io!", "font-style:bold;color:#ffb347;font-size:50px;")
                    config.gameState = config.gameStates.goingInGame;
                    player.resetSkill();
                    player.skillPoints = 64;
                    player.kills = 0;
                    if (player.dead) player.dead = 2;
                    break;
                case "entities":
                    message = message[0]
                    for (let key in message) {
                        if (!(key in room.entities)) {
                            room.entities[key] = {
                                id: key,
                                rx: message[key].x,
                                x: message[key].x,
                                ry: message[key].y,
                                y: message[key].y,
                                facing: message[key].facing,
                                rfacing: message[key].facing,
                                name: message[key].name,
                                rsize: message[key].size,
                                size: message[key].size,
                                score: message[key].score,
                                level: message[key].level,
                                class: message[key].class,
                                color: message[key].color,
                                showName: message[key].showName,
                                showHealth: message[key].showHealth,
                                barrels: message[key].barrels,
                                rbarrels: message[key].barrels,
                                alpha: message[key].alpha,
                                ralpha: message[key].alpha,
                                vx: message[key].vx,
                                vy: message[key].vy,
                                rvx: message[key].vx,
                                rvy: message[key].vy,
                                health: message[key].health,
                                rhealth: message[key].health,
                                damageAnimation: 0,
                                barrelFlash: message[key].barrelFlash,
                                rbarrelFlash: message[key].barrelFlash,
                                healthAlpha: 0
                            };
                        } else {
                            for (let key2 in room.entities) {
                                if (!(key2 in message)) {
                                    delete room.entities[key2];
                                };
                                if (key2 == key) {
                                    room.entities[key2].rfacing = message[key].facing;
                                    room.entities[key2].rx = message[key].x;
                                    room.entities[key2].ry = message[key].y;
                                    room.entities[key2].rsize = message[key].size;
                                    room.entities[key2].level = message[key].level;
                                    room.entities[key2].score = message[key].score;
                                    room.entities[key2].class = message[key].class;
                                    room.entities[key2].color = message[key].color;
                                    room.entities[key2].showName = message[key].showName;
                                    room.entities[key2].showHealth = message[key].showHealth;
                                    if (room.entities[key2].rbarrels.length != message[key].barrels.length) room.entities[key2].barrels = message[key].barrels;
                                    room.entities[key2].rbarrels = message[key].barrels;
                                    room.entities[key2].ralpha = message[key].alpha;
                                    room.entities[key2].rvx = message[key].vx;
                                    room.entities[key2].rvy = message[key].vy;
                                    if (room.entities[key2].rhealth > message[key].health) room.entities[key2].damageAnimation = 1;
                                    room.entities[key2].rhealth = message[key].health;
                                    room.entities[key2].rbarrelFlash = message[key].barrelFlash;
                                    if (message[key].barrelFlash == 1) {
                                        room.entities[key2].barrelFlash = 1;
                                    };
                                };
                            };
                        };
                    };
                    break;
                case "camera":
                    player.camera.position.rx = message[0];
                    player.camera.position.ry = message[1];
                    player.camera.rfov = message[2];
                    break;
                case "terminalOutput":
                    elements.terminalOutput.value += message[0] + "\n\n"
                    break;
                case "entityTypes":
                    entityTypes = JSON.parse(message[0])
                    config.entityTypesLoaded = true;
                    console.log("Loaded entityTypes.");
                    if (config.language == "tr") {
                        for (let i = 0; i < entityTypes.length; i++) {
                            entityTypes[i].name = ["Bilinmeyen Sınıf", "Madeni Para", "Kare", "Üçgen", "Beşgen", "Altıgen", "Mermi", "Drone", "Tank", "Yan Muhafız", "Üçlü Atış", "Dörtlü Tank", "Keskin Nişancı", "İkiz", "Suikastçı", "Korucu", "Yok Edici", "Yok Edici", "Makineli Tüfek", "Negev", "Ana Gemi", "Üç Açılı ", "Dominator", "Arena Closer", "İsimsiz Sınıf", "İsimsiz Sınıf", "Minigun", "Smasher", "Mega Smasher"][i] || entityTypes[i].name;
                        };
                    };
                    break;
                case "death":
                    player.dead = true;
                    config.sendInput = false;
                    config.spawned = false;
                    player.killerType = message[0];
                    offCanvas.deathIcon = document.createElement("canvas").getContext("2d");
                    offCanvas.deathIcon.canvas.width = 100;
                    offCanvas.deathIcon.canvas.height = 100;
                    util.drawEntity(offCanvas.deathIcon, 50, 50, {
                        class: player.tank.id,
                        showHealth: false,
                        showName: false,
                        color: 10,
                        facing: -Math.PI / 4
                    }, undefined, 25, 3, false);
                    /*player.deathMessage = "";
                    if (player.score > 100000) {
                        player.deathMessage = "Nice score, good luck next time"
                    };
                    if (player.score > 1000000) {
                        player.deathMessage = "Oh wow, you should probably post this somewhere"
                    };
                    if (player.score >= 10000000) {
                        player.deathMessage = "What the..."
                    };
                    if (player.score == 100000) {
                        player.deathMessage = "Perfect!";
                    };
                    if (player.score == 1000000) {
                        player.deathMessage = "Perfect..?";
                    };
                    if (player.score < 1000000 && player.score > 900000) {
                        player.deathMessage = "I feel bad for you";
                    };
                    if (player.score == 22275) {
                        player.deathMessage = "Sandbox player?";
                    };
                    if (player.score < 22275 && player.score > 20000) {
                        player.deathMessage = "You almost reached level 45, what a bad luck";
                    };
                    if (player.score == 0) {
                        player.deathMessage = "I have no words";
                    };
                    if (player.score == 69) {
                        player.deathMessage = "...";
                    };
                    if (player.score == 420) {
                        player.deathMessage = "...";
                    };
                    if (player.score == 69420) {
                        player.deathMessage = "............";
                    };*/
                    break;
                case "message":
                    config.messages.push({
                        content: message[0],
                        time: Date.now() + 6000,
                        width: (function () {
                            ctx.font = "32px " + config.font;
                            return ctx.measureText(message[0]).width;
                        })(),
                        y: 0,
                        alpha: 0,
                    });
                    break;
                case "upgradeReset":
                    player.upgradeReset();
                    break;
                case "upgrade":
                    player.upgradeCount++;
                    let index = 0;
                    for (let key in player.upgrades) {
                        if (!player.upgrades[key].dying) index++;
                    };
                    new Upgrade(message[0], index, index, index)
                    break;
                case "lb":
                    room.lb = (function () {
                        let output = [];
                        for (let i = 0; i < message.length; i++) {
                            if (i == 0) {
                                message[i].percentage = 1;
                            } else {
                                if (message[i].score == 0) {
                                    message[i].percentage = message[0].score == 0 ? 1 : 0;
                                } else {
                                    message[i].percentage = message[i].score / message[0].score;
                                }
                            };
                            output.push(message[i]);
                        };
                        return output;
                    })();
                    break;
                case "kill":
                    player.kills++;
                    break;
            };
        };
    };
    connect(window.servers[config.selectedServer].wsLink);
    elements.terminalExit.onclick = function () {
        elements.terminal.style.display = "none";
        canvas.focus();
    };
    elements.name.value = localStorage.getItem("name");
})();