/* @flow strict */
// flowlint-next-line unclear-type:off
let _noneSingleton: any = null;

type SomeType = {...} 
  | string 
  | number 
  | boolean 
  | [] 
  // flowlint-next-line unclear-type:off
  | $ReadOnlyArray<any>;

type OptionalConfig = {|
  emptyStringIsNone: boolean;
|};

const defaultConfig = Object.freeze({
  emptyStringIsNone: false
});

export class Optional<T> {
  _value: T;
  _hasValue: boolean;

  static _None: Optional<T> = new Optional(null);

  constructor(value: ?T, config?: OptionalConfig = defaultConfig): Optional<T> {
    const emptyStringIsNone = config.emptyStringIsNone;
    if (value === null || value === undefined || (value.length === 0 && emptyStringIsNone)) {
      if (_noneSingleton !== null && _noneSingleton !== undefined) {
        return _noneSingleton;
      }
      this._hasValue = false;
      _noneSingleton = this;
      Object.freeze(_noneSingleton);
      return _noneSingleton;
    }
    this._hasValue = true;
    this._value = value;
    Object.freeze(this);
    return this;
  }

  /**
   * This method returns a new optional.  It's useful for cases where you need to pass in
   * a function that returns back a new optional that wraps the value (like a mapper)
   * @param {*} value
   */
  static create<ValueType>(value: ValueType): Optional<ValueType> {
    return new Optional(value);
  }

  /**
   * Use this for side effecting functions that work on the option
   */
  forEach(procedure: (value: T) => mixed) {
    if (this._hasValue) {
      procedure(this._value);
    }
  }

  /**
   * If the Optional is None, returns a new optional with the given value.
   */
  ifEmpty(value: T): Optional<T> {
    if (this._hasValue) {
      return this;
    }
    return new Optional(value);
  }

  /**
   * Use this if you are transforming the value into some other value.
   * The mapper maps the value T to some other type T2, which
   * is then automatically wrapped in an Optional<T2>
   */
  map<T2, ContextType>(
      mapper: (value: T, context: ContextType) => T2,
      context: ContextType
  ): Optional<T2> {
    if (this._hasValue) {
      return new Optional(mapper(this._value, context));
    }

    return Optional._None;
  }

  flatMap<T2, ContextType>(
      mapper: (value: T, context: ContextType) => Optional<T2>, 
      context: ContextType
  ): Optional<T2> {
    if (this._hasValue) {
      return mapper(this._value, context);
    }

    return Optional._None;
  }

  /**
   * BE CAREFUL ABOUT USING THIS IN TIGHT LOOPS, IF YOU DO SO, MAKE SURE TO CREATE the
   * functions for caseSome and caseNoneoutside the matcher to avoid constantly creating
   * new new anonymous functions
   *
   * Javascript doesn't have match + case from scala so we improvise
   */
  match<T2, ContextType>(
      caseSome: (value: T, context: ContextType) => T2,
      caseNone: (context: ContextType) => T2,
      context: ContextType
  ): T2 {
    if (this._hasValue) {
      return caseSome(this._value, context);
    }

    return caseNone(context);
  }

  /**
   * Async version of match
   */
  matchAsync<T2, ContextType>(
      caseSome: (value: T, context: ContextType) => Promise<T2>,
      caseNone: (context: ContextType) => Promise<T2>,
      context: ContextType
  ): Promise<T2> {
    if (this._hasValue) {
      return caseSome(this._value, context);
    }
    return caseNone(context);
  }

  // This method is NOT safe, if you call it on a null optional, it will throw, use with care
  get(): T {
    if (this._hasValue) {
      return this._value;
    }
    throw new TypeError('get called on a null Optional');
  }

  /**
   * Returns true if the value of this optional is strictly equal to the value of the other
   * optional by using a strict equals '===' comparison on their values if they have a value, 
   * or if both of these optionals are None.
   * For example:
   *    myObject = {};
   *    a = new Optional(myObject);
   *    b = new Optional(myObject);
   *    a === b is FALSE
   *    a.strictEquals(b) is TRUE
   */
  strictEquals(other: Optional<T>): boolean {
    if (!(other instanceof Optional)) {
      return false;
    }

    if (this._hasValue && other._hasValue) {
      if (this._value instanceof Optional && other._value instanceof Optional) {
        return this._value.strictEquals(other._value);
      }
      return this._value === other._value;
    }
    return !this._hasValue && !other._hasValue;
  }

  /**
   * Returns true if this optional has a value and that value is strictly equal to
   * the provided other value.
   * @param {*} other 
   */
  strictValueEquals(other: T): boolean {
    if (this._hasValue) {      
      return this._value === other;
    }
    return false;
  }

  /**
   * If the optional has some value, return it, else return the specified value.
   */
  getOrElse(elseValue: T): T {
    return this._hasValue ? this._value : elseValue;
  }

  /**
   * If the optional has some value, return it, else call the specified function to create a value
   */
  getOrElseCreate(elseCreateValueFunction: () => T): T {
    return this._hasValue ? this._value : elseCreateValueFunction();
  }

  orNull(): ?T {
    if (this._hasValue) {
      return this._value;
    }
    return null;
  }

  orUndefined(): ?T {
    if (this._hasValue) {
      return this._value;
    }
    return undefined;
  }

  // flowlint-next-line unsafe-getters-setters:off
  get hasValue(): boolean {
    return this._hasValue;
  }

  // flowlint-next-line unsafe-getters-setters:off
  get isDefined(): boolean {
    return this._hasValue;
  }

  // flowlint-next-line unsafe-getters-setters:off
  get isEmpty(): boolean {
    return !this._hasValue;
  }
}

// any type is the correct usage here as mixed creates a lot of problems
// flowlint-next-line unclear-type:off
export const None: Optional<any> = Optional._None;

export function Some<T: SomeType | TimeoutID>(value: T): Optional<T> {
  return new Optional(value);
}

export class Match {
  constructor() {
    throw new Error('Do not create instances of this class');
  }

  static Both<T1, T2, ResultType, ContextType>(
      optional1: Optional<T1>, 
      optional2: Optional<T2>,
      caseBoth: (value1: T1, value2: T2, context: ContextType) => ResultType,
      caseNotBoth: (context: ContextType) => ResultType,
      context: ContextType
  ): ResultType {
    if (optional1._hasValue && optional2._hasValue) {
      return caseBoth(optional1._value, optional2._value, context);
    }
    return caseNotBoth(context);
  }
}
