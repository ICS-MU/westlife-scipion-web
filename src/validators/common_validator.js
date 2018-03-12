// validation messages
export const required = value => (value ? undefined : 'Please fill the field')
export const positiveNumber = value => (value >= 0 ? undefined : 'Value must be a positive number')