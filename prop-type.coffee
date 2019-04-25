isArray = (value)-> Array.isArray value
isObject = (value)-> !isArray(value) and typeof value is 'object'

createPrimitiveExtractor = (PropType, isValid)->
  if isValid is undefined then isValid = (value)-> typeof value is PropType

  return (isRequired, prop, value)->
    return undefined if not isRequired and value is undefined
    return value if isValid value
    error = new Error "Expect typeof #{PropType}, but received #{typeof value}"
    error.propPath = [prop]
    throw error

createChainableExtractor = (original)->
  required = original.bind null, true
  optional = original.bind null, false
  
  required.optional = optional
  required.required = required
  optional.optional = optional
  optional.required = required

  # default required
  return required

# primitive type value extractor
exports.bool   = bool    = createChainableExtractor createPrimitiveExtractor typeof true
exports.string = string  = createChainableExtractor createPrimitiveExtractor typeof ''
exports.number = number  = createChainableExtractor createPrimitiveExtractor typeof 0
exports.object = object  = createChainableExtractor createPrimitiveExtractor 'object', isObject
exports.array  = array   = createChainableExtractor createPrimitiveExtractor 'array', isArray

# custom type value extractor
exports.oneOf = oneOf = (validValues)->
  extract = (isRequired, prop, value)->
    return undefined if not isRequired and value is undefined
    return value if value in validValues

    error = new Error("expect oneOf [#{validValues.join(', ')}], but recieved #{value}");
    error.propPath = [prop]
    throw error

  return createChainableExtractor extract

exports.onceOfType = onceOfType = (extractors)->
  extract = (isRequired, prop, value)->
    return undefined if not isRequired and value is undefined
    for extractor of extractors
      try
        result = extractor prop, value
        error = undefined;
        break
      catch e
        error = e
        continue
    throw error if error
    return result;

  return createChainableExtractor extract

exports.arrayOf = arrayOf = (validValues)->
  validValues = [] if not isArray validValues
  extract = (isRequired, prop, values)->
    return undefined if not isRequired and values is undefined
    values = array.required prop, values

    for index, value of values
      if not value in validValues
        error = new Error "Expect one of [#{validValues.join(', ')}], but recieved #{value}"
        error.propPath = [prop, index]
        throw error

    return values

  return createChainableExtractor extract

exports.arrayOfType = arrayOfType = (extractor)->
  extract = (isRequired, prop, values)->
    return undefined if not isRequired and  values is undefined

    values = array.required prop, values

    try 
      extractor.required index, value for index, value of values
    catch error
      error.propPath = [] if not isArray error.propPath
      error.propPath.unshift prop
      throw error

  return createChainableExtractor extract

exports.shape = shape = (definination)->

  extract = (isRequired, prop, value)->
    return undefined if not isRequired and value is undefined

    result = {}
    
    try
      for prop, extract of definination
        maybe = extract prop, value[prop]
        result[prop] = maybe if maybe isnt undefined
    catch e
      error = e
    
    if error
      error.propPath = [] if not Array.isArray error.propPath
      error.propPath.unshift prop
      throw error

    return result

  return createChainableExtractor extract

exports.match = match = (regex)->
  extract = (isRequired, prop, value)->
    return undefined if not isRequired and value is undefined

    return value if regex.test value

    error = new Error "Expect match #{regex}, but received #{value}"
    error.propPath = [prop]
    throw error

  return createChainableExtractor extract