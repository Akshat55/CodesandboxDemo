export declare const createChartSandbox: (chartTemplate: any) => string;
export declare const createVanillaChartApp: (demo: any) => {
    'index.html': string;
    'src/index.js': string;
    'package.json': {
        scripts: {
            start: string;
            build: string;
        };
        dependencies: {
            '@carbon/charts': any;
            'carbon-components': any;
            d3: string;
        };
        devDependencies: {
            'parcel-bundler': string;
        };
    };
};
export declare const createReactChartApp: (demo: any) => {
    'src/index.html': string;
    'src/index.js': string;
    'src/plex-and-carbon-components.css': string;
    'package.json': {
        dependencies: {
            '@carbon/charts': any;
            '@carbon/charts-react': any;
            d3: string;
            react: string;
            'react-dom': string;
            'react-scripts': string;
            'carbon-components': any;
        };
    };
};
export declare const createAngularChartApp: (demo: any) => {
    'src/index.html': string;
    'src/main.ts': string;
    'src/app/app.component.html': string;
    'src/app/app.component.ts': string;
    'src/app/plex-and-carbon-components.css': string;
    'src/app/app.module.ts': string;
    '.angular-cli.json': string;
    'package.json': string;
};
export declare const createVueChartApp: (demo: any) => {
    'src/components/chart.vue': string;
    'src/plex-and-carbon-components.css': string;
    'src/App.vue': string;
    'src/main.js': string;
    'package.json': string;
};
export declare const createSvelteChartApp: (demo: any) => {
    'App.svelte': string;
    'index.html': string;
    'package.json': {
        scripts: {
            dev: string;
            build: string;
        };
        devDependencies: {
            '@carbon/charts-svelte': any;
            '@sveltejs/vite-plugin-svelte': string;
            d3: string;
            svelte: string;
            'svelte-hmr': string;
            vite: string;
        };
    };
    'vite.config.js': string;
};
