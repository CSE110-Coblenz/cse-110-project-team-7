// target: RHS of equation, length: length of each equation, count: max number of equations generated
// returns list of all generated equations as strings
import { EquationMode } from "../screens/BasicGameScreen/BasicGameScreenModel";
import { evaluate } from "./equationSolver";
export function generateEquation(target: number, length: number, count: number, operations: string[]): string[]{
    if (length <= 2){
        return [];
    }

    if (length % 2 == 0){
        return [];
    }
 
    let res: string[] = [];

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
            for (let i = 1; i < 10; i ++){
                let updated_str = curr + i.toString();

                if (idx == 0){
                    backtrack(updated_str, idx + 1, i, i, null);
                    continue;
                }

                if (last_op == '+'){
                    backtrack(updated_str, idx + 1, val + i, i, null);
                } else if (last_op == '-'){
                    backtrack(updated_str, idx + 1, val - i, -i, null);
                } else if (last_op == 'x'){
                    backtrack(updated_str, idx + 1, val - prev + (prev * i), prev * i, null);
                } else if (last_op == '/'){
                    backtrack(updated_str, idx + 1, val - prev + Math.floor(prev / i), Math.floor(prev / i), null);
                }

            }
        }
    }

    backtrack('', 0, 0, 0);
    return res;
}   

export function generateEquationOptions(target: number, equationMode: EquationMode): string[] {
        // Generate correct equations
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
        const correctEquations = generateEquation(target, 3, 5, operations);
        
        if (correctEquations.length === 0) {
            // Fallback if no equations found
            return [target.toString()];
        }

        // Pick one correct equation
        const correctEq = correctEquations[Math.floor(Math.random() * correctEquations.length)];

        // Generate 3 wrong options
        const wrongOptions: string[] = [];
        while (wrongOptions.length < 3) {
            const fakeEq = generateFakeEquation(equationMode);
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

function generateFakeEquation(equationMode: EquationMode): string {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
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
    
    const op = ops[Math.floor(Math.random() * ops.length)];
    return `${a}${op}${b}`;
}