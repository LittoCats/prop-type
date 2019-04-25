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
    test('bool true toBe true', ()=> expect(bool('', true)).toBe(true));
    test('bool false toBe false', ()=> expect(bool('', false)).toBe(false));
    test('bool throw if undefined', ()=> expect(bool.bind(null, '', undefined)).toThrow());
    test('bool throw if null', ()=> expect(bool.bind(null, '', null)).toThrow());
    test('bool throw if number', ()=> expect(bool.bind(null, '', 1)).toThrow());
    test('bool throw if string', ()=> expect(bool.bind(null, '', '')).toThrow());
    test('bool throw if object', ()=> expect(bool.bind(null, '', {})).toThrow());
    test('bool throw if array', ()=> expect(bool.bind(null, '', [])).toThrow());  

    test('bool optional maybe undefined', ()=> expect(bool.optional('', undefined)).toBe(undefined))
    test('bool required must not be undefined', ()=> expect(()=> bool.required('', undefined)).toThrow())
  })
  
  describe('Test string', ()=> {
    test('string', ()=> expect(string('', 'true')).toBe('true'));
    test('string throw if bool', ()=> expect(string.bind(null, '', true)).toThrow());
    test('string throw if number', ()=> expect(string.bind(null, '', 1)).toThrow());
    test('string throw if object', ()=> expect(string.bind(null, '', {})).toThrow());
    test('string throw if array', ()=> expect(string.bind(null, '', [])).toThrow());    
  })

  describe('Test number', ()=> {
    test('number ', ()=> expect(number( '', 0)).toBe(0));
    test('number throw if bool', ()=> expect(number.bind(null, '', true)).toThrow());
    test('number throw if string', ()=> expect(number.bind(null, '', '')).toThrow());
    test('number throw if object', ()=> expect(number.bind(null, '', {})).toThrow());
    test('number throw if array', ()=> expect(number.bind(null, '', [])).toThrow());
  })

  describe('Test object', ()=> {

    test('object ', ()=> expect(object('', {})).toEqual({}));
    test('object throw if bool', ()=> expect(object.bind(null, '', true)).toThrow());
    test('object throw if string', ()=> expect(object.bind(null, '', '')).toThrow());
    test('object throw if number', ()=> expect(object.bind(null, '', 0)).toThrow());
    test('object throw if array', ()=> expect(object.bind(null, '', [])).toThrow());
  })

  describe('Test array', ()=> {
    test('array ', ()=> expect(array('', [1])).toEqual([1]));
    test('array throw if bool', ()=> expect(array.bind(null, '', true)).toThrow());
    test('array throw if number', ()=> expect(array.bind(null, '', 0)).toThrow());
    test('array throw if string', ()=> expect(array.bind(null, '', '')).toThrow());
    test('array throw if object', ()=> expect(array.bind(null, '', {})).toThrow());
  })
})

describe('Test oneOf', ()=> {

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


describe('Test shape', ()=> {

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


describe('Test arrayOfType', ()=> {

  const extract = arrayOfType(string);

  test('pass if all items are string', ()=> expect(extract('', ['name', 'age'])).toEqual(['name', 'age']));
  test('throw if some items are not string', ()=> expect(()=> extract('', ['nam', 3, 'age'])).toThrow());

})

describe('Test match', ()=> {

  const extract = match(/^189\d{8}$/);

  test('pass if phonenum with prefix 189', ()=> expect(extract('', '18928842273')).toBe('18928842273'));
  test('throw if not phonenum with prefix 189', ()=> expect(()=> extract('', 15928842273)).toThrow());
})