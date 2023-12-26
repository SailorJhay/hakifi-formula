# Hakifi Formula

## Installation

### Installing by `main` branch

> `yarn add git+ssh://git@bitbucket.org:namicorp/hakifi-formula.git`

### Installing by `tag` version

> `yarn add git+ssh://git@bitbucket.org:namicorp/hakifi-formula.git#v1.0`

## Usage

```typescript
import { InsuranceFormula, PERIOD_UNIT } from 'hakifi-formula';

const changeAvg = 0.0699;

const margin = 500;
const q_covered = 10000;
const p_claim = 6.182;
const p_open = 6.561;
const periodUnit = PERIOD_UNIT.DAY;
const dayChangeToken = 0.0572;

const formula = new InsuranceFormula();

const hedge = formula.calculateHedge(margin, q_covered);

const q_claim = formula.calculateQClaim({
  margin,
  dayChangeToken,
  hedge,
  p_claim,
  p_open,
  periodUnit,
});

console.log(q_claim);
```
