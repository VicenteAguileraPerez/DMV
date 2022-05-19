"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMVRouter = void 0;
const DMVController_1 = require("./controllers/DMVController");
class DMVRouter {
    constructor(router) {
        this._router = router;
    }
    get router() {
        this._router.get('/dmv', (req, res) => new DMVController_1.DMVController().getDMVINFO(req, res));
        return this._router;
    }
}
exports.DMVRouter = DMVRouter;
