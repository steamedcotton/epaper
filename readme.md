# epaper

Node.js library for the 4.3 Inch E-Paper display by Waveshare

![e-paper Display Sample](/docs/images/sampleDisplay.png)

## Install

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