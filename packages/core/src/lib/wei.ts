import Big from 'bignumber.js';

export enum RoundingMode {
  /**
   * Rounds away from zero.
   */
  ROUND_UP = 0,
  /**
   * Rounds towards zero.
   * I.e. truncate, no rounding.
   */
  ROUND_DOWN = 1,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds away from zero.
   */
  ROUND_HALF_UP = 4,
  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards even neighbour.
   */
  ROUND_HALF_EVEN = 6,
}

export const oneEth = new Big(10).pow(18);

// Wei precision on Starkware has only 8 significant figures
export const WEI_DECIMAL_PLACES = 8;

// We enforce only 4 decimals
export const ETH_DECIMAL_PLACES = 4;

export const roundCeilFloat = (amount: number, decimal: number) =>
  Number(new Big(amount).toFixed(decimal, RoundingMode.ROUND_UP));

export const roundRoundFloat = (amount: number, decimal: number) =>
  new Big(amount).decimalPlaces(decimal);

export const fromWei = (
  number: string,
  round = 4,
  roundingMode = RoundingMode.ROUND_HALF_UP
): number =>
  Number(new Big(number).dividedBy(oneEth).toFixed(round, roundingMode));

export const toWei = (number: string | number): string =>
  new Big(number)
    .decimalPlaces(WEI_DECIMAL_PLACES)
    .multipliedBy(oneEth)
    .toString();
