/* @flow */
/* eslint-disable import/first */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-self-compare */
/* eslint-disable flowtype/require-return-type */
/* eslint-disable flowtype/require-parameter-type */
// flowlint unclear-type:off

import { Optional, None, Some } from '../optional.js';

describe('Optional', () => {
  it('correctly works for the basics', () => {
    const o = new Optional(25);
    expect(o.isDefined).toBe(true);
    expect(o.isEmpty).toBe(false);
    expect(o.get()).toBe(25);

    const o2 = new Optional(null);
    expect(o2.isDefined).toBe(false);
    expect(o2.isEmpty).toBe(true);
    expect(() => o2.get()).toThrow(new TypeError('get called on a null Optional'));

    // All optionals of null are always exactly the same instance
    expect(new Optional(null) === new Optional(null)
           && new Optional(null) === new Optional(null)).toBe(true);
    expect(None === new Optional(null)).toBe(true);
    expect(new Optional(null) === None).toBe(true);

    expect(new Optional(undefined) === new Optional(null)
           && new Optional(null) === new Optional(undefined)
           && new Optional(undefined) === new Optional(undefined)).toBe(true);
    expect(None === new Optional(undefined)).toBe(true);
    expect(new Optional(undefined) === None).toBe(true);

    expect(new Optional() === new Optional()
           && new Optional() === new Optional()
           && new Optional() === new Optional()).toBe(true);
    expect(None === new Optional()).toBe(true);
    expect(new Optional() === None).toBe(true);

    expect(None.isDefined).toBe(false);
    expect(None.isEmpty).toBe(true);

    // Correclty works with results of empty keys in a dictionary
    const myDict = {};
    myDict.a = 123;
    myDict.b = 345;
    let myKey = 'a';
    expect(new Optional(myDict[myKey]).strictEquals(Some(123))).toBe(true);
    expect(new Optional(myDict[myKey]).get()).toBe(123);
    myKey = 'b';
    expect(new Optional(myDict[myKey]).strictEquals(Some(345))).toBe(true);
    expect(new Optional(myDict[myKey]).get()).toBe(345);

    // Here we end up with None
    myKey = 'zzzzzzz';
    expect(new Optional(myDict[myKey]).strictEquals(None)).toBe(true);
    expect(new Optional(myDict[myKey])).toBe(None);
  });
  it('handles emptyStringIsNone properly', () => {
    const o = new Optional('');
    expect(o.isDefined).toBe(true);
    expect(o.isEmpty).toBe(false);
    expect(o.get()).toBe('');

    const o2 = new Optional('', { emptyStringIsNone: true });
    expect(o2.isDefined).toBe(false);
    expect(o2.isEmpty).toBe(true);
    expect(o2 === None).toBe(true);
  });
  it('handles strictValueEquals properly', () => {
    const a = {};
    const b = {};
    const o = new Optional(a);
    expect(o.strictValueEquals(a)).toBe(true);
    expect(o.strictValueEquals(b)).toBe(false);
  });
  it('handles strictEquals comparisons properly', () => {
    expect(
      new Optional(null).strictEquals(new Optional(null))
      && new Optional(null).strictEquals(None)
      && None.strictEquals(new Optional(null))
      && None.strictEquals(None)
      && new Optional(undefined).strictEquals(new Optional(undefined))
      && new Optional(undefined).strictEquals(None)
      && None.strictEquals(new Optional(undefined))
      && new Optional(null).strictEquals(new Optional(undefined))
      && new Optional(undefined).strictEquals(new Optional(null))
    ).toBe(true);
    const a = new Optional(25);
    const b = new Optional(25);
    expect(a === b).toBe(false);
    expect(a.strictEquals(b)).toBe(true);
    expect(b.strictEquals(a)).toBe(true);
    expect(None.strictEquals(a)).toBe(false);
    expect(a.strictEquals(None)).toBe(false);

    const c = new Optional(35);
    expect(a.strictEquals(c)).toBe(false);

    // We can also compare optionals of optionals
    const d = new Optional(new Optional(99));
    const e = new Optional(new Optional(99));
    expect(d === e).toBe(false);
    expect(d.strictEquals(e)).toBe(true);

    const f = new Optional(new Optional(new Optional(99)));
    const g = new Optional(new Optional(new Optional(99)));
    expect(f === g).toBe(false);
    expect(f.strictEquals(g)).toBe(true);
    expect(f.strictEquals(g.get())).toBe(false); // different levels are not equal

    // We do not expect optionals of different wrapped levels to equal
    const h = new Optional(new Optional(new Optional(99)));
    const i = new Optional(new Optional(new Optional(new Optional(99))));
    expect(h === i).toBe(false);
    expect(h.strictEquals(i)).toBe(false);
    expect(h.strictEquals(i.get())).toBe(true);

    // Works properly for non primivites
    const j = new Optional([1, 2, 3]);
    const k = new Optional([1, 2, 3]);
    expect(j === k).toBe(false);
    expect(j.strictEquals(k)).toBe(false);
    expect(j.get() === k.get()).toBe(false);

    // Works correctly when the item being compared to is not Optional
    // $FlowExpectedError - obviously 'some string' is not an Optional
    expect(j.strictEquals('some string')).toBe(false);
  });
  it('creates immutable None instances', () => {
    const x = None;
    expect(x._hasValue).toBe(false);
    expect(x._value).toBeUndefined();
    expect(() => x._hasValue = true).toThrow(
      new TypeError('Cannot assign to read only property \'_hasValue\' of object \'#<Optional>\'')
    );
    expect(() => x._value = 'some value').toThrow(
      new TypeError('Cannot assign to read only property \'_value\' of object \'#<Optional>\'')
    );    

    // Validates the above two lines truly did nothing
    expect(x._hasValue).toBe(false);
    expect(x._value).toBeUndefined();
  });
  it('handles forEach with a value', () => {
    let result = 10;
    const o = new Optional(25);
    o.forEach((v) => result = v * 2);
    expect(result).toBe(50);

    const o2 = new Optional(0);
    o2.forEach((v) => result = v + 999);
    expect(result).toBe(999);
  });
  it('handles forEach without a value', () => {
    let result = 10;
    const o: Optional<number> = new Optional(null);
    o.forEach((v) => result = v * 10000);
    expect(result).toBe(10);

    const o2: Optional<number> = new Optional(undefined);
    o2.forEach((v) => result = v * 1000);
    expect(result).toBe(10);
  });
  it('handles map with a value', () => {
    const o: Optional<number> = new Optional(25);
    const result: Optional<string> = o.map((v) => String(v * 2));
    expect(result.get()).toBe('50');

    const result2: Optional<string> = o.map((): any => null);
    expect(result2).toBe(None);
    expect(result2.isDefined).toBe(false);
  });
  it('handles map without a value', () => {
    const o: Optional<number> = new Optional(null);
    expect(o).toBe(None); // These are exactly the same instance
    expect(o === None).toBe(true); // These are exactly the same instance
    expect(o.isDefined).toBe(false);
    expect(o.isEmpty).toBe(true);

    const result = o.map((v) => String(v * 2));
    expect(result).toBe(None); // This is an instance of None
    expect(result.isDefined).toBe(false);
    expect(result.isEmpty).toBe(true);
  });
  it('handles flatMap with a value', () => {
    const o = new Optional(25);
    const result: Optional<string> = o.flatMap((v) => new Optional(String(v * 2)));
    expect(result.get()).toBe('50');

    const result2: Optional<string> = o.flatMap(() => new Optional(null));
    expect(result2).toBe(None);
    expect(result2.isDefined).toBe(false);

    const result3: Optional<string> = o.flatMap(() => None);
    expect(result3).toBe(None);
    expect(result3.isDefined).toBe(false);
  });
  it('handles flatMap without a value', () => {
    const o: Optional<number> = new Optional(null);
    const result: Optional<string> = o.flatMap((v) => new Optional(String(v * 2)));
    expect(result).toBe(None);
    expect(result.isDefined).toBe(false);
  });
  it('handles get properly', () => {
    const o: Optional<number> = new Optional(null);
    // expect(o.get()).toThrowError('get called on a null Optional');
    expect(() => o.get()).toThrow(new TypeError('get called on a null Optional'));

    const o2 = new Optional(55);
    expect(o2.get()).toBe(55);
  });
  it('handles getOrElse properly', () => {
    const o: Optional<number> = new Optional(null);
    expect(o.getOrElse(999999)).toBe(999999);
    expect(o.getOrElse(7771)).toBe(7771);

    const o2 = new Optional(55);
    expect(o2.getOrElse(999999)).toBe(55);
    expect(o2.getOrElse(7771)).toBe(55);

    const o3: Optional<number> = None;
    expect(o3.getOrElse(999999)).toBe(999999);
    expect(o3.getOrElse(7771)).toBe(7771);
  });
  it('matches properly', () => {
    const o: Optional<number> = new Optional(null);
    expect(o.match(
      (v) => v * 3,
      () => 235937
    )).toBe(235937);

    const o2: Optional<number> = new Optional(100);
    expect(o2.match(
      (v) => v * 3,
      () => 235937
    )).toBe(300);
  });
  it('matches properly with type change', () => {
    const o: Optional<number> = new Optional(null);
    const result: string = o.match(
      (v) => (v * 3).toString(),
      () => '235937'
    );
    expect(result).toBe('235937');

    const o2: Optional<number> = new Optional(100);
    const result2: string = o2.match(
      (v) => (v * 3).toString(),
      () => '235937'
    );
    expect(result2).toBe('300');
  });
  it('correctly maps None', () => {
    const nakedVariable = null;
    const o: Optional<number> = new Optional(nakedVariable);
    expect(o).toBe(None);           // These are truly the same instance
    expect(o === None).toBe(true);  // These are truly the same instance

    // Now we map
    const mappedOptional = o.map((x) => x * 500);
    expect(mappedOptional).toBe(None);           // These are truly the same instance
    expect(mappedOptional === None).toBe(true);  // These are truly the same instance
  });
  it('correctly works with getOrElseCreate', () => {
    let numCalls = 0;
    const x = None;
    const createValue = () => {
      numCalls += 1;
      return numCalls;
    };
    const y: Optional<number> = Some(999);

    // When calling on an Optional with a value, our numCalls should never increase because we
    // do not invoke the function
    expect(numCalls).toBe(0);
    expect(y.getOrElseCreate(createValue)).toBe(999);
    expect(numCalls).toBe(0);
    expect(y.getOrElseCreate(createValue)).toBe(999);
    expect(numCalls).toBe(0);
    expect(y.getOrElseCreate(createValue)).toBe(999);
    expect(numCalls).toBe(0);

    // When calling with None value, we will keep calling the function
    expect(x.getOrElseCreate(createValue)).toBe(1);
    expect(numCalls).toBe(1);

    expect(x.getOrElseCreate(createValue)).toBe(2);
    expect(numCalls).toBe(2);
  });
});
