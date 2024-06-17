import { Application, Assets, Sprite, SCALE_MODES, Text, TextStyle, Color, FillGradient, Container, Graphics } from './pixi.mjs';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099ff', antialias: true, resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

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

    // Load the bunny texture
    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    // Set the texture's scale mode to nearest to preserve pixelation
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    // Create gradient fill
    const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);
    const colors = [0xffffff, 0x00ff11].map((color) => Color.shared.setValue(color).toNumber());
    colors.forEach((number, index) =>
    {
        const ratio = index / colors.length;
        fill.addColorStop(ratio, number);
    });

    // Initialize rich text style
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: { fill },
        stroke: { color: '#4a1850', width: 5, join: 'round' },
        dropShadow: {
            color: '#000000',
            blur: 4,
            angle: Math.PI / 6,
            distance: 6,
        },
    });

    // Create rich text
    const richText = new Text({
        text: 'Drag and drop bunnies',
        style,
    });
    richText.x = 100;
    richText.y = 50;
    app.stage.addChild(richText);

    // Create bunnies
    let x = 200;
    let y = 200;
    for (let i = 0; i < 5; i++)
    {
        createBunny(x, y);
        y += 150;
    }

    function createBunny(x, y)
    {
        // Create our little bunny friend..
        const bunny = new Sprite(texture);

        // Enable the bunny to be interactive... this will allow it to respond to mouse and touch events
        bunny.eventMode = 'static';

        // This button mode will mean the hand cursor appears when you roll over the bunny with your mouse
        bunny.cursor = 'pointer';

        // Center the bunny's anchor point
        bunny.anchor.set(0.5);

        // Make it a bit bigger, so it's easier to grab
        bunny.scale.set(2);

        // Setup events for mouse + touch using the pointer events
        bunny.on('pointerdown', onDragStart, bunny);

        // Move the sprite to its designated position
        bunny.x = x;
        bunny.y = y;

        // Add it to the stage
        app.stage.addChild(bunny);
    }

    let dragTarget = null;
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);

    function onDragMove(event)
    {
        if (dragTarget)
        {
            dragTarget.parent.toLocal(event.global, null, dragTarget.position);
        }
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

    function onDragEnd()
    {
        if (dragTarget)
        {
            app.stage.off('pointermove', onDragMove);
            dragTarget.alpha = 1;
            dragTarget = null;
        }
    }

    
})();
