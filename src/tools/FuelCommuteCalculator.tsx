import React, { useState, useMemo } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { getToolBySlug } from '../config/tools';
import { formatCurrency, formatNumber } from '../config/site';
import { Input } from '../design-system/Input';
import { SegmentedControl } from '../design-system/SegmentedControl';
import { calculateFuelCommute, EPRA_NAIROBI_BENCHMARK } from '../utils/fuelCalculator';
import { ExternalLink, MapPin, Calendar, Info } from 'lucide-react';

interface FuelCommuteCalculatorProps {
  onNavigate: (view: string, param?: string) => void;
}

export const FuelCommuteCalculator: React.FC<FuelCommuteCalculatorProps> = ({ onNavigate }) => {
  const tool = getToolBySlug('fuel-commute')!;

  const [distance, setDistance] = useState<number>(35);
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'commute'>('roundtrip');
  const [mileageUnit, setMileageUnit] = useState<'kml' | 'l100km'>('kml');
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(14);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(
    EPRA_NAIROBI_BENCHMARK.superPetrol.pricePerLiter
  );
  const [passengers, setPassengers] = useState<number>(1);

  const handleReset = () => {
    setDistance(35);
    setTripType('roundtrip');
    setMileageUnit('kml');
    setFuelEfficiency(14);
    setFuelPricePerLiter(EPRA_NAIROBI_BENCHMARK.superPetrol.pricePerLiter);
    setPassengers(1);
  };

  const results = useMemo(() => {
    return calculateFuelCommute({
      oneWayDistanceKm: distance,
      tripType,
      mileageUnit,
      fuelEfficiency,
      fuelPricePerLiter,
      passengers,
    });
  }, [distance, tripType, mileageUnit, fuelEfficiency, fuelPricePerLiter, passengers]);

  const summaryCopyText = `JibuWise Fuel & Commute Cost Summary:
One-Way Distance: ${results.oneWayDistanceKm} km (${tripType === 'commute' ? '22 Days Monthly Commute' : tripType})
Total Distance Traveled: ${results.totalTripDistanceKm} km
Fuel Consumed: ${formatNumber(results.litersConsumed, 1)} Liters
Fuel Pump Price: ${formatCurrency(fuelPricePerLiter)}/L
Total Journey Fuel Cost: ${formatCurrency(results.totalTripCost)}
Running Cost per km: ${formatCurrency(results.costPerKm)}/km
Carpool Share (${passengers} rider${passengers > 1 ? 's' : ''}): ${formatCurrency(results.costPerPerson)}`;

  return (
    <ToolLayout
      tool={tool}
      onReset={handleReset}
      onNavigate={onNavigate}
      summaryTextForCopy={summaryCopyText}
    >
      {{
        inputs: (
          <div className="space-y-5">
            <SegmentedControl
              label="Trip Type"
              value={tripType}
              onChange={(v) => setTripType(v as 'oneway' | 'roundtrip' | 'commute')}
              options={[
                { value: 'oneway', label: 'One-Way' },
                { value: 'roundtrip', label: 'Round-Trip' },
                { value: 'commute', label: 'Monthly Commute (22d)' },
              ]}
            />

            <Input
              id="trip-distance"
              label={tripType === 'oneway' ? 'Trip Distance' : 'One-Way Distance'}
              type="number"
              min={1}
              step={5}
              value={distance || ''}
              onChange={(e) => setDistance(Math.max(0, Number(e.target.value) || 0))}
              suffix="km"
              hint={
                tripType === 'roundtrip'
                  ? 'Total round-trip is 2× this distance'
                  : tripType === 'commute'
                  ? 'Monthly commute will calculate 44 trips (22 work days)'
                  : 'Total one-way distance'
              }
            />

            <div className="grid grid-cols-2 gap-3 items-end">
              <Input
                id="efficiency-input"
                label="Fuel Efficiency"
                type="number"
                min={0.1}
                step={0.5}
                value={fuelEfficiency || ''}
                onChange={(e) => setFuelEfficiency(Math.max(0.1, Number(e.target.value) || 1))}
                suffix={mileageUnit === 'kml' ? 'km/L' : 'L/100km'}
              />
              <SegmentedControl
                value={mileageUnit}
                onChange={(v) => setMileageUnit(v as 'kml' | 'l100km')}
                options={[
                  { value: 'kml', label: 'km / L' },
                  { value: 'l100km', label: 'L / 100km' },
                ]}
              />
            </div>

            {/* Fuel Price & Official EPRA Benchmark Section */}
            <div>
              <Input
                id="fuel-price"
                label="Fuel Price per Liter"
                type="number"
                min={1}
                step={0.01}
                value={fuelPricePerLiter || ''}
                onChange={(e) => setFuelPricePerLiter(Math.max(0, Number(e.target.value) || 0))}
                prefix="KES"
                hint="Enter your local pump price or select an EPRA benchmark"
              />

              {/* Official EPRA Benchmarks Box */}
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-lime-700" />
                    <span>EPRA Maximum Retail Price Presets (Nairobi)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>15 Oct – 14 Nov 2026</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFuelPricePerLiter(EPRA_NAIROBI_BENCHMARK.superPetrol.pricePerLiter)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      fuelPricePerLiter === EPRA_NAIROBI_BENCHMARK.superPetrol.pricePerLiter
                        ? 'bg-white border-[#0b2d21] shadow-xs ring-1 ring-[#0b2d21]'
                        : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] font-medium text-slate-500">Super Petrol (PMS)</span>
                    <span className="block text-sm font-bold font-mono-numbers text-slate-900">
                      KES {EPRA_NAIROBI_BENCHMARK.superPetrol.pricePerLiter.toFixed(2)} / L
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuelPricePerLiter(EPRA_NAIROBI_BENCHMARK.diesel.pricePerLiter)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      fuelPricePerLiter === EPRA_NAIROBI_BENCHMARK.diesel.pricePerLiter
                        ? 'bg-white border-[#0b2d21] shadow-xs ring-1 ring-[#0b2d21]'
                        : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] font-medium text-slate-500">Diesel (AGO)</span>
                    <span className="block text-sm font-bold font-mono-numbers text-slate-900">
                      KES {EPRA_NAIROBI_BENCHMARK.diesel.pricePerLiter.toFixed(2)} / L
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuelPricePerLiter(EPRA_NAIROBI_BENCHMARK.kerosene.pricePerLiter)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      fuelPricePerLiter === EPRA_NAIROBI_BENCHMARK.kerosene.pricePerLiter
                        ? 'bg-white border-[#0b2d21] shadow-xs ring-1 ring-[#0b2d21]'
                        : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] font-medium text-slate-500">Kerosene (IK)</span>
                    <span className="block text-sm font-bold font-mono-numbers text-slate-900">
                      KES {EPRA_NAIROBI_BENCHMARK.kerosene.pricePerLiter.toFixed(2)} / L
                    </span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                  <span>Prices differ across towns due to pipeline/road transit costs.</span>
                  <a
                    href={EPRA_NAIROBI_BENCHMARK.superPetrol.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0b2d21] font-semibold hover:underline"
                  >
                    <span>EPRA Official Notice</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <Input
              id="passenger-count"
              label="Number of People Sharing Ride"
              type="number"
              min={1}
              max={15}
              value={passengers || ''}
              onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
              suffix="riders"
              hint="Evenly splits fuel cost among passengers"
            />
          </div>
        ),
        results: (
          <div className="space-y-6">
            {/* Primary KPI Result */}
            <div className="p-5 rounded-2xl bg-[#0b2d21] text-white">
              <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold block mb-1">
                {passengers > 1 ? 'Cost per Person (Carpool Split)' : 'Total Journey Fuel Cost'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-numbers tabular-nums text-white">
                {formatCurrency(passengers > 1 ? results.costPerPerson : results.totalTripCost)}
              </div>
              <div className="mt-2 text-xs text-emerald-200">
                {formatNumber(results.litersConsumed, 1)} liters needed for {results.totalTripDistanceKm} km · {formatCurrency(results.costPerKm)}/km
              </div>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Total Fuel Needed
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatNumber(results.litersConsumed, 1)} L
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Running Cost / km
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.costPerKm)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Total Trip Cost
                </span>
                <span className="text-lg font-bold font-mono-numbers text-slate-900">
                  {formatCurrency(results.totalTripCost)}
                </span>
              </div>
            </div>

            {/* Price Transparency Note */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#0b2d21] shrink-0 mt-0.5" />
              <div>
                <strong>Location & Regulated Price Transparency:</strong>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Maximum pump prices are announced on the 14th of each month by the Energy and Petroleum Regulatory Authority (EPRA). The presets above represent the gazetted Nairobi ceilings for the 15 Oct – 14 Nov 2026 cycle. These presets are static official references and do not update automatically. If fueling outside Nairobi (e.g. Mombasa, Kisumu, Nakuru, Eldoret) or at an independent dealer, enter your exact station pump price above.
                </p>
              </div>
            </div>
          </div>
        ),
        breakdown: (
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Commute Budget & Mileage Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 pr-4">Timeframe</th>
                    <th className="py-2.5 px-3">Distance</th>
                    <th className="py-2.5 pl-4 text-right">Fuel Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-numbers">
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Daily Return Commute</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">{distance * 2} km</td>
                    <td className="py-2.5 pl-4 text-right text-slate-900">
                      {formatCurrency(results.singleRoundTripCost)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-sans text-slate-700">Monthly Working Commute (22 days)</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">{distance * 44} km</td>
                    <td className="py-2.5 pl-4 text-right font-medium text-slate-900">
                      {formatCurrency(results.monthlyCommuteCost)}
                    </td>
                  </tr>
                  <tr className="bg-slate-100/70 font-semibold">
                    <td className="py-2.5 pr-4 font-sans text-[#0b2d21]">Annual Commute Projection</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">12 Months (528 trips)</td>
                    <td className="py-2.5 pl-4 text-right text-[#0b2d21] font-bold">
                      {formatCurrency(results.annualCommuteCost)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      }}
    </ToolLayout>
  );
};
