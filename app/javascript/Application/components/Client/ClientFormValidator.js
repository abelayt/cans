export function validate(fieldName, value) {
  switch (fieldName) {
    case 'first_name':
    case 'last_name':
      return value.length && /^[A-z]+(([ ]|[-])[A-z]+)?$/i.test(value);
    case 'external_id':
      return value.length > 18 && (/^\d{4}-\d{4}-\d{4}-\d{7}$/i.test(value) || /^\d{19}$/i.test(value));
    case 'dob':
      return !!value;
    case 'county':
      return value ? !!value.id : false;
    default:
      return false;
  }
}

export function validateCaseNumber(caseNumber) {
  return !caseNumber || /^[a-zA-Z0-9]{1,50}$/i.test(caseNumber);
}

export function validateCaseNumbersAreUnique(cases) {
  const nonUniqueIndices = [];
  if (cases.length <= 1) {
    return nonUniqueIndices;
  }

  const lastIndex = cases.length - 1;
  for (let i = 0; i <= lastIndex - 1; i++) {
    const aCase = cases[i];
    if (!aCase.external_id || nonUniqueIndices.includes(i)) continue;
    for (let j = i + 1; j <= lastIndex; j++) {
      const bCase = cases[j];
      if (aCase.external_id === bCase.external_id) {
        nonUniqueIndices.push(i);
        nonUniqueIndices.push(j);
      }
    }
  }
  return [...new Set(nonUniqueIndices)];
}

export function isFormValid(childInfoValidation) {
  return !!(
    childInfoValidation.first_name &&
    childInfoValidation.last_name &&
    childInfoValidation.external_id &&
    childInfoValidation.dob &&
    childInfoValidation.county &&
    childInfoValidation.cases.filter(aCase => !aCase.external_id).length === 0
  );
}
