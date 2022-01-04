import { pieData, pieDataMapsTo } from './pie';
export var donutData = pieData;
export var donutOptions = {
    title: 'Donut',
    resizable: true,
    donut: {
        center: {
            label: 'Browsers',
        },
    },
};
export var donutCenteredData = pieData;
export var donutCenteredOptions = {
    title: 'Donut (centered)',
    resizable: true,
    legend: {
        alignment: 'center',
    },
    donut: {
        center: {
            label: 'Browsers',
        },
        alignment: 'center',
    },
};
// donut - using a different value key
export var donutDataMapsTo = pieDataMapsTo;
export var donutMapsToOptions = {
    title: 'Donut (value maps to count)',
    resizable: true,
    pie: {
        valueMapsTo: 'count',
    },
};
// donut - empty state
export var donutEmptyStateData = [];
export var donutEmptyStateOptions = {
    title: 'Donut (empty state)',
    resizable: true,
    donut: {
        center: {
            label: 'Browsers',
        },
    },
};
// donut - skeleton
export var donutSkeletonData = [];
export var donutSkeletonOptions = {
    title: 'Donut (skeleton)',
    resizable: true,
    donut: {
        center: {
            label: 'Browsers',
        },
    },
    data: {
        loading: true,
    },
};
//# sourceMappingURL=../../../demo/data/donut.js.map