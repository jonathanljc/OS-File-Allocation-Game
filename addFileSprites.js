import { Assets, Sprite, Point } from './pixi.mjs';
import { onClick, onHover, onStopHovering } from './ContiguousGamecode.mjs';

export async function addFileSprites(container, files)
{
    // Load the bunny texture
    const texture1 = await Assets.load('./assets/images/file1.png');
    const texture2 = await Assets.load('./assets/images/file2.png');
    const texture3 = await Assets.load('./assets/images/file3.png');
    const texture4 = await Assets.load('./assets/images/file4.png');

    // Set the texture's scale mode to nearest to preserve pixelation
    texture1.source.scaleMode = 'nearest';
    texture2.source.scaleMode = 'nearest';
    texture3.source.scaleMode = 'nearest';
    texture4.source.scaleMode = 'nearest';

    // Create file sprites
    let x = 1000;
    let y = 175;
    for (let i = 0; i < Object.keys(files).length; i++)
    {
        let fileNum = Object.keys(files)[i];
        switch (fileNum) {
            case "1": createFile(x, y, fileNum, texture1); break;
            case "2": createFile(x, y, fileNum, texture2); break;
            case "3": createFile(x, y, fileNum, texture3); break;
            case "4": createFile(x, y, fileNum, texture4); break;
        }
        // originalSpritePos[i] = new Point(x, y);
        y += 150;
    }

    function createFile(x, y, fileNum, texture)
    {
        // Create our little bunny friend..
        const fileSprite = new Sprite(texture);

        // Enable the bunny to be interactive... this will allow it to respond to mouse and touch events
        fileSprite.eventMode = 'static';

        // This button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        fileSprite.cursor = 'pointer';

        // Center the bunny's anchor point
        fileSprite.anchor.set(0.5);

        // Make it a bit bigger, so it's easier to grab
        fileSprite.scale.set(0.15);

        // Setup events for mouse + touch using the pointer events
        fileSprite.on('pointerdown', onClick, fileSprite);
        fileSprite.on('pointerenter', onHover, fileSprite);
        fileSprite.on('pointerleave', onStopHovering, fileSprite);

        // Move the sprite to its designated position
        fileSprite.x = x;
        fileSprite.y = y;

        // Set file sprite label as the corresponding file number
        fileSprite.label = fileNum;

        // Add it to the stage
        container.addChild(fileSprite);
    }
}