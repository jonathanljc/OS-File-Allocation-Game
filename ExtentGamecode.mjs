import { Application } from "./pixi.mjs";

export async function extentGame()
{
    // Create a new application
    const app = new Application();
    globalThis.__PIXI_STAGE__ = app.stage;
    globalThis.__PIXI_RENDERER__ = app.renderer;

    // Initialize the application
    await app.init({ background: '#1099ff', antialias: true, width: 1200, height: 800});

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);
}