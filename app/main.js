// Nusa in Numbers — routing and control wiring.
(function () {
  'use strict';

  var data = window.NusaData;
  var charts = window.NusaCharts;
  var views = window.NusaViews;
  var app = document.getElementById('app');

  var routes = {
    overview: views.renderOverview,
    population: views.renderPopulation,
    economy: views.renderEconomy,
    regions: views.renderRegions,
    explore: views.renderExplore,
    wellbeing: views.renderWellbeing,
    sources: views.renderSources
  };

  var regionState = { query: '', island: 'All', sortKey: 'population', sortDir: -1 };

  function currentRoute() {
    var hash = window.location.hash.replace(/^#\/?/, '');
    return routes[hash] ? hash : 'overview';
  }

  function markActiveNav(route) {
    var links = document.querySelectorAll('.site-nav a');
    links.forEach(function (link) {
      if (link.getAttribute('data-route') === route) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function render() {
    var hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.indexOf('province/') === 0) {
      app.innerHTML = views.renderProvince(hash.slice('province/'.length));
      markActiveNav('regions');
      window.scrollTo(0, 0);
      return;
    }
    var route = currentRoute();
    app.innerHTML = routes[route]();
    markActiveNav(route);
    if (route === 'economy') wireEconomyToggle();
    if (route === 'regions') wireRegionControls();
    if (route === 'explore') wireExplorer();
    if (route === 'sources') wireDownloads();
    window.scrollTo(0, 0);
  }

  // Economy: one chart, two series. Buttons swap the bars and the caption.
  function wireEconomyToggle() {
    var chartBox = document.getElementById('economy-chart');
    var caption = document.getElementById('economy-caption');
    var buttons = document.querySelectorAll('[data-series]');
    var captions = {
      growth: 'Annual real GDP growth, 2019–2024. Output contracted 2.07% in 2020, then returned to about 5%.',
      inflation: 'December year-on-year inflation, 2019–2024. Prices rose fastest in 2022 at 5.51%, then eased to 1.57%.'
    };
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var series = button.getAttribute('data-series');
        buttons.forEach(function (other) { other.classList.remove('is-active'); });
        button.classList.add('is-active');
        if (series === 'inflation') {
          var inflationBars = data.inflationSeries.map(function (point) {
            return { label: String(point.year), value: point.value };
          });
          chartBox.innerHTML = charts.barChart(inflationBars, { unit: '%', color: '#c47b2a', ariaLabel: 'Inflation by year, percent' });
        } else {
          var growthBars = data.gdpGrowthSeries.map(function (point) {
            return { label: String(point.year), value: point.value };
          });
          chartBox.innerHTML = charts.barChart(growthBars, { unit: '%', ariaLabel: 'GDP growth by year, percent' });
        }
        caption.innerHTML = captions[series] + ' <span class="source-tag">BPS · 2024</span>';
      });
    });
  }

  // Regions: island filter and search narrow the rows; sort buttons flip
  // direction on repeat clicks. Density is derived, never stored.
  function densityOf(province) {
    return (province.population * 1000000) / province.area;
  }

  function sortValue(province, key) {
    if (key === 'name') return province.name;
    if (key === 'area') return province.area;
    if (key === 'density') return densityOf(province);
    return province.population;
  }

  function filteredProvinces() {
    var query = regionState.query.trim().toLowerCase();
    var rows = data.provinces.filter(function (province) {
      if (regionState.island !== 'All' && province.island !== regionState.island) return false;
      if (!query) return true;
      return province.name.toLowerCase().indexOf(query) !== -1 ||
        province.capital.toLowerCase().indexOf(query) !== -1;
    });
    rows.sort(function (a, b) {
      var left = sortValue(a, regionState.sortKey);
      var right = sortValue(b, regionState.sortKey);
      if (left < right) return -1 * regionState.sortDir;
      if (left > right) return 1 * regionState.sortDir;
      return 0;
    });
    return rows;
  }

  function refreshProvinceRows() {
    var rows = filteredProvinces();
    var body = document.getElementById('province-rows');
    if (body) body.innerHTML = views.provinceRows(rows);
    var count = document.getElementById('region-count');
    if (count) count.textContent = 'Showing ' + rows.length + ' of ' + data.provinces.length + ' provinces';
  }

  function markSortButtons() {
    var bases = {
      population: 'Sort by population',
      area: 'Sort by area',
      density: 'Sort by density',
      name: 'Sort by name'
    };
    var sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(function (button) {
      var key = button.getAttribute('data-sort');
      var active = key === regionState.sortKey;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.textContent = active ? bases[key] + (regionState.sortDir === 1 ? ' ↑' : ' ↓') : bases[key];
    });
  }

  function markFilterButtons() {
    var filterButtons = document.querySelectorAll('[data-island]');
    filterButtons.forEach(function (button) {
      var active = button.getAttribute('data-island') === regionState.island;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function wireRegionControls() {
    var search = document.getElementById('region-search');
    if (search) {
      search.addEventListener('input', function () {
        regionState.query = search.value;
        refreshProvinceRows();
      });
    }
    var filterButtons = document.querySelectorAll('[data-island]');
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        regionState.island = button.getAttribute('data-island');
        markFilterButtons();
        refreshProvinceRows();
      });
    });
    var sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-sort');
        if (regionState.sortKey === key) {
          regionState.sortDir = regionState.sortDir * -1;
        } else {
          regionState.sortKey = key;
          regionState.sortDir = key === 'name' ? 1 : -1;
        }
        markSortButtons();
        refreshProvinceRows();
      });
    });
    markFilterButtons();
    markSortButtons();
    refreshProvinceRows();
  }

  // Sources: build CSV text from the data arrays and download it as a Blob.
  function csvText(kind) {
    var lines = [];
    if (kind === 'provinces') {
      lines.push('province,capital,island,population_millions,area_km2,density_per_km2,share_percent,source,year');
      data.provinces.forEach(function (province) {
        var share = ((province.population / data.nationalPopulation) * 100).toFixed(2);
        var density = Math.round(densityOf(province));
        lines.push([province.name, province.capital, province.island, province.population.toFixed(1), province.area, density, share, 'BPS', '2024'].join(','));
      });
    } else if (kind === 'economy') {
      lines.push('year,gdp_growth_percent,inflation_dec_yoy_percent,source');
      data.gdpGrowthSeries.forEach(function (point, index) {
        lines.push([point.year, point.value.toFixed(2), data.inflationSeries[index].value.toFixed(2), 'BPS'].join(','));
      });
    } else {
      lines.push('year,population_millions,source');
      data.populationSeries.forEach(function (point) {
        lines.push([point.year, point.value.toFixed(1), 'BPS / World Bank'].join(','));
      });
    }
    return lines.join('\n') + '\n';
  }

  function downloadCsv(kind) {
    var blob = new Blob([csvText(kind)], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'nusa-' + kind + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Explore: indicator buttons swap chart, table and audit card together;
  // compare selects rebuild the side-by-side panel; the CSV button exports
  // exactly the view on screen.
  var explorerState = { key: 'population' };

  function explorerCsv() {
    var indicator = views.indicatorByKey(explorerState.key);
    var lines = [];
    if (indicator.mode === 'province') {
      lines.push('rank,province,island_group,value,unit,source,year');
      window.NusaExplorer.rankedProvinces(indicator.key).forEach(function (row) {
        lines.push([row.rank, row.province.name, row.province.island,
          row.value.toFixed(2), indicator.unit, indicator.source, indicator.year].join(','));
      });
    } else {
      lines.push('year,value,unit,source');
      window.NusaExplorer.seriesFor(indicator.key).forEach(function (point) {
        lines.push([point.year, point.value, indicator.unit, indicator.source].join(','));
      });
    }
    return lines.join('\n') + '\n';
  }

  function wireExplorer() {
    var buttons = document.querySelectorAll('[data-indicator]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        explorerState.key = button.getAttribute('data-indicator');
        buttons.forEach(function (other) { other.classList.remove('is-active'); });
        button.classList.add('is-active');
        var indicator = views.indicatorByKey(explorerState.key);
        document.getElementById('explorer-chart').innerHTML = views.explorerChart(indicator);
        document.getElementById('explorer-table').innerHTML = views.explorerTable(indicator);
        document.getElementById('explorer-audit').innerHTML = views.auditCard(indicator);
        var caption = document.getElementById('explorer-caption');
        caption.innerHTML = (indicator.mode === 'province'
          ? 'Top 10 provinces. Full ranking below. '
          : 'Full published series. Data table below. ') +
          '<span class="source-tag">' + indicator.source + ' · ' + indicator.year + '</span>';
      });
    });
    var csvButton = document.getElementById('explorer-csv');
    if (csvButton) {
      csvButton.addEventListener('click', function () {
        var blob = new Blob([explorerCsv()], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'nusa-explorer-' + explorerState.key + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    }
    var selectA = document.getElementById('compare-a');
    var selectB = document.getElementById('compare-b');
    function refreshCompare() {
      document.getElementById('compare-panel').innerHTML = views.comparePanel(selectA.value, selectB.value);
    }
    if (selectA && selectB) {
      selectA.addEventListener('change', refreshCompare);
      selectB.addEventListener('change', refreshCompare);
    }
  }

  function wireDownloads() {
    var buttons = document.querySelectorAll('[data-csv]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        downloadCsv(button.getAttribute('data-csv'));
      });
    });
  }

  window.addEventListener('hashchange', render);
  render();
})();
