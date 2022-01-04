var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Internal Imports
import * as Configuration from '../configuration';
import { histogram as histogramConfigs } from '../configuration-non-customizable';
import { Tools } from '../tools';
import { Events, ScaleTypes } from '../interfaces';
// D3
import { scaleOrdinal } from 'd3-scale';
import { stack, stackOffsetDiverging } from 'd3-shape';
import { histogram } from 'd3-array';
/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
var ChartModel = /** @class */ (function () {
    function ChartModel(services) {
        // Internal Model state
        this.state = {
            options: {},
        };
        // Fill scales & fill related objects
        this.colorScale = {};
        this.colorClassNames = {};
        this.services = services;
    }
    ChartModel.prototype.getAllDataFromDomain = function (groups) {
        if (!this.getData()) {
            return null;
        }
        var options = this.getOptions();
        // Remove datasets that have been disabled
        var allData = this.getData();
        var dataGroups = this.getDataGroups();
        var groupMapsTo = Tools.getProperty(options, 'data').groupMapsTo;
        var axesOptions = Tools.getProperty(options, 'axes');
        // filter out the groups that are irrelevant to the component
        if (groups) {
            allData = allData.filter(function (item) {
                return groups.includes(item[groupMapsTo]);
            });
        }
        if (axesOptions) {
            Object.keys(axesOptions).forEach(function (axis) {
                var mapsTo = axesOptions[axis].mapsTo;
                var scaleType = axesOptions[axis].scaleType;
                // make sure linear/log values are numbers
                if (scaleType === ScaleTypes.LINEAR ||
                    scaleType === ScaleTypes.LOG) {
                    allData = allData.map(function (datum) {
                        var _a;
                        return __assign(__assign({}, datum), (_a = {}, _a[mapsTo] = datum[mapsTo] === null
                            ? datum[mapsTo]
                            : Number(datum[mapsTo]), _a));
                    });
                }
                // Check for custom domain
                if (mapsTo && axesOptions[axis].domain) {
                    if (scaleType === ScaleTypes.LABELS) {
                        allData = allData.filter(function (datum) {
                            return axesOptions[axis].domain.includes(datum[mapsTo]);
                        });
                    }
                    else {
                        var _a = axesOptions[axis].domain, start_1 = _a[0], end_1 = _a[1];
                        // Filter out data outside domain if that datapoint is using that axis (has mapsTo property)
                        allData = allData.filter(function (datum) {
                            return !(mapsTo in datum) ||
                                (datum[mapsTo] >= start_1 && datum[mapsTo] <= end_1);
                        });
                    }
                }
            });
        }
        return allData.filter(function (datum) {
            return dataGroups.find(function (group) { return group.name === datum[groupMapsTo]; });
        });
    };
    /**
     * Charts that have group configs passed into them, only want to retrieve the display data relevant to that chart
     * @param groups the included datasets for the particular chart
     */
    ChartModel.prototype.getDisplayData = function (groups) {
        if (!this.get('data')) {
            return null;
        }
        var ACTIVE = Configuration.legend.items.status.ACTIVE;
        var dataGroups = this.getDataGroups(groups);
        var groupMapsTo = this.getOptions().data.groupMapsTo;
        var allDataFromDomain = this.getAllDataFromDomain(groups);
        return allDataFromDomain.filter(function (datum) {
            return dataGroups.find(function (dataGroup) {
                return dataGroup.name === datum[groupMapsTo] &&
                    dataGroup.status === ACTIVE;
            });
        });
    };
    ChartModel.prototype.getData = function () {
        return this.get('data');
    };
    ChartModel.prototype.isDataEmpty = function () {
        return !this.getData().length;
    };
    /**
     *
     * @param newData The new raw data to be set
     */
    ChartModel.prototype.setData = function (newData) {
        var sanitizedData = this.sanitize(Tools.clone(newData));
        var dataGroups = this.generateDataGroups(sanitizedData);
        this.set({
            data: sanitizedData,
            dataGroups: dataGroups,
        });
        return sanitizedData;
    };
    ChartModel.prototype.getDataGroups = function (groups) {
        var isDataLoading = Tools.getProperty(this.getOptions(), 'data', 'loading');
        // No data should be displayed while data is still loading
        if (isDataLoading) {
            return [];
        }
        // if its a combo chart, the specific chart will pass the model the groups it needs
        if (groups) {
            return this.get('dataGroups').filter(function (dataGroup) {
                return groups.includes(dataGroup.name);
            });
        }
        return this.get('dataGroups');
    };
    ChartModel.prototype.getActiveDataGroups = function (groups) {
        var ACTIVE = Configuration.legend.items.status.ACTIVE;
        return this.getDataGroups(groups).filter(function (dataGroup) { return dataGroup.status === ACTIVE; });
    };
    ChartModel.prototype.getDataGroupNames = function (groups) {
        var dataGroups = this.getDataGroups(groups);
        return dataGroups.map(function (dataGroup) { return dataGroup.name; });
    };
    ChartModel.prototype.getActiveDataGroupNames = function (groups) {
        var activeDataGroups = this.getActiveDataGroups(groups);
        return activeDataGroups.map(function (dataGroup) { return dataGroup.name; });
    };
    ChartModel.prototype.aggregateBinDataByGroup = function (bin) {
        return Tools.groupBy(bin, 'group');
    };
    ChartModel.prototype.getBinConfigurations = function () {
        var _this = this;
        // Manipulate data and options for Histogram
        var data = this.getDisplayData();
        var options = this.getOptions();
        var mainXPos = this.services.cartesianScales.getMainXAxisPosition();
        var domainIdentifier = this.services.cartesianScales.getDomainIdentifier();
        var axisOptions = options.axes[mainXPos];
        var groupMapsTo = options.data.groupMapsTo;
        var _a = axisOptions.bins, axisBins = _a === void 0 ? histogramConfigs.defaultBins : _a;
        var areBinsDefined = Array.isArray(axisBins);
        // Get Histogram bins
        var bins = histogram()
            .value(function (d) { return d[domainIdentifier]; })
            .thresholds(axisBins)(data);
        if (!areBinsDefined) {
            // If bins are not defined by user
            var binsWidth = bins[0].x1 - bins[0].x0;
            // Set last bin width as the others
            bins[bins.length - 1].x1 = +bins[bins.length - 1].x0 + binsWidth;
        }
        else {
            // Set last bin end as the last user defined one
            bins[bins.length - 1].x1 = axisBins[axisBins.length - 1];
        }
        var binsDomain = areBinsDefined
            ? [axisBins[0], axisBins[axisBins.length - 1]]
            : [bins[0].x0, bins[bins.length - 1].x1];
        // Get all groups
        var groupsKeys = Array.from(new Set(data.map(function (d) { return d[groupMapsTo]; })));
        var histogramData = [];
        // Group data by bin
        bins.forEach(function (bin) {
            var key = bin.x0 + "-" + bin.x1;
            var aggregateDataByGroup = _this.aggregateBinDataByGroup(bin);
            groupsKeys.forEach(function (group) {
                // For each dataset put a bin with value 0 if not exist
                // (Scale X won't change when changing showed datasets)
                histogramData.push({
                    group: group,
                    key: key,
                    value: aggregateDataByGroup[group] || 0,
                    bin: bin.x0,
                });
            });
        });
        return {
            bins: bins,
            binsDomain: binsDomain,
        };
    };
    ChartModel.prototype.getBinnedStackedData = function () {
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var dataGroupNames = this.getActiveDataGroupNames();
        var bins = this.getBinConfigurations().bins;
        var dataValuesGroupedByKeys = this.getDataValuesGroupedByKeys({
            bins: bins,
        });
        return stack()
            .keys(dataGroupNames)(dataValuesGroupedByKeys)
            .map(function (series, i) {
            // Add data group names to each series
            return Object.keys(series)
                .filter(function (key) { return !isNaN(key); })
                .map(function (key) {
                var element = series[key];
                element[groupMapsTo] = dataGroupNames[i];
                return element;
            });
        });
    };
    ChartModel.prototype.getGroupedData = function (groups) {
        var displayData = this.getDisplayData(groups);
        var groupedData = {};
        var groupMapsTo = this.getOptions().data.groupMapsTo;
        displayData.map(function (datum) {
            var group = datum[groupMapsTo];
            if (groupedData[group] !== null &&
                groupedData[group] !== undefined) {
                groupedData[group].push(datum);
            }
            else {
                groupedData[group] = [datum];
            }
        });
        return Object.keys(groupedData).map(function (groupName) { return ({
            name: groupName,
            data: groupedData[groupName],
        }); });
    };
    ChartModel.prototype.getStackKeys = function (_a) {
        var _this = this;
        var _b = _a.bins, bins = _b === void 0 ? null : _b, _c = _a.groups, groups = _c === void 0 ? null : _c;
        var options = this.getOptions();
        var displayData = this.getDisplayData(groups);
        var stackKeys;
        if (bins) {
            stackKeys = bins.map(function (bin) { return bin.x0 + "-" + bin.x1; });
        }
        else {
            stackKeys = Tools.removeArrayDuplicates(displayData.map(function (datum) {
                var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(datum);
                return datum[domainIdentifier] &&
                    typeof datum[domainIdentifier].toString === 'function'
                    ? datum[domainIdentifier].toString()
                    : datum[domainIdentifier];
            }));
        }
        var axisPosition = this.services.cartesianScales.domainAxisPosition;
        var scaleType = options.axes[axisPosition].scaleType;
        // Sort keys
        if (scaleType === ScaleTypes.TIME) {
            stackKeys.sort(function (a, b) {
                var dateA = new Date(a);
                var dateB = new Date(b);
                return dateA - dateB;
            });
        }
        else if (scaleType === ScaleTypes.LOG ||
            scaleType === ScaleTypes.LINEAR) {
            stackKeys.sort(function (a, b) { return a - b; });
        }
        return stackKeys;
    };
    ChartModel.prototype.getDataValuesGroupedByKeys = function (_a) {
        var _this = this;
        var _b = _a.bins, bins = _b === void 0 ? null : _b, _c = _a.groups, groups = _c === void 0 ? null : _c;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        var displayData = this.getDisplayData(groups);
        var dataGroupNames = this.getDataGroupNames();
        var stackKeys = this.getStackKeys({ bins: bins, groups: groups });
        if (bins) {
            return stackKeys.map(function (key) {
                var _a = key.split('-'), binStart = _a[0], binEnd = _a[1];
                var correspondingValues = { x0: binStart, x1: binEnd };
                var correspondingBin = bins.find(function (bin) { return bin.x0.toString() === binStart.toString(); });
                dataGroupNames.forEach(function (dataGroupName) {
                    correspondingValues[dataGroupName] = correspondingBin.filter(function (binItem) { return binItem[groupMapsTo] === dataGroupName; }).length;
                });
                return correspondingValues;
            });
        }
        return stackKeys.map(function (key) {
            var correspondingValues = { sharedStackKey: key };
            dataGroupNames.forEach(function (dataGroupName) {
                var correspondingDatum = displayData.find(function (datum) {
                    var domainIdentifier = _this.services.cartesianScales.getDomainIdentifier(datum);
                    return (datum[groupMapsTo] === dataGroupName &&
                        datum.hasOwnProperty(domainIdentifier) &&
                        datum[domainIdentifier].toString() === key);
                });
                var rangeIdentifier = _this.services.cartesianScales.getRangeIdentifier(correspondingValues);
                correspondingValues[dataGroupName] = correspondingDatum
                    ? correspondingDatum[rangeIdentifier]
                    : null;
            });
            return correspondingValues;
        });
    };
    ChartModel.prototype.getStackedData = function (_a) {
        var _b = _a.percentage, percentage = _b === void 0 ? false : _b, _c = _a.groups, groups = _c === void 0 ? null : _c, _d = _a.divergent, divergent = _d === void 0 ? false : _d;
        var options = this.getOptions();
        var groupMapsTo = options.data.groupMapsTo;
        // Get only active data groups so non-active data groups are not rendered
        // on legend item click
        var dataGroupNames = this.getActiveDataGroupNames(groups);
        var dataValuesGroupedByKeys = this.getDataValuesGroupedByKeys({
            groups: groups,
        });
        if (percentage) {
            var maxByKey_1 = Tools.fromPairs(dataValuesGroupedByKeys.map(function (d) { return [d.sharedStackKey, 0]; }));
            dataValuesGroupedByKeys.forEach(function (d) {
                dataGroupNames.forEach(function (name) {
                    maxByKey_1[d.sharedStackKey] += d[name];
                });
            });
            // cycle through data values to get percentage
            dataValuesGroupedByKeys.forEach(function (d) {
                dataGroupNames.forEach(function (name) {
                    if (maxByKey_1[d.sharedStackKey]) {
                        d[name] = (d[name] / maxByKey_1[d.sharedStackKey]) * 100;
                    }
                    else {
                        d[name] = 0;
                    }
                });
            });
        }
        var stackToUse = divergent
            ? stack().offset(stackOffsetDiverging)
            : stack();
        return stackToUse
            .keys(dataGroupNames)(dataValuesGroupedByKeys)
            .map(function (series, i) {
            // Add data group names to each series
            return Object.keys(series)
                .filter(function (key) { return !isNaN(key); })
                .map(function (key) {
                var element = series[key];
                element[groupMapsTo] = dataGroupNames[i];
                return element;
            });
        });
    };
    /**
     * @return {Object} The chart's options
     */
    ChartModel.prototype.getOptions = function () {
        return this.state.options;
    };
    ChartModel.prototype.set = function (newState, configs) {
        this.state = Object.assign({}, this.state, newState);
        var newConfig = Object.assign({ skipUpdate: false, animate: true }, // default configs
        configs);
        if (!newConfig.skipUpdate) {
            this.update(newConfig.animate);
        }
    };
    ChartModel.prototype.get = function (property) {
        if (property) {
            return this.state[property];
        }
        else {
            return this.state;
        }
    };
    /**
     *
     * @param newOptions New options to be set
     */
    ChartModel.prototype.setOptions = function (newOptions) {
        var options = this.getOptions();
        Tools.updateLegendAdditionalItems(options, newOptions);
        this.set({
            options: Tools.merge(options, newOptions),
        });
    };
    /**
     *
     * Updates miscellanous information within the model
     * such as the color scales, or the legend data labels
     */
    ChartModel.prototype.update = function (animate) {
        if (animate === void 0) { animate = true; }
        if (!this.getDisplayData()) {
            return;
        }
        this.updateAllDataGroups();
        this.setCustomColorScale();
        this.setColorClassNames();
        this.services.events.dispatchEvent(Events.Model.UPDATE, { animate: animate });
    };
    /*
     * Data labels
     */
    ChartModel.prototype.toggleDataLabel = function (changedLabel) {
        var _a = Configuration.legend.items.status, ACTIVE = _a.ACTIVE, DISABLED = _a.DISABLED;
        var dataGroups = this.getDataGroups();
        var hasDeactivatedItems = dataGroups.some(function (group) { return group.status === DISABLED; });
        var activeItems = dataGroups.filter(function (group) { return group.status === ACTIVE; });
        // If there are deactivated items, toggle "changedLabel"
        if (hasDeactivatedItems) {
            // If the only active item is being toggled
            // Activate all items
            if (activeItems.length === 1 &&
                activeItems[0].name === changedLabel) {
                // If every item is active, then enable "changedLabel" and disable all other items
                dataGroups.forEach(function (group, i) {
                    dataGroups[i].status = ACTIVE;
                });
            }
            else {
                var indexToChange = dataGroups.findIndex(function (group) { return group.name === changedLabel; });
                dataGroups[indexToChange].status =
                    dataGroups[indexToChange].status === DISABLED
                        ? ACTIVE
                        : DISABLED;
            }
        }
        else {
            // If every item is active, then enable "changedLabel" and disable all other items
            dataGroups.forEach(function (group, i) {
                dataGroups[i].status =
                    group.name === changedLabel ? ACTIVE : DISABLED;
            });
        }
        // Updates selected groups
        var updatedActiveItems = dataGroups.filter(function (group) { return group.status === ACTIVE; });
        var options = this.getOptions();
        var hasUpdatedDeactivatedItems = dataGroups.some(function (group) { return group.status === DISABLED; });
        // If there are deactivated items, map the item name into selected groups
        if (hasUpdatedDeactivatedItems) {
            options.data.selectedGroups = updatedActiveItems.map(function (activeItem) { return activeItem.name; });
        }
        else {
            // If every item is active, clear array
            options.data.selectedGroups = [];
        }
        // dispatch legend filtering event with the status of all the dataLabels
        this.services.events.dispatchEvent(Events.Legend.ITEMS_UPDATE, {
            dataGroups: dataGroups,
        });
        // Update model
        this.set({
            dataGroups: dataGroups,
        });
    };
    /**
     * Should the data point be filled?
     * @param group
     * @param key
     * @param value
     * @param defaultFilled the default for this chart
     */
    ChartModel.prototype.getIsFilled = function (group, key, data, defaultFilled) {
        var options = this.getOptions();
        if (options.getIsFilled) {
            return options.getIsFilled(group, key, data, defaultFilled);
        }
        else {
            return defaultFilled;
        }
    };
    ChartModel.prototype.getFillColor = function (group, key, data) {
        var options = this.getOptions();
        var defaultFillColor = Tools.getProperty(this.colorScale, group);
        if (options.getFillColor) {
            return options.getFillColor(group, key, data, defaultFillColor);
        }
        else {
            return defaultFillColor;
        }
    };
    ChartModel.prototype.getStrokeColor = function (group, key, data) {
        var options = this.getOptions();
        var defaultStrokeColor = Tools.getProperty(this.colorScale, group);
        if (options.getStrokeColor) {
            return options.getStrokeColor(group, key, data, defaultStrokeColor);
        }
        else {
            return defaultStrokeColor;
        }
    };
    ChartModel.prototype.isUserProvidedColorScaleValid = function () {
        var userProvidedScale = Tools.getProperty(this.getOptions(), 'color', 'scale');
        var dataGroups = this.getDataGroups();
        if (userProvidedScale == null ||
            Object.keys(userProvidedScale).length == 0) {
            return false;
        }
        return dataGroups.some(function (dataGroup) {
            return Object.keys(userProvidedScale).includes(dataGroup.name);
        });
    };
    ChartModel.prototype.getColorClassName = function (configs) {
        var colorPairingTag = this.colorClassNames(configs.dataGroupName);
        var className = configs.originalClassName;
        configs.classNameTypes.forEach(function (type) {
            return (className = configs.originalClassName
                ? className + " " + type + "-" + colorPairingTag
                : type + "-" + colorPairingTag);
        });
        return className;
    };
    /**
     * For charts that might hold an associated status for their dataset
     */
    ChartModel.prototype.getStatus = function () {
        return null;
    };
    ChartModel.prototype.getAllDataGroupsNames = function () {
        return this.allDataGroups;
    };
    /**
     * Converts data provided in the older format to tabular
     *
     */
    ChartModel.prototype.transformToTabularData = function (data) {
        console.warn("We've updated the charting data format to be tabular by default. The current format you're using is deprecated and will be removed in v1.0, read more here https://carbon-design-system.github.io/carbon-charts/?path=/story/docs-tutorials--tabular-data-format");
        var tabularData = [];
        var datasets = data.datasets, labels = data.labels;
        // Loop through all datasets
        datasets.forEach(function (dataset) {
            // Update each data point to the new format
            dataset.data.forEach(function (datum, i) {
                var group;
                var datasetLabel = Tools.getProperty(dataset, 'label');
                if (datasetLabel === null) {
                    var correspondingLabel = Tools.getProperty(labels, i);
                    if (correspondingLabel) {
                        group = correspondingLabel;
                    }
                    else {
                        group = 'Ungrouped';
                    }
                }
                else {
                    group = datasetLabel;
                }
                var updatedDatum = {
                    group: group,
                    key: labels[i],
                };
                if (isNaN(datum)) {
                    updatedDatum['value'] = datum.value;
                    updatedDatum['date'] = datum.date;
                }
                else {
                    updatedDatum['value'] = datum;
                }
                tabularData.push(updatedDatum);
            });
        });
        return tabularData;
    };
    ChartModel.prototype.getTabularDataArray = function () {
        return [];
    };
    ChartModel.prototype.exportToCSV = function () {
        var data = this.getTabularDataArray().map(function (row) {
            return row.map(function (column) { return "\"" + column + "\""; });
        });
        var csvString = '', csvData = '';
        data.forEach(function (d, i) {
            csvData = d.join(',');
            csvString += i < data.length ? csvData + '\n' : csvData;
        });
        this.services.files.downloadCSV(csvString, 'myChart.csv');
    };
    ChartModel.prototype.getTabularData = function (data) {
        // if data is not an array
        if (!Array.isArray(data)) {
            return this.transformToTabularData(data);
        }
        return data;
    };
    ChartModel.prototype.sanitize = function (data) {
        data = this.getTabularData(data);
        return data;
    };
    /*
     * Data groups
     */
    ChartModel.prototype.updateAllDataGroups = function () {
        // allDataGroups is used to generate a color scale that applies
        // to all the groups. Now when the data updates, you might remove a group,
        // and then bring it back in a newer data update, therefore
        // the order of the groups in allDataGroups matters so that you'd never
        // have an incorrect color assigned to a group.
        var _this = this;
        // Also, a new group should only be added to allDataGroups if
        // it doesn't currently exist
        if (!this.allDataGroups) {
            this.allDataGroups = this.getDataGroupNames();
        }
        else {
            // Loop through current data groups
            this.getDataGroupNames().forEach(function (dataGroupName) {
                // If group name hasn't been stored yet, store it
                if (_this.allDataGroups.indexOf(dataGroupName) === -1) {
                    _this.allDataGroups.push(dataGroupName);
                }
            });
        }
    };
    ChartModel.prototype.generateDataGroups = function (data) {
        var groupMapsTo = this.getOptions().data.groupMapsTo;
        var _a = Configuration.legend.items.status, ACTIVE = _a.ACTIVE, DISABLED = _a.DISABLED;
        var options = this.getOptions();
        var uniqueDataGroups = Tools.removeArrayDuplicates(data.map(function (datum) { return datum[groupMapsTo]; }));
        // check if selectedGroups can be applied to chart with current data groups
        if (options.data.selectedGroups.length) {
            var hasAllSelectedGroups = options.data.selectedGroups.every(function (groupName) { return uniqueDataGroups.includes(groupName); });
            if (!hasAllSelectedGroups) {
                options.data.selectedGroups = [];
            }
        }
        // Get group status based on items in selected groups
        var getStatus = function (groupName) {
            return !options.data.selectedGroups.length ||
                options.data.selectedGroups.includes(groupName)
                ? ACTIVE
                : DISABLED;
        };
        return uniqueDataGroups.map(function (groupName) { return ({
            name: groupName,
            status: getStatus(groupName),
        }); });
    };
    /*
     * Fill scales
     */
    ChartModel.prototype.setCustomColorScale = function () {
        var _this = this;
        if (!this.isUserProvidedColorScaleValid()) {
            return;
        }
        var options = this.getOptions();
        var userProvidedScale = Tools.getProperty(options, 'color', 'scale');
        Object.keys(userProvidedScale).forEach(function (dataGroup) {
            if (!_this.allDataGroups.includes(dataGroup)) {
                console.warn("\"" + dataGroup + "\" does not exist in data groups.");
            }
        });
        /**
         * Go through allDataGroups. If a data group has a color value provided
         * by the user, add that to the color range
         */
        var providedDataGroups = this.allDataGroups.filter(function (dataGroup) { return userProvidedScale[dataGroup]; });
        providedDataGroups.forEach(function (dataGroup) {
            return (_this.colorScale[dataGroup] = userProvidedScale[dataGroup]);
        });
    };
    /*
     * Color palette
     */
    ChartModel.prototype.setColorClassNames = function () {
        var colorPairingOptions = Tools.getProperty(this.getOptions(), 'color', 'pairing');
        // Check if user has defined numberOfVariants (differ from given data)
        var numberOfVariants = Tools.getProperty(colorPairingOptions, 'numberOfVariants');
        if (!numberOfVariants || numberOfVariants < this.allDataGroups.length) {
            numberOfVariants = this.allDataGroups.length;
        }
        var pairingOption = Tools.getProperty(colorPairingOptions, 'option');
        var colorPairingCounts = Configuration.color.pairingOptions;
        // If number of dataGroups is greater than 5, user 14-color palette
        var numberOfColors = numberOfVariants > 5 ? 14 : numberOfVariants;
        // Use default palette if user choice is not in range
        pairingOption =
            pairingOption <= colorPairingCounts[numberOfColors + "-color"]
                ? pairingOption
                : 1;
        // Create color classes for graph, tooltip and stroke use
        var colorPairing = this.allDataGroups.map(function (dataGroup, index) {
            return numberOfColors + "-" + pairingOption + "-" + ((index % 14) + 1);
        });
        // Create default color classnames
        this.colorClassNames = scaleOrdinal()
            .range(colorPairing)
            .domain(this.allDataGroups);
    };
    return ChartModel;
}());
export { ChartModel };
//# sourceMappingURL=../../src/model/model.js.map