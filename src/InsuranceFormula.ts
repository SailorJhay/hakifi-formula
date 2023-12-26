import Big from 'big.js';
import CONFIG from './constants';
import {
  ENUM_INSURANCE_SIDE,
  PERIOD_UNIT,
  TCalExpired,
  TCalPStop,
  TCalQClaim,
  TCalQuantityFuture,
  TCalSystemCapital,
  TCalSystemRisk,
  TGetDistancePClaim,
} from './types';

export class InsuranceFormula {
  public risk_config: number;
  public refund_ratio: number;
  public decimal_usdt: number;
  public min_period: number;
  public max_period: number;
  public diff_claim: number;
  public constant_claim: number;

  constructor() {
    this.refund_ratio = CONFIG.REFUND_RATIO;
    this.risk_config = CONFIG.RISK_CONFIG;
    this.decimal_usdt = CONFIG.DECIMAL_USDT;
    this.min_period = CONFIG.MIN_PERIOD;
    this.max_period = CONFIG.MAX_PERIOD;
    this.diff_claim = CONFIG.DIFFCLAIM;
    this.constant_claim = 1;
  }

  /**
   * Calculates the system risk based on the given parameters.
   *
   * @param params - The parameters required for the calculation.
   * @returns The calculated system risk.
   */
  public calculateSystemRisk(params: TCalSystemRisk) {
    const { dayChangeToken, p_open, p_stop } = params;
    const percent_p_expired = Big(p_stop).minus(p_open).abs().div(p_open).toNumber();

    return Big(dayChangeToken).div(percent_p_expired).toNumber();
  }

  public calculateSystemCapital({ margin, system_risk }: TCalSystemCapital) {
    if (Big(system_risk).gt(this.risk_config)) {
      return Big(margin).times(this.risk_config).div(system_risk).toNumber();
    } else {
      return Big(margin).plus(Big(this.risk_config).minus(system_risk).times(margin)).toNumber();
    }
  }

  public getDiffStop(ratio_profit: number) {
    if (ratio_profit <= 0.05) {
      return 0.02;
    }
    if (ratio_profit <= 0.01 && ratio_profit > 0.05) {
      return 0.05;
    }
    return 0.04;
  }

  public calculatePStop = ({ p_open, p_claim }: TCalPStop): number => {
    const ratio_profit = Big(p_claim).minus(p_open).abs().div(p_open).toNumber();
    const future_diff_stop = this.getDiffStop(ratio_profit);
    let p_stop: number;

    if (Big(p_claim).gt(p_open)) {
      p_stop = Big(p_open)
        .minus(Big(p_open).times(Big(ratio_profit).plus(future_diff_stop)))
        .toNumber();
    } else {
      p_stop = Big(p_open)
        .plus(Big(p_open).times(Big(ratio_profit).plus(future_diff_stop)))
        .toNumber();
    }
    return p_stop;
  };

  public calculateLeverage(p_open: number, p_stop: number) {
    return Math.floor(Big(p_open).div(Big(p_open).minus(p_stop).abs()).toNumber());
  }

  public calculateQClaim({ margin, p_open, p_claim, hedge, dayChangeToken, periodUnit }: TCalQClaim) {
    const p_stop = this.calculatePStop({ p_open, p_claim, hedge });
    const leverage = this.calculateLeverage(p_open, p_stop);
    const ratio_predict = Big(p_claim).minus(p_open).abs().div(p_open).toNumber();
    const user_capital = margin;
    const system_risk = this.calculateSystemRisk({ p_stop, p_open, dayChangeToken });
    const system_capital = this.calculateSystemCapital({ margin, system_risk });
    const hedge_capital = Big(user_capital).add(system_capital).toNumber();
    const profit = Big(ratio_predict).times(hedge_capital).times(leverage).toNumber();

    const ratio = (periodUnit === PERIOD_UNIT.HOUR ? CONFIG.Q_CLAIM_CONFIG_HOUR : CONFIG.Q_CLAIM_CONFIG_DAY).reduce(
      (prev, curr) => {
        const currHedge = Big(curr.hedge).minus(hedge).abs();
        const prevHedge = Big(prev.hedge).minus(hedge).abs();
        return Big(currHedge).lt(prevHedge) ? curr : prev;
      },
    );
    const q_claim = Big(profit)
      .times(Big(1).minus(this.diff_claim))
      .times(Big(1).minus(ratio.x))
      .plus(margin)
      .toNumber();

    return q_claim;
  }

