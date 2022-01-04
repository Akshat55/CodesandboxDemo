import { getParameters } from 'codesandbox/lib/api/define';
var packageJSON = require('@carbon/charts/package.json');
var libraryVersion = packageJSON.version;
var carbonComponentsVersion = packageJSON.devDependencies['carbon-components'];
var plexAndCarbonComponentsCSS = "@import \"https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed|IBM+Plex+Sans:400,600&display=swap\";\n@import \"https://unpkg.com/carbon-components/css/carbon-components.min.css\";\n";
var D3VERSION = '^7.0.0';
export var createChartSandbox = function (chartTemplate) {
    var files = {};
    Object.keys(chartTemplate).forEach(function (filePath) { return (files[filePath] = { content: chartTemplate[filePath] }); });
    return "https://codesandbox.io/api/v1/sandboxes/define?parameters=" + getParameters({ files: files });
};
export var createVanillaChartApp = function (demo) {
    var chartData = JSON.stringify(demo.data, null, '\t');
    var chartOptions = JSON.stringify(demo.options, null, '\t');
    var chartComponent = demo.chartType.vanilla;
    var indexHtml = "<html>\n\t<head>\n\t\t<title>Parcel Sandbox</title>\n\t\t<meta charset=\"UTF-8\" />\n\t\t<link\n\t\t\trel=\"preconnect\"\n\t\t\tcrossorigin=\"anonymous\"\n\t\t\thref=\"https://fonts.gstatic.com\"\n\t\t/>\n\t\t<link\n\t\t\thref=\"https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed:300,400|IBM+Plex+Sans:400,600&display=swap\"\n\t\t\trel=\"stylesheet\"\n\t\t\tcrossorigin=\"anonymous\"\n\t\t/>\n\t\t<link\n\t\t\thref=\"https://unpkg.com/carbon-components/css/carbon-components.min.css\"\n\t\t\trel=\"stylesheet\"\n\t\t/>\n\t</head>\n\t<body>\n\t\t<div id=\"app\" style=\"width: 100%; height: 100%;\"></div>\n\n\t\t<script src=\"src/index.js\"></script>\n\t</body>\n</html>";
    var indexJs = "import \"@carbon/charts/styles.css\";\nimport { " + chartComponent + " } from \"@carbon/charts\";\n\nconst data = " + chartData + ";\n\nconst options = " + chartOptions + ";\n\n// Grab chart holder HTML element and initialize the chart\nconst chartHolder = document.getElementById(\"app\");\nnew " + chartComponent + "(chartHolder, {\n\tdata,\n\toptions\n});\n";
    var packageJson = {
        scripts: {
            start: 'parcel index.html --open',
            build: 'parcel build index.html',
        },
        dependencies: {
            '@carbon/charts': libraryVersion,
            'carbon-components': carbonComponentsVersion,
            d3: D3VERSION,
        },
        devDependencies: {
            'parcel-bundler': '^1.6.1',
        },
    };
    return {
        'index.html': indexHtml,
        'src/index.js': indexJs,
        'package.json': packageJson,
    };
};
export var createReactChartApp = function (demo) {
    var chartData = JSON.stringify(demo.data, null, '\t');
    var chartOptions = JSON.stringify(demo.options, null, '\t');
    var chartComponent = demo.chartType.vanilla;
    var indexHtml = "<div id=\"root\"></div>\n  ";
    var indexJs = "import React from \"react\";\nimport ReactDOM from \"react-dom\";\nimport { " + chartComponent + " } from \"@carbon/charts-react\";\nimport \"@carbon/charts/styles.css\";\n// Or\n// import \"@carbon/charts/styles/styles.scss\";\n\n// IBM Plex should either be imported in your project by using Carbon\n// or consumed manually through an import\nimport \"./plex-and-carbon-components.css\";\n\nclass App extends React.Component {\n\tstate = {\n\t\tdata: " + chartData + ",\n\t\toptions: " + chartOptions + "\n\t};\n\n\trender = () => (\n\t\t<" + chartComponent + "\n\t\t\tdata={this.state.data}\n\t\t\toptions={this.state.options}>\n\t\t</" + chartComponent + ">\n\t);\n}\nReactDOM.render(<App />, document.getElementById(\"root\"));\n  ";
    var packageJson = {
        dependencies: {
            '@carbon/charts': libraryVersion,
            '@carbon/charts-react': libraryVersion,
            d3: D3VERSION,
            react: '16.12.0',
            'react-dom': '16.12.0',
            'react-scripts': '3.0.1',
            'carbon-components': carbonComponentsVersion,
        },
    };
    return {
        'src/index.html': indexHtml,
        'src/index.js': indexJs,
        'src/plex-and-carbon-components.css': plexAndCarbonComponentsCSS,
        'package.json': packageJson,
    };
};
export var createAngularChartApp = function (demo) {
    var chartData = JSON.stringify(demo.data, null, '\t\t');
    var chartOptions = JSON.stringify(demo.options, null, '\t\t');
    var chartComponent = demo.chartType.angular;
    var appComponentHtml = "<" + chartComponent + " [data]=\"data\" [options]=\"options\"></" + chartComponent + ">";
    var appComponentTs = "import { Component } from \"@angular/core\";\n\nimport \"@carbon/charts/styles.css\";\n\n// IBM Plex should either be imported in your project by using Carbon\n// or consumed manually through an import\nimport \"./plex-and-carbon-components.css\";\n\n@Component({\n\tselector: \"app-root\",\n\ttemplateUrl: \"./app.component.html\"\n})\nexport class AppComponent {\n\tdata = " + chartData + ";\n\toptions = " + chartOptions + ";\n}";
    var appModule = "import { NgModule } from \"@angular/core\";\nimport { BrowserModule } from \"@angular/platform-browser\";\nimport { ChartsModule } from \"@carbon/charts-angular\";\nimport { AppComponent } from \"./app.component\";\n@NgModule({\n\timports: [BrowserModule, ChartsModule],\n\tdeclarations: [AppComponent],\n\tbootstrap: [AppComponent]\n})\nexport class AppModule {}";
    var indexHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>Angular</title>\n\t</head>\n\t<body>\n\t\t<app-root></app-root>\n\t</body>\n</html>";
    var mainTs = "import { platformBrowserDynamic } from \"@angular/platform-browser-dynamic\";\nimport { AppModule } from \"./app/app.module\";\nplatformBrowserDynamic()\n\t.bootstrapModule(AppModule)\n\t.catch(err => console.log(err));\n";
    var angularCliJson = "{\n\t\"apps\": [\n\t\t{\n\t\t\t\"root\": \"src\",\n\t\t\t\"outDir\": \"dist\",\n\t\t\t\"assets\": [\"assets\", \"favicon.ico\"],\n\t\t\t\"index\": \"index.html\",\n\t\t\t\"main\": \"main.ts\",\n\t\t\t\"polyfills\": \"polyfills.ts\",\n\t\t\t\"prefix\": \"app\",\n\t\t\t\"styles\": [\"styles.css\"],\n\t\t\t\"scripts\": [],\n\t\t\t\"environmentSource\": \"environments/environment.ts\",\n\t\t\t\"environments\": {\n\t\t\t\t\"dev\": \"environments/environment.ts\",\n\t\t\t\t\"prod\": \"environments/environment.prod.ts\"\n\t\t\t}\n\t\t}\n\t]\n}";
    var packageJson = JSON.stringify({
        dependencies: {
            '@angular/animations': '8.2.14',
            '@angular/common': '8.2.14',
            '@angular/compiler': '8.2.14',
            '@angular/core': '8.2.14',
            '@angular/forms': '8.2.14',
            '@angular/platform-browser': '8.2.14',
            '@angular/platform-browser-dynamic': '8.2.14',
            '@angular/router': '8.2.14',
            '@carbon/charts': libraryVersion,
            '@carbon/charts-angular': libraryVersion,
            'core-js': '3.6.0',
            d3: D3VERSION,
            rxjs: '6.5.3',
            'zone.js': '0.10.2',
        },
    }, null, '\t');
    return {
        'src/index.html': indexHtml,
        'src/main.ts': mainTs,
        'src/app/app.component.html': appComponentHtml,
        'src/app/app.component.ts': appComponentTs,
        'src/app/plex-and-carbon-components.css': plexAndCarbonComponentsCSS,
        'src/app/app.module.ts': appModule,
        '.angular-cli.json': angularCliJson,
        'package.json': packageJson,
    };
};
export var createVueChartApp = function (demo) {
    var chartData = JSON.stringify(demo.data, null, '\t\t');
    var chartOptions = JSON.stringify(demo.options, null, '\t\t');
    var chartComponent = demo.chartType.vue;
    var chartVue = "<script>\nimport Vue from \"vue\";\nimport \"@carbon/charts/styles.css\";\nimport chartsVue from \"@carbon/charts-vue\";\n\n// IBM Plex should either be imported in your project by using Carbon\n// or consumed manually through an import\nimport \"../plex-and-carbon-components.css\";\n\nVue.use(chartsVue);\n\nexport default {\n\tname: \"Chart\",\n\tcomponents: {},\n\tdata() {\n\t\treturn {\n\t\t\tdata: " + chartData + ",\n\t\t\toptions: " + chartOptions + "\n\t\t};\n\t},\n\ttemplate: \"<" + chartComponent + " :data='data' :options='options'></" + chartComponent + ">\"\n};\n</script>\n  ";
    var appVue = "<template>\n\t<div id=\"app\">\n\t\t<Chart/>\n\t</div>\n</template>\n<script>\nimport Chart from \"./components/chart\";\nexport default {\n\tname: \"App\",\n\tcomponents: {\n\t\tChart\n\t}\n};\n</script>\n  ";
    var mainJs = "import Vue from \"vue\";\nimport App from \"./App.vue\";\nVue.config.productionTip = false;\nnew Vue({\n\trender: h => h(App)\n}).$mount(\"#app\");\n";
    var packageJson = JSON.stringify({
        dependencies: {
            '@carbon/charts': libraryVersion,
            '@carbon/charts-vue': libraryVersion,
            '@vue/cli-plugin-babel': '4.1.1',
            'carbon-components': carbonComponentsVersion,
            d3: D3VERSION,
            vue: '^2.6.11',
        },
    }, null, '\t\t');
    return {
        'src/components/chart.vue': chartVue,
        'src/plex-and-carbon-components.css': plexAndCarbonComponentsCSS,
        'src/App.vue': appVue,
        'src/main.js': mainJs,
        'package.json': packageJson,
    };
};
export var createSvelteChartApp = function (demo) {
    var chartData = JSON.stringify(demo.data, null, '\t');
    var chartOptions = JSON.stringify(demo.options, null, '\t');
    var chartComponent = demo.chartType.vanilla;
    switch (chartComponent) {
        case 'SimpleBarChart':
            chartComponent = 'BarChartSimple';
            break;
        case 'GroupedBarChart':
            chartComponent = 'BarChartGrouped';
            break;
        case 'StackedBarChart':
            chartComponent = 'BarChartStacked';
            break;
    }
    var indexHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <link\n      rel=\"preconnect\"\n      crossorigin=\"anonymous\"\n      href=\"https://fonts.gstatic.com\"\n    />\n    <link\n      href=\"https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Condensed:300,400%7CIBM+Plex+Sans:400,600&display=swap\"\n      rel=\"stylesheet\"\n      crossorigin=\"anonymous\"\n    />\n  </head>\n  <body>\n    <script type=\"module\">\n      import App from \"./App.svelte\";\n\n      const app = new App({ target: document.body });\n    </script>\n  </body>\n</html>\n";
    var App = "<script>\n\timport \"@carbon/charts/styles.min.css\";\n\timport \"carbon-components/css/carbon-components.min.css\";\n\timport { " + chartComponent + " } from \"@carbon/charts-svelte\";\n</script>\n\n<" + chartComponent + "\n\tdata={" + chartData + "}\n\toptions={" + chartOptions + "}\n\t/>\n";
    var packageJson = {
        scripts: {
            dev: 'vite',
            build: 'vite build',
        },
        devDependencies: {
            '@carbon/charts-svelte': libraryVersion,
            '@sveltejs/vite-plugin-svelte': 'next',
            d3: D3VERSION,
            svelte: '^3.43.1',
            'svelte-hmr': '^0.14.7',
            vite: '^2.6.7',
        },
    };
    var vite = "import { svelte } from \"@sveltejs/vite-plugin-svelte\";\nimport { defineConfig } from \"vite\";\n\nexport default defineConfig(({ mode }) => {\n  return {\n    plugins: [svelte()],\n    build: { minify: mode === \"production\" },\n    optimizeDeps: { include: [\"@carbon/charts\"] },\n  };\n});\n";
    return {
        'App.svelte': App,
        'index.html': indexHtml,
        'package.json': packageJson,
        'vite.config.js': vite,
    };
};
//# sourceMappingURL=../../demo/create-codesandbox.js.map