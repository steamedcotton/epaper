# epaper

**Coming soon: support for displaying images (from SD card)**

Node.js library for the 4.3 Inch E-Paper display by Waveshare

![e-paper Display Sample](/docs/images/sampleDisplay.png)

## Install

This project uses [serialport](https://www.npmjs.com/package/serialport), before you install this libary, please have a look at this section of the serialport readme: https://www.npmjs.com/package/serialport#installation-instructions

**Installing epaper module:**

```bash
npm install epaper
```


## Sample Code

Assuming you have the e-paper displayed connected to `/dev/cu.usbserial`:

```javascript
const Display = require('epaper').Display;
const display = new Display('/dev/cu.usbserial', true);
 
display.handshake()
    .then(() => display.setColor(Display.BLACK, Display.WHITE))
    .then(display.clear)
    .then(() => display.setFont(Display.ASCII64))
    .then(() => display.displayString('Hello World!', 50, 100))
    .then(() => display.setFont(Display.ASCII48))
    .then(() => display.displayString('github.com/steamedcotton', 50, 180))
    .then(() => display.drawCircle(75, 350, 50))
    .then(() => display.drawFilledCircle(75, 350, 25))
    .then(() => display.drawTriangle(150, 300, 150, 400, 200, 400))
    .then(() => display.drawFillTriangle(150, 300, 200, 300, 200, 400))
    .then(() => display.drawRect(250, 300, 350, 400))
    .then(() => display.drawFilledRect(375, 300, 475, 400))
    .then(() => display.drawLine(50, 420, 475, 420))
    .then(display.update)
    .catch((err) => console.log('Error:', err));
```

## Methods

### Utilities

#### Handshake

After the epaper has powered up, you can send the handshake command to make sure whether the terminal is ready and able to receive commands or data.

```javascript
handshake()
```

#### Clear

Clears the screen using the background color

```javascript
clear()
```

#### Update

Used to refresh and update the display (clears then displays).  All the commands sent in the session will be displayed.

```javascript
update()
```

#### Set Color

Sets the foreground and background color of the drawing.   The foreground color is used in the display the basic drawings and text.  The background color is used for the cleared screen.

```javascript
setColor(<FORGROUND COLOR>, <BACKGROUND COLOR>)
```

**Colors**

The colors can be referenced as static variables on the Display object.

* `Display.WHITE`
* `Display.GRAY`
* `Display.DARK_GRAY`
* `Display.BLACK`

### Draw

#### Pixel

```javascript
drawPixel(<X -> Int>, <Y -> Int>)
```

#### Line

Draws a line with the 2 given points (X1, Y1 > X2, Y2).

```javascript
drawLine(<X1 -> Int>, <Y1 -> Int>, <X2 -> Int>, <Y2 -> Int>)
```

#### Rectangle

Draws a rectangle with the two given points (opposite corners)

```javascript
drawRect(<X1 -> Int>, <Y1 -> Int>, <X2 -> Int>, <Y2 -> Int>)
```

**Filled Rectangle**

```javascript
drawFilledRect(<X1 -> Int>, <Y1 -> Int>, <X2 -> Int>, <Y2 -> Int>)
```


#### Circle

Draws a circle with the given point (X, Y) being the center and the third parameter being the radius.

```javascript
drawCircle(<X1 -> Int>, <Y1 -> Int>, <RADIUS -> Int>) 
```

**Filled Circle**

```javascript
drawFilledCircle(<X1 -> Int>, <Y1 -> Int>, <RADIUS -> Int>) 
```

#### Trangle

Draws a triangle using the three points given. 

```javascript
drawTrangle(<X1 -> Int>, <Y1 -> Int>, <X2 -> Int>, <Y2 -> Int>, <X3 -> Int>, <Y3 -> Int>) 
```

**Filled Triangle**

```javascript
drawFilledTriangle(<X1 -> Int>, <Y1 -> Int>, <X2 -> Int>, <Y2 -> Int>, <X3 -> Int>, <Y3 -> Int>) 
```

### Text

#### Set Font

```javascript
setFont(<FONT>)
```

**Fonts**

The fonts can be referenced as static varibles on the Display object.

English:
* `ASCII32`
* `ASCII48`
* `ASCII64`

Chinese
* `GBK32`
* `GBK48`
* `GBK64`

### Display Text

Displays a provided string at the given location using the current forground color and font.  Maximum lentgh is 1020 bytes.

```javascript
displayText(<X -> Int>, <Y -> Int>, <Text -> Sting>);
```

## Resources

* Waveshare product website: http://www.waveshare.com/4.3inch-e-paper.htm
* E-paper product manual: http://www.waveshare.com/wiki/4.3inch_e-Paper#How_to_work_with_PC