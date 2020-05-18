import { useRef, useCallback } from "react";
import { mergeValidators } from "../utils/utilValidators";

export function useValidators(context, nameProp, isMounted, isAsync = false) {
  const validators = useRef({});
  const validatorsMaps = useRef({});

  const updateValidatorsMap = useCallback((path, isValid, counter) => {
    // It propagates up to the form context
    if (context !== undefined) {
      context.updateValidatorsMap(
        `${nameProp.current}/${path}`,
        isValid,
        counter
      );
    } else {
      validatorsMaps.current[path] = {
        ...validatorsMaps.current[path],
        isValid,
        counter
      };

      console.log(validatorsMaps.current, "path - ", path, "context ", context);
    }
  }, []);

  // resetValidatorsMap only used in useForm
  const resetValidatorsMap = useCallback(() => {
    Object.keys(validatorsMaps.current).forEach(key => {
      const { type } = validatorsMaps.current[key];
      validatorsMaps.current[key].counter = 0;
      validatorsMaps.current[key].isValid =
        type === "collection" ? null : false;
    });
    return validatorsMaps.current;
  }, []);

  // validatorsFN type depends on its context - can be function or object
  // validatorsMapsFN type depends on its context - can be boolean, null or object
  const { current: addValidators } = useRef(
    (path, validatorsFN, validatorsMapsFN) => {
      validators.current = {
        ...validators.current,
        ...mergeValidators(path, validatorsFN)
      };

      if (isAsync) {
        validatorsMaps.current = {
          ...validatorsMaps.current,
          ...mergeValidators(path, validatorsMapsFN)
        };
      }

      if (
        nameProp !== undefined &&
        isMounted.current &&
        context !== undefined
      ) {
        const addFN = isAsync
          ? context.addValidatorsAsync
          : context.addValidators;

        addFN(nameProp.current, validators.current, validatorsMaps.current);
      }
    }
  );

  const { current: removeValidators } = useRef(
    (path, validatorsToRemove, validatorsMapsToRemove = false) => {
      const newValidators = {
        ...validators.current,
        ...mergeValidators(path, validatorsToRemove, true)
      };

      const newValidatorsMaps = !isAsync
        ? {}
        : {
            ...validatorsMaps.current,
            ...mergeValidators(path, validatorsMapsToRemove, true)
          };

      if (context !== undefined) {
        validators.current = newValidators;
        validatorsMaps.current = newValidatorsMaps;

        const removeFN = isAsync
          ? context.removeValidatorsAsync
          : context.removeValidators;

        removeFN(nameProp.current, validators.current, validatorsMaps.current);
      } else {
        // if context is undefined it is the form context and then
        // we must clean the undefined prop from it
        validators.current = cleanValidators(newValidators);
        validatorsMaps.current = cleanValidators(newValidatorsMaps);
      }
    }
  );
  return [
    validators,
    addValidators,
    removeValidators,
    validatorsMaps,
    updateValidatorsMap,
    resetValidatorsMap
  ];
}

function cleanValidators(validatorObj) {
  Object.keys(validatorObj).forEach(key => {
    if (validatorObj[key] === undefined) {
      delete validatorObj[key];
    }
  });
  return validatorObj;
}
