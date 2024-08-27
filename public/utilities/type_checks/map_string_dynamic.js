function isString(variable) {
  return typeof variable === 'string' || variable instanceof String;
}

function isMapStringDynamic(variable) {
  if (typeof variable !== 'object' || variable === null || Array.isArray(variable)) {
    return false;
  }

  for (const key in variable) {
    if (!isString(key)) {
      return false;
    }
  }

  return true;
}

export { isMapStringDynamic, isString };

// const example1 = { key1: 'value1', key2: 42 };
// const example2 = { key1: 'value1', key2: { nestedKey: 'nestedValue' } };
// const example3 = { key1: 'value1', 42: 'value2' }; // Invalid because key is not a string
// const example4 = ['value1', 'value2']; // Invalid because it's an array

// console.log(isMapStringDynamic(example1)); // true
// console.log(isMapStringDynamic(example2)); // true
// console.log(isMapStringDynamic(example3)); // false
// console.log(isMapStringDynamic(example4)); // false