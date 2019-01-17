// @author 程巍巍 2019-01-17 14:41:10
// 

function isArray(value) {
  return Array.isArray(value)
}

function isObject(value) {
  return !isArray(value) && typeof value === 'object';
}

function createPrimitiveExtractor(PropType, isValid) {

  if (typeof isValid === 'undefined') isValid = (value)=> typeof value === PropType
  
  return function (isRequired, prop, value) {
    let type = typeof value;
    if (!isRequired && value === undefined) return undefined;

    if (isValid(value)) return value;

    let error = new Error(`expect typeof ${PropType}, but received ${typeof value}`);
    error.propPath = [prop]
    throw error;
  }  
}

// 默认属性是 required
function createChainableExtractor(original) {
  const required = original.bind(null, true);
  const optional = original.bind(null, false);

  required.optional = optional;
  required.required = required;
  optional.optional = optional;
  optional.required = required;

  return required;
}


// primitive type value extractor
const bool    = createChainableExtractor(createPrimitiveExtractor(typeof true));
const string  = createChainableExtractor(createPrimitiveExtractor(typeof ''));
const number  = createChainableExtractor(createPrimitiveExtractor(typeof 0));
const object  = createChainableExtractor(createPrimitiveExtractor('object', isObject));
const array   = createChainableExtractor(createPrimitiveExtractor('array', isArray));

// custom type value extractor
const oneOf = function (validValues) {
  
  return createChainableExtractor(extract);

  function extract(isRequired, prop, value) {
    
    if (!isRequired && type === undefined) return undefined;
    if (value in validValues) return value;

    let error = new Error(`expect oneOf [${validValues.join(', ')}], but recieved ${value}`);
    error.propPath = [prop];
    throw error;
  }
}

const oneOfType = function (extractors) {
  
  return createChainableExtractor(extract);

  function extract(isRequired, prop, value) {
    let type = typeof value;
    if (!isRequired && type === undefined) return undefined;

    let error = undefined;
    let result = undefined;
    for (let extract of extractors) {
      try {
        result = extract(prop, value);
        error = undefined;
        break;
      }catch(e){
        error = e;
        continue;
      }
    }

    if (error) throw error;
    return result;
  }
}

const shape = function (definination) {
  const defininations = Object.entries(definination);

  return createChainableExtractor(extract);

  function extract(isRequired, prop, value) {
    let type = typeof value;
    if (!isRequired && type === undefined) return undefined;

    let error = undefined;
    let result = {};

    try {
      defininations.forEach(([prop, extract])=> {
        let maybe = extract(prop, value[prop]);
        if (maybe !== undefined) result[prop] = maybe;
      });  
    }catch(e){
      error = e;
    }
    
    if (error) {
      error.propPath.unshift(prop);
      throw error;
    }

    return result;
  }
}

const arrayOfType = function (extractor) {
  
  return createChainableExtractor(extract);

  function extract(isRequired, prop, values) {
    if (!isRequired && values === undefined) return undefined;

    values = array.required(prop, values);

    try {
      return values.map((value, index)=> extractor.required(index, value));
    } catch(e) {
      e.propPath.unshift(prop);
      throw e;
    }
  }
}


export {
  bool,
  string,
  number,
  object,
  array,

  shape,

  arrayOfType,
  oneOf,
  oneOfType
}