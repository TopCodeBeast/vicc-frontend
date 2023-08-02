import { StartCase } from 'types';

const toStartCase = <T extends string>(s: T): StartCase<T> => {
  return (
    s
      // convert camel case to start case
      .replace(/([^A-Z]+)([A-Z])/g, '$1 $2')
      // separate all-uppercased letters (etc Accept CTU Dialog)
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') as StartCase<T>
  );
};

export default toStartCase;
