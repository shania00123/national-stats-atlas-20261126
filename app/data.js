// Nusa in Numbers — data layer.
// Every figure carries its source and year so views can label it in place.
(function () {
  'use strict';

  var headline = {
    population: { value: '283.5M', label: 'Population', source: 'World Bank · 2024' },
    gdp: { value: 'US$1.40T', label: 'GDP', source: 'World Bank · 2024' },
    gdpPerCapita: { value: 'US$4,925', label: 'GDP per capita', source: 'World Bank · 2024' },
    gdpGrowth: { value: '5.03%', label: 'GDP growth', source: 'BPS · 2024' },
    inflation: { value: '1.57%', label: 'Inflation, Dec yoy', source: 'BPS · 2024' },
    unemployment: { value: '4.91%', label: 'Unemployment', source: 'BPS Sakernas · Aug 2024' },
    poverty: { value: '8.57%', label: 'Poverty rate', source: 'BPS · Sep 2024' },
    lifeExpectancy: { value: '71.7 yrs', label: 'Life expectancy', source: 'World Bank · 2023' },
    literacy: { value: '96.7%', label: 'Literacy', source: 'BPS · 2023' },
    internet: { value: '79.5%', label: 'Internet users', source: 'APJII · 2024' },
    hdi: { value: '75.02', label: 'Human Development Index', source: 'BPS · 2024' },
    stunting: { value: '21.5%', label: 'Stunting', source: 'Kemenkes SSGI · 2023' },
    density: { value: '149/km²', label: 'Population density', source: 'BPS · 2024' },
    urbanShare: { value: '59.9%', label: 'Urban share', source: 'UN · 2024' },
    medianAge: { value: '30.4 yrs', label: 'Median age', source: 'UN · 2024' },
    sexRatio: { value: '102.0', label: 'Sex ratio (males per 100 females)', source: 'BPS · 2024' }
  };

  var gdpGrowthSeries = [
    { year: 2019, value: 5.02 },
    { year: 2020, value: -2.07 },
    { year: 2021, value: 3.70 },
    { year: 2022, value: 5.31 },
    { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 }
  ];

  var inflationSeries = [
    { year: 2019, value: 2.72 },
    { year: 2020, value: 1.68 },
    { year: 2021, value: 1.87 },
    { year: 2022, value: 5.51 },
    { year: 2023, value: 2.61 },
    { year: 2024, value: 1.57 }
  ];

  var populationSeries = [
    { year: 2015, value: 255.5 },
    { year: 2016, value: 258.7 },
    { year: 2017, value: 261.9 },
    { year: 2018, value: 264.2 },
    { year: 2019, value: 266.9 },
    { year: 2020, value: 270.2 },
    { year: 2021, value: 272.7 },
    { year: 2022, value: 275.8 },
    { year: 2023, value: 277.5 },
    { year: 2024, value: 283.5 }
  ];

  var ageShares = [
    { label: '0–14', value: 24.1 },
    { label: '15–64', value: 69.3 },
    { label: '65+', value: 6.6 }
  ];

  var sectors = [
    { label: 'Manufacturing', value: 19.0, color: '#0d4f4a' },
    { label: 'Agriculture', value: 12.6, color: '#2e7d6b' },
    { label: 'Trade', value: 12.4, color: '#e8a33d' },
    { label: 'Construction', value: 9.4, color: '#c47b2a' },
    { label: 'Mining', value: 8.6, color: '#7a8b87' },
    { label: 'Other services', value: 38.0, color: '#d8cfc0' }
  ];

  var trade = {
    exports: { value: 'US$264.7B', label: 'Exports', source: 'BPS · 2024' },
    imports: { value: 'US$233.7B', label: 'Imports', source: 'BPS · 2024' },
    balance: { value: '+US$31.0B', label: 'Trade balance', source: 'BPS · 2024' }
  };

  var provinces = [
    { name: 'West Java', capital: 'Bandung', population: 50.3 },
    { name: 'East Java', capital: 'Surabaya', population: 41.8 },
    { name: 'Central Java', capital: 'Semarang', population: 37.9 },
    { name: 'North Sumatra', capital: 'Medan', population: 15.6 },
    { name: 'Banten', capital: 'Serang', population: 12.4 },
    { name: 'Jakarta', capital: 'Jakarta', population: 10.7 },
    { name: 'South Sulawesi', capital: 'Makassar', population: 9.5 },
    { name: 'Lampung', capital: 'Bandar Lampung', population: 9.4 },
    { name: 'South Sumatra', capital: 'Palembang', population: 8.9 },
    { name: 'Riau', capital: 'Pekanbaru', population: 6.8 },
    { name: 'West Sumatra', capital: 'Padang', population: 5.9 },
    { name: 'East Kalimantan', capital: 'Samarinda', population: 4.1 }
  ];

  var wellbeing = [
    {
      key: 'hdi',
      label: 'Human Development Index',
      value: '75.02',
      source: 'BPS · 2024',
      barPct: 75.02,
      note: 'Combines health, schooling and income into one score out of 100. Higher is better.'
    },
    {
      key: 'life',
      label: 'Life expectancy',
      value: '71.7 yrs',
      source: 'World Bank · 2023',
      barPct: 84.4,
      note: 'Average years a newborn is expected to live. Shown against an 85-year scale.'
    },
    {
      key: 'literacy',
      label: 'Literacy',
      value: '96.7%',
      source: 'BPS · 2023',
      barPct: 96.7,
      note: 'Share of people aged 15 and over who can read and write.'
    },
    {
      key: 'poverty',
      label: 'Poverty rate',
      value: '8.57%',
      source: 'BPS · Sep 2024',
      barPct: 8.57,
      note: 'Share of people below the national poverty line. Lower is better.'
    },
    {
      key: 'stunting',
      label: 'Stunting',
      value: '21.5%',
      source: 'Kemenkes SSGI · 2023',
      barPct: 21.5,
      note: 'Share of children under five who are too short for their age. Lower is better.'
    },
    {
      key: 'internet',
      label: 'Internet users',
      value: '79.5%',
      source: 'APJII · 2024',
      barPct: 79.5,
      note: 'Share of the population using the internet, a proxy for digital access.'
    }
  ];

  var releases = [
    { title: 'GDP growth 2024: 5.03%', detail: 'Full-year growth held just above 5% after the 2020 contraction.', source: 'BPS · 2024' },
    { title: 'Poverty rate Sep 2024: 8.57%', detail: 'Share below the national poverty line, the lowest level in this series.', source: 'BPS · Sep 2024' },
    { title: 'Unemployment Aug 2024: 4.91%', detail: 'Open unemployment from the national labour force survey.', source: 'BPS Sakernas · Aug 2024' },
    { title: 'Inflation Dec 2024: 1.57% yoy', detail: 'December year-on-year inflation closed the year below 2%.', source: 'BPS · 2024' }
  ];

  var sourceList = [
    { indicator: 'Population', value: '283.5M', source: 'World Bank', year: '2024' },
    { indicator: 'GDP', value: 'US$1.40T', source: 'World Bank', year: '2024' },
    { indicator: 'GDP per capita', value: 'US$4,925', source: 'World Bank', year: '2024' },
    { indicator: 'GDP growth', value: '5.03%', source: 'BPS', year: '2024' },
    { indicator: 'Inflation, Dec yoy', value: '1.57%', source: 'BPS', year: '2024' },
    { indicator: 'Unemployment', value: '4.91%', source: 'BPS Sakernas', year: 'Aug 2024' },
    { indicator: 'Poverty rate', value: '8.57%', source: 'BPS', year: 'Sep 2024' },
    { indicator: 'Life expectancy', value: '71.7 yrs', source: 'World Bank', year: '2023' },
    { indicator: 'Literacy', value: '96.7%', source: 'BPS', year: '2023' },
    { indicator: 'Internet users', value: '79.5%', source: 'APJII', year: '2024' },
    { indicator: 'Human Development Index', value: '75.02', source: 'BPS', year: '2024' },
    { indicator: 'Stunting', value: '21.5%', source: 'Kemenkes SSGI', year: '2023' },
    { indicator: 'Population density', value: '149/km²', source: 'BPS', year: '2024' },
    { indicator: 'Urban share', value: '59.9%', source: 'UN', year: '2024' },
    { indicator: 'Median age', value: '30.4 yrs', source: 'UN', year: '2024' },
    { indicator: 'Province populations', value: '12 provinces', source: 'BPS', year: '2024' }
  ];

  window.NusaData = {
    headline: headline,
    gdpGrowthSeries: gdpGrowthSeries,
    inflationSeries: inflationSeries,
    populationSeries: populationSeries,
    ageShares: ageShares,
    sectors: sectors,
    trade: trade,
    provinces: provinces,
    wellbeing: wellbeing,
    releases: releases,
    sourceList: sourceList,
    nationalPopulation: 283.5
  };
})();
