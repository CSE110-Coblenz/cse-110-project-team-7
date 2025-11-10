// target: RHS of equation, length: length of each equation, count: max number of equations generated
// returns list of all generated equations as strings

export function generateEquation(target: number, length: number, count: number): string[]{
    if (length <= 2){
        return [];
    }

    if (length % 2 == 0){
        return [];
    }
    const operations = ['+', '-', '*', '/']
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
                } else if (last_op == '*'){
                    backtrack(updated_str, idx + 1, val - prev + (prev * i), prev * i, null);
                } else{
                    backtrack(updated_str, idx + 1, val - prev + Math.floor(prev / i), Math.floor(prev / i), null);
                }

            }
        }
    }

    backtrack('', 0, 0, 0);
    return res;
}   