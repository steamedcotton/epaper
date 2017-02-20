# epaper

**Please note: this should be considered a "work in progress".  Once I'm satisfied with the feature set and documentation, I will remove this message.**

Node.js library for the 4.3 Inch E-Paper display by Waveshare

![e-paper Display Sample](/docs/images/sampleDisplay.png)

## Install

This project uses [serialport](https://www.npmjs.com/package/serialport), before you install this libary, please have a look at this section of the serialport readme: https://www.npmjs.com/package/serialport#installation-instructions

```bash
npm install epaper
```


## Sample Code

Assuming you have the e-paper displayed connected to `/dev/cu.usbserial`:

```javascript
var Display = require('epaper').Display;
var display = new Display('/dev/cu.usbserial', true);
 
display.handshake()
    .then(() => display.setColor(Display.BLACK, Display.WHITE))
    .then(display.clear)
    .then(() => display.setFont(Display.ASCII64))
    .then(() => display.displayString('Hello World!', 50, 100))
    .then(display.update)
    .catch((err) => console.log(err));
```

## Resources

* Waveshare product website: http://www.waveshare.com/4.3inch-e-paper.htm
* E-paper product manual: http://www.waveshare.com/wiki/4.3inch_e-Paper#How_to_work_with_PC