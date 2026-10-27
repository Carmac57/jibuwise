/**
 * JibuWise Fuel & Commute Cost Engine
 * 
 * Sources:
 * - Energy and Petroleum Regulatory Authority (EPRA)
 *   Maximum Retail Pump Prices (Nairobi)
 *   Official Gazette Release (15 Oct 2026 – 14 Nov 2026):
 *   https://www.epra.go.ke/index.php/maximum-retail-petroleum-prices-kenya-period-15th-october-2026-14th-november-2026
 */

export interface EpraPriceBenchmark {
  fuelType: 'super-petrol' | 'diesel' | 'kerosene';
  name: string;
  pricePerLiter: number;
  location: string;
  pricingCycle: string;
  effectiveFrom: string;
  effectiveTo: string;
  sourceUrl: string;
  isOfficialGazettedMax: boolean;
}

export const EPRA_NAIROBI_BENCHMARK: Record<string, EpraPriceBenchmark> = {
  superPetrol: {
    fuelType: 'super-petrol',
    name: 'Super Petrol (PMS)',
    pricePerLiter: 214.03,
    location: 'Nairobi',
    pricingCycle: '15 Oct 2026 – 14 Nov 2026',
    effectiveFrom: '2026-10-15',
    effectiveTo: '2026-11-14',
    sourceUrl: 'https://www.epra.go.ke/index.php/maximum-retail-petroleum-prices-kenya-period-15th-october-2026-14th-november-2026',
    isOfficialGazettedMax: true,
  },
  diesel: {
    fuelType: 'diesel',
    name: 'Automotive Gas Oil (AGO/Diesel)',
    pricePerLiter: 217.86,
    location: 'Nairobi',
    pricingCycle: '15 Oct 2026 – 14 Nov 2026',
    effectiveFrom: '2026-10-15',
    effectiveTo: '2026-11-14',
    sourceUrl: 'https://www.epra.go.ke/index.php/maximum-retail-petroleum-prices-kenya-period-15th-october-2026-14th-november-2026',
    isOfficialGazettedMax: true,
  },
  kerosene: {
    fuelType: 'kerosene',
    name: 'Illuminating Kerosene (IK)',
    pricePerLiter: 191.38,
    location: 'Nairobi',
    pricingCycle: '15 Oct 2026 – 14 Nov 2026',
    effectiveFrom: '2026-10-15',
    effectiveTo: '2026-11-14',
    sourceUrl: 'https://www.epra.go.ke/index.php/maximum-retail-petroleum-prices-kenya-period-15th-october-2026-14th-november-2026',
    isOfficialGazettedMax: true,
  },
};

export interface FuelCalculationInputs {
  oneWayDistanceKm: number;
  tripType: 'oneway' | 'roundtrip' | 'commute';
  mileageUnit: 'kml' | 'l100km';
  fuelEfficiency: number;
  fuelPricePerLiter: number;
  passengers?: number;
}

export interface FuelCalculationResult {
  oneWayDistanceKm: number;
  totalTripDistanceKm: number;
  tripMultiplier: number;
  litersConsumed: number;
  totalTripCost: number;
  costPerKm: number;
  passengers: number;
  costPerPerson: number;
  singleRoundTripCost: number;
  monthlyCommuteCost: number; // 22 work days = 44 trips
  annualCommuteCost: number; // 12 months
}

/**
 * Calculates fuel consumption, journey cost, and carpool split with clean rounding.
 */
export function calculateFuelCommute(inputs: FuelCalculationInputs): FuelCalculationResult {
  const rawDist = Math.max(0, inputs.oneWayDistanceKm || 0);
  const eff = Math.max(0.1, inputs.fuelEfficiency || 1);
  const price = Math.max(0, inputs.fuelPricePerLiter || 0);
  const riders = Math.max(1, inputs.passengers || 1);

  let multiplier = 1;
  if (inputs.tripType === 'roundtrip') {
    multiplier = 2;
  } else if (inputs.tripType === 'commute') {
    multiplier = 44; // 22 work days * 2 trips/day
  }

  const totalTripDistanceKm = rawDist * multiplier;

  // Liters consumed calculation
  let liters = 0;
  if (inputs.mileageUnit === 'kml') {
    liters = totalTripDistanceKm / eff;
  } else {
    liters = (totalTripDistanceKm * eff) / 100;
  }
  liters = Math.round(liters * 100) / 100;

  const totalTripCost = Math.round(liters * price * 100) / 100;
  const costPerKm = totalTripDistanceKm > 0 ? Math.round((totalTripCost / totalTripDistanceKm) * 100) / 100 : 0;
  const costPerPerson = Math.round((totalTripCost / riders) * 100) / 100;

  // Monthly commute (44 one-way trips) and Annual projections
  let singleRoundTripLiters = 0;
  if (inputs.mileageUnit === 'kml') {
    singleRoundTripLiters = (rawDist * 2) / eff;
  } else {
    singleRoundTripLiters = (rawDist * 2 * eff) / 100;
  }
  const singleRoundTripCost = Math.round(singleRoundTripLiters * price * 100) / 100;
  const monthlyCommuteCost = Math.round(singleRoundTripCost * 22 * 100) / 100;
  const annualCommuteCost = Math.round(monthlyCommuteCost * 12 * 100) / 100;

  return {
    oneWayDistanceKm: rawDist,
    totalTripDistanceKm,
    tripMultiplier: multiplier,
    litersConsumed: liters,
    totalTripCost,
    costPerKm,
    passengers: riders,
    costPerPerson,
    singleRoundTripCost,
    monthlyCommuteCost,
    annualCommuteCost,
  };
}
