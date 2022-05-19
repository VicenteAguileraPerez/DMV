import { Router } from "express";
import { DMVController } from "./controllers/DMVController";

export class DMVRouter
{
    private _router: Router;
    constructor(router: Router)
    {
        this._router = router;
    }
    get router()
    {
        this._router.get('/dmv', (req, res) => new DMVController().getDMVINFO(req,res));
        return this._router;
    }
}