export function BindThis(_1, _2, descriptor) {
    const originalMethod = descriptor.value;
    const configuredDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundThisFunction = originalMethod.bind(this);
            return boundThisFunction;
        },
    };
    return configuredDescriptor;
}
//# sourceMappingURL=autobind-this-decorator.js.map