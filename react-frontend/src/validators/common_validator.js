/*
 * Returns required field validation message if value is empty, or undefined
 *
 * @param   {string}            value   Value to be validated
 * @return  {string/undefined}  Validation message if value is empty, otherwise undefined
 */
export const required = value => (value ? undefined : 'Please fill the field')

/*
 * Returns positive number validation message if value is negative or undefined
 *
 * @param   {integer}           value   Value to be validated
 * @return  {string/undefined}  Validation message if value is negative, otherwise undefined
 */
export const positiveNumber = value => (value >= 0 ? undefined : 'Value must be a positive number')