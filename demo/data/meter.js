export var meterData = [
    {
        group: 'Dataset 1',
        value: 56,
    },
];
export var meterOptionsWithStatus = {
    title: 'Meter Chart - with statuses',
    meter: {
        peak: 80,
        status: {
            ranges: [
                { range: [0, 50], status: 'success' },
                { range: [50, 60], status: 'warning' },
                { range: [60, 100], status: 'danger' },
            ],
        },
    },
    height: '100px',
};
export var meterOptionsCustomColor = {
    title: 'Meter Chart - statuses and custom color',
    meter: {
        peak: 70,
        status: {
            ranges: [
                { range: [0, 40], status: 'success' },
                { range: [40, 60], status: 'warning' },
                { range: [60, 100], status: 'danger' },
            ],
        },
    },
    color: {
        scale: {
            'Dataset 1': '#925699',
        },
    },
    height: '100px',
};
export var meterOptionsNoStatus = {
    title: 'Meter Chart - no status',
    meter: {
        peak: 70,
    },
    height: '100px',
};
export var propMeterData = [
    { group: 'emails', value: 202 },
    { group: 'photos', value: 654 },
    { group: 'text messages', value: 723 },
    { group: 'other', value: 120 },
];
export var propMeterOptions = {
    title: 'Proportional Meter Chart',
    height: '130px',
    meter: {
        proportional: {
            total: 2000,
            unit: 'GB',
        },
    },
    color: {
        pairing: {
            option: 2,
        },
    },
};
export var propMeterStatusOptions = {
    title: 'Proportional Meter Chart - peak and statuses',
    height: '130px',
    meter: {
        peak: 1800,
        proportional: {
            total: 2000,
            unit: 'GB',
        },
        status: {
            ranges: [
                {
                    range: [0, 800],
                    status: 'success',
                },
                {
                    range: [800, 1800],
                    status: 'warning',
                },
                {
                    range: [1800, 2000],
                    status: 'danger',
                },
            ],
        },
    },
    color: {
        pairing: {
            option: 2,
        },
    },
};
export var propMeterTruncationOptions = {
    title: 'Proportional Meter Chart (truncated)',
    height: '130px',
    meter: {
        proportional: {
            total: 2000,
            unit: 'MB',
            totalFormatter: function (total) { return "custom total string for: " + total; },
            breakdownFormatter: function (x) {
                return "You are using " + x.datasetsTotal + " GB of the space this label is really long will need to be truncated with a tooltip Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            },
        },
    },
};
//# sourceMappingURL=../../../demo/data/meter.js.map