// Commands

module.exports = {
    CMD_HANDSHAKE: 0x00,        //handshake
    CMD_SET_BAUD: 0x01,         //set baud
    CMD_READ_BAUD: 0x02,        //read baud
    CMD_MEMORYMODE: 0x07,       //set memory mode
    CMD_STOPMODE: 0x08,         //enter stop mode
    CMD_UPDATE: 0x0A,           //update
    CMD_SCREEN_ROTATION: 0x0D,  //set screen rotation
    CMD_LOAD_FONT: 0x0E,        //load font
    CMD_LOAD_PIC:  0x0F,        //load picture
    CMD_SET_COLOR: 0x10,        //set color
    CMD_SET_EN_FONT: 0x1E,      //set english font
    CMD_SET_CH_FONT: 0x1F,      //set chinese font
    CMD_DRAW_PIXEL: 0x20,       //set pixel
    CMD_DRAW_LINE: 0x22,        //draw line
    CMD_FILL_RECT: 0x24,        //fill rectangle
    CMD_DRAW_RECT: 0x25,        //draw rectangle
    CMD_DRAW_CIRCLE: 0x26,      //draw circle
    CMD_FILL_CIRCLE: 0x27,      //fill circle
    CMD_DRAW_TRIANGLE: 0x28,    //draw triangle
    CMD_FILL_TRIANGLE: 0x29,    //fill triangle
    CMD_CLEAR: 0x2E,            //clear screen use back color
    CMD_DRAW_STRING: 0x30,      //draw string
    CMD_DRAW_BITMAP: 0x70       //draw bitmap
};