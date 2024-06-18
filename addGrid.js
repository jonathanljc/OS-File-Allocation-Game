import { Graphics } from './pixi.mjs';

export function addGrid(app, container, fileNum, blocks, gridPlacement) 
{   
    let blocksAdded = 0;

    // Create a 5x5 grid of squares in the container
    const graphics = new Graphics();
    for (let i = 0; i < 30; i++)
    {
        let x = (i % 5) * 100;
        let y = Math.floor(i / 5) * 100;
        // Rectangle + line style 2
        graphics.rect(x, y, 100, 100);
        if(fileNum != 0){
            if (gridPlacement[i] == 0 && blocksAdded < blocks) {
                gridPlacement[i] = fileNum;
                blocksAdded++;
            }
        }

        if (gridPlacement[i] == 0) {
            graphics.fill(0xc34288); // Black
        }else if(gridPlacement[i] == 1){
            graphics.fill(0xA52A2A); // Brown
        }else if(gridPlacement[i] == 2){
            graphics.fill(0x7FFF00); // Chartreuse
        }else if(gridPlacement[i] == 3){
            graphics.fill(0x0000FF); // Blue
        }else{
            graphics.fill(0xFFFF00); // Yellow
        }

        graphics.stroke({ width: 10, color: 0xffffff });
    }

    container.addChild(graphics);
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
}