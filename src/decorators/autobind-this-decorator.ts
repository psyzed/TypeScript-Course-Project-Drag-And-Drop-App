  //THIS KEYWORD BIND DECORATOR

export function BindThis(_1: any, _2: any, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const configuredDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundThisFunction = originalMethod.bind(this);
      return boundThisFunction;
    },
  };
  return configuredDescriptor;
}