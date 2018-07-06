export function validate(fieldName, value) {
  switch (fieldName) {
    case 'first_name':
      return value.length && /^[A-z]+(([ ]|[-])[A-z]+)?$/i.test(value);
    case 'last_name':
      return value.length && /^[A-z]+(([ ]|[-])[A-z]+)?$/i.test(value);
    case 'case_id':
      return value.length && /^[a-zA-Z0-9]+$/i.test(value);
    case 'external_id':
      return value.length > 18 && /^\d{4}-\d{4}-\d{4}-\d{7}$/i.test(value);
    case 'dob':
      return !!value;
    case 'county':
      return value ? !!value.id : false;
    default:
      return false;
  }
}

export function isFormValid(childInfoValidation) {
  return !!(
    childInfoValidation.first_name &&
    childInfoValidation.last_name &&
    childInfoValidation.case_id &&
    childInfoValidation.external_id &&
    childInfoValidation.dob &&
    childInfoValidation.county
  );
}