  public calculatePRefund(p_open: number, p_claim: number) {
    const isBull = Big(p_claim).gt(p_open);
    return Number(Big(p_open).times(isBull ? 1 + this.refund_ratio : 1 - this.refund_ratio));
  }

  public calculateHedge(number1: number, number2: number) {
    return Big(number1).div(number2).toNumber();
  }

  public calculateQuantityFuture({ p_open, p_claim, hedge, margin, dayChangeToken }: TCalQuantityFuture) {
    const p_stop = this.calculatePStop({ p_open, p_claim, hedge });
    const leverage = Math.floor(p_open / Math.abs(p_open - p_stop));
    const user_capital = margin;
    const system_risk = this.calculateSystemRisk({ p_stop, p_open, dayChangeToken });
    const system_capital = this.calculateSystemCapital({ margin, system_risk });
    const hedge_capital = Big(user_capital).plus(system_capital);
    const qty = hedge_capital.times(leverage).div(p_open).toNumber();
    return qty;
  }

  public calculateExpired(params: TCalExpired): number {
    const { period, periodUnit } = params;
    let expired: number;
    switch (periodUnit) {
      case PERIOD_UNIT.DAY:
        expired = new Date(
          new Date().getTime() + parseInt(period as unknown as string) * 60 * 60 * 1000 * 24,
        ).getTime();
        break;
      case PERIOD_UNIT.HOUR:
        expired = new Date(new Date().getTime() + parseInt(period as unknown as string) * 60 * 60 * 1000).getTime();
        break;
    }
    return expired;
  }

  public formatDecimalUsdt(amount: number) {
    return Big(amount).toFixed(this.decimal_usdt); // decimal usdt = 2
  }

  public getMaxPeriod(hedge: number, list_ratio_change: Array<number>) {
    let max_period_user = 1;
    const max = Math.min(list_ratio_change.length, this.max_period);
    // new logic https://docs.google.com/document/d/1KDoovJg-l_2JfQXZhraqCg9NhAbHJdZ5o98D_xrAL30/edit#heading=h.4zejuwqr0ou0
    for (let i = 1; i < max; i++) {
      if (hedge > list_ratio_change[i - 1]) {
        const diff_previous = Big(list_ratio_change[i - 1])
          .minus(hedge)
          .abs();
        const diff_current = Big(list_ratio_change[i]).minus(hedge).abs();
        if (diff_previous.lt(diff_current)) {
          max_period_user = i;
        } else {
          max_period_user = i + 1;
        }
      } else {
        break;
      }
    }
    return max_period_user;
  }

  public getDistancePClaim(params: TGetDistancePClaim) {
    const { p_market, current_avg, list_avg, side } = params;
    if (side === ENUM_INSURANCE_SIDE.BEAR) {
      const min_avg = this.getMinAvg(list_avg);
      const claim_price_max = Big(this.constant_claim).minus(current_avg).times(p_market).toNumber();
      const claim_price_min = Big(this.constant_claim).minus(min_avg).times(p_market).toNumber();

      return { claim_price_max, claim_price_min };
    } else {
      const min_avg = this.getMinAvg(list_avg);
      const claim_price_min = Big(this.constant_claim).plus(current_avg).times(p_market).toNumber();
      const claim_price_max = Big(this.constant_claim).plus(min_avg).times(p_market).toNumber();

      return { claim_price_min, claim_price_max };
    }
  }

  public getMinAvg(list_avg: Array<number>): number {
    const max = Math.min(list_avg.length, this.max_period);
    let min_avg = 0;
    for (let i = 1; i < max; i++) {
      if (list_avg[i] > this.constant_claim) {
        min_avg = list_avg[i - 1];
        break;
      } else {
        min_avg = list_avg[i];
      }
    }

    return min_avg;
  }
}
