// Nusa in Numbers — page views.
// One render function per route; each returns an HTML string for #app.
(function () {
  'use strict';

  var data = window.NusaData;
  var charts = window.NusaCharts;
  var explorer = window.NusaExplorer;
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

  function miniStat(figure) {
    return '<article class="mini-stat">' +
      '<p class="mini-value">' + esc(figure.value) + '</p>' +
      '<div class="mini-meta"><p class="mini-label">' + esc(figure.label) + '</p>' +
      sourceTag(figure.source) + '</div>' +
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

  // Island-group totals, computed by summing the BPS 2024 province figures.
  function islandStrip() {
    var cells = explorer.islandTotals().map(function (row) {
      return '<div class="island-cell"><strong>' + esc(row.group) + '</strong>' +
        '<span class="island-pop">' + row.population.toFixed(1) + 'M · ' + row.share.toFixed(1) + '%</span>' +
        '<span class="island-meta">' + row.count + ' provinces · ' +
        Math.round(row.density).toLocaleString('en-US') + '/km²</span></div>';
    }).join('');
    return '<section class="panel island-panel"><h2>Where people live — six island groups</h2>' +
      '<div class="island-grid">' + cells + '</div>' +
      '<p class="panel-note">Computed by summing the 38 BPS 2024 province populations and areas. Java holds the majority of the country on a small share of its land. ' + sourceTag('Computed from BPS · 2024') + '</p></section>';
  }

  function renderOverview() {
    var h = data.headline;
    var growthBars = data.gdpGrowthSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    var longBars = data.populationLongSeries.map(function (point) {
      return { label: String(point.year), value: point.value };
    });
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
      '<section class="ministat-band" aria-label="More key figures">' +
      miniStat(h.hdi) + miniStat(h.lifeExpectancy) + miniStat(h.literacy) + miniStat(h.internet) +
      '</section>' +
      islandStrip() +
      '<section class="explore-cards" aria-label="Explore the data">' +
      '<a class="explore-card" href="#/explore"><strong>Indicator Explorer</strong><span>Rank all 38 provinces or plot a national series, with the audit trail for every figure.</span></a>' +
      '<a class="explore-card" href="#/explore"><strong>Compare provinces</strong><span>Put any two provinces side by side: population, density, area and ranks.</span></a>' +
      '<a class="explore-card" href="#/regions"><strong>Province profiles</strong><span>Open any province for its ranks, share and density against the national average.</span></a>' +
      '</section>' +
      '<section class="split split-cover">' +
      '<article class="panel"><h2>GDP growth, 2019–2024</h2>' +
      charts.barChart(growthBars, { unit: '%', ariaLabel: 'GDP growth by year, percent' }) +
      '<p class="panel-note">Annual real GDP growth. The 2020 bar is negative: output contracted 2.07% that year. ' + sourceTag('BPS · 2024') + '</p></article>' +
      '<article class="panel"><h2>Population, 1961–2024</h2>' +
      charts.barChart(longBars, { unit: 'M', color: '#2e7d6b', ariaLabel: 'Population in millions, 1961 to 2024' }) +
      '<p class="panel-note">From 97.0M in 1961 to 283.5M in 2024 — census years plus the 2024 estimate. ' + sourceTag('BPS censuses + 2024 estimate') + '</p></article>' +
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
      '<section class="economy-grid">' +
      '<article class="panel"><h2>Growth and prices</h2>' +
      '<div class="toggle-row" role="group" aria-label="Choose series">' +
      '<button type="button" class="toggle-btn is-active" data-series="growth">GDP growth</button>' +
      '<button type="button" class="toggle-btn" data-series="inflation">Inflation</button>' +
      '</div>' +
      '<div id="economy-chart">' + charts.barChart(growthBars, { unit: '%', ariaLabel: 'GDP growth by year, percent' }) + '</div>' +
      '<p class="panel-note" id="economy-caption">Annual real GDP growth, 2019–2024. Output contracted 2.07% in 2020, then returned to about 5%. ' + sourceTag('BPS · 2024') + '</p></article>' +
      '<article class="panel"><h2>Where output comes from, 2024</h2>' +
      charts.donutChart(data.sectors, { centreTop: 'GDP', centreBottom: 'by sector', ariaLabel: 'GDP share by sector, percent' }) +
      '<p class="panel-note">Manufacturing is the largest single sector at 19.0% of GDP; services outside trade make up the biggest combined share. ' + sourceTag('BPS · 2024') + '</p></article>' +
      '<article class="panel"><h2>GDP per capita, 2019–2024 (US$)</h2>' +
      charts.barChart(perCapitaBars, { unit: '', color: '#2e7d6b', ariaLabel: 'GDP per capita in US dollars, 2019 to 2024' }) +
      '<p class="panel-note">Income per person fell to US$3,912 in 2020, then recovered to US$4,925 by 2024. ' + sourceTag('World Bank · 2024') + '</p></article>' +
      '<article class="panel"><h2>Trade, 2024</h2>' +
      '<div class="trade-grid">' + kpiCard(data.trade.exports) + kpiCard(data.trade.imports) + kpiCard(data.trade.balance) + '</div>' +
      '<p class="panel-note">Exports exceeded imports by US$31.0B in 2024, keeping the trade balance in surplus. ' + sourceTag('BPS · 2024') + '</p>' +
      '<h3>Headline size</h3><div class="trade-grid trade-grid-2">' + kpiCard(data.headline.gdp) + kpiCard(data.headline.gdpPerCapita) + '</div></article>' +
      '</section>';
  }

  function provinceRows(provinces) {
    if (provinces.length === 0) {
      return '<tr><td colspan="8" class="empty-row">No province matches that filter and search.</td></tr>';
    }
    return provinces.map(function (province) {
      return '<tr><td>' + explorer.rankOf(province, 'population') + '</td><td><a href="#/province/' +
        explorer.slugOf(province.name) + '">' + esc(province.name) + '</a></td><td>' + esc(province.capital) + '</td><td>' +
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
      return '<a class="tile" href="#/province/' + explorer.slugOf(province.name) + '" style="' + tileStyle(province.population) + '">' +
        '<strong>' + esc(province.name) + '</strong>' +
        '<span>' + province.population.toFixed(1) + 'M · ' + formatShare(province.population) + '</span></a>';
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
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Pop. rank</th><th>Province</th><th>Capital</th><th>Island</th><th>Population</th><th>Area km²</th><th>Density /km²</th><th>Share</th></tr></thead>' +
      '<tbody id="province-rows">' + provinceRows(data.provinces) + '</tbody></table></div>' +
      '<p class="panel-note">Population in millions (BPS 2024 estimates), land area in km², density computed as population ÷ area, share of the 283.5M national total. Open any province name for its full profile. ' + sourceTag('BPS · 2024') + '</p></section>' +
      '<section class="panel"><h2>Tile map — darker means larger share</h2><div class="tile-grid">' + tiles + '</div>' +
      '<p class="panel-note">Each tile is one of the 38 provinces; colour depth follows its share of national population. West Java alone holds 17.7%. ' + sourceTag('BPS · 2024') + '</p></section>';
  }

  function wellbeingCard(item) {
    var color = (item.key === 'poverty' || item.key === 'stunting') ? '#c47b2a' : '#0d4f4a';
    return '<article class="wellbeing-card">' +
      '<p class="kpi-value">' + esc(item.value) + '</p>' +
      '<p class="kpi-label">' + esc(item.label) + '</p>' +
      charts.progressBar(item.barPct, { color: color, ariaLabel: item.label + ' progress bar' }) +
      '<p class="wellbeing-note">' + esc(item.note) + '</p>' +
      sourceTag(item.source) +
      '</article>';
  }

  function wellbeingSection(title, group, gridClass) {
    var cards = data.wellbeing.filter(function (item) {
      return item.group === group;
    }).map(wellbeingCard).join('');
    return '<section class="wellbeing-section"><h2 class="wellbeing-subhead">' + esc(title) + '</h2>' +
      '<div class="wellbeing-grid ' + gridClass + '">' + cards + '</div></section>';
  }

  function renderWellbeing() {
    return pageHead('Wellbeing', 'Health, learning, income and access — how people are doing, not just how the economy is doing.') +
      wellbeingSection('Health', 'health', 'wellbeing-grid-2') +
      wellbeingSection('Education', 'education', '') +
      wellbeingSection('Living standards & access', 'living', '') +
      '<section class="panel"><h2>Reading these bars</h2>' +
      '<p>Bars for poverty (8.57%, BPS · Sep 2024) and stunting (21.5%, Kemenkes SSGI · 2023) run the other way: shorter is better. ' +
      'Literacy reaches 96.7% (BPS · 2023), mean schooling is 9.22 years (BPS · 2024) and primary participation 99.4% (BPS · 2024), ' +
      'while internet use is 79.5% (APJII · 2024) and the Human Development Index stands at 75.02 (BPS · 2024). ' +
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
      'Wellbeing bars scale each indicator to its natural maximum, except life expectancy, shown against 85 years, and mean schooling, shown against 15 years.</p></section>' +
      '<section class="panel"><h2>Source list</h2>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Indicator</th><th>Value</th><th>Source</th><th>Year</th></tr></thead><tbody>' +
      rows + '</tbody></table></div></section>' +
      '<section class="panel"><h2>Figure audit — Explorer indicators</h2>' +
      '<p>Every indicator in the <a href="#/explore">Indicator Explorer</a> carries this audit trail beside its chart, so a reader can check a figure before acting on it.</p>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Indicator</th><th>Unit</th><th>Source &amp; year</th><th>Frequency</th><th>Caveat</th></tr></thead><tbody>' +
      data.indicators.map(function (item) {
        return '<tr><td>' + esc(item.label) + '</td><td>' + esc(item.unit) + '</td><td>' +
          esc(item.source) + ' · ' + esc(item.year) + '</td><td>' + esc(item.frequency) + '</td><td>' + esc(item.caveat) + '</td></tr>';
      }).join('') +
      '</tbody></table></div></section>' +
      '<section class="panel"><h2>Download the data</h2>' +
      '<p>CSV files are generated in your browser from the same arrays that draw the charts.</p>' +
      '<div class="download-row">' +
      '<button type="button" class="download-btn" data-csv="provinces">Provinces CSV</button>' +
      '<button type="button" class="download-btn" data-csv="economy">Growth &amp; inflation CSV</button>' +
      '<button type="button" class="download-btn" data-csv="population">Population CSV</button>' +
      '</div></section>';
  }

  function indicatorByKey(key) {
    for (var i = 0; i < data.indicators.length; i++) {
      if (data.indicators[i].key === key) return data.indicators[i];
    }
    return data.indicators[0];
  }

  // The audit trail shown beside every Explorer chart: what the figure is,
  // where it came from, how to read it, and what would mislead.
  function auditCard(indicator) {
    return '<article class="panel audit-card"><h2>Figure audit — ' + esc(indicator.label) + '</h2>' +
      '<dl class="audit-list">' +
      '<div><dt>Definition</dt><dd>' + esc(indicator.definition) + '</dd></div>' +
      '<div><dt>Unit</dt><dd>' + esc(indicator.unit) + '</dd></div>' +
      '<div><dt>Source &amp; year</dt><dd>' + esc(indicator.source) + ' · ' + esc(indicator.year) + '</dd></div>' +
      '<div><dt>Frequency</dt><dd>' + esc(indicator.frequency) + '</dd></div>' +
      '<div><dt>How to read it</dt><dd>' + esc(indicator.howToRead) + '</dd></div>' +
      '<div><dt>Caveat</dt><dd>' + esc(indicator.caveat) + '</dd></div>' +
      '</dl></article>';
  }

  function explorerChart(indicator) {
    if (indicator.mode === 'province') {
      var top = explorer.rankedProvinces(indicator.key).slice(0, 10).map(function (row) {
        return { label: row.province.name.replace('North ', 'N. ').replace('South ', 'S. ').replace('West ', 'W. ').replace('East ', 'E. ').replace('Central ', 'C. '), value: Math.round(row.value * 10) / 10 };
      });
      return charts.barChart(top, { unit: indicator.key === 'share' ? '%' : '', ariaLabel: indicator.label + ', top 10 provinces' });
    }
    var bars = explorer.seriesFor(indicator.key).map(function (point) {
      return { label: String(point.year), value: point.value };
    });
    var unit = (indicator.key === 'growth' || indicator.key === 'inflation') ? '%' : (indicator.key === 'percapita' ? '' : 'M');
    return charts.barChart(bars, { unit: unit, ariaLabel: indicator.label + ' by year' });
  }

  function explorerTable(indicator) {
    if (indicator.mode === 'province') {
      var rows = explorer.rankedProvinces(indicator.key).map(function (row) {
        return '<tr><td>' + row.rank + '</td><td><a href="#/province/' + explorer.slugOf(row.province.name) + '">' +
          esc(row.province.name) + '</a></td><td>' + esc(row.province.island) + '</td><td>' +
          explorer.formatProvinceValue(row.value, indicator.key) + '</td></tr>';
      }).join('');
      return '<div class="table-wrap"><table class="data-table"><thead><tr><th>Rank</th><th>Province</th><th>Island group</th><th>' +
        esc(indicator.label) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    }
    var summary = explorer.seriesSummary(indicator.key);
    var srows = explorer.seriesFor(indicator.key).map(function (point) {
      return '<tr><td>' + point.year + '</td><td>' + explorer.formatSeriesValue(point.value, indicator.key) + '</td></tr>';
    }).join('');
    return '<p class="panel-note">From ' + explorer.formatSeriesValue(summary.first.value, indicator.key) + ' in ' + summary.first.year +
      ' to ' + explorer.formatSeriesValue(summary.last.value, indicator.key) + ' in ' + summary.last.year +
      '. Highest: ' + explorer.formatSeriesValue(summary.high.value, indicator.key) + ' (' + summary.high.year +
      '). Lowest: ' + explorer.formatSeriesValue(summary.low.value, indicator.key) + ' (' + summary.low.year + '). ' +
      sourceTag(indicator.source + ' · ' + indicator.year) + '</p>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Year</th><th>' + esc(indicator.label) +
      '</th></tr></thead><tbody>' + srows + '</tbody></table></div>';
  }

  function provinceOptions(selectedName) {
    return data.provinces.map(function (province) {
      var selected = province.name === selectedName ? ' selected' : '';
      return '<option value="' + esc(province.name) + '"' + selected + '>' + esc(province.name) + '</option>';
    }).join('');
  }

  function compareCard(province) {
    return '<article class="compare-card"><h3><a href="#/province/' + explorer.slugOf(province.name) + '">' + esc(province.name) + '</a></h3>' +
      '<p class="compare-meta">' + esc(province.capital) + ' · ' + esc(province.island) + '</p>' +
      '<ul class="compare-stats">' +
      '<li>Population <strong>' + province.population.toFixed(1) + 'M</strong> (rank ' + explorer.rankOf(province, 'population') + ' of 38)</li>' +
      '<li>Density <strong>' + Math.round(explorer.densityOf(province)).toLocaleString('en-US') + '/km²</strong> (rank ' + explorer.rankOf(province, 'density') + ')</li>' +
      '<li>Land area <strong>' + formatArea(province.area) + ' km²</strong> (rank ' + explorer.rankOf(province, 'area') + ')</li>' +
      '<li>Share of country <strong>' + formatShare(province.population) + '</strong></li>' +
      '</ul></article>';
  }

  function comparePanel(aName, bName) {
    var a = explorer.findProvince(explorer.slugOf(aName)) || data.provinces[11];
    var b = explorer.findProvince(explorer.slugOf(bName)) || data.provinces[10];
    var verdict = explorer.compareVerdict(a, b).map(function (line) {
      return '<li>' + esc(line) + '</li>';
    }).join('');
    return '<div class="compare-grid">' + compareCard(a) + compareCard(b) + '</div>' +
      '<ul class="verdict-list">' + verdict + '</ul>' +
      '<p class="panel-note">Ranks and ratios computed from the BPS 2024 province figures. ' + sourceTag('Computed from BPS · 2024') + '</p>';
  }

  function renderExplore() {
    var indicator = indicatorByKey('population');
    var buttons = data.indicators.map(function (item) {
      var active = item.key === indicator.key ? ' is-active' : '';
      return '<button type="button" class="filter-btn' + active + '" data-indicator="' + esc(item.key) + '">' + esc(item.label) + '</button>';
    }).join('');
    return pageHead('Explore', 'Pick an indicator to rank every province or plot a national series — each figure with its audit trail — then compare any two provinces side by side.') +
      '<section class="panel"><h2>Indicator Explorer</h2>' +
      '<div class="filter-row" role="group" aria-label="Choose indicator">' + buttons + '</div>' +
      '<div id="explorer-chart">' + explorerChart(indicator) + '</div>' +
      '<p class="panel-note" id="explorer-caption">Top 10 provinces by population. Full ranking below. ' + sourceTag('BPS · 2024') + '</p>' +
      '<div id="explorer-table">' + explorerTable(indicator) + '</div>' +
      '<div class="download-row"><button type="button" class="download-btn" id="explorer-csv">Download this view as CSV</button></div>' +
      '</section>' +
      '<div id="explorer-audit">' + auditCard(indicator) + '</div>' +
      '<section class="panel"><h2>Compare two provinces</h2>' +
      '<div class="compare-controls">' +
      '<label class="search-label">Province A <select id="compare-a">' + provinceOptions('West Java') + '</select></label>' +
      '<label class="search-label">Province B <select id="compare-b">' + provinceOptions('Jakarta') + '</select></label>' +
      '</div>' +
      '<div id="compare-panel">' + comparePanel('West Java', 'Jakarta') + '</div></section>';
  }

  function renderProvince(slug) {
    var province = explorer.findProvince(slug || '');
    if (!province) {
      return pageHead('Province not found', 'That province link does not match any of the 38 provinces.') +
        '<section class="panel"><p><a href="#/regions">Back to all 38 provinces</a></p></section>';
    }
    var nationalDensity = 149;
    var multiple = explorer.densityOf(province) / nationalDensity;
    var island = explorer.islandTotals().filter(function (row) { return row.group === province.island; })[0];
    var islandShare = (province.population / island.population) * 100;
    return '<p class="crumb"><a href="#/regions">Regions</a> · <a href="#/explore">Explore</a></p>' +
      pageHead(province.name, province.capital + ' · ' + province.island + ' — province profile from the BPS 2024 figures.') +
      '<section class="kpi-row" aria-label="Province key figures">' +
      kpiCard({ value: province.population.toFixed(1) + 'M', label: 'Population', source: 'BPS · 2024' }) +
      kpiCard({ value: formatShare(province.population), label: 'Share of country', source: 'Computed · 2024' }) +
      kpiCard({ value: Math.round(explorer.densityOf(province)).toLocaleString('en-US') + '/km²', label: 'Density', source: 'Computed · 2024' }) +
      kpiCard({ value: formatArea(province.area) + ' km²', label: 'Land area', source: 'BPS · 2024' }) +
      kpiCard({ value: '#' + explorer.rankOf(province, 'population') + ' of 38', label: 'Population rank', source: 'Computed · 2024' }) +
      kpiCard({ value: '#' + explorer.rankOf(province, 'density') + ' of 38', label: 'Density rank', source: 'Computed · 2024' }) +
      '</section>' +
      '<section class="panel"><h2>How ' + esc(province.name) + ' compares</h2>' +
      charts.progressBar(shareOf(province.population), { ariaLabel: 'Share of national population' }) +
      '<p>' + esc(province.name) + ' holds ' + formatShare(province.population) + ' of Indonesia’s 283.5M people and ' +
      islandShare.toFixed(1) + '% of the ' + esc(province.island) + ' island group (' + island.population.toFixed(1) + 'M across ' + island.count + ' provinces). ' +
      'Its density of ' + Math.round(explorer.densityOf(province)).toLocaleString('en-US') + ' people/km² is ' + multiple.toFixed(1) +
      '× the national average of 149/km² (BPS · 2024). By land area it ranks #' + explorer.rankOf(province, 'area') + ' of 38.</p>' +
      '<p class="panel-note">Population and area: BPS 2024. Shares, density and ranks computed from those figures. ' + sourceTag('BPS · 2024') + '</p>' +
      '<p><a href="#/explore">Compare ' + esc(province.name) + ' with another province</a> · <a href="#/regions">All 38 provinces</a></p></section>';
  }

  window.NusaViews = {
    renderOverview: renderOverview,
    renderPopulation: renderPopulation,
    renderEconomy: renderEconomy,
    renderRegions: renderRegions,
    renderWellbeing: renderWellbeing,
    renderSources: renderSources,
    renderExplore: renderExplore,
    renderProvince: renderProvince,
    explorerChart: explorerChart,
    explorerTable: explorerTable,
    auditCard: auditCard,
    comparePanel: comparePanel,
    indicatorByKey: indicatorByKey,
    provinceRows: provinceRows
  };
})();
