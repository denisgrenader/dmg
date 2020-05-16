/* @flow */
/* eslint-disable import/first */
/* eslint-disable no-magic-numbers */
/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
// flowlint unclear-type:off

import { None, Some, Optional } from '../optional.js';
import { ImmutableClass } from '../immutableClass.js';

const CANONICAL_EMPTY_OBJECT: any = {};
const MALFORMED_VERIFICATION_CODE = 9001;
const TOO_MANY_VERIFY_DEVICE_REQUESTS = 9003;

type MyMockClassParams = {|
  verificationErrorCode?: Optional<number>,
  backoffSeconds?: number
|};

class MyMockClass extends ImmutableClass<MyMockClass, MyMockClassParams> {
  verificationErrorCode: Optional<number> = None;
  backoffSeconds: number = 0;

  constructor(params: MyMockClassParams) {
    super();
    super._init(params);
  }

  testExtraMethod(): number {
    return this.backoffSeconds;
  }
}

class HasUndefinedProps extends ImmutableClass<HasUndefinedProps, Object> {
  verificationErrorCode: Optional<number> = None;
  backoffSeconds: number = 0;

  // This allows ImmutableClass to check initialization
  someBadKey: string = (undefined: any);

  constructor(params: Object) {
    super();
    super._init(params);
  }
}

const INITIAL_STATE = new MyMockClass(CANONICAL_EMPTY_OBJECT);

describe('ImmutableClass', () => {
  it('does not allow null or undefined props', () => {
    expect(() => new HasUndefinedProps({})).toThrow(
      ImmutableClass._nullOrUndefinedPropError('someBadKey', 'HasUndefinedProps')
    );
    expect(() => new HasUndefinedProps({ someBadKey: null })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('someBadKey', 'HasUndefinedProps')
    );
    expect(() => new HasUndefinedProps({ someBadKey: undefined })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('someBadKey', 'HasUndefinedProps')
    );
    expect(() => new HasUndefinedProps({ backoffSeconds: null })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('backoffSeconds', 'HasUndefinedProps')
    );
    expect(() => new HasUndefinedProps({ verificationErrorCode: undefined })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('verificationErrorCode', 'HasUndefinedProps')
    );

    // Cannot update an existing class with null/undefined values
    const a = new MyMockClass(CANONICAL_EMPTY_OBJECT);
    // $FlowExpectedError
    expect(() => a.update({ verificationErrorCode: null })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('verificationErrorCode', 'MyMockClass')
    );
    expect(() => a.update({ verificationErrorCode: undefined })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('verificationErrorCode', 'MyMockClass')
    );
    // $FlowExpectedError
    expect(() => new MyMockClass({ verificationErrorCode: null })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('verificationErrorCode', 'MyMockClass')
    );
    expect(() => new MyMockClass({ verificationErrorCode: undefined })).toThrow(
      ImmutableClass._nullOrUndefinedPropError('verificationErrorCode', 'MyMockClass')
    );
  });
  it('is actually immutable', () => {
    // Default works
    const a = new MyMockClass(CANONICAL_EMPTY_OBJECT);
    expect(a.verificationErrorCode).toBe(None);
    expect(a.backoffSeconds).toBe(0);

    expect(() => a.backoffSeconds = 23823).toThrow(
      new TypeError('Cannot assign to read only property \'backoffSeconds\' of object \'#<MyMockClass>\'')
    );

    // Validates above line actually did nothing
    expect(a.backoffSeconds).toBe(0);
  });
  it('correctly updates state', () => {
    // Default works
    const a = new MyMockClass(CANONICAL_EMPTY_OBJECT);
    expect(a.verificationErrorCode).toBe(None);
    expect(a.backoffSeconds).toBe(0);

    // INITIAL_STATE works
    expect(INITIAL_STATE.verificationErrorCode).toBe(None);
    expect(INITIAL_STATE.backoffSeconds).toBe(0);

    const b = new MyMockClass({ verificationErrorCode: Some(MALFORMED_VERIFICATION_CODE),
      backoffSeconds: 935 });
    const bRef = b;

    expect(b.verificationErrorCode.get()).toBe(MALFORMED_VERIFICATION_CODE);
    expect(b.backoffSeconds).toBe(935);
    expect(bRef).toBe(b);

    const c = b.update({ verificationErrorCode: Some(TOO_MANY_VERIFY_DEVICE_REQUESTS),
      backoffSeconds: 4984 });

    expect(c.verificationErrorCode.get()).toBe(TOO_MANY_VERIFY_DEVICE_REQUESTS);
    expect(c.backoffSeconds).toBe(4984);

    // Make sure original is not changed
    expect(b.verificationErrorCode.get()).toBe(MALFORMED_VERIFICATION_CODE);
    expect(b.backoffSeconds).toBe(935);
    expect(bRef).toBe(b);

    // Updating with exact same values returns same object
    const d = b.update({ verificationErrorCode: Some(MALFORMED_VERIFICATION_CODE),
      backoffSeconds: 935 });
    expect(d === b).toBe(true);

    // Same goes if you don't provide any values
    const e = b.update(CANONICAL_EMPTY_OBJECT);
    expect(e === b).toBe(true);
  });
  it('correctly updates state multiple times', () => {
    // Default works
    const a = new MyMockClass(CANONICAL_EMPTY_OBJECT);
    expect(a.verificationErrorCode).toBe(None);
    expect(a.backoffSeconds).toBe(0);

    const c = a.update({ backoffSeconds: 5 });
    expect(c.backoffSeconds).toBe(5);
    expect(c.testExtraMethod()).toBe(5);

    const d = c.update({ backoffSeconds: 15 });
    expect(d.backoffSeconds).toBe(15);
    expect(d.testExtraMethod()).toBe(15);
  });
});
