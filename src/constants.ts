export const Q_CLAIM_CONFIG_DAY = [
  {
    hedge: 0.02,
    x: 0,
  },
  {
    hedge: 0.03,
    x: 0,
  },
  {
    hedge: 0.04,
    x: 0,
  },
  {
    hedge: 0.05,
    x: 0,
  },
  {
    hedge: 0.06,
    x: 0,
  },
  {
    hedge: 0.07,
    x: 0,
  },
  {
    hedge: 0.08,
    x: 0,
  },
  {
    hedge: 0.09,
    x: 0,
  },
  {
    hedge: 0.1,
    x: 0,
  },
];
export const Q_CLAIM_CONFIG_HOUR = [
  {
    hedge: 0.02,
    x: 0,
  },
  {
    hedge: 0.03,
    x: 0,
  },
  {
    hedge: 0.04,
    x: 0,
  },
  {
    hedge: 0.05,
    x: 0,
  },
  {
    hedge: 0.06,
    x: 0,
  },
  {
    hedge: 0.07,
    x: 0,
  },
  {
    hedge: 0.08,
    x: 0,
  },
  {
    hedge: 0.09,
    x: 0,
  },
  {
    hedge: 0.1,
    x: 0,
  },
];
export const FUTURE_DIFF_STOP = -0.03;
export const RISK_CONFIG = 0.85;
export const REFUND_RATIO = 0.005;
export const DECIMAL_USDT = 2;
export const MIN_PERIOD = 1;
export const MAX_PERIOD = 15;
export const MIN_RATIO_CLAIM = 0.02;
export const LIST_UNIT = { USDT: 'USDT' };
export const RATIO_DIFFERENT_PRICE_CLAIM = 0.003;
export const MIN_MARGIN = 0.1;
export const MAX_MARGIN = 1000;
export const MIN_Q_COVER = 5;
export const MAX_Q_COVER = 10000;
export const MIN_HEDGE_MARGIN_PER_Q_COVER = 0.02;
export const MAX_HEDGE_MARGIN_PER_Q_COVER = 0.1;
export const DIFFCLAIM = 0.2; // 20%
export const FUNDING_LOCK = 0.1;
export const FUNDING_UNLOCK = 0.05;
export const MAX_MARGIN_SYSTEM = 800000;

export default {
  Q_CLAIM_CONFIG_DAY,
  Q_CLAIM_CONFIG_HOUR,
  FUTURE_DIFF_STOP,
  RISK_CONFIG,
  REFUND_RATIO,
  DECIMAL_USDT,
  MIN_PERIOD,
  MAX_PERIOD,
  DIFFCLAIM,
  MIN_RATIO_CLAIM,
  LIST_UNIT,
  RATIO_DIFFERENT_PRICE_CLAIM,
  MIN_MARGIN,
  MIN_Q_COVER,
  MAX_Q_COVER,
  MIN_HEDGE_MARGIN_PER_Q_COVER,
  MAX_HEDGE_MARGIN_PER_Q_COVER,
};
