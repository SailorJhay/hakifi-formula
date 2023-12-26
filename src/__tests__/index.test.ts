import { ENUM_INSURANCE_SIDE, InsuranceFormula, PERIOD_UNIT } from '../index';

describe('Valid Formula', () => {
  const insuranceFormula: InsuranceFormula = new InsuranceFormula();

  describe('New Period', () => {
    const hedge = 0.5122;
    const avgConfig = [
      0.04, 0.074, 0.108, 0.142, 0.176, 0.21, 0.244, 0.278, 0.312, 0.346, 0.38, 0.414, 0.448, 0.482, 0.516,
    ];

    test('should match a max period', () => {
      const maxPeriod = insuranceFormula.getMaxPeriod(hedge, avgConfig);
      console.log('MAX PERIOD', maxPeriod);

      expect(maxPeriod).toEqual(15);
    });

    test('should match a min avg', () => {
      const minAvg = insuranceFormula.getMinAvg(avgConfig);
      console.log('MIN AVG', minAvg);

      expect(minAvg).toEqual(0.516);
    });

    test('should match a min and max p_claim - BULL', () => {
      const { claim_price_max, claim_price_min } = insuranceFormula.getDistancePClaim({
        p_market: 200,
        current_avg: 0.0607,
        list_avg: avgConfig,
        side: ENUM_INSURANCE_SIDE.BULL,
      });
      expect(claim_price_max).toEqual(303.2);
      expect(claim_price_min).toEqual(212.14);
    });

    test('should match a min and max p_claim - BEAR', () => {
      const { claim_price_max, claim_price_min } = insuranceFormula.getDistancePClaim({
        p_market: 200,
        current_avg: 0.0607,
        list_avg: avgConfig,
        side: ENUM_INSURANCE_SIDE.BEAR,
      });
      expect(claim_price_max).toEqual(187.86);
      expect(claim_price_min).toEqual(96.8);
      console.log('Min-Max pclaim ', claim_price_max, claim_price_min);
    });
  });

  describe('get Min-Max p_claim', () => {
    const hedge = 0.08;
    const avgConfig = [
      0.04, 0.07400000000000001, 0.1029, 0.127465, 0.14834524999999998, 0.16609346249999998, 0.18117944312499998,
      0.19400252665624998, 0.20490214765781248, 0.2141668255091406, 0.2220418016827695, 0.22873553143035405,
      0.23442520171580095, 0.2392614214584308, 0.24337220823966618,
    ];

    const maxPeriod = insuranceFormula.getMaxPeriod(hedge, avgConfig);

    console.log('maxPeriod', maxPeriod);
  });

  // BEAR INSURANCE
  describe('Valid BEAR Insurance', () => {
    const margin = 500;
    const q_covered = 10000;
    const p_claim = 6.182;
    const p_open = 6.561;
    // const period = 1;
    const periodUnit = PERIOD_UNIT.DAY;
    const dayChangeToken = 0.0572;

    let p_stop: number;

    test('should match a valid Q-Claim', () => {
      const hedge = insuranceFormula.calculateHedge(margin, q_covered);

      const q_claim = insuranceFormula.calculateQClaim({
        margin,
        dayChangeToken,
        hedge,
        p_claim,
        p_open,
        periodUnit,
      });
      expect(q_claim).toEqual(1023.3393372000332);
    });

    test('should match a valid P-Stop BEAR', () => {
      const hedge = insuranceFormula.calculateHedge(margin, q_covered);
      p_stop = insuranceFormula.calculatePStop({ p_open, p_claim, hedge });
      expect(p_stop).toEqual(7.20244);
    });

    test('should match a valid Leverage', () => {
      const rightLeverage = Math.floor(p_open / Math.abs(p_open - p_stop));

      expect(insuranceFormula.calculateLeverage(p_open, p_stop)).toEqual(rightLeverage);
    });

    test('should match a valid Binance Quantity', () => {
      const hedge = insuranceFormula.calculateHedge(margin, q_covered);
      const quantity = insuranceFormula.calculateQuantityFuture({
        p_claim,
        p_open,
        hedge,
        margin,
        dayChangeToken,
      });

      expect(quantity).toEqual(1726.053222955255);
    });
  });

  // BULL INSURANCE
  describe('Valid BULL Insurance', () => {
    const margin = 0.25;
    const q_covered = 5;
    const p_claim = 0.17066;
    const p_open = 0.16365;
    const period = 4;
    const periodUnit = PERIOD_UNIT.DAY;
    const dayChangeToken = 0.14484;

    let p_stop: number;

    test('should match a valid Q-Claim', () => {
      const hedge = insuranceFormula.calculateHedge(margin, q_covered);

      const q_claim = insuranceFormula.calculateQClaim({
        margin,
        dayChangeToken,
        hedge,
        p_claim,
        p_open,
        periodUnit,
      });
      expect(q_claim).toEqual(0.4258927705711511);
    });

    test('should match a valid P-Stop', () => {
      const hedge = insuranceFormula.calculateHedge(margin, q_covered);
      p_stop = insuranceFormula.calculatePStop({ p_open, p_claim, hedge });
      expect(p_stop).toEqual(0.153367);
    });

    test('should match a valid Leverage', () => {
      const rightLeverage = Math.floor(p_open / Math.abs(p_open - p_stop));

      expect(insuranceFormula.calculateLeverage(p_open, p_stop)).toEqual(rightLeverage);
    });

    test('should match a valid Binance Quantity', () => {
      const hedge = insuranceFormula.calculateHedge(margin, q_covered);
      const quantity = insuranceFormula.calculateQuantityFuture({
        p_claim,
        p_open,
        hedge,
        margin,
        dayChangeToken,
      });

      expect(quantity).toEqual(31.364616720961322);
    });
  });
});
