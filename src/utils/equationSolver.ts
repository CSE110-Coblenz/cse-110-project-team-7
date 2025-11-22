function is_digit(char: string): boolean{
    return /^\d$/.test(char);
}

// Equations should be stripped of whitespaces before using
// Equations should only contain whole numbers
export function evaluate(equation: string): number {
    let stack: number[] = [];
    let num: number = 0;
    let operator: string = '+'
    let res: number = 0;

    for (let i: number = 0; i <= equation.length; i ++){
        let c = i < equation.length ? equation[i] : '\0';
        
        if (is_digit(c)){
            num = num * 10 + Number(c);
        }

        if (!is_digit(c) || i == equation.length){
            if (operator == '+'){
                stack.push(num);
            }

            if (operator == '-'){
                stack.push(-num);
            }

            if (operator == 'x'){
                let top = stack[stack.length - 1];
                stack.pop();
                stack.push(top * num);
            }

            if (operator == '/'){
                let top = stack[stack.length - 1];
                stack.pop();
                stack.push(top / num);
            }

            operator = c;
            num = 0;
        }
    }

    while (stack.length > 0){
        res += stack[stack.length - 1];
        stack.pop();
    }

    return res;

}

// function is_valid_equation(equation: string): boolean {
//   // Must only contain digits and + - * / (optionally parentheses)
//   if (!/^[\d+\-*/\s]+$/.test(equation)) return false;

//   // No consecutive operators (except something like "-5" at the start)
//   if (/[*+\-/]{2,}/.test(equation)) return false;

//   // Must not start or end with an invalid operator
//   if (/^[*/+]/.test(equation) || /[*+\-/]$/.test(equation)) return false;

//   // Must contain at least one digit
//   if (!/\d/.test(equation)) return false;

//   return true;
// }
