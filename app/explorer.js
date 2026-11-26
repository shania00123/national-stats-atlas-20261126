// Nusa in Numbers — explorer computations.
// Pure derivations over the published figures in data.js: province ranks,
// island-group totals, series summaries and two-province comparisons.
// Nothing here invents a statistic; every result is arithmetic on a
// sourced figure and views label it as computed.
(function () {
  'use strict';

  var data = window.NusaData;

  function densityOf(province) {
    return (province.population * 1000000) / province.area;
  }

  function shareOf(population) {
    return (population / data.nationalPopulation) * 100;
  }

  function provinceValue(province, key) {
    if (key === 'density') return densityOf(province);
    if (key === 'area') return province.area;
    if (key === 'share') return shareOf(province.population);
    return province.population;
  }

  function formatProvinceValue(value, key) {
    if (key === 'density') return Math.round(value).toLocaleString('en-US');
    if (key === 'area') return value.toLocaleString('en-US');
    if (key === 'share') return value.toFixed(1) + '%';
    return value.toFixed(1) + 'M';
  }

  // All 38 provinces ranked high to low on one province-mode indicator.
  function rankedProvinces(key) {
    var rows = data.provinces.map(function (province) {
      return { province: province, value: provinceValue(province, key) };
    });
    rows.sort(function (a, b) { return b.value - a.value; });
    rows.forEach(function (row, index) { row.rank = index + 1; });
    return rows;
  }

  function rankOf(province, key) {
    var rows = rankedProvinces(key);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].province.name === province.name) return rows[i].rank;
    }
    return rows.length;
  }

  // Island-group totals computed by summing the BPS 2024 province figures.
  function islandTotals() {
    return data.islandGroups.map(function (group) {
      var members = data.provinces.filter(function (province) {
        return province.island === group;
      });
      var population = members.reduce(function (sum, p) { return sum + p.population; }, 0);
      var area = members.reduce(function (sum, p) { return sum + p.area; }, 0);
      return {
        group: group,
        count: members.length,
        population: population,
        area: area,
        density: (population * 1000000) / area,
        share: shareOf(population)
      };
    });
  }

  function seriesFor(key) {
    if (key === 'growth') return data.gdpGrowthSeries;
    if (key === 'inflation') return data.inflationSeries;
    if (key === 'percapita') return data.gdpPerCapitaSeries;
    if (key === 'poplong') return data.populationLongSeries;
    return data.populationSeries;
  }

  // First-to-last change and extremes, computed from the published series.
  function seriesSummary(key) {
    var series = seriesFor(key);
    var first = series[0];
    var last = series[series.length - 1];
    var high = series[0];
    var low = series[0];
    series.forEach(function (point) {
      if (point.value > high.value) high = point;
      if (point.value < low.value) low = point;
    });
    return { first: first, last: last, high: high, low: low, change: last.value - first.value };
  }

  function formatSeriesValue(value, key) {
    if (key === 'percapita') return 'US$' + Math.round(value).toLocaleString('en-US');
    if (key === 'growth' || key === 'inflation') return value.toFixed(2) + '%';
    return value.toFixed(1) + 'M';
  }

  function slugOf(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  function findProvince(slug) {
    for (var i = 0; i < data.provinces.length; i++) {
      if (slugOf(data.provinces[i].name) === slug) return data.provinces[i];
    }
    return null;
  }

  // Plain-language verdict lines for a two-province comparison, each one
  // arithmetic on the two provinces' published figures.
  function compareVerdict(a, b) {
    var lines = [];
    var bigger = a.population >= b.population ? a : b;
    var smaller = bigger === a ? b : a;
    var popRatio = bigger.population / smaller.population;
    lines.push(bigger.name + ' has ' + popRatio.toFixed(1) + '× the population of ' + smaller.name +
      ' (' + bigger.population.toFixed(1) + 'M vs ' + smaller.population.toFixed(1) + 'M).');
    var denser = densityOf(a) >= densityOf(b) ? a : b;
    var sparser = denser === a ? b : a;
    var denRatio = densityOf(denser) / densityOf(sparser);
    lines.push(denser.name + ' is ' + denRatio.toFixed(1) + '× as dense (' +
      Math.round(densityOf(denser)).toLocaleString('en-US') + ' vs ' +
      Math.round(densityOf(sparser)).toLocaleString('en-US') + ' people/km²).');
    var wider = a.area >= b.area ? a : b;
    var narrower = wider === a ? b : a;
    lines.push(wider.name + ' covers ' + (wider.area / narrower.area).toFixed(1) + '× the land area of ' +
      narrower.name + ' (' + wider.area.toLocaleString('en-US') + ' vs ' +
      narrower.area.toLocaleString('en-US') + ' km²).');
    return lines;
  }

  window.NusaExplorer = {
    densityOf: densityOf,
    shareOf: shareOf,
    provinceValue: provinceValue,
    formatProvinceValue: formatProvinceValue,
    rankedProvinces: rankedProvinces,
    rankOf: rankOf,
    islandTotals: islandTotals,
    seriesFor: seriesFor,
    seriesSummary: seriesSummary,
    formatSeriesValue: formatSeriesValue,
    slugOf: slugOf,
    findProvince: findProvince,
    compareVerdict: compareVerdict
  };
})();
