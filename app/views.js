// Nusa in Numbers — page views.
// One render function per route; each returns an HTML string for #app.
(function () {
  'use strict';

  var data = window.NusaData;
  var charts = window.NusaCharts;
  var esc = charts.escapeText;

  function sourceTag(source) {
    return '<span class="source-tag">' + esc(source) + '</span>';
  }

  function kpiCard(figure) {
    return '<article class="kpi-card">' +
      '<p class="kpi-value">' + esc(figure.value) + '</p>' +
      '<p class="kpi-label">' + esc(figure.label) + '</p>' +
      sourceTag(figure.source) +
      '</article>';
  }

  function shareOf(population) {
    return (population / data.nationalPopulation) * 100;
  }

  function formatShare(population) {
    return shareOf(population).toFixed(1) + '%';
  }

  // People per km² from the stored millions and area; rounded for display.
  function densityOf(province) {
    return (province.population * 1000000) / province.area;
  }

  function formatDensity(province) {
    return Math.round(densityOf(province)).toLocaleString('en-US');
  }

  function formatArea(area) {
    return area.toLocaleString('en-US');
  }

  function pageHead(title, intro) {
    return '<div class="page-head"><h1>' + esc(title) + '</h1><p>' + esc(intro) + '</p></div>';
  }

  function renderOverview() {
    var h = data.headline;
    var growthBars = data.gdpGrowthSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    var topFive = data.provinces.slice().sort(function (a, b) {
      return b.population - a.population;
    }).slice(0, 5);
    var rows = topFive.map(function (province, index) {
      return '<tr><td>' + (index + 1) + '</td><td>' + esc(province.name) + '</td><td>' +
        province.population.toFixed(1) + 'M</td><td>' + formatShare(province.population) + '</td></tr>';
    }).join('');
    var releases = data.releases.map(function (release) {
      return '<li><div><strong>' + esc(release.title) + '</strong><p>' + esc(release.detail) + '</p></div>' +
        sourceTag(release.source) + '</li>';
    }).join('');
    return '<section class="hero">' +
      '<p class="hero-eyebrow">Indonesia at a glance</p>' +
      '<p class="hero-figure">283.5 million</p>' +
      '<p class="hero-sub">people live in Indonesia — the fourth-largest population in the world. ' +
      'Growth held at 5.03% in 2024 while December inflation eased to 1.57%.</p>' +
      '<p class="hero-coverage">38 provinces · 17,508 islands · every figure sourced</p>' +
      '<p class="hero-sources">' + sourceTag('Population · World Bank · 2024') + ' ' +
      sourceTag('Growth & inflation · BPS · 2024') + '</p>' +
      '</section>' +
      '<section class="kpi-row" aria-label="Key figures">' +
      kpiCard(h.gdp) + kpiCard(h.gdpPerCapita) + kpiCard(h.gdpGrowth) +
      kpiCard(h.inflation) + kpiCard(h.unemployment) + kpiCard(h.poverty) +
      '</section>' +
      '<section class="split">' +
      '<article class="panel"><h2>GDP growth, 2019–2024</h2>' +
      charts.barChart(growthBars, { unit: '%', ariaLabel: 'GDP growth by year, percent' }) +
      '<p class="panel-note">Annual real GDP growth. The 2020 bar is negative: output contracted 2.07% that year. ' + sourceTag('BPS · 2024') + '</p></article>' +
      '<article class="panel"><h2>Largest provinces</h2>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>Province</th><th>Population</th><th>Share</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>' +
      '<p class="panel-note">Five provinces hold just over half the national population. ' + sourceTag('BPS · 2024') + '</p>' +
      '<p><a class="text-link" href="#/regions">See all provinces</a></p></article>' +
      '</section>' +
      '<section class="panel"><h2>Latest releases</h2><ul class="release-list">' + releases + '</ul></section>';
  }

  function renderPopulation() {
    var h = data.headline;
    var ageBars = data.ageShares.map(function (share) {
      return { label: share.label, value: share.value };
    });
    var populationLine = data.populationSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    var longLine = data.populationLongSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    return pageHead('Population', 'How many people live in Indonesia, how old they are, and where they live.') +
      '<section class="panel"><h2>Population, 1961–2024</h2>' +
      charts.lineChart(longLine, { unit: 'M', ariaLabel: 'Population in millions, 1961 to 2024' }) +
      '<p class="panel-note">From 97.0M in 1961 to 283.5M in 2024 — the population has nearly tripled in six decades. Census years plus the 2024 estimate. ' + sourceTag('BPS censuses + 2024 estimate') + '</p></section>' +
      '<section class="split">' +
      '<article class="panel"><h2>Age structure, 2024</h2>' +
      charts.barChart(ageBars, { unit: '%', color: '#2e7d6b', ariaLabel: 'Population share by age group, percent' }) +
      '<p class="panel-note">Seven in ten Indonesians are of working age (15–64), while children under 15 are about a quarter of the population. ' + sourceTag('UN · 2024') + '</p></article>' +
      '<article class="panel"><h2>Population, 2015–2024</h2>' +
      charts.lineChart(populationLine, { unit: 'M', ariaLabel: 'Population in millions, 2015 to 2024' }) +
      '<p class="panel-note">Population rose from 255.5M in 2015 to 283.5M in 2024 — about 28 million more people in a decade. ' + sourceTag('BPS / World Bank · 2024') + '</p></article>' +
      '</section>' +
      '<section class="kpi-row" aria-label="Population facts">' +
      kpiCard(h.population) + kpiCard(h.density) + kpiCard(h.urbanShare) +
      kpiCard(h.medianAge) + kpiCard(h.sexRatio) + kpiCard(h.lifeExpectancy) +
      '</section>' +
      '<section class="panel"><h2>What this means</h2>' +
      '<p>With a median age of 30.4 years (UN · 2024) and 69.3% of people aged 15–64 (UN · 2024), Indonesia has a large working-age population to support growth. ' +
      'About 59.9% of people now live in urban areas (UN · 2024), and average density is 149 people per km² (BPS · 2024), though Java is far denser than the national average. ' +
      'The sex ratio is 102.0 males per 100 females (BPS · 2024).</p></section>';
  }

  function renderEconomy() {
    var growthBars = data.gdpGrowthSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    var perCapitaBars = data.gdpPerCapitaSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    return pageHead('Economy', 'Growth, prices, sectors and trade — the size and shape of the Indonesian economy.') +
      '<section class="panel"><h2>Growth and prices</h2>' +
      '<div class="toggle-row" role="group" aria-label="Choose series">' +
      '<button type="button" class="toggle-btn is-active" data-series="growth">GDP growth</button>' +
      '<button type="button" class="toggle-btn" data-series="inflation">Inflation</button>' +
      '</div>' +
      '<div id="economy-chart">' + charts.barChart(growthBars, { unit: '%', ariaLabel: 'GDP growth by year, percent' }) + '</div>' +
      '<p class="panel-note" id="economy-caption">Annual real GDP growth, 2019–2024. Output contracted 2.07% in 2020, then returned to about 5%. ' + sourceTag('BPS · 2024') + '</p></section>' +
      '<section class="split">' +
      '<article class="panel"><h2>Where output comes from, 2024</h2>' +
      charts.donutChart(data.sectors, { centreTop: 'GDP', centreBottom: 'by sector', ariaLabel: 'GDP share by sector, percent' }) +
      '<p class="panel-note">Manufacturing is the largest single sector at 19.0% of GDP; services outside trade make up the biggest combined share. ' + sourceTag('BPS · 2024') + '</p></article>' +
      '<article class="panel"><h2>Trade, 2024</h2>' +
      '<div class="trade-grid">' + kpiCard(data.trade.exports) + kpiCard(data.trade.imports) + kpiCard(data.trade.balance) + '</div>' +
      '<p class="panel-note">Exports exceeded imports by US$31.0B in 2024, keeping the trade balance in surplus. ' + sourceTag('BPS · 2024') + '</p>' +
      '<h3>Headline size</h3><div class="trade-grid">' + kpiCard(data.headline.gdp) + kpiCard(data.headline.gdpPerCapita) + '</div></article>' +
      '</section>' +
      '<section class="panel"><h2>GDP per capita, 2019–2024 (US$)</h2>' +
      charts.barChart(perCapitaBars, { unit: '', color: '#2e7d6b', ariaLabel: 'GDP per capita in US dollars, 2019 to 2024' }) +
      '<p class="panel-note">Income per person fell to US$3,912 in 2020, then recovered to US$4,925 by 2024. ' + sourceTag('World Bank · 2024') + '</p></section>';
  }

  function provinceRows(provinces) {
    if (provinces.length === 0) {
      return '<tr><td colspan="7" class="empty-row">No province matches that filter and search.</td></tr>';
    }
    return provinces.map(function (province) {
      return '<tr><td>' + esc(province.name) + '</td><td>' + esc(province.capital) + '</td><td>' +
        esc(province.island) + '</td><td>' + province.population.toFixed(1) + 'M</td><td>' +
        formatArea(province.area) + '</td><td>' + formatDensity(province) + '</td><td>' +
        formatShare(province.population) + '</td></tr>';
    }).join('');
  }

  function tileStyle(population) {
    var maxPopulation = data.provinces.reduce(function (best, province) {
      return Math.max(best, province.population);
    }, 0);
    var alpha = 0.14 + (shareOf(population) / shareOf(maxPopulation)) * 0.58;
    var textColor = alpha > 0.48 ? '#ffffff' : '#17201f';
    return 'background:rgba(13,79,74,' + alpha.toFixed(2) + ');color:' + textColor;
  }

  function renderRegions() {
    var tiles = data.provinces.map(function (province) {
      return '<div class="tile" style="' + tileStyle(province.population) + '">' +
        '<strong>' + esc(province.name) + '</strong>' +
        '<span>' + province.population.toFixed(1) + 'M · ' + formatShare(province.population) + '</span></div>';
    }).join('');
    var filters = '<button type="button" class="filter-btn is-active" data-island="All">All</button>' +
      data.islandGroups.map(function (group) {
        return '<button type="button" class="filter-btn" data-island="' + esc(group) + '">' + esc(group) + '</button>';
      }).join('');
    return pageHead('Regions', 'All 38 provinces compared — population, land area and density. Filter by island group, search, and sort the table.') +
      '<section class="panel"><h2>38 provinces — population, area and density</h2>' +
      '<div class="filter-row" role="group" aria-label="Filter by island group">' + filters + '</div>' +
      '<div class="region-controls">' +
      '<label class="search-label">Search <input type="search" id="region-search" placeholder="Province or capital" autocomplete="off"></label>' +
      '<div class="sort-row" role="group" aria-label="Sort provinces">' +
      '<button type="button" class="sort-btn" data-sort="population">Sort by population</button>' +
      '<button type="button" class="sort-btn" data-sort="area">Sort by area</button>' +
      '<button type="button" class="sort-btn" data-sort="density">Sort by density</button>' +
      '<button type="button" class="sort-btn" data-sort="name">Sort by name</button>' +
      '</div></div>' +
      '<p class="region-count" id="region-count">Showing 38 of 38 provinces</p>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Province</th><th>Capital</th><th>Island</th><th>Population</th><th>Area km²</th><th>Density /km²</th><th>Share</th></tr></thead>' +
      '<tbody id="province-rows">' + provinceRows(data.provinces) + '</tbody></table></div>' +
      '<p class="panel-note">Population in millions (BPS 2024 estimates), land area in km², density computed as population ÷ area, share of the 283.5M national total. ' + sourceTag('BPS · 2024') + '</p></section>' +
      '<section class="panel"><h2>Tile map — darker means larger share</h2><div class="tile-grid">' + tiles + '</div>' +
      '<p class="panel-note">Each tile is one of the 38 provinces; colour depth follows its share of national population. West Java alone holds 17.7%. ' + sourceTag('BPS · 2024') + '</p></section>';
  }

  function renderWellbeing() {
    var cards = data.wellbeing.map(function (item) {
      var color = (item.key === 'poverty' || item.key === 'stunting') ? '#c47b2a' : '#0d4f4a';
      return '<article class="wellbeing-card">' +
        '<p class="kpi-value">' + esc(item.value) + '</p>' +
        '<p class="kpi-label">' + esc(item.label) + '</p>' +
        charts.progressBar(item.barPct, { color: color, ariaLabel: item.label + ' progress bar' }) +
        '<p class="wellbeing-note">' + esc(item.note) + '</p>' +
        sourceTag(item.source) +
        '</article>';
    }).join('');
    return pageHead('Wellbeing', 'Health, learning, income and access — how people are doing, not just how the economy is doing.') +
      '<section class="wellbeing-grid">' + cards + '</section>' +
      '<section class="panel"><h2>Reading these bars</h2>' +
      '<p>Bars for poverty (8.57%, BPS · Sep 2024) and stunting (21.5%, Kemenkes SSGI · 2023) run the other way: shorter is better. ' +
      'Literacy reaches 96.7% (BPS · 2023) and internet use 79.5% (APJII · 2024), while the Human Development Index stands at 75.02 (BPS · 2024). ' +
      'Life expectancy is 71.7 years (World Bank · 2023).</p></section>';
  }

  function renderSources() {
    var rows = data.sourceList.map(function (row) {
      return '<tr><td>' + esc(row.indicator) + '</td><td>' + esc(row.value) + '</td><td>' +
        esc(row.source) + '</td><td>' + esc(row.year) + '</td></tr>';
    }).join('');
    return pageHead('Sources', 'Where every figure comes from, how to read it, and the data behind the charts.') +
      '<section class="panel"><h2>Methodology</h2>' +
      '<p>Figures are taken from the official releases listed below and shown with the source and year beside each number. ' +
      'Growth and inflation use BPS annual and December year-on-year releases; population levels use World Bank and BPS series; ' +
      'all 38 province populations and land areas are BPS 2024 figures, with density computed as population ÷ area and shares computed against the 283.5M national total. ' +
      'Charts plot the published values directly — no modelling, smoothing or seasonal adjustment is added by this site.</p>' +
      '<p>Percentages in the sector chart sum to 100% of GDP. Age shares sum to 100% of population. ' +
      'Wellbeing bars scale each indicator to its natural maximum, except life expectancy, which is shown against 85 years.</p></section>' +
      '<section class="panel"><h2>Source list</h2>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Indicator</th><th>Value</th><th>Source</th><th>Year</th></tr></thead><tbody>' +
      rows + '</tbody></table></div></section>' +
      '<section class="panel"><h2>Download the data</h2>' +
      '<p>CSV files are generated in your browser from the same arrays that draw the charts.</p>' +
      '<div class="download-row">' +
      '<button type="button" class="download-btn" data-csv="provinces">Provinces CSV</button>' +
      '<button type="button" class="download-btn" data-csv="economy">Growth &amp; inflation CSV</button>' +
      '<button type="button" class="download-btn" data-csv="population">Population CSV</button>' +
      '</div></section>';
  }

  window.NusaViews = {
    renderOverview: renderOverview,
    renderPopulation: renderPopulation,
    renderEconomy: renderEconomy,
    renderRegions: renderRegions,
    renderWellbeing: renderWellbeing,
    renderSources: renderSources,
    provinceRows: provinceRows
  };
})();
