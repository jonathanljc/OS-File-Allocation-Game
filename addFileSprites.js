import { Assets, Sprite, SCALE_MODES } from './pixi.mjs';

let dragTarget = null;

export async function addFileSprites(app, files)
{
    // Load the bunny texture
    const texture = await Assets.load('./assets/images/file.png');

    // Set the texture's scale mode to nearest to preserve pixelation
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    // Create file sprites
    let x = 200;
    let y = 200;
    for (let i = 0; i < 5; i++)
    {
        createFile(x, y);
        y += 150;
    }

    // Set-up mouse interactivity
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);

    function createFile(x, y)
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

        // Move the sprite to its designated position
        fileSprite.x = x;
        fileSprite.y = y;

        // Add it to the stage
        app.stage.addChild(fileSprite);
    }

    function onDragStart()
    {
        // Store a reference to the data
        // * The reason for this is because of multitouch *
        // * We want to track the movement of this particular touch *
        this.alpha = 0.5;
        dragTarget = this;
        app.stage.on('pointermove', onDragMove);
    }

    function onDragMove(event)
    {
        if (dragTarget)
        {
            dragTarget.parent.toLocal(event.global, null, dragTarget.position);
        }
    }

    function onDragEnd()
    {
        if (dragTarget)
        {
            app.stage.off('pointermove', onDragMove);
            dragTarget.alpha = 1;
            dragTarget = null;
        }
    }
}