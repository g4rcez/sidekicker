import { capitalize } from '../../src/strings';

const tests = [
  { toBe: 'Everything ok', expect: capitalize('eVERyTHing OK'), name: 'multiple cases' },
  { toBe: 'Marvel vs dc', expect: capitalize('MARVEL VS DC'), name: 'versus mode' },
];

tests.forEach((testing) => {
  test(testing.name, () => {
    expect(testing.expect).toBe(testing.toBe);
  });
});
