import { Text, TextStyle, Color, FillGradient } from './pixi.mjs';

export function addFileInfoText(app, fileSprite, fileBlocks)
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

    // Create file info texts
    const fileNum = new Text({
        text: 'File number: ' + fileSprite.label,
        style,
    });
    fileNum.x = app.screen.width / 2 + 400;
    fileNum.y = 150;

    const fileBlocksText = new Text({
        text: 'Memory blocks needed: ' + fileBlocks,
        style,
    });
    fileBlocksText.x = app.screen.width / 2 + 400;
    fileBlocksText.y = 200;

    return [fileNum, fileBlocksText];
}