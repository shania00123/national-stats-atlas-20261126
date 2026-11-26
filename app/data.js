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

  // Long-run population: census years plus the 2024 estimate, in millions.
  var populationLongSeries = [
    { year: 1961, value: 97.0 },
    { year: 1971, value: 119.2 },
    { year: 1980, value: 147.5 },
    { year: 1990, value: 179.4 },
    { year: 2000, value: 206.3 },
    { year: 2010, value: 237.6 },
    { year: 2020, value: 270.2 },
    { year: 2024, value: 283.5 }
  ];

  // GDP per capita in current US dollars.
  var gdpPerCapitaSeries = [
    { year: 2019, value: 4174 },
    { year: 2020, value: 3912 },
    { year: 2021, value: 4349 },
    { year: 2022, value: 4784 },
    { year: 2023, value: 4919 },
    { year: 2024, value: 4925 }
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

  // All 38 provinces: BPS 2024 population estimates (millions) and land area (km²).
  // Density and share are computed in the views, never stored.
  var provinces = [
    { name: 'Aceh', capital: 'Banda Aceh', island: 'Sumatra', population: 5.6, area: 57956 },
    { name: 'North Sumatra', capital: 'Medan', island: 'Sumatra', population: 15.6, area: 72981 },
    { name: 'West Sumatra', capital: 'Padang', island: 'Sumatra', population: 5.9, area: 42297 },
    { name: 'Riau', capital: 'Pekanbaru', island: 'Sumatra', population: 6.8, area: 87024 },
    { name: 'Jambi', capital: 'Jambi', island: 'Sumatra', population: 3.7, area: 50058 },
    { name: 'South Sumatra', capital: 'Palembang', island: 'Sumatra', population: 8.9, area: 91592 },
    { name: 'Bengkulu', capital: 'Bengkulu', island: 'Sumatra', population: 2.1, area: 19919 },
    { name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatra', population: 9.4, area: 34624 },
    { name: 'Bangka Belitung', capital: 'Pangkal Pinang', island: 'Sumatra', population: 1.5, area: 16424 },
    { name: 'Riau Islands', capital: 'Tanjung Pinang', island: 'Sumatra', population: 2.2, area: 8202 },
    { name: 'Jakarta', capital: 'Jakarta', island: 'Java', population: 10.7, area: 661 },
    { name: 'West Java', capital: 'Bandung', island: 'Java', population: 50.3, area: 37004 },
    { name: 'Central Java', capital: 'Semarang', island: 'Java', population: 37.9, area: 34055 },
    { name: 'Yogyakarta', capital: 'Yogyakarta', island: 'Java', population: 3.8, area: 3186 },
    { name: 'East Java', capital: 'Surabaya', island: 'Java', population: 41.8, area: 48106 },
    { name: 'Banten', capital: 'Serang', island: 'Java', population: 12.4, area: 9663 },
    { name: 'Bali', capital: 'Denpasar', island: 'Bali & Nusa Tenggara', population: 4.5, area: 5780 },
    { name: 'West Nusa Tenggara', capital: 'Mataram', island: 'Bali & Nusa Tenggara', population: 5.7, area: 18572 },
    { name: 'East Nusa Tenggara', capital: 'Kupang', island: 'Bali & Nusa Tenggara', population: 5.7, area: 48718 },
    { name: 'West Kalimantan', capital: 'Pontianak', island: 'Kalimantan', population: 5.7, area: 147307 },
    { name: 'Central Kalimantan', capital: 'Palangka Raya', island: 'Kalimantan', population: 2.8, area: 153564 },
    { name: 'South Kalimantan', capital: 'Banjarbaru', island: 'Kalimantan', population: 4.3, area: 38744 },
    { name: 'East Kalimantan', capital: 'Samarinda', island: 'Kalimantan', population: 4.1, area: 129066 },
    { name: 'North Kalimantan', capital: 'Tanjung Selor', island: 'Kalimantan', population: 0.8, area: 75468 },
    { name: 'North Sulawesi', capital: 'Manado', island: 'Sulawesi', population: 2.7, area: 13852 },
    { name: 'Central Sulawesi', capital: 'Palu', island: 'Sulawesi', population: 3.1, area: 61841 },
    { name: 'South Sulawesi', capital: 'Makassar', island: 'Sulawesi', population: 9.5, area: 46717 },
    { name: 'Southeast Sulawesi', capital: 'Kendari', island: 'Sulawesi', population: 2.8, area: 38068 },
    { name: 'Gorontalo', capital: 'Gorontalo', island: 'Sulawesi', population: 1.2, area: 11257 },
    { name: 'West Sulawesi', capital: 'Mamuju', island: 'Sulawesi', population: 1.5, area: 16788 },
    { name: 'Maluku', capital: 'Ambon', island: 'Maluku & Papua', population: 2.0, area: 46914 },
    { name: 'North Maluku', capital: 'Sofifi', island: 'Maluku & Papua', population: 1.4, area: 31983 },
    { name: 'West Papua', capital: 'Manokwari', island: 'Maluku & Papua', population: 0.6, area: 99672 },
    { name: 'Southwest Papua', capital: 'Sorong', island: 'Maluku & Papua', population: 0.6, area: 39123 },
    { name: 'Papua', capital: 'Jayapura', island: 'Maluku & Papua', population: 1.1, area: 82680 },
    { name: 'Central Papua', capital: 'Nabire', island: 'Maluku & Papua', population: 1.4, area: 61593 },
    { name: 'Highland Papua', capital: 'Wamena', island: 'Maluku & Papua', population: 1.5, area: 51121 },
    { name: 'South Papua', capital: 'Merauke', island: 'Maluku & Papua', population: 0.5, area: 117849 }
  ];

  var islandGroups = ['Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

  var wellbeing = [
    {
      key: 'hdi',
      group: 'living',
      label: 'Human Development Index',
      value: '75.02',
      source: 'BPS · 2024',
      barPct: 75.02,
      note: 'Combines health, schooling and income into one score out of 100. Higher is better.'
    },
    {
      key: 'life',
      group: 'health',
      label: 'Life expectancy',
      value: '71.7 yrs',
      source: 'World Bank · 2023',
      barPct: 84.4,
      note: 'Average years a newborn is expected to live. Shown against an 85-year scale.'
    },
    {
      key: 'literacy',
      group: 'education',
      label: 'Literacy',
      value: '96.7%',
      source: 'BPS · 2023',
      barPct: 96.7,
      note: 'Share of people aged 15 and over who can read and write.'
    },
    {
      key: 'poverty',
      group: 'living',
      label: 'Poverty rate',
      value: '8.57%',
      source: 'BPS · Sep 2024',
      barPct: 8.57,
      note: 'Share of people below the national poverty line. Lower is better.'
    },
    {
      key: 'stunting',
      group: 'health',
      label: 'Stunting',
      value: '21.5%',
      source: 'Kemenkes SSGI · 2023',
      barPct: 21.5,
      note: 'Share of children under five who are too short for their age. Lower is better.'
    },
    {
      key: 'internet',
      group: 'living',
      label: 'Internet users',
      value: '79.5%',
      source: 'APJII · 2024',
      barPct: 79.5,
      note: 'Share of the population using the internet, a proxy for digital access.'
    },
    {
      key: 'schooling',
      group: 'education',
      label: 'Mean years of schooling',
      value: '9.22',
      source: 'BPS · 2024',
      barPct: 61.5,
      note: 'Average completed years of schooling. Shown against a 15-year scale.'
    },
    {
      key: 'primary',
      group: 'education',
      label: 'Primary school participation',
      value: '99.4%',
      source: 'BPS · 2024',
      barPct: 99.4,
      note: 'Share of children of primary-school age who are in school.'
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
    { indicator: 'Mean years of schooling', value: '9.22', source: 'BPS', year: '2024' },
    { indicator: 'Primary school participation', value: '99.4%', source: 'BPS', year: '2024' },
    { indicator: 'Internet users', value: '79.5%', source: 'APJII', year: '2024' },
    { indicator: 'Human Development Index', value: '75.02', source: 'BPS', year: '2024' },
    { indicator: 'Stunting', value: '21.5%', source: 'Kemenkes SSGI', year: '2023' },
    { indicator: 'Population density', value: '149/km²', source: 'BPS', year: '2024' },
    { indicator: 'Urban share', value: '59.9%', source: 'UN', year: '2024' },
    { indicator: 'Median age', value: '30.4 yrs', source: 'UN', year: '2024' },
    { indicator: 'Province populations & areas', value: '38 provinces', source: 'BPS', year: '2024' },
    { indicator: 'Population 1961–2024', value: '97.0M → 283.5M', source: 'BPS censuses + 2024 estimate', year: '1961–2024' },
    { indicator: 'GDP per capita 2019–2024', value: 'US$4,174 → US$4,925', source: 'World Bank', year: '2019–2024' },
    { indicator: 'Island count', value: '17,508 islands', source: 'BPS', year: '2024' }
  ];

  // Indicator catalogue for the Explorer: every entry carries the audit
  // trail a reader needs — definition, unit, source, year, frequency,
  // how to read it, and the caveat that stops a misreading. Province-mode
  // indicators rank the 38 BPS 2024 province figures; series-mode
  // indicators plot the published national series already on this site.
  var indicators = [
    {
      key: 'population', mode: 'province', label: 'Population by province',
      unit: 'millions of people', source: 'BPS', year: '2024', frequency: 'Annual estimate',
      definition: 'Estimated number of usual residents in each province.',
      howToRead: 'Rank 1 is the most populous province. Shares are computed against the 283.5M national total (World Bank · 2024).',
      caveat: 'Estimates between censuses; small provinces round to 0.1M, so tiny rank gaps can be rounding.'
    },
    {
      key: 'density', mode: 'province', label: 'Population density',
      unit: 'people per km²', source: 'Computed from BPS population and area', year: '2024', frequency: 'Computed',
      definition: 'Province population divided by its land area.',
      howToRead: 'Higher means people live closer together on average. Jakarta is a city-province, so it sits far above the rest.',
      caveat: 'Averages hide empty land: a dense capital and empty interior average out inside one province.'
    },
    {
      key: 'area', mode: 'province', label: 'Land area',
      unit: 'km²', source: 'BPS', year: '2024', frequency: 'Fixed unless boundaries change',
      definition: 'Land area of each province in square kilometres.',
      howToRead: 'Rank 1 is the largest province. Compare with population to see why densities differ so widely.',
      caveat: 'Land area only; sea territory between islands is not counted.'
    },
    {
      key: 'share', mode: 'province', label: 'Share of national population',
      unit: '% of 283.5M', source: 'Computed from BPS province figures', year: '2024', frequency: 'Computed',
      definition: 'Each province population as a percentage of the national total.',
      howToRead: 'Add the top shares to see concentration: the Java provinces together hold well over half the country.',
      caveat: 'Shares use the World Bank 283.5M national total, so they sum to about 100%, not exactly.'
    },
    {
      key: 'growth', mode: 'series', label: 'GDP growth',
      unit: '% per year', source: 'BPS', year: '2019–2024', frequency: 'Annual',
      definition: 'Year-on-year change in real (inflation-adjusted) gross domestic product.',
      howToRead: 'Above zero means the economy grew. The 2020 bar is negative: output contracted 2.07%.',
      caveat: 'Annual figures smooth within-year swings; quarterly BPS releases move first.'
    },
    {
      key: 'inflation', mode: 'series', label: 'Inflation, December yoy',
      unit: '% per year', source: 'BPS', year: '2019–2024', frequency: 'Monthly, December shown',
      definition: 'Change in consumer prices versus the same month a year earlier, for December.',
      howToRead: 'Higher means prices rose faster. 2022 peaked at 5.51%; by Dec 2024 it eased to 1.57%.',
      caveat: 'December only: other months of the same year can differ.'
    },
    {
      key: 'percapita', mode: 'series', label: 'GDP per capita',
      unit: 'current US$', source: 'World Bank', year: '2019–2024', frequency: 'Annual',
      definition: 'Gross domestic product divided by population, in current US dollars.',
      howToRead: 'A rough average income scale, not a typical wage. It fell in 2020, then recovered to US$4,925.',
      caveat: 'Current dollars move with the exchange rate as well as with real incomes.'
    },
    {
      key: 'poprecent', mode: 'series', label: 'Population, 2015–2024',
      unit: 'millions of people', source: 'BPS / World Bank', year: '2015–2024', frequency: 'Annual',
      definition: 'Estimated total population each year.',
      howToRead: 'The slope is the story: about 28 million more people in a decade.',
      caveat: 'Annual estimates are revised after each census.'
    },
    {
      key: 'poplong', mode: 'series', label: 'Population, 1961–2024',
      unit: 'millions of people', source: 'BPS censuses + 2024 estimate', year: '1961–2024', frequency: 'Census years',
      definition: 'Census counts from 1961 to 2020, plus the 2024 estimate.',
      howToRead: 'From 97.0M in 1961 to 283.5M in 2024 — nearly tripled in six decades.',
      caveat: 'Gaps between census years are not shown; do not read yearly change off this chart.'
    }
  ];

  window.NusaData = {
    headline: headline,
    gdpGrowthSeries: gdpGrowthSeries,
    inflationSeries: inflationSeries,
    populationSeries: populationSeries,
    populationLongSeries: populationLongSeries,
    gdpPerCapitaSeries: gdpPerCapitaSeries,
    ageShares: ageShares,
    sectors: sectors,
    trade: trade,
    provinces: provinces,
    islandGroups: islandGroups,
    wellbeing: wellbeing,
    releases: releases,
    sourceList: sourceList,
    indicators: indicators,
    nationalPopulation: 283.5
  };
})();
