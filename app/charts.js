// Nusa in Numbers — chart builders.
// Each builder returns an SVG string; views place the string in the page.
(function () {
  'use strict';

  function escapeText(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatValue(value, unit) {
    var rounded = Math.round(value * 100) / 100;
    var text = rounded.toFixed(2).replace(/\.?0+$/, '');
    if (text === '-0') text = '0';
    return text + (unit || '');
  }

  // Vertical bars with a zero baseline, so negative values hang below the axis.
  // series: [{ label, value }]; options: { color, negativeColor, unit, ariaLabel }
  function barChart(series, options) {
    var opts = options || {};
    var color = opts.color || '#0d4f4a';
    var negativeColor = opts.negativeColor || '#c0563b';
    var unit = opts.unit || '';
    var width = 560;
    var height = 240;
    var padLeft = 44;
    var padRight = 12;
    var padTop = 26;
    var padBottom = 30;
    var plotW = width - padLeft - padRight;
    var plotH = height - padTop - padBottom;
    var max = 0;
    var min = 0;
    series.forEach(function (point) {
      if (point.value > max) max = point.value;
      if (point.value < min) min = point.value;
    });
    if (max === min) max = min + 1;
    var span = max - min;
    var zeroY = padTop + (max / span) * plotH;
    var slot = plotW / series.length;
    var barW = Math.min(52, slot * 0.62);
    var parts = [];
    parts.push('<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + escapeText(opts.ariaLabel || 'Bar chart') + '">');
    parts.push('<line x1="' + padLeft + '" y1="' + zeroY.toFixed(1) + '" x2="' + (width - padRight) + '" y2="' + zeroY.toFixed(1) + '" class="chart-axis"></line>');
    parts.push('<text x="' + (padLeft - 8) + '" y="' + (padTop + 4) + '" class="chart-scale" text-anchor="end">' + escapeText(formatValue(max, unit)) + '</text>');
    if (min < 0) {
      parts.push('<text x="' + (padLeft - 8) + '" y="' + (height - padBottom + 4) + '" class="chart-scale" text-anchor="end">' + escapeText(formatValue(min, unit)) + '</text>');
    }
    series.forEach(function (point, index) {
      var x = padLeft + slot * index + (slot - barW) / 2;
      var y = padTop + ((max - point.value) / span) * plotH;
      var top = Math.min(y, zeroY);
      var barH = Math.max(2, Math.abs(zeroY - y));
      var fill = point.value < 0 ? negativeColor : color;
      var labelY = point.value < 0 ? top + barH + 14 : top - 6;
      parts.push('<rect x="' + x.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="3" fill="' + fill + '"></rect>');
      parts.push('<text x="' + (x + barW / 2).toFixed(1) + '" y="' + labelY.toFixed(1) + '" class="chart-value" text-anchor="middle">' + escapeText(formatValue(point.value, unit)) + '</text>');
      parts.push('<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (height - 10) + '" class="chart-label" text-anchor="middle">' + escapeText(point.label) + '</text>');
    });
    parts.push('</svg>');
    return parts.join('');
  }

  // Line with a dot per point. series: [{ label, value }]
  function lineChart(series, options) {
    var opts = options || {};
    var color = opts.color || '#0d4f4a';
    var unit = opts.unit || '';
    var width = 560;
    var height = 240;
    var padLeft = 52;
    var padRight = 16;
    var padTop = 26;
    var padBottom = 30;
    var plotW = width - padLeft - padRight;
    var plotH = height - padTop - padBottom;
    var max = -Infinity;
    var min = Infinity;
    series.forEach(function (point) {
      if (point.value > max) max = point.value;
      if (point.value < min) min = point.value;
    });
    var pad = (max - min) * 0.12 || 1;
    max += pad;
    min -= pad;
    var span = max - min;
    var xFor = function (index) {
      return padLeft + (series.length === 1 ? plotW / 2 : (plotW * index) / (series.length - 1));
    };
    var yFor = function (value) {
      return padTop + ((max - value) / span) * plotH;
    };
    var points = series.map(function (point, index) {
      return xFor(index).toFixed(1) + ',' + yFor(point.value).toFixed(1);
    }).join(' ');
    var parts = [];
    parts.push('<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + escapeText(opts.ariaLabel || 'Line chart') + '">');
    parts.push('<line x1="' + padLeft + '" y1="' + (height - padBottom) + '" x2="' + (width - padRight) + '" y2="' + (height - padBottom) + '" class="chart-axis"></line>');
    parts.push('<text x="' + (padLeft - 8) + '" y="' + (padTop + 4) + '" class="chart-scale" text-anchor="end">' + escapeText(formatValue(max - pad, unit)) + '</text>');
    parts.push('<text x="' + (padLeft - 8) + '" y="' + (height - padBottom + 4) + '" class="chart-scale" text-anchor="end">' + escapeText(formatValue(min + pad, unit)) + '</text>');
    parts.push('<polyline points="' + points + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></polyline>');
    series.forEach(function (point, index) {
      var x = xFor(index);
      var y = yFor(point.value);
      parts.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="' + color + '"></circle>');
      if (index === 0 || index === series.length - 1) {
        parts.push('<text x="' + x.toFixed(1) + '" y="' + (y - 10).toFixed(1) + '" class="chart-value" text-anchor="middle">' + escapeText(formatValue(point.value, unit)) + '</text>');
      }
      if (index % 2 === 0 || index === series.length - 1) {
        parts.push('<text x="' + x.toFixed(1) + '" y="' + (height - 10) + '" class="chart-label" text-anchor="middle">' + escapeText(point.label) + '</text>');
      }
    });
    parts.push('</svg>');
    return parts.join('');
  }

  // Donut from circle segments. slices: [{ label, value, color }]
  function donutChart(slices, options) {
    var opts = options || {};
    var total = slices.reduce(function (sum, slice) { return sum + slice.value; }, 0) || 1;
    var radius = 84;
    var circumference = 2 * Math.PI * radius;
    var offset = 0;
    var parts = [];
    parts.push('<div class="donut-wrap">');
    parts.push('<svg class="donut-svg" viewBox="0 0 220 220" role="img" aria-label="' + escapeText(opts.ariaLabel || 'Donut chart') + '">');
    parts.push('<circle cx="110" cy="110" r="' + radius + '" fill="none" stroke="#e7dfd2" stroke-width="30"></circle>');
    slices.forEach(function (slice) {
      var length = (slice.value / total) * circumference;
      var dash = length.toFixed(2) + ' ' + (circumference - length).toFixed(2);
      var dashOffset = (-offset).toFixed(2);
      parts.push('<circle cx="110" cy="110" r="' + radius + '" fill="none" stroke="' + slice.color + '" stroke-width="30" stroke-dasharray="' + dash + '" stroke-dashoffset="' + dashOffset + '" transform="rotate(-90 110 110)"></circle>');
      offset += length;
    });
    parts.push('<text x="110" y="104" class="donut-centre" text-anchor="middle">' + escapeText(opts.centreTop || '') + '</text>');
    parts.push('<text x="110" y="126" class="donut-centre-small" text-anchor="middle">' + escapeText(opts.centreBottom || '') + '</text>');
    parts.push('</svg>');
    parts.push('<ul class="donut-legend">');
    slices.forEach(function (slice) {
      parts.push('<li><span class="legend-swatch" style="background:' + slice.color + '"></span>' + escapeText(slice.label) + ' <strong>' + escapeText(formatValue(slice.value, '%')) + '</strong></li>');
    });
    parts.push('</ul>');
    parts.push('</div>');
    return parts.join('');
  }

  // Horizontal progress bar as SVG. pct is 0..100.
  function progressBar(pct, options) {
    var opts = options || {};
    var color = opts.color || '#0d4f4a';
    var clamped = Math.max(0, Math.min(100, pct));
    var width = 320;
    var filled = ((width * clamped) / 100).toFixed(1);
    return '<svg class="progress-svg" viewBox="0 0 ' + width + ' 14" role="img" aria-label="' + escapeText(opts.ariaLabel || 'Progress') + '">' +
      '<rect x="0" y="2" width="' + width + '" height="10" rx="5" fill="#e7dfd2"></rect>' +
      '<rect x="0" y="2" width="' + filled + '" height="10" rx="5" fill="' + color + '"></rect>' +
      '</svg>';
  }

  window.NusaCharts = {
    barChart: barChart,
    lineChart: lineChart,
    donutChart: donutChart,
    progressBar: progressBar,
    escapeText: escapeText
  };
})();
