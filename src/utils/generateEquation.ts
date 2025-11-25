// target: RHS of equation, length: length of each equation, count: max number of equations generated
// returns list of all generated equations as strings
import { EquationMode } from "../screens/BasicGameScreen/BasicGameScreenModel";
import { evaluate } from "./equationSolver";
export function generateEquation(target: number, length: number, count: number, operations: string[]): string[]{
    if (count <= 0) return [];
    if (length <= 2 || length % 2 === 0 ) return [];
 
    let res: string[] = [];

    function getNumberRange(): [number, number] {
        const hasAddOrMult = operations.includes('+') || operations.includes('*');
        if (hasAddOrMult) {
            return [1, 99]; 
        }
        return [1, 99];
    }

    const [minNum, maxNum] = getNumberRange();

    function backtrack(curr: string, idx: number, val: number, prev: number, last_op: string | null = null): void{
        if (res.length >= count){
            return;
        }
        
        if (idx == length){
            if (val == target){
                res.push(curr);
            }

            return;
        }

        if (idx % 2 == 1){
            operations.forEach(op =>{
                backtrack(curr + op, idx + 1, val, prev, op);
            });
        } else {
            for (let i = minNum; i <= maxNum; i ++){
                let updated_str = curr + i.toString();

                if (idx == 0){
                    backtrack(updated_str, idx + 1, i, i, null);
                    continue;
                }

                if (last_op == '+'){
                    backtrack(updated_str, idx + 1, val + i, i, null);
                } else if (last_op == '-'){
                    backtrack(updated_str, idx + 1, val - i, -i, null);
                } else if (last_op == '*'){
                    backtrack(updated_str, idx + 1, val - prev + (prev * i), prev * i, null);
                } else if (last_op == '/'){
                    if (prev % i == 0){
                        backtrack(updated_str, idx + 1, val - prev + Math.floor(prev / i), Math.floor(prev / i), null);
                    }
                }

            }
        }
    }

    backtrack('', 0, 0, 0);
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
            operations = ['*'];
        } else if (equationMode == 'division'){
            operations = ['/'];
        } else{
            operations = ['+', '-', '*', '/'];
        }
        const correctEquations = generateEquation(target, equationLength, 50, operations);
        
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
                        return `${i}*${other}`;
                    }
                }
            }
            // If no single-digit factor: use 1 * target
            return `1*${target}`;
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

function generateFakeEquation(target: number, length: number, equationMode: EquationMode): string {
    // Determine number range based on operations (same logic as generateEquation)
    const hasAddOrMult = equationMode === 'addition' || equationMode === 'multiplication' || equationMode === 'any';
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
            ops = ["*"];
            break;
        case "division":
            ops = ["/"];
            break;
        default:
            ops = ["+", "-", "*", "/"];
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