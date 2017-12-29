import DateUtils from './DateUtils';

it('should correctly show date before some minutes', () => {
  Date.now = jest.fn(() => new Date('2017-12-23T18:31:46').valueOf());
  expect(
    DateUtils.getPostedAtDateString('2017-12-23T18:30:46')
  ).toBe('Vor kurzem');
});

it('should correctly show date before one hour', () => {
  Date.now = jest.fn(() => new Date('2017-12-23T19:35:46').valueOf());
  expect(
    DateUtils.getPostedAtDateString('2017-12-23T18:35:46')
  ).toBe('Vor einer Stunde');
});

it('should correctly show date before two hours', () => {
  Date.now = jest.fn(() => new Date('2017-12-23T20:35:46').valueOf());
  expect(
    DateUtils.getPostedAtDateString('2017-12-23T18:35:46')
  ).toBe('Vor 2 Stunden');
});

it('should correctly show date before one day', () => {
  Date.now = jest.fn(() => new Date('2017-12-24T18:30:46').valueOf());
  expect(
    DateUtils.getPostedAtDateString('2017-12-23T18:30:46')
  ).toBe('Vor einem Tag');
});

it('should correctly show date before two days', () => {
  Date.now = jest.fn(() => new Date('2017-12-25T18:30:46').valueOf());
  expect(
    DateUtils.getPostedAtDateString('2017-12-23T18:30:46')
  ).toBe('Vor 2 Tagen');
});

it('should correctly show date before multiple days', () => {
  Date.now = jest.fn(() => new Date('2018-08-01T12:23:14').valueOf());
  expect(
    DateUtils.getPostedAtDateString('2017-12-23T18:30:46')
  ).toBe('Am December 23, 2017');
});