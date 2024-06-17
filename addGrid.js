import { Container, Graphics } from './pixi.mjs';

export function addGrid(app) 
{
    // Create grid container
    const container = new Container();
    app.stage.addChild(container);
    
    // Create a 5x5 grid of squares in the container
    const graphics = new Graphics();
    for (let i = 0; i < 30; i++)
    {
        let x = (i % 5) * 100;
        let y = Math.floor(i / 5) * 100;
        // Rectangle + line style 2
        graphics.rect(x, y, 100, 100);
        graphics.fill(0xc34288);
        graphics.stroke({ width: 10, color: 0xffffff });
    }

    container.addChild(graphics);
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
}