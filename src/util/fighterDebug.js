function drawCross(context, camera, position, color) {

    //Origin X
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(Math.floor(position.x - camera.position.x) - 4, Math.floor(position.y - camera.position.y) - 0.5);
    context.lineTo(Math.floor(position.x - camera.position.x) + 5, Math.floor(position.y - camera.position.y) - 0.5);
    context.moveTo(Math.floor(position.x - camera.position.x) + 0.5, Math.floor(position.y - camera.position.y) - 5);
    context.lineTo(Math.floor(position.x - camera.position.x) + 0.5, Math.floor(position.y - camera.position.y) + 4);
    context.stroke();
}

function drawBox(context, camera, position, direction, dimensions, color) {
    if (!Array.isArray(dimensions)) return;

    const [x = 0, y = 0, width = 0, height = 0] = dimensions;

    context.beginPath();
    context.strokeStyle = color + 'AA';
    context.fillStyle = color + '44';
    context.fillRect(
        Math.floor(position.x + (x * direction) - camera.position.x) + 0.5,
        Math.floor(position.y + y - camera.position.y) + 0.5,
        width * direction,
        height,
    );
    context.rect(
        Math.floor(position.x + (x * direction) - camera.position.x) + 0.5,
        Math.floor(position.y + y - camera.position.y) + 0.5,
        width * direction,
        height,
    );
    context.stroke();
}

export function drawCollisionInfo(entity, context, camera) {
    switch (entity.constructor.name) {
        case 'Fireball':
            const p = entity.position
            const d = entity.direction
            const b = entity.boxes

            context.lineWidth = 1;

            //Push Boxes
            drawBox(context, camera, p, d, Object.values(b.push), '#55FF55');
            //Hit Box
            drawBox(context, camera, p, d, Object.values(b.hit), '#FF0000');

            drawCross(context, camera, p, '#FFFFFF');


            break;

        default:
            const { position, direction, boxes } = entity;

            context.lineWidth = 1;

            //Push Boxes
            drawBox(context, camera, position, direction, Object.values(boxes.push), '#55FF55');
            //Hurt Boxes
            for (const hurtBox of Object.values(boxes.hurt)) {
                drawBox(context, camera, position, direction, hurtBox, '#7777FF');
            }
            //Hit Box
            drawBox(context, camera, position, direction, Object.values(boxes.hit), '#FF0000');

            drawCross(context, camera, position, '#FFFFFF');
            break;
    }

}

export function logHit(entity, hitStrength, hitLocation) {
    console.log(`hit ${hitLocation}: ${hitStrength}`)
    console.log(`${entity.constructor.name}`)
}