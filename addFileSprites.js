import { Assets, Sprite, SCALE_MODES, Container } from './pixi.mjs';
import { onDragStart, onHover, onStopHovering } from './gamecode.mjs';

export async function addFileSprites(container, files)
{
    // Load the bunny texture
    const texture = await Assets.load('./assets/images/file.png');

    // Set the texture's scale mode to nearest to preserve pixelation
    texture.source.scaleMode = 'nearest';

    // Create file sprites
    let x = 900;
    let y = 150;
    for (let i = 0; i < Object.keys(files).length; i++)
    {
        let fileNum = Object.keys(files)[i];
        createFile(x, y, fileNum);
        y += 150;
    }

    function createFile(x, y, fileNum)
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
        fileSprite.on('pointerdown', onDragStart, fileSprite);
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