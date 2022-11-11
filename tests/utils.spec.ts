import useUtils from '../src/composables/useUtils'

const utils = useUtils()

describe('timestampToDateString function', () => {
  describe('early-year date', () => {
    test('leading zeros', () => {
      const targetTimestamp = 1640980800000
      const expectedDateString = '2022/01/01 05:00:00'
      expect(utils.timestampToDateString(targetTimestamp)).toEqual(expectedDateString)
    })
    test('non-leading zeros', () => {
      const targetTimestamp = 1642249220000
      const expectedDateString = '2022/01/15 21:20:20'
      expect(utils.timestampToDateString(targetTimestamp)).toEqual(expectedDateString)
    })
  })
  describe('mid-year date', () => {
    test('leading zeros', () => {
      const targetTimestamp = 1654027200000
      const expectedDateString = '2022/06/01 05:00:00'
      expect(utils.timestampToDateString(targetTimestamp)).toEqual(expectedDateString)
    })
    test('non-leading zeros', () => {
      const targetTimestamp = 1655295620000
      const expectedDateString = '2022/06/15 21:20:20'
      expect(utils.timestampToDateString(targetTimestamp)).toEqual(expectedDateString)
    })
  })
  describe('late-year date', () => {
    test('leading zeros', () => {
      const targetTimestamp = 1669838400000
      const expectedDateString = '2022/12/01 05:00:00'
      expect(utils.timestampToDateString(targetTimestamp)).toEqual(expectedDateString)
    })
    test('non-leading zeros', () => {
      const targetTimestamp = 1671106820000
      const expectedDateString = '2022/12/15 21:20:20'
      expect(utils.timestampToDateString(targetTimestamp)).toEqual(expectedDateString)
    })
  })
})

