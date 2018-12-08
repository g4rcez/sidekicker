import { titlelize } from '../../src/strings';

const tests = [
  { result: 'Everything Ok', expect: titlelize('eVERyTHing OK'), name: 'multiple cases' },
  { result: 'Marvel Vs Dc', expect: titlelize('MARVEL VS DC'), name: 'No titlelize DC' },
  { result: 'Marvel Vs DC', expect: titlelize('marvel vs DC', true), name: 'versus mode with preserve' },
];

tests.forEach((testing) => {
  test(testing.name, () => {
    expect(testing.expect).toBe(testing.result);
  });
});
