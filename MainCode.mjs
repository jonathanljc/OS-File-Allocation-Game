import { addMenuBtn } from './addGraphics.js';
import { addMenuBtnText, addTitleText } from './addText.js';
import { Application } from './pixi.mjs';

// Create a new application
const app = new Application();
globalThis.__PIXI_STAGE__ = app.stage;
globalThis.__PIXI_RENDERER__ = app.renderer;

// Initialize the application
await app.init({ background: '#1099ff', antialias: true, width: 1200, height: 800});

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Add main menu text
addTitleText(app);

// Add buttons to contiguous method or extent-based method
let btnLength = 200;
let btnHeight = 50;
let x = app.screen.width / 2 - (btnLength / 2);
let y = app.screen.height / 2;
addMenuBtn(app, x, y, btnLength, btnHeight);
addMenuBtnText(app, x, y, btnLength, btnHeight);


export async function goContiguous()
{
    await clearCanvas();
}

export async function goExtentBased()
{
    await clearCanvas();
}

export async function clearCanvas()
{
    for (var i = app.stage.children.length - 1; i >= 0; i--) { app.stage.removeChild(stage.children[i]); };
    document.body.removeChild(app.canvas);
}
