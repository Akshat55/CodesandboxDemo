var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Internal Imports
import { Service } from '../service';
var Files = /** @class */ (function (_super) {
    __extends(Files, _super);
    function Files(model, services) {
        return _super.call(this, model, services) || this;
    }
    Files.prototype.downloadCSV = function (content, filename) {
        var anchor = document.createElement('a');
        var mimeType = 'text/csv;encoding:utf-8';
        if (navigator['msSaveBlob']) {
            // Internet Explorer 10
            navigator['msSaveBlob'](new Blob([content], {
                type: mimeType,
            }), filename);
        }
        else if (URL && 'download' in anchor) {
            // HTML5
            var href = URL.createObjectURL(new Blob([content], {
                type: mimeType,
            }));
            anchor.href = href;
            anchor.setAttribute('download', filename);
            // Add anchor to body
            document.body.appendChild(anchor);
            // Click anchor
            anchor.click();
            // Remove anchor from body
            document.body.removeChild(anchor);
            URL.revokeObjectURL(href);
        }
        else {
            location.href = "data:application/octet-stream," + encodeURIComponent(content);
        }
    };
    Files.prototype.downloadImage = function (uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return Files;
}(Service));
export { Files };
//# sourceMappingURL=../../../src/services/essentials/files.js.map