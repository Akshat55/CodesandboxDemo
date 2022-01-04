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
import * as Configuration from '../../configuration';
import { Events } from './../../interfaces';
import { Tools } from '../../tools';
var Transitions = /** @class */ (function (_super) {
    __extends(Transitions, _super);
    function Transitions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pendingTransitions = {};
        return _this;
    }
    Transitions.prototype.init = function () {
        var _this = this;
        this.services.events.addEventListener(Events.Model.UPDATE, function () {
            _this.pendingTransitions = {};
        });
    };
    Transitions.prototype.setupTransition = function (_a) {
        var _this = this;
        var t = _a.transition, name = _a.name, animate = _a.animate;
        this.pendingTransitions[t._id] = t;
        t.on('end interrupt cancel', function () {
            delete _this.pendingTransitions[t._id];
        });
        if (this.model.getOptions().animations === false || animate === false) {
            return t.duration(0);
        }
        return t.duration(Tools.getProperty(Configuration.transitions, name, 'duration') ||
            Configuration.transitions.default.duration);
    };
    Transitions.prototype.getPendingTransitions = function () {
        return this.pendingTransitions;
    };
    return Transitions;
}(Service));
export { Transitions };
//# sourceMappingURL=../../../src/services/essentials/transitions.js.map