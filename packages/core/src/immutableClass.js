/* @flow strict */
type SomeType = {...} 
  | string 
  | number 
  | boolean 
  | [] 
  // flowlint-next-line unclear-type:off
  | $ReadOnlyArray<any>;

type AccumulatorType = {
  [string]: mixed,
  ...
};

export class ImmutableClass<T: SomeType, ParamType: {...}> {
  _init(params: $Shape<ParamType>) {
    Object.keys(params).forEach((paramKey: string) => {
      // $FlowFixMe - I don't know how to get this to type check the right way
      this[paramKey] = params[paramKey];
    });
    Object.getOwnPropertyNames(this).forEach((propName: string) => {
      // $FlowFixMe - I don't know how to get this to type check the right way
      const propValue: ?mixed = this[propName];
      if (propValue === null || propValue === undefined) {
        throw ImmutableClass._nullOrUndefinedPropError(propName, this.constructor.name);
      }
    });
    Object.freeze(this);
  }

  static _nullOrUndefinedPropError(propName: string, className: string): Error {
    return new Error(
      `ImmutableClass ${className} ` 
      + `must not contain undefined/null properties, initialize: ${propName}`
    );
  }

  _update(classInstance: T, params: ParamType): T {          
    let objectMustChange = false;
    const ownProps: $ReadOnlyArray<string> = Object.getOwnPropertyNames(this);
    const allParams = ownProps.reduce(
      (accumulator: AccumulatorType, propName: string): AccumulatorType => {
        // $FlowExpectedError
        const propertyValue: ?mixed = this[propName];
        if (propName in params) {
          const paramValue: ?mixed = params[propName];
          if (paramValue === propertyValue
              || (
                // $FlowExpectedError
                paramValue instanceof Object && typeof paramValue.strictEquals === 'function'
                // $FlowExpectedError
                && propertyValue instanceof Object && typeof propertyValue.strictEquals === 'function'
                // $FlowExpectedError
                && paramValue.strictEquals(propertyValue))
          ) {
            accumulator[propName] = propertyValue;
          } else {
            objectMustChange = true;
            accumulator[propName] = paramValue;
          }
        } else {
          accumulator[propName] = propertyValue;
        }

        return accumulator;
      }, {}
    );

    if (!objectMustChange) {
      return classInstance;
    }

    return new classInstance.constructor(allParams);
  }

  update(params: $Shape<ParamType>): T {
    // $FlowExpectedError - the use of 'this' here is safe
    return this._update(this, params);
  }
}
