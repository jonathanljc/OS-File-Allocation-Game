import { Text, TextStyle, Color, FillGradient } from './pixi.mjs';

export function addText(app)
{
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
        fontSize: 30,
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

    // Create file allocation method text
    const allocateMethod = new Text({
        text: 'Contiguous File Allocation:',
        style,
    });
    allocateMethod.x = 100;
    allocateMethod.y = 25;
    app.stage.addChild(allocateMethod);

    // Create game instruction text
    const instruction = new Text({
        text: 'Drag and drop files into storage',
        style,
    });
    instruction.x = 100;
    instruction.y = 75;
    app.stage.addChild(instruction);

    // Create file storage label
    const storageLabel = new Text({
        text: 'File Storage',
        style,
    });
    storageLabel.anchor.set(0.5);
    storageLabel.x = app.screen.width / 2;
    storageLabel.y = 130;
    app.stage.addChild(storageLabel);
}