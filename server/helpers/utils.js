export const contains_capital_letter_and_a_number = (string) => {
    return /[A-Z]/.test(string) && /\d/.test(string);
};