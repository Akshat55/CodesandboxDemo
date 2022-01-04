var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var generateThemePickerHTML = function (container, configs) {
    var div = document.createElement('div');
    div.id = 'theme-picker';
    div.innerHTML = "\n<fieldset class=\"bx--fieldset marginTop-45\">\n\t<legend class=\"bx--label\">Active theme</legend>\n\n\t<div class=\"bx--form-item\">\n\t\t<div class=\"bx--radio-button-group \">\n\t\t\t<div class=\"bx--radio-button-wrapper\">\n\t\t\t\t<input id=\"radio-button-abfeuherm2f-1\" class=\"bx--radio-button\" type=\"radio\" value=\"white\" name=\"radio-button\" tabindex=\"0\">\n\t\t\t\t<label for=\"radio-button-abfeuherm2f-1\" class=\"bx--radio-button__label\">\n\t\t\t\t<span class=\"bx--radio-button__appearance\"></span>\n\t\t\t\t<span class=\"bx--radio-button__label-text\">White</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"bx--radio-button-wrapper\">\n\t\t\t\t<input id=\"radio-button-abfeuherm2f-2\" class=\"bx--radio-button\" type=\"radio\" value=\"g10\" name=\"radio-button\" tabindex=\"0\">\n\t\t\t\t<label for=\"radio-button-abfeuherm2f-2\" class=\"bx--radio-button__label\">\n\t\t\t\t<span class=\"bx--radio-button__appearance\"></span>\n\t\t\t\t<span class=\"bx--radio-button__label-text\">G10</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"bx--radio-button-wrapper\">\n\t\t\t\t<input id=\"radio-button-abfeuherm2f-3\" class=\"bx--radio-button\" type=\"radio\" value=\"g90\" name=\"radio-button\" tabindex=\"0\">\n\t\t\t\t<label for=\"radio-button-abfeuherm2f-3\" class=\"bx--radio-button__label\">\n\t\t\t\t<span class=\"bx--radio-button__appearance\"></span>\n\t\t\t\t<span class=\"bx--radio-button__label-text\">G90</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t\t<div class=\"bx--radio-button-wrapper\">\n\t\t\t\t<input id=\"radio-button-abfeuherm2f-4\" class=\"bx--radio-button\" type=\"radio\" value=\"g100\" name=\"radio-button\" tabindex=\"0\" checked>\n\t\t\t\t<label for=\"radio-button-abfeuherm2f-4\" class=\"bx--radio-button__label\">\n\t\t\t\t<span class=\"bx--radio-button__appearance\"></span>\n\t\t\t\t<span class=\"bx--radio-button__label-text\">G100</span>\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</fieldset>";
    container.querySelector('#charting-controls').appendChild(div);
};
var generateColorPalettePickerHTML = function (container, chart, configs) {
    if (configs === void 0) { configs = { colorPairingOptions: null }; }
    var colorPairingOptions = configs.colorPairingOptions;
    var chartOptions = chart.model.getOptions();
    var _a = chartOptions.color.pairing, variants = _a.numberOfVariants, option = _a.option;
    var numberOfChartDataGroups = chart.model.getAllDataGroupsNames().length;
    var numberOfVariants = variants || numberOfChartDataGroups;
    var onlyCategoricalPaletteIsApplicable = false;
    if (numberOfChartDataGroups > 5) {
        onlyCategoricalPaletteIsApplicable = true;
    }
    var selectedColorPalette = numberOfVariants + "-" + option;
    var div = document.createElement('div');
    div.id = 'color-palette-picker';
    div.innerHTML = "\n<div class=\"bx--form-item\">\n\t<div\n\tclass=\"bx--select\">\n\t<label for=\"color-palette-select\" class=\"bx--label\">Active color palette</label>\n\t\t<div class=\"bx--select-input__wrapper\">\n\t\t<select id=\"color-palette-select\" class=\"bx--select-input\">\n\t\t\t<option class=\"bx--select-option\" value=\"\" disabled selected hidden>\n\t\t\tChoose an option\n\t\t\t</option>\n\t\t\t" + Object.keys(colorPairingOptions)
        .map(function (colorGroup) {
        var optionsCount = colorPairingOptions[colorGroup];
        var optionsHTML = "<optgroup class=\"bx--select-optgroup\" label=\"" + colorGroup + " groups\">";
        var numberOfVariants = parseInt(colorGroup);
        if (numberOfVariants !== 14) {
            for (var i = 1; i <= optionsCount; i++) {
                optionsHTML += "\n\t\t\t\t\t\t<option class=\"bx--select-option\" " + (onlyCategoricalPaletteIsApplicable ||
                    numberOfVariants < numberOfChartDataGroups
                    ? 'disabled'
                    : '') + " value=\"" + colorGroup + "-option-" + i + "\" " + (selectedColorPalette ===
                    numberOfVariants + "-" + i
                    ? 'selected'
                    : '') + ">\n\t\t\t\t\t\t\t" + numberOfVariants + "-color groups, option " + i + "\n\t\t\t\t\t\t</option>";
            }
        }
        else {
            optionsHTML += "<option class=\"bx--select-option\" value=\"14-color-option-1\" " + (selectedColorPalette === "14-1" ||
                onlyCategoricalPaletteIsApplicable
                ? 'selected'
                : '') + ">\n\t\t\t\t\t\tCategorical palette\n\t\t\t\t\t</option>";
        }
        return optionsHTML;
    })
        .join('') + "\n\t\t</select>\n\t\t<svg focusable=\"false\" preserveAspectRatio=\"xMidYMid meet\" style=\"will-change: transform;\" xmlns=\"http://www.w3.org/2000/svg\" class=\"bx--select__arrow\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><path d=\"M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z\"></path></svg>\n\t\t</div>\n\t</div>\n\t</div>\n</div>";
    div.querySelector('#color-palette-select').addEventListener('change', function (e) {
        var value = e.target.value;
        var _a = value.split('-color-option-'), numberOfVariants = _a[0], pairingOption = _a[1];
        chartOptions.color.pairing.numberOfVariants = numberOfVariants;
        chartOptions.color.pairing.option = pairingOption;
        chart.model.setOptions(chartOptions);
    });
    container.querySelector('#charting-controls').appendChild(div);
};
export var addControls = function (container, demoGroup, chart, configs) {
    if (configs === void 0) { configs = { colorPairingOptions: null }; }
    var _a, _b;
    generateThemePickerHTML(container, configs);
    if (((_b = (_a = demoGroup) === null || _a === void 0 ? void 0 : _a.configs) === null || _b === void 0 ? void 0 : _b.excludeColorPaletteControl) !== true) {
        generateColorPalettePickerHTML(container, chart, configs);
    }
    addRadioButtonEventListeners(container, chart, configs);
};
export var addRadioButtonEventListeners = function (container, chart, configs) {
    // Add event listeners for radio buttons
    var radioButtons = container.querySelectorAll('div#theme-picker input.bx--radio-button');
    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('click', function (e) {
            var theme = e.target.value;
            container.setAttribute('class', "container theme--" + theme);
            chart.update();
        });
    });
};
export var addOtherVersions = function (container, demoGroup, demo, configs) {
    if (configs === void 0) { configs = { currentVersion: 'vanilla' }; }
    var currentVersion = configs.currentVersion;
    var demoGroupClassification = (demoGroup.type || '').replace('-chart', '');
    var div = document.createElement('div');
    div.setAttribute('class', 'bx--row resource-card-group');
    var htmlContent = '';
    var otherVersions = __spreadArrays((currentVersion !== 'vanilla'
        ? [
            {
                name: 'vanilla',
                link: "https://carbon-design-system.github.io/carbon-charts/?path=/story/" + demoGroupClassification + "-charts-" + demo.id,
            },
        ]
        : []), (currentVersion !== 'react'
        ? [
            {
                name: 'React',
                link: "https://carbon-design-system.github.io/carbon-charts/react/?path=/story/" + demoGroupClassification + "-charts-" + demo.id,
            },
        ]
        : []), (currentVersion !== 'angular'
        ? [
            {
                name: 'Angular',
                link: "https://carbon-design-system.github.io/carbon-charts/angular/?path=/story/" + demoGroupClassification + "-charts-" + demo.id,
            },
        ]
        : []), (currentVersion !== 'vue'
        ? [
            {
                name: 'Vue',
                link: "https://carbon-design-system.github.io/carbon-charts/vue/?path=/story/" + demoGroupClassification + "-charts-" + demo.id,
            },
        ]
        : []), (currentVersion !== 'svelte'
        ? [
            {
                name: 'Svelte',
                link: "https://carbon-design-system.github.io/carbon-charts/svelte/?path=/story/" + demoGroupClassification + "-charts-" + demo.id,
            },
        ]
        : []));
    otherVersions.forEach(function (otherVersion) {
        htmlContent += "<div class=\"bx--no-gutter-sm bx--col-md-6 bx--col-lg-6\">\n\t\t<div class=\"bx--resource-card\">\n\t\t  <div class=\"bx--aspect-ratio bx--aspect-ratio--2x1\">\n\t\t\t<div class=\"bx--aspect-ratio--object\">\n\t\t\t  <a href=\"" + otherVersion.link + "\" class=\"bx--tile bx--tile--clickable\">\n\t\t\t\t<h5 class=\"bx--resource-card__subtitle\">" + otherVersion.name + "</h5>\n\t\t\t\t<div class=\"bx--resource-card__icon--img\"></div>\n\t\t\t\t<div class=\"bx--resource-card__icon--action\">\n\t\t\t\t  <svg focusable=\"false\" preserveAspectRatio=\"xMidYMid meet\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" aria-label=\"Open resource\" width=\"20\" height=\"20\" viewBox=\"0 0 32 32\" role=\"img\">\n\t\t\t\t\t<path d=\"M26,28H6a2.0027,2.0027,0,0,1-2-2V6A2.0027,2.0027,0,0,1,6,4H16V6H6V26H26V16h2V26A2.0027,2.0027,0,0,1,26,28Z\"></path>\n\t\t\t\t\t<path d=\"M20 2L20 4 26.586 4 18 12.586 19.414 14 28 5.414 28 12 30 12 30 2 20 2z\"></path>\n\t\t\t\t  </svg>\n\t\t\t\t</div>\n\t\t\t  </a>\n\t\t\t</div>\n\t\t  </div>\n\t\t</div>\n\t  </div>";
    });
    div.innerHTML = htmlContent;
    container.querySelector('#other-versions').appendChild(div);
};
/**
 * Generates random data going backwards from now once a minute
 * @param {number} quantity number of data points to create
 * @param {number} min min range of integer value
 * @param {number} max max range of integer value
 * @returns {array} randomly generated array of objects with a date and value field
 */
export var generateRandomData = function (quantity, min, max) {
    var now = Date.now();
    return Array(quantity)
        .fill(0)
        .map(function (value, index) {
        return {
            group: 'group',
            value: Math.floor(Math.random() * (max - min + 1) + min),
            date: new Date(now.valueOf() + (index - quantity) * 60000),
        };
    });
};
/**
 * Adds a generate demo data form to the story
 */
export var generateHighScaleDemoDataForm = function () {
    return "<form id=\"demo-data\"><label for=\"demo-data-name\">Records to generate: </label><input type=\"number\" id=\"demo-data-number\" name=\"number\" required\n\t size=\"5\" value=\"100\"><input type=\"submit\"></label></form>";
};
export var addDemoDataFormListeners = function (container, demo, chart) {
    // Add event listeners for form
    var form = container.querySelector('form#demo-data');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var recordsToGenerate = parseInt(e.currentTarget[0].value) || 2000;
            chart.model.setData(generateRandomData(recordsToGenerate, 100, 500));
            chart.update();
        });
    }
};
//# sourceMappingURL=../../demo/utils.js.map