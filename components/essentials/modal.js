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
import { Component } from '../component';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { Events } from '../../interfaces';
// Carbon modal
import { Modal as CarbonModalComponent } from 'carbon-components';
// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';
// D3 Imports
import { select } from 'd3-selection';
import { get } from 'lodash-es';
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal(model, services, configs) {
        var _this = _super.call(this, model, services, configs) || this;
        _this.type = 'modal';
        // flag for checking whether tooltip event listener is added or not
        _this.isEventListenerAdded = false;
        _this.handleShowModal = function () {
            _this.modal.html(_this.getModalHTML());
            _this.modal
                .select('div.bx--modal-footer button.bx--btn')
                .on('click', function () { return _this.model.exportToCSV(); });
            var modalInstance = CarbonModalComponent.create(_this.modal.node());
            modalInstance.show();
        };
        _this.init();
        return _this;
    }
    Modal.prototype.addEventListeners = function () {
        // listen to show-modal Custom Events to render the modal
        this.services.events.addEventListener(Events.Modal.SHOW, this.handleShowModal);
    };
    Modal.prototype.removeEventListeners = function () {
        // remove show-modal Custom Events
        this.services.events.removeEventListener(Events.Modal.SHOW, this.handleShowModal);
    };
    Modal.prototype.getModalHTML = function () {
        var options = this.model.getOptions();
        var chartprefix = Tools.getProperty(options, 'style', 'prefix');
        var tableArray = this.model.getTabularDataArray();
        return "\n\t\t<div class=\"bx--modal-container\">\n\t\t\t<div class=\"bx--modal-header\">\n\t\t\t\t<p class=\"bx--modal-header__label bx--type-delta\" id=\"modal-title\">Tabular representation</p>\n\t\t\t\t<p class=\"bx--modal-header__heading bx--type-beta\" id=\"modal-description\">" + options.title + "</p>\n\t\t\t\t<button class=\"bx--modal-close\" type=\"button\" data-modal-close aria-label=\"close modal\"  data-modal-primary-focus>\n\t\t\t\t\t<svg focusable=\"false\" preserveAspectRatio=\"xMidYMid meet\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" aria-label=\"Close\" width=\"20\" height=\"20\" viewBox=\"0 0 32 32\" role=\"img\" class=\"bx--modal-close__icon\">\n\t\t\t\t\t\t<path d=\"M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z\"></path>\n\t\t\t\t\t</svg>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"bx--modal-content\"><table class=\"bx--data-table bx--data-table--no-border\">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t" + get(tableArray, 0)
            .map(function (heading) { return "<th scope=\"col\">\n\t\t\t\t\t\t\t\t<div class=\"bx--table-header-label\">" + heading + "</div>\n\t\t\t\t\t\t\t</th>"; })
            .join('') + "\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>" + tableArray
            .slice(1)
            .map(function (row) { return "\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t" + row.map(function (column) { return "<td>" + column + "</td>"; }).join('') + "\n\t\t\t\t\t\t\t</tr>"; })
            .join('') + "\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t<div class=\"bx--modal-footer\">\n\t\t\t  <div class=\"" + settings.prefix + "--" + chartprefix + "-modal-footer-spacer\"></div>\n\t\t\t  <button class=\"bx--btn bx--btn--primary\" type=\"button\" data-modal-primary-focus>Download as CSV</button>\n\t\t\t</div>\n\t\t</div>";
    };
    Modal.prototype.render = function () {
        var options = this.model.getOptions();
        if (!this.isEventListenerAdded) {
            // Grab the tooltip element
            var holder = select(this.services.domUtils.getHolder());
            var chartprefix = Tools.getProperty(options, 'style', 'prefix');
            this.modal = DOMUtils.appendOrSelect(holder, "div." + settings.prefix + "--" + chartprefix + "--modal");
            this.addEventListeners();
            this.isEventListenerAdded = true;
            this.modal
                .attr('data-modal', true)
                .attr('class', 'bx--modal')
                .attr('role', 'dialog')
                .attr('aria-modal', true)
                .attr('aria-labelledby', 'modal-title')
                .attr('aria-describedby', 'modal-description')
                .attr('tabindex', -1);
        }
    };
    Modal.prototype.destroy = function () {
        // remove tooltip eventListener
        this.removeEventListeners();
        this.isEventListenerAdded = false;
    };
    return Modal;
}(Component));
export { Modal };
//# sourceMappingURL=../../../src/components/essentials/modal.js.map