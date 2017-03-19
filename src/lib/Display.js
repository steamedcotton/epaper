const SerialPort = require("serialport");
const Promise = require('bluebird');
const _ = require('lodash');

const cmds = require('./commands/cmds');
const colors = require('./commands/colors');
const fonts = require('./commands/fonts');
const frames = require('./commands/frames');
const memoryModes = require('./commands/memoryModes');
const screenRotation = require('./commands/screenRotation');

const HANDSHAKE_DELAY = 1000;

class Display {

    constructor(dev, settings = {}) {
        // Settings
        this.debug = _.get(settings, 'debug', false);
        this.baudRate = _.get(settings, 'baudRate', 115200);
        this.res = _.get(settings, 'res', {w: 800, h: 600});

        this.port = new SerialPort(dev, {
            baudRate: this.baudRate
        });


        // "this" binding
        this.checkOK = this.checkOK.bind(this);
        this.sendSync = this.sendSync.bind(this);
        this.handshake = this.handshake.bind(this);
        this.setColor = this.setColor.bind(this);
        this.clear = this.clear.bind(this);
        this.update = this.update.bind(this);
        this.setFont = this.setFont.bind(this);
        this.displayString = this.displayString.bind(this);
        this.drawCircle = this.drawCircle.bind(this);
        this.drawPixel = this.drawPixel.bind(this);
        this.drawFilledCircle = this.drawFilledCircle.bind(this);
        this.drawFilledRect = this.drawFilledRect.bind(this);
        this.drawRect = this.drawRect.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.drawTriangle = this.drawTriangle.bind(this);
        this.drawFillTriangle = this.drawFillTriangle.bind(this);
    }

    static getParityByte(data) {
        let result = 0;
        for(let i = 0; i < data.length; i++) {
            result ^= data[i];
        }
        return result;
    }

    static stringToByteArray(str) {
        let byteArray = []; // char codes

        for (let i = 0; i < str.length; ++i) {
            const code = str.charCodeAt(i);

            if (code / 256 >>> 0 > 0) {
                byteArray = byteArray.concat([code & 0xff, code / 256 >>> 0]);
            } else {
                byteArray.push(code & 0xff);
            }
        }

        // Strings must end with a "0"
        byteArray.push(0x00);

        return byteArray;
    }

    // Low Level Methods

    checkOK(data) {
        return new Promise((resolve, reject) => {
            if (this.debug) {
                console.log('[DEBUG] CheckOK Received:', data);
            }
            if (data === 'OK') {
                resolve();
            }
            reject(data);
        });
    }

    sendSync(src, ignoreResponse = false) {
        let byteArray = src;
        byteArray.push(Display.getParityByte(src));

        if (this.debug) {
            const hexArray = src.map((num) => num.toString(16));
            console.log('[DEBUG] Sending byte array', hexArray);
        }

        return new Promise((resolve, reject) => {
            this.port.write(byteArray);

            if (!ignoreResponse) {
                this.port.once('data', (data) => {
                    resolve(data.toString());
                });

                this.port.once('error', (err) => {
                    reject(err);
                });
            } else {
                resolve();
            }
        });
    }

    handshake() {
        const cmdHandshake = [
            frames.FRAME_B,
            0x00,
            0x09,
            cmds.CMD_HANDSHAKE,
            0xCC,
            0x33,
            0xC3,
            0x3C,
            0xAC
        ];
        return Promise
                .delay(HANDSHAKE_DELAY)
                .then(() => this.sendSync(cmdHandshake))
                .then(this.checkOK);
    }

    setColor(colorFg, colorBg) {
        const cmdSetColor = [
            frames.FRAME_B,
            0x00,
            0x0B,
            cmds.CMD_SET_COLOR,
            colorFg,
            colorBg,
            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];
        return this.sendSync(cmdSetColor)
            .then(this.checkOK);
    }

    clear() {
        const cmdClear = [
            frames.FRAME_B,
            0x00,
            0x09,
            cmds.CMD_CLEAR,
            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];
        return this.sendSync(cmdClear)
            .then(this.checkOK);
    }

    update() {
        const cmdUpdate = [
            frames.FRAME_B,
            0x00,
            0x09,
            cmds.CMD_UPDATE,
            0xCC,
            0x33,
            0xC3,
            0x3C
        ];
        return this.sendSync(cmdUpdate)
            .then(this.checkOK);
    }

    setFont(font) {
        const cmdSetFont = [
            frames.FRAME_B,
            0x00,
            0x0A,
            cmds.CMD_SET_EN_FONT,
            font,
            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];
        return this.sendSync(cmdSetFont)
            .then(this.checkOK);
    }

    drawFilledCircle(x0, y0, r) {
        let cmdDrawCircle = [
            frames.FRAME_B,
            0x00,
            0x0F,

            cmds.CMD_FILL_CIRCLE,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (r >> 8) & 0xFF,
            r & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmdDrawCircle, true);
    }

    drawCircle(x0, y0, r) {
        let cmdDrawCircle = [
            frames.FRAME_B,
            0x00,
            0x0F,

            cmds.CMD_DRAW_CIRCLE,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (r >> 8) & 0xFF,
            r & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmdDrawCircle, true);
    }

    drawFilledRect(x0, y0, x1, y1) {
        let cmd = [
            frames.FRAME_B,
            0x00,
            0x11,

            cmds.CMD_FILL_RECT,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (x1 >> 8) & 0xFF,
            x1 & 0xFF,

            (y1 >> 8) & 0xFF,
            y1 & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmd, true);
    }

    drawRect(x0, y0, x1, y1) {
        let cmd = [
            frames.FRAME_B,
            0x00,
            0x11,

            cmds.CMD_DRAW_RECT,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (x1 >> 8) & 0xFF,
            x1 & 0xFF,

            (y1 >> 8) & 0xFF,
            y1 & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmd, true);
    }

    drawTriangle(x0, y0, x1, y1, x2, y2) {
        let cmd = [
            frames.FRAME_B,
            0x00,
            0x15,

            cmds.CMD_DRAW_TRIANGLE,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (x1 >> 8) & 0xFF,
            x1 & 0xFF,

            (y1 >> 8) & 0xFF,
            y1 & 0xFF,

            (x2 >> 8) & 0xFF,
            x2 & 0xFF,

            (y2 >> 8) & 0xFF,
            y2 & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmd, true);
    }

    drawFillTriangle(x0, y0, x1, y1, x2, y2) {
        let cmd = [
            frames.FRAME_B,
            0x00,
            0x15,

            cmds.CMD_FILL_TRIANGLE,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (x1 >> 8) & 0xFF,
            x1 & 0xFF,

            (y1 >> 8) & 0xFF,
            y1 & 0xFF,

            (x2 >> 8) & 0xFF,
            x2 & 0xFF,

            (y2 >> 8) & 0xFF,
            y2 & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmd, true);
    }

    drawLine(x0, y0, x1, y1) {
        let cmd = [
            frames.FRAME_B,
            0x00,
            0x11,

            cmds.CMD_DRAW_LINE,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            (x1 >> 8) & 0xFF,
            x1 & 0xFF,

            (y1 >> 8) & 0xFF,
            y1 & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmd, true);
    }

    drawPixel(x0, y0) {
        let cmd = [
            frames.FRAME_B,
            0x00,
            0x0D,

            cmds.CMD_DRAW_PIXEL,

            (x0 >> 8) & 0xFF,
            x0 & 0xFF,

            (y0 >> 8) & 0xFF,
            y0 & 0xFF,

            frames.FRAME_E0,
            frames.FRAME_E1,
            frames.FRAME_E2,
            frames.FRAME_E3
        ];

        return this.sendSync(cmd, this.checkOK);
    }

    displayString(str, x, y) {
        const strByteArray = Display.stringToByteArray(str);
        const stringSize = strByteArray.length + 0x0D;
        let cmdDisplayString = [
            frames.FRAME_B,

            (stringSize >> 8) & 0xFF,
            stringSize & 0xFF,

            cmds.CMD_DRAW_STRING,

            (x >> 8) & 0xFF,
            x & 0xFF,

            (y >> 8) & 0xFF,
            y & 0xFF
        ];

        cmdDisplayString = cmdDisplayString.concat(strByteArray);

        cmdDisplayString.push(frames.FRAME_E0);
        cmdDisplayString.push(frames.FRAME_E1);
        cmdDisplayString.push(frames.FRAME_E2);
        cmdDisplayString.push(frames.FRAME_E3);

        return this.sendSync(cmdDisplayString)
            .then(this.checkOK);
    }

}

//Colors
Display.BLACK = colors.BLACK;
Display.WHITE = colors.WHITE;
Display.GRAY = colors.GRAY;
Display.DARK_GRAY = colors.DARK_GRAY;

// Fonts
Display.ASCII32 = fonts.ASCII32;
Display.ASCII48 = fonts.ASCII48;
Display.ASCII64 = fonts.ASCII64;
Display.GBK32 = fonts.GBK32;
Display.GBK48 = fonts.GBK48;
Display.GBK64 = fonts.GBK64;

module.exports = Display;