import * as _ from 'lodash';

const recursiveSetIn = (state: any | undefined, index: number, path: string[], value: any): any => {
  // Base case where recursion has reached limit.
  if (index >= path.length) {
    return value;
  }

  const key = path[index];

  if (!_.isNumber(key)) {
    if (state === undefined || state === null) {
      const result = recursiveSetIn(undefined, index + 1, path, value);
      return result === undefined ? undefined : { [key]: result };
    }

    if (_.isArray(state)) {
      throw new Error('Cannot set non-numeric property on array.');
    }

    const result = recursiveSetIn(state[key], index + 1, path, value);
    const keyCount = Object.keys(state).length;

    if (result === undefined) {
      if (state[key] === undefined && keyCount === 0) {
        return undefined;
      }

      if (state[key] !== undefined && keyCount <= 1) {
        if (!_.isNaN(path[index - 1])) {
          return {};
        } else {
          return undefined;
        }
      }
    }

    return {
      ...state,
      [key]: result,
    };
  }

  const numericKey = Number(key);
  if (state === undefined || state === null) {
    const result = recursiveSetIn(undefined, index + 1, path, value);

    if (result === undefined) {
      return undefined;
    }

    const array = [];
    array[numericKey] = result;
    return array;
  }

  if (!_.isArray(state)) {
    throw new Error('Cannot set a numeric property on an object.');
  }

  const existingValue = state[numericKey];
  const result = recursiveSetIn(existingValue, index + 1, path, value);

  const array = [...state];
  array[numericKey] = result;
  return array;
};

export const setIn = (state: any, key: string, value: any) => {
  if (state === undefined || state === null) {
    throw new Error(`Cannot set property in ${String(state)} state.`);
  }

  if (key === undefined || key === null) {
    throw new Error(`Cannot set property with ${String(key)} key.`);
  }

  return recursiveSetIn(state, 0, _.toPath(key), value);
};

export const getIn = (state: any, compound: string) => {
  const path = _.toPath(compound);

  let current = state;
  for (const key of path) {
    const arrayInvalid = _.isArray(current) && !_.isNumber(key);
    if (current === undefined || current === null || !_.isObject(current) || arrayInvalid) {
      return undefined;
    }

    current = current[key];
  }

  return current;
};
