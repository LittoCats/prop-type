// @author 程巍巍 2019-01-17 14:42:23
// 
  
import {
  bool,
  string,
  number,
  object,
  array,

  shape,

  arrayOfType,
  oneOf,
  oneOfType,

  match
} from '.';


describe('Test primitive type', ()=> {
  describe('Test bool', ()=> {
    test('pass if item is true', ()=> expect(bool('', true)).toBe(true));
    test('pass if item is false', ()=> expect(bool('', false)).toBe(false));
    test('throw if item is undefined', ()=> expect(bool.bind(null, '', undefined)).toThrow());
    test('throw if item is null', ()=> expect(bool.bind(null, '', null)).toThrow());
    test('throw if item is number', ()=> expect(bool.bind(null, '', 1)).toThrow());
    test('throw if item is string', ()=> expect(bool.bind(null, '', '')).toThrow());
    test('throw if item is object', ()=> expect(bool.bind(null, '', {})).toThrow());
    test('throw if item is array', ()=> expect(bool.bind(null, '', [])).toThrow());  

    test('optional maybe undefined', ()=> expect(bool.optional('', undefined)).toBe(undefined))
    test('required must not be undefined', ()=> expect(()=> bool.required('', undefined)).toThrow())
  })
  
  describe('Test string', ()=> {
    test('pass if item is string literal', ()=> expect(string('', 'true')).toBe('true'));
    test('throw if item is bool', ()=> expect(string.bind(null, '', true)).toThrow());
    test('throw if item is number', ()=> expect(string.bind(null, '', 1)).toThrow());
    test('throw if item is object', ()=> expect(string.bind(null, '', {})).toThrow());
    test('throw if item is array', ()=> expect(string.bind(null, '', [])).toThrow());
    test('throw if item is undefined', ()=> expect(string.bind(null, '', undefined)).toThrow());
    test('throw if item is null', ()=> expect(string.bind(null, '', null)).toThrow());
 })

  describe('Test number', ()=> {
    test('pass if item is number literal', ()=> expect(number( '', 0)).toBe(0));
    test('pass if item is number object', ()=> expect(number( '', Number(0))).toBe(0));
    test('throw if item is bool', ()=> expect(number.bind(null, '', true)).toThrow());
    test('throw if item is string', ()=> expect(number.bind(null, '', '')).toThrow());
    test('throw if item is object', ()=> expect(number.bind(null, '', {})).toThrow());
    test('throw if item is array', ()=> expect(number.bind(null, '', [])).toThrow());
    test('throw if item is undefined', ()=> expect(number.bind(null, '', undefined)).toThrow());
    test('throw if item is null', ()=> expect(number.bind(null, '', null)).toThrow());
})

  describe('Test object', ()=> {

    test('pass if item is object literal', ()=> expect(object('', {})).toEqual({}));
    test('pass if item is object new', ()=> expect(object('', Object())).toEqual({}));
    test('throw if item is bool', ()=> expect(object.bind(null, '', true)).toThrow());
    test('throw if item is string', ()=> expect(object.bind(null, '', '')).toThrow());
    test('throw if item is number', ()=> expect(object.bind(null, '', 0)).toThrow());
    test('throw if item is array', ()=> expect(object.bind(null, '', [])).toThrow());
    test('throw if item is undefined', ()=> expect(object.bind(null, '', undefined)).toThrow());
    test('pass if item is null, because null is object', ()=> expect(object('', null)).toEqual(null));
})

  describe('Test array', ()=> {
    test('pass if item is array literal', ()=> expect(array('', [1])).toEqual([1]));
    test('pass if item is array new', ()=> expect(array('', new Array())).toEqual([]));
    test('throw if item is bool', ()=> expect(array.bind(null, '', true)).toThrow());
    test('throw if item is number', ()=> expect(array.bind(null, '', 0)).toThrow());
    test('throw if item is string', ()=> expect(array.bind(null, '', '')).toThrow());
    test('throw if item is object', ()=> expect(array.bind(null, '', {})).toThrow());
  })
})

describe('Test oneOf 1, 2, 3', ()=> {

  const validNumbers = [1,2,3];
  const extract = oneOf(validNumbers);

  test('1 in validNumbers', ()=> {
    expect(extract('', 1)).toBe(1);
  });

  test('2 in validNumbers', ()=> {
    expect(extract('', 2)).toBe(2);
  });

  test('4 not in validNumbers', ()=> {
    expect(()=> extract('', 4)).toThrow();
  });

});


describe('Test shape with name of string and optional age of number', ()=> {

  const shapeExtract = shape({
    name: string,
    age: number.optional
  });

  test('throw with no name', ()=> expect(()=> shapeExtract('', {age: 100})).toThrow());
  test('pass with no age', ()=> expect(shapeExtract('', {name: 'John'})).toEqual({name: 'John'}));
  
  test('without data undefined', ()=> expect(shapeExtract('', {name: 'John', boyfriend: 'Simith'})).toEqual({name: 'John'}));

  test('throw with invalid name type', ()=> expect(()=> shapeExtract('', {name: 234})).toThrow());
  test('throw with invalid age type', ()=> expect(()=>shapeExtract('', {name: 'John', age: '100'})).toThrow());
})


describe('Test arrayOfType string', ()=> {

  const extract = arrayOfType(string);

  test('pass if all items are string', ()=> expect(extract('', ['name', 'age'])).toEqual(['name', 'age']));
  test('throw if some items are not string', ()=> expect(()=> extract('', ['nam', 3, 'age'])).toThrow());

})
describe('Test oneOfType string and number', ()=> {

  const extract = oneOfType([string, number]);

  test('pass if item is string', ()=> expect(extract('', 'name')).toEqual('name'));
  test('pass if item  is number', ()=> expect(extract('', 12345)).toEqual(12345));
  test('throw if some item is boolean', ()=> expect(()=> extract('', true)).toThrow());
  test('throw if some item is array', ()=> expect(()=> extract('', [])).toThrow());
  test('throw if some item is object', ()=> expect(()=> extract('', {})).toThrow());
  test('throw if some item is null', ()=> expect(()=> extract('', null)).toThrow());
  test('throw if some item is undefined', ()=> expect(()=> extract('', undefined)).toThrow());

})


describe('Test match', ()=> {

  const extract = match(/^189\d{8}$/);

  test('pass if phonenum with prefix 189', ()=> expect(extract('', '18928842273')).toBe('18928842273'));
  test('throw if not phonenum with prefix 189', ()=> expect(()=> extract('', 15928842273)).toThrow());
})
