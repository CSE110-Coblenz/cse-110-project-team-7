// target: RHS of equation, length: length of each equation, count: max number of equations generated
// returns list of all generated equations as strings
import { EquationMode } from "../screens/BasicGameScreen/BasicGameScreenModel";
import { evaluate } from "./equationSolver";
function shuffledArray<T>(arr: T[]): T[] {
    return arr
        .map(x => [Math.random(), x] as [number, T])
        .sort((a, b) => a[0] - b[0])
        .map(x => x[1]);
}

export function generateEquation(target: number, length: number, count: number, operations: string[]): string[] {
    if (count <= 0) return [];
    if (length <= 2 || length % 2 === 0) return [];

    const res: string[] = [];

    const [minNum, maxNum] = [1, 99];

    const allNumbers = shuffledArray(
        Array.from({ length: maxNum - minNum + 1 }, (_, i) => minNum + i)
    );

    function backtrack(curr: string[], idx: number, val: number, prev: number, lastOp: string | null) {
        if (res.length >= count) return;

        // If we used exactly `length` tokens
        if (idx === length) {
            if (val === target) {
                res.push(curr.join("")); // join at end
            }
            return;
        }

        // Odd indices -> operators
        if (idx % 2 === 1) {
            for (const op of operations) {
                backtrack([...curr, op], idx + 1, val, prev, op);
            }
        }

        // Even indices -> numbers
        else {
            for (const num of allNumbers) {
                const str = String(num);

                // First number
                if (idx === 0) {
                    backtrack([str], 1, num, num, null);
                    continue;
                }

                if (lastOp === "+") {
                    backtrack([...curr, str], idx + 1, val + num, num, null);
                } else if (lastOp === "-") {
                    backtrack([...curr, str], idx + 1, val - num, -num, null);
                } else if (lastOp === "x") {
                    const newPrev = prev * num;
                    backtrack([...curr, str], idx + 1, val - prev + newPrev, newPrev, null);
                } else if (lastOp === "/") {
                    if (prev % num === 0) {
                        const newPrev = prev / num;
                        backtrack([...curr, str], idx + 1, val - prev + newPrev, newPrev, null);
                    }
                }
            }
        }
    }
    backtrack([], 0, 0, 0, null);
    return res;
}


export function generateEquationOptions(target: number, equationMode: EquationMode): string[] {
        let equationLength = 3;
        let operations: string[];
        if (equationMode == 'addition'){
            operations = ['+'];
        } else if (equationMode == 'subtraction'){
            operations = ['-'];
        } else if (equationMode == 'multiplication'){
            operations = ['x'];
        } else if (equationMode == 'division'){
            operations = ['/'];
        } else{
            operations = ['+', '-', 'x', '/'];
        }
        const correctEquations = generateEquation(target, equationLength, 10, operations);
        
        console.log(correctEquations);
        let guaranteedCorrect = 
            correctEquations.length > 0
            ? correctEquations
            : [buildGuaranteedEquation(target, equationMode)];

        // Pick one correct equation
        const correctEq = guaranteedCorrect[Math.floor(Math.random() * guaranteedCorrect.length)];

        // Generate 3 wrong options
        const wrongOptions: string[] = [];
        while (wrongOptions.length < 3) {
            const fakeEq = generateFakeEquation(target, equationLength, equationMode);
            const fakeResult = evaluate(fakeEq);
            
            // Make sure it's different from the target and not already in the list
            if (fakeResult !== target && !wrongOptions.includes(fakeEq)) {
                wrongOptions.push(fakeEq);
            }
        }

        // Combine and shuffle
        const allOptions = [correctEq, ...wrongOptions];
        return allOptions.sort(() => Math.random() - 0.5);
}

function buildGuaranteedEquation(target: number, mode: EquationMode): string {
    switch (mode) {
        case "addition": {
            // x + y = target → pick x randomly
            const x = Math.floor(Math.random() * target);
            const y = target - x;
            return `${x}+${y}`;
        }

        case "subtraction": {
            // x - y = target → pick y randomly
            const y = Math.floor(Math.random() * 10);
            const x = target + y;
            return `${x}-${y}`;
        }

        case "multiplication": {
            // x * y = target → find a divisor
            for (let i = 1; i <= 9; i++) {
                if (target % i === 0) {
                    const other = target / i;
                    if (other >= 0 && other < 10) {
                        return `${i}x${other}`;
                    }
                }
            }
            // If no single-digit factor: use 1 * target
            return `1x${target}`;
        }

        case "division": {
            // x / y = target → x = target * y
            const y = Math.floor(Math.random() * 9) + 1;
            const x = target * y;
            return `${x}/${y}`;
        }

        default:
            // For "any", just make a + equation
            const a = Math.floor(Math.random() * target);
            return `${a}+${target - a}`;
    }
}

function generateFakeEquation(_target: number, length: number, equationMode: EquationMode): string {
    // Determine number range based on operations (same logic as generateEquation)
    const hasAddOrMult = equationMode === 'addition' || equationMode === 'multiplication' || equationMode === 'any';
    //const [minNum, maxNum] = [1, 9];
    const [minNum, maxNum] = hasAddOrMult ? [1, 9] : [1, 99];
    
    // Build an equation of the specified length
    let equation = '';
    let ops: string[] = [];
    
    switch (equationMode) {
        case "addition":
            ops = ["+"];
            break;
        case "subtraction":
            ops = ["-"];
            break;
        case "multiplication":
            ops = ["x"];
            break;
        case "division":
            ops = ["/"];
            break;
        default:
            ops = ["+", "-", "x", "/"];
    }
    
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            // Add a number
            const num = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
            equation += num;
        } else {
            // Add an operator
            const op = ops[Math.floor(Math.random() * ops.length)];
            equation += op;
        }
    }
    
    return equation;
}