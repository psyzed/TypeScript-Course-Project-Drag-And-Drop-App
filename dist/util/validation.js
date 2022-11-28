export function validate(ValitableInput) {
    let isValid = true;
    if (ValitableInput.required) {
        isValid = isValid && ValitableInput.value.toString().trim().length !== 0;
    }
    if (ValitableInput.minLength != null &&
        typeof ValitableInput.value === "string") {
        isValid =
            isValid && ValitableInput.value.length >= ValitableInput.minLength;
    }
    if (ValitableInput.maxLength != null &&
        typeof ValitableInput.value === "string") {
        isValid =
            isValid && ValitableInput.value.length <= ValitableInput.maxLength;
    }
    if (ValitableInput.minNumber != null &&
        typeof ValitableInput.value === "number") {
        isValid = isValid && ValitableInput.value >= ValitableInput.minNumber;
    }
    if (ValitableInput.maxNumber != null &&
        typeof ValitableInput.value === "number") {
        isValid = isValid && ValitableInput.value <= ValitableInput.maxNumber;
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map