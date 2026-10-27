/**
 * Comprehensive Calculation Regression Test Suite for JibuWise
 * 
 * Tests:
 * 1. NSSF Year 4 (2026) contribution boundaries, Tier I and Tier II ceilings
 * 2. NSSF Year 3 and Year 2 historical boundaries
 * 3. Kenya PAYE: Statutory treatment of SHIF (2.75%) and Affordable Housing Levy (1.5%)
 *    as allowable pre-tax deductions under Section 15(2) of the Income Tax Act
 * 4. Section 31 Qualifying Private Insurance Relief vs Section 15(2) SHIF deduction
 *    (preventing double tax deduction / relief)
 * 5. Full Net Salary Reconciliation across representative salary brackets:
 *    KES 20,000 (Low / Nil PAYE), KES 50,000 (Median), KES 100,000 (Standard),
 *    KES 150,000 (Above UEL), and KES 900,000 (High / 32.5% & 35% bands)
 * 6. Edge cases: Disability exemption (KES 150,000/mo), voluntary pension deduction limit (KES 30,000/mo)
 * 7. EPRA Gazetted Nairobi Fuel Benchmarks (15 Oct – 14 Nov 2026):
 *    Super Petrol KES 214.03/L, Diesel KES 217.86/L, Kerosene KES 191.38/L
 * 8. Fuel & commute calculations: One-way, round-trip, commute (22d), km/L vs L/100km equivalence, carpool split
 */

import { calculateNssf, calculateKenyaPaye, NSSF_SCHEDULES } from './payeCalculator';
import { calculateFuelCommute, EPRA_NAIROBI_BENCHMARK } from './fuelCalculator';
import { parseRoute } from './routes';

interface TestFailure {
  testName: string;
  expected: any;
  received: any;
}

export function runCalculationTests(): {
  total: number;
  passed: number;
  failed: number;
  failures: TestFailure[];
} {
  const failures: TestFailure[] = [];
  let total = 0;
  let passed = 0;

  function assert(testName: string, actual: any, expected: any) {
    total++;
    // Float comparison tolerance
    const isFloat = typeof actual === 'number' && typeof expected === 'number';
    const match = isFloat ? Math.abs(actual - expected) < 0.05 : actual === expected;
    if (match) {
      passed++;
    } else {
      failures.push({ testName, expected, received: actual });
      console.error(`FAIL: ${testName} | Expected: ${expected}, Received: ${actual}`);
    }
  }

  // =========================================================================
  // 1. NSSF Year 4 (2026) Boundary Tests
  // =========================================================================
  const nssfZero = calculateNssf(0, 'year4');
  assert('NSSF Year 4: Gross KES 0 -> Total KES 0', nssfZero.total, 0);

  // Below LEL: KES 5,000
  const nssf5k = calculateNssf(5000, 'year4');
  assert('NSSF Year 4: Gross KES 5,000 -> Tier 1 is KES 300', nssf5k.tier1, 300);
  assert('NSSF Year 4: Gross KES 5,000 -> Tier 2 is KES 0', nssf5k.tier2, 0);
  assert('NSSF Year 4: Gross KES 5,000 -> Total is KES 300', nssf5k.total, 300);

  // Exact LEL: KES 9,000 (Tier I maximum)
  const nssf9k = calculateNssf(9000, 'year4');
  assert('NSSF Year 4: Gross KES 9,000 (LEL) -> Tier 1 is KES 540', nssf9k.tier1, 540);
  assert('NSSF Year 4: Gross KES 9,000 (LEL) -> Tier 2 is KES 0', nssf9k.tier2, 0);
  assert('NSSF Year 4: Gross KES 9,000 (LEL) -> Total is KES 540', nssf9k.total, 540);

  // Mid Tier II: KES 50,000
  const nssf50k = calculateNssf(50000, 'year4');
  assert('NSSF Year 4: Gross KES 50,000 -> Tier 1 is KES 540', nssf50k.tier1, 540);
  assert('NSSF Year 4: Gross KES 50,000 -> Tier 2 is KES 2,460', nssf50k.tier2, 2460);
  assert('NSSF Year 4: Gross KES 50,000 -> Total is KES 3,000', nssf50k.total, 3000);

  // Exact UEL: KES 108,000 (Statutory maximum)
  const nssf108k = calculateNssf(108000, 'year4');
  assert('NSSF Year 4: Gross KES 108,000 (UEL) -> Tier 1 is KES 540', nssf108k.tier1, 540);
  assert('NSSF Year 4: Gross KES 108,000 (UEL) -> Tier 2 is KES 5,940', nssf108k.tier2, 5940);
  assert('NSSF Year 4: Gross KES 108,000 (UEL) -> Total is KES 6,480', nssf108k.total, 6480);

  // Above UEL: KES 250,000 (Must remain strictly capped at 6,480)
  const nssf250k = calculateNssf(250000, 'year4');
  assert('NSSF Year 4: Gross KES 250,000 -> Tier 1 is capped at KES 540', nssf250k.tier1, 540);
  assert('NSSF Year 4: Gross KES 250,000 -> Tier 2 is capped at KES 5,940', nssf250k.tier2, 5940);
  assert('NSSF Year 4: Gross KES 250,000 -> Total is capped at KES 6,480', nssf250k.total, 6480);

  // =========================================================================
  // 2. Historical NSSF Schedule Regression Tests
  // =========================================================================
  // Year 3 (2025): LEL 8,000 (480), UEL 72,000 (3,840), max 4,320
  const nssfY3 = calculateNssf(150000, 'year3');
  assert('NSSF Year 3: Max contribution is KES 4,320', nssfY3.total, 4320);
  assert('NSSF Year 3: Tier 1 max is KES 480', nssfY3.tier1, 480);
  assert('NSSF Year 3: Tier 2 max is KES 3,840', nssfY3.tier2, 3840);

  // Year 2 (2024): LEL 7,000 (420), UEL 36,000 (1,740), max 2,160
  const nssfY2 = calculateNssf(150000, 'year2');
  assert('NSSF Year 2: Max contribution is KES 2,160', nssfY2.total, 2160);
  assert('NSSF Year 2: Tier 1 max is KES 420', nssfY2.tier1, 420);
  assert('NSSF Year 2: Tier 2 max is KES 1,740', nssfY2.tier2, 1740);

  // =========================================================================
  // 3. Kenya PAYE Statutory Treatment: Allowable Deductions vs Reliefs
  // =========================================================================

  // Test Case: Gross KES 100,000 under current Year 4 (2026) NSSF, SHIF, and AHL
  // 1. NSSF: Tier 1 = 540, Tier 2 = (100k - 9k)*0.06 = 5,460. Total NSSF = 6,000
  // 2. SHIF: 100,000 * 0.0275 = 2,750
  // 3. AHL: 100,000 * 0.015 = 1,500
  // 4. Total Allowable Deductions (Section 15(2)) = 6,000 + 2,750 + 1,500 = 10,250
  // 5. Taxable Employment Income = 100,000 - 10,250 = 89,750
  // 6. Gross Tax on 89,750:
  //    Band 1 (24,000) @ 10% = 2,400.00
  //    Band 2 (8,333.33) @ 25% = 2,083.33
  //    Band 3 (89,750 - 32,333.33 = 57,416.67) @ 30% = 17,225.00
  //    Total Gross Tax = 2,400 + 2,083.33 + 17,225.00 = 21,708.33
  // 7. Statutory Reliefs:
  //    Personal Relief = 2,400.00
  //    Insurance Relief = 0 (SHIF is deducted pre-tax under Sec 15; not an insurance relief under Sec 31)
  //    Housing Relief = 0 (AHL is deducted pre-tax under Sec 15; Sec 30A relief ceased)
  //    Total Relief = 2,400.00
  // 8. Net PAYE = 21,708.33 - 2,400.00 = 19,308.33
  // 9. Total Deductions = 19,308.33 (PAYE) + 6,000 (NSSF) + 2,750 (SHIF) + 1,500 (AHL) = 29,558.33
  // 10. Net Take-Home Pay = 100,000 - 29,558.33 = 70,441.67
  const paye100k = calculateKenyaPaye({
    basicSalary: 100000,
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
  });

  assert('PAYE: NSSF on KES 100,000 is KES 6,000', paye100k.totalNssf, 6000);
  assert('PAYE: SHIF on KES 100,000 is KES 2,750', paye100k.healthInsurance, 2750);
  assert('PAYE: Housing Levy on KES 100,000 is KES 1,500', paye100k.housingLevy, 1500);
  assert('PAYE: Total allowable pre-tax deductions is KES 10,250', paye100k.totalAllowableDeductions, 10250);
  assert('PAYE: Taxable pay is KES 89,750 (Gross - NSSF - SHIF - AHL)', paye100k.taxablePay, 89750);
  assert('PAYE: Gross tax on KES 89,750 is KES 21,708.33', paye100k.grossTax, 21708.33);
  assert('PAYE: Personal relief is KES 2,400', paye100k.personalRelief, 2400);
  assert('PAYE: No separate SHIF insurance relief (avoiding double benefit)', paye100k.insuranceRelief, 0);
  assert('PAYE: No separate Housing Relief when AHL is deducted under Sec 15', paye100k.housingRelief, 0);
  assert('PAYE: Net PAYE is KES 19,308.33', paye100k.payeTax, 19308.33);
  assert('PAYE: Total employee deductions is KES 29,558.33', paye100k.totalDeductions, 29558.33);
  assert('PAYE: Net Take-Home Pay is KES 70,441.67', paye100k.netPay, 70441.67);
  assert('PAYE: Net Pay + Total Deductions strictly equals Gross Pay', paye100k.netPay + paye100k.totalDeductions, 100000);

  // =========================================================================
  // 4. Representative Salary Bracket Reconciliation Tests
  // =========================================================================

  // --- Case A: Low Income (KES 20,000) ---
  // Gross = 20,000
  // NSSF = 540 + (11,000 * 0.06) = 540 + 660 = 1,200
  // SHIF = 20,000 * 0.0275 = 550
  // AHL = 20,000 * 0.015 = 300
  // Allowable deductions = 1,200 + 550 + 300 = 2,050
  // Taxable pay = 20,000 - 2,050 = 17,950
  // Gross tax = 17,950 * 0.10 = 1,795.00
  // Personal relief = 2,400 -> Net PAYE = 0 (Relief covers tax)
  // Total deductions = 1,200 + 550 + 300 = 2,050
  // Net Pay = 17,950
  const paye20k = calculateKenyaPaye({
    basicSalary: 20000,
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
  });
  assert('PAYE 20k: Taxable pay is KES 17,950', paye20k.taxablePay, 17950);
  assert('PAYE 20k: Gross tax is KES 1,795.00', paye20k.grossTax, 1795);
  assert('PAYE 20k: Net PAYE is KES 0.00 (covered by Personal Relief)', paye20k.payeTax, 0);
  assert('PAYE 20k: Net Pay is KES 17,950.00', paye20k.netPay, 17950);
  assert('PAYE 20k: Reconciliation holds (Net + Deductions == Gross)', paye20k.netPay + paye20k.totalDeductions, 20000);

  // --- Case B: Median Income (KES 50,000) ---
  // Gross = 50,000
  // NSSF = 540 + (41,000 * 0.06) = 540 + 2,460 = 3,000
  // SHIF = 50,000 * 0.0275 = 1,375
  // AHL = 50,000 * 0.015 = 750
  // Allowable deductions = 3,000 + 1,375 + 750 = 5,125
  // Taxable pay = 50,000 - 5,125 = 44,875
  // Gross tax:
  // Band 1: 24,000 * 0.10 = 2,400.00
  // Band 2: 8,333.33 * 0.25 = 2,083.33
  // Band 3: (44,875 - 32,333.33 = 12,541.67) * 0.30 = 3,762.50
  // Total Gross tax = 8,245.83
  // Net PAYE = 8,245.83 - 2,400 = 5,845.83
  // Total deductions = 5,845.83 + 3,000 + 1,375 + 750 = 10,970.83
  // Net Pay = 50,000 - 10,970.83 = 39,029.17
  const paye50k = calculateKenyaPaye({
    basicSalary: 50000,
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
  });
  assert('PAYE 50k: Taxable pay is KES 44,875.00', paye50k.taxablePay, 44875);
  assert('PAYE 50k: Gross tax is KES 8,245.83', paye50k.grossTax, 8245.83);
  assert('PAYE 50k: Net PAYE is KES 5,845.83', paye50k.payeTax, 5845.83);
  assert('PAYE 50k: Net Pay is KES 39,029.17', paye50k.netPay, 39029.17);
  assert('PAYE 50k: Reconciliation holds', paye50k.netPay + paye50k.totalDeductions, 50000);

  // --- Case C: Above UEL Income (KES 150,000) ---
  // Gross = 150,000
  // NSSF = capped at 6,480
  // SHIF = 150,000 * 0.0275 = 4,125
  // AHL = 150,000 * 0.015 = 2,250
  // Allowable deductions = 6,480 + 4,125 + 2,250 = 12,855
  // Taxable pay = 150,000 - 12,855 = 137,145
  // Gross tax:
  // Band 1: 24,000 * 0.10 = 2,400.00
  // Band 2: 8,333.33 * 0.25 = 2,083.33
  // Band 3: (137,145 - 32,333.33 = 104,811.67) * 0.30 = 31,443.50
  // Total Gross tax = 35,926.83
  // Net PAYE = 35,926.83 - 2,400 = 33,526.83
  // Total deductions = 33,526.83 + 6,480 + 4,125 + 2,250 = 46,381.83
  // Net Pay = 150,000 - 46,381.83 = 103,618.17
  const paye150k = calculateKenyaPaye({
    basicSalary: 150000,
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
  });
  assert('PAYE 150k: Taxable pay is KES 137,145.00', paye150k.taxablePay, 137145);
  assert('PAYE 150k: Gross tax is KES 35,926.83', paye150k.grossTax, 35926.83);
  assert('PAYE 150k: Net PAYE is KES 33,526.83', paye150k.payeTax, 33526.83);
  assert('PAYE 150k: Net Pay is KES 103,618.17', paye150k.netPay, 103618.17);
  assert('PAYE 150k: Reconciliation holds', paye150k.netPay + paye150k.totalDeductions, 150000);

  // --- Case D: High Income (KES 900,000) — reaching 32.5% and 35% bands ---
  // Gross = 900,000
  // NSSF = capped at 6,480
  // SHIF = 900,000 * 0.0275 = 24,750
  // AHL = 900,000 * 0.015 = 13,500
  // Allowable deductions = 6,480 + 24,750 + 13,500 = 44,730
  // Taxable pay = 900,000 - 44,730 = 855,270
  // Gross tax:
  // Band 1: 24,000 * 0.10 = 2,400.00
  // Band 2: 8,333.33 * 0.25 = 2,083.33
  // Band 3: 467,666.67 * 0.30 = 140,300.00
  // Band 4: 300,000 * 0.325 = 97,500.00
  // Band 5: (855,270 - 800,000 = 55,270) * 0.35 = 19,344.50
  // Total Gross tax = 2,400 + 2,083.33 + 140,300 + 97,500 + 19,344.50 = 261,627.83
  // Net PAYE = 261,627.83 - 2,400 = 259,227.83
  // Total deductions = 259,227.83 + 6,480 + 24,750 + 13,500 = 303,957.83
  // Net Pay = 900,000 - 303,957.83 = 596,042.17
  const paye900k = calculateKenyaPaye({
    basicSalary: 90000,
    benefits: 810000, // total 900,000
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
  });
  assert('PAYE 900k: Taxable pay is KES 855,270.00', paye900k.taxablePay, 855270);
  assert('PAYE 900k: Gross tax reaches 35% band (KES 261,627.83)', paye900k.grossTax, 261627.83);
  assert('PAYE 900k: Net PAYE is KES 259,227.83', paye900k.payeTax, 259227.83);
  assert('PAYE 900k: Net Pay is KES 596,042.17', paye900k.netPay, 596042.17);
  assert('PAYE 900k: Reconciliation holds', paye900k.netPay + paye900k.totalDeductions, 900000);

  // =========================================================================
  // 5. Special Tax Provisions & Edge Cases
  // =========================================================================

  // Test Case: Section 31 Qualifying Private Insurance Relief
  // An employee with KES 10,000/mo private life/education insurance premium receives 15% relief = 1,500
  const payeWithPrivateInsurance = calculateKenyaPaye({
    basicSalary: 100000,
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
    qualifyingInsurancePremium: 10000,
  });
  assert('PAYE: Private insurance relief (15% of 10k) is KES 1,500', payeWithPrivateInsurance.insuranceRelief, 1500);
  assert('PAYE: Total relief includes personal (2,400) + private insurance (1,500) = 3,900', payeWithPrivateInsurance.totalRelief, 3900);
  assert('PAYE: Net PAYE reflects private insurance tax credit (21,708.33 - 3,900 = 17,808.33)', payeWithPrivateInsurance.payeTax, 17808.33);

  // Test Case: Disability Exemption (first KES 150,000 exempt under certified NCPWD/KRA status)
  const payeDisability = calculateKenyaPaye({
    basicSalary: 160000,
    hasDisabilityExemption: true,
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: true,
  });
  // Without disability exemption, taxable pay would be 160,000 - 13,280 = 146,720 (< 150k exempt), so taxable pay becomes 0!
  assert('PAYE Disability: Taxable pay becomes 0 when below KES 150,000 exemption limit', payeDisability.taxablePay, 0);
  assert('PAYE Disability: PAYE tax is 0', payeDisability.payeTax, 0);

  // Test Case: Pension deduction limit (KES 30,000/mo ceiling)
  const payePension = calculateKenyaPaye({
    basicSalary: 100000,
    voluntaryPension: 40000, // exceeds KES 30,000 limit
    nssfSchedule: 'year4',
    insuranceScheme: 'shif',
    housingLevyEnabled: false,
  });
  assert('PAYE Pension: Allowable pension is capped at KES 30,000/month', payePension.allowablePension, 30000);

  // =========================================================================
  // 6. EPRA Fuel Benchmarks & Commute Tests
  // =========================================================================

  // Test Case: Verify EPRA Nairobi Benchmarks (15 Oct – 14 Nov 2026 Cycle)
  assert('EPRA Benchmark: Super Petrol price is KES 214.03', EPRA_NAIROBI_BENCHMARK.superPetrol.pricePerLiter, 214.03);
  assert('EPRA Benchmark: Diesel price is KES 217.86', EPRA_NAIROBI_BENCHMARK.diesel.pricePerLiter, 217.86);
  assert('EPRA Benchmark: Kerosene price is KES 191.38', EPRA_NAIROBI_BENCHMARK.kerosene.pricePerLiter, 191.38);
  assert('EPRA Benchmark: Location is Nairobi', EPRA_NAIROBI_BENCHMARK.superPetrol.location, 'Nairobi');
  assert('EPRA Benchmark: Pricing cycle is 15 Oct 2026 – 14 Nov 2026', EPRA_NAIROBI_BENCHMARK.superPetrol.pricingCycle, '15 Oct 2026 – 14 Nov 2026');
  assert('EPRA Benchmark: Exact official URL is configured', EPRA_NAIROBI_BENCHMARK.superPetrol.sourceUrl.includes('maximum-retail-petroleum-prices-kenya-period-15th-october-2026-14th-november-2026'), true);

  // Test Case A: One-way trip 50 km @ 10 km/L, price KES 214.03 (EPRA Nairobi Super Petrol)
  const fuelOneWay = calculateFuelCommute({
    oneWayDistanceKm: 50,
    tripType: 'oneway',
    mileageUnit: 'kml',
    fuelEfficiency: 10,
    fuelPricePerLiter: 214.03,
    passengers: 1,
  });
  assert('Fuel: One-way distance 50 km', fuelOneWay.totalTripDistanceKm, 50);
  assert('Fuel: 50 km at 10 km/L consumes 5 Liters', fuelOneWay.litersConsumed, 5);
  assert('Fuel: 5 Liters * 214.03 = KES 1,070.15', fuelOneWay.totalTripCost, 1070.15);
  assert('Fuel: Cost per km is KES 21.40', fuelOneWay.costPerKm, 21.4);

  // Test Case B: Round-trip distance multiplication and carpool split
  const fuelRoundTrip = calculateFuelCommute({
    oneWayDistanceKm: 50,
    tripType: 'roundtrip',
    mileageUnit: 'kml',
    fuelEfficiency: 10,
    fuelPricePerLiter: 214.03,
    passengers: 2, // 2 passengers split
  });
  assert('Fuel: Round-trip distance is 100 km', fuelRoundTrip.totalTripDistanceKm, 100);
  assert('Fuel: Round-trip consumes 10 Liters', fuelRoundTrip.litersConsumed, 10);
  assert('Fuel: Total round-trip cost is KES 2,140.30', fuelRoundTrip.totalTripCost, 2140.3);
  assert('Fuel: Carpool split for 2 riders is KES 1,070.15 each', fuelRoundTrip.costPerPerson, 1070.15);

  // Test Case C: L/100km unit equivalence test (10 km/L is exactly 10 L/100km)
  const fuelL100km = calculateFuelCommute({
    oneWayDistanceKm: 50,
    tripType: 'roundtrip',
    mileageUnit: 'l100km',
    fuelEfficiency: 10,
    fuelPricePerLiter: 214.03,
    passengers: 2,
  });
  assert('Fuel: L/100km yields exact same liters as equivalent km/L', fuelL100km.litersConsumed, fuelRoundTrip.litersConsumed);
  assert('Fuel: L/100km yields exact same cost as equivalent km/L', fuelL100km.totalTripCost, fuelRoundTrip.totalTripCost);

  // Test Case D: Monthly Commute (22 days = 44 one-way trips)
  const fuelCommute = calculateFuelCommute({
    oneWayDistanceKm: 25,
    tripType: 'commute',
    mileageUnit: 'kml',
    fuelEfficiency: 12.5,
    fuelPricePerLiter: 214.03,
  });
  // 25 km * 44 = 1,100 km total
  assert('Fuel Commute: 22 working days equals 1,100 km', fuelCommute.totalTripDistanceKm, 1100);
  // 1,100 km / 12.5 km/L = 88 Liters
  assert('Fuel Commute: 88 Liters consumed in month', fuelCommute.litersConsumed, 88);
  // 88 Liters * 214.03 = KES 18,834.64
  assert('Fuel Commute: Monthly budget is KES 18,834.64', fuelCommute.totalTripCost, 18834.64);

  // -------------------------------------------------------------
  // SECTION 7: Path-Based Routing, Canonical Paths & Legacy Migration
  // -------------------------------------------------------------
  const routeHome = parseRoute('/');
  assert('Route: Root / maps to home view', routeHome.view, 'home');
  assert('Route: Root / canonical path is /', routeHome.canonicalPath, '/');

  const routeTools = parseRoute('/tools');
  assert('Route: /tools maps to all-tools view', routeTools.view, 'all-tools');
  assert('Route: /tools canonical path is /tools', routeTools.canonicalPath, '/tools');

  const routePaye = parseRoute('/tools/kenya-paye-salary-calculator');
  assert('Route: /tools/kenya-paye-salary-calculator maps to tool', routePaye.view, 'tool');
  assert('Route: PAYE slug is kenya-paye-salary-calculator', routePaye.param, 'kenya-paye-salary-calculator');

  const routeMpesa = parseRoute('/tools/mpesa-charges-calculator');
  assert('Route: /tools/mpesa-charges-calculator maps to tool', routeMpesa.view, 'tool');
  assert('Route: Mpesa slug is mpesa-charges-calculator', routeMpesa.param, 'mpesa-charges-calculator');

  const routeLoan = parseRoute('/tools/loan-mortgage-emi-calculator');
  assert('Route: /tools/loan-mortgage-emi-calculator maps to tool', routeLoan.view, 'tool');
  assert('Route: Loan slug is loan-mortgage-emi-calculator', routeLoan.param, 'loan-mortgage-emi-calculator');

  const routeFuel = parseRoute('/tools/fuel-cost-commute-calculator');
  assert('Route: /tools/fuel-cost-commute-calculator maps to tool', routeFuel.view, 'tool');
  assert('Route: Fuel primary slug resolved', routeFuel.param, 'fuel-cost-commute-calculator');

  const routeFuelAlias = parseRoute('/tools/fuel-commute-cost-calculator');
  assert('Route: /tools/fuel-commute-cost-calculator alias resolves to tool', routeFuelAlias.view, 'tool');
  assert('Route: Fuel alias resolves to canonical slug', routeFuelAlias.param, 'fuel-cost-commute-calculator');

  const routeStamp = parseRoute('/tools/kenya-stamp-duty-land-transfer-calculator');
  assert('Route: Stamp duty maps to tool', routeStamp.view, 'tool');
  assert('Route: Stamp duty slug is kenya-stamp-duty-land-transfer-calculator', routeStamp.param, 'kenya-stamp-duty-land-transfer-calculator');

  const routeVat = parseRoute('/tools/vat-margin-markup-calculator');
  assert('Route: VAT maps to tool', routeVat.view, 'tool');
  assert('Route: VAT primary slug resolved', routeVat.param, 'vat-margin-markup-calculator');

  const routeVatAlias = parseRoute('/tools/vat-profit-margin-markup-calculator');
  assert('Route: VAT alias resolves to tool', routeVatAlias.view, 'tool');
  assert('Route: VAT alias resolves to canonical slug', routeVatAlias.param, 'vat-margin-markup-calculator');

  const routeCategory = parseRoute('/category/tax-salary');
  assert('Route: /category/tax-salary maps to category view', routeCategory.view, 'category');
  assert('Route: Category param is tax-salary', routeCategory.param, 'tax-salary');

  const routeInvalidCategory = parseRoute('/category/non-existent-cat');
  assert('Route: Invalid category maps to not-found', routeInvalidCategory.view, 'not-found');
  assert('Route: Invalid category flagged as isNotFound', routeInvalidCategory.isNotFound, true);

  const routeInvalidTool = parseRoute('/tools/non-existent-tool');
  assert('Route: Invalid tool maps to not-found', routeInvalidTool.view, 'not-found');
  assert('Route: Invalid tool flagged as isNotFound', routeInvalidTool.isNotFound, true);

  const routeUnknown = parseRoute('/some-random-unknown-page');
  assert('Route: Unknown path maps to not-found', routeUnknown.view, 'not-found');

  // Legacy hash migration tests
  const legacyHashTool = parseRoute('/', '#/tool/kenya-paye-salary-calculator');
  assert('Legacy Hash: #/tool/kenya-paye maps to tool view', legacyHashTool.view, 'tool');
  assert('Legacy Hash: #/tool/kenya-paye migrates to /tools/kenya-paye-salary-calculator', legacyHashTool.canonicalPath, '/tools/kenya-paye-salary-calculator');

  const legacyHashCategory = parseRoute('/', '#/category/property-land');
  assert('Legacy Hash: #/category/property-land maps to category view', legacyHashCategory.view, 'category');
  assert('Legacy Hash: #/category/property-land migrates to /category/property-land', legacyHashCategory.canonicalPath, '/category/property-land');

  const legacyHashAbout = parseRoute('/', '#/about');
  assert('Legacy Hash: #/about maps to about view', legacyHashAbout.view, 'about');
  assert('Legacy Hash: #/about migrates to /about', legacyHashAbout.canonicalPath, '/about');

  return { total, passed, failed: failures.length, failures };
}
