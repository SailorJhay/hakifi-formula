export type InsuranceFormulaOptions = {
  changeAvg: number;
};

export type TCalSystemRisk = {
  p_stop: number;
  p_open: number;
  dayChangeToken: number;
};

export type TCalSystemCapital = {
  margin: number;
  system_risk: number;
};

export type TCalPStop = {
  p_open: number;
  p_claim: number;
  hedge: number;
};

export enum PERIOD_UNIT {
  DAY = 'DAY',
  HOUR = 'HOUR',
}

export type TCalQClaim = {
  margin: number;
  p_open: number;
  p_claim: number;
  hedge: number;
  dayChangeToken: number;
  periodUnit: PERIOD_UNIT;
};

export type TCalQuantityFuture = {
  margin: number;
  p_open: number;
  p_claim: number;
  hedge: number;
  dayChangeToken: number;
};

export type TCalExpired = {
  period: number;
  periodUnit: PERIOD_UNIT;
};

export type TGetDistancePClaim = {
  p_market: number;
  current_avg: number;
  list_avg: Array<number>;
  side: ENUM_INSURANCE_SIDE;
};

export enum ENUM_INSURANCE_SIDE {
  BULL = 'BULL',
  BEAR = 'BEAR',
}
