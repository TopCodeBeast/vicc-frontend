export const hidePhoneDetails = (phoneNumber: string) =>
  '•'.repeat(phoneNumber.length - 2) + phoneNumber.slice(-2);

export const hideEmailDetails = (str: string) => {
  const positionOfAt = str.indexOf('@');
  return positionOfAt < 4
    ? `${'•'.repeat(positionOfAt)}${str.slice(str.indexOf('@'))}`
    : `${str.slice(0, 2) + '•'.repeat(positionOfAt - 2)}${str.slice(
        str.indexOf('@')
      )}`;
};
