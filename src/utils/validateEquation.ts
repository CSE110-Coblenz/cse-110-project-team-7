function is_digit(char: string): boolean{
    return /^\d$/.test(char);
}

export function validate(equation: string): boolean{
    // no possible equation of length <= 2
    if (equation.length <= 2){
        return false;
    }

    // check if there is an operator at the beginning or end
    if (!is_digit(equation[0]) || !is_digit(equation[equation.length - 1])){
        return false;
    }

    const operators = ['+','-','/','x']

    for (let i = 1; i < equation.length; i ++){
        let curr = equation[i];
        let prev = equation[i - 1];
        
        // check that there are no extraneous characters
        if (!is_digit(curr) && !operators.includes(curr)){
            return false;
        }
        
        // check that there are no consecutive digits
        if (is_digit(curr) && is_digit(prev)){
            return false;
        }

        // check that there are no conseuctive operators
        if (!is_digit(curr) && !is_digit(prev)){
            return false;
        }
    }

    return true;
}