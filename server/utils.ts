export function rollDice(sides: number, numDice = 1): number[] {
    let rolls: number[] = []
    for(let i = 0; i < numDice; i++) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    return rolls
}