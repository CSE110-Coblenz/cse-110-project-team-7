function is_digit(c: string): boolean {
    return c >= '0' && c <= '9';
}

export function evaluate(equation: string): number {
    equation = equation.replace(/\s+/g, '');
    let stack: number[] = [];
    let num = 0;
    let operator = '+';

    for (const c of equation) {
        if (is_digit(c)) {
            num = num * 10 + Number(c);
        } else {
            switch(operator) {
                case '+': stack.push(num); break;
                case '-': stack.push(-num); break;
                case 'x': stack.push(stack.pop()! * num); break;
                case '/': stack.push(stack.pop()! / num); break;
            }
            operator = c;
            num = 0;
        }
    }

    // Process last number
    switch(operator) {
        case '+': stack.push(num); break;
        case '-': stack.push(-num); break;
        case 'x': stack.push(stack.pop()! * num); break;
        case '/': stack.push(stack.pop()! / num); break;
    }

    return stack.reduce((a, b) => a + b, 0);
}
