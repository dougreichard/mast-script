function isEmpty(value) {
    if (value == null) {
      return true
    }
    if (isArrayLike(value) &&
        (Array.isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
          isBuffer(value) || isTypedArray(value) || isArguments(value))) {
      return !value.length
    }
    const tag = getTag(value)
    if (tag == '[object Map]' || tag == '[object Set]') {
      return !value.size
    }
    if (isPrototype(value)) {
      return !Object.keys(value).length
    }
    for (const key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false
      }
    }
    return true
  }

  function last(array) {
    const length = array == null ? 0 : array.length
    return length ? array[length - 1] : undefined
  }