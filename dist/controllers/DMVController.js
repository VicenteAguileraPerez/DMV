"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMVController = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class DMVController {
    constructor() {
    }
    getDMVINFO(req, res) {
        let isKnowLicense = req.query.isKnowLicense;
        let vinfull = req.query.vinfull;
        let license = req.query.license;
        let vin = req.query.vin;
        let punchaseInfo = req.query.punchaseInfo;
        let price = req.query.price;
        let month = req.query.month;
        let year = req.query.year;
        let day = req.query.day;
        let zip = req.query.zip;
        this.DMVFunction(isKnowLicense, vinfull, license, vin, punchaseInfo, price, month, day, year, zip).then(result => {
            res.status(200).json({
                "result": result
            });
        })
            .catch(err => {
            res.status(500).json({ "message": "Internal Error", err });
        });
    }
    DMVFunction(isKnowLicense, VINFull, license, VIN, PunchaseInfo, price, month, day, year, zip) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto('https://www.dmv.ca.gov/wasapp/FeeCalculatorWeb/usedVehicleForm.do', { waitUntil: 'load' });
            yield page.screenshot({ path: "img.png", fullPage: true });
            if (isKnowLicense == "Y") {
                yield page.click("#knowLicense1");
                yield page.type("#vehicleLicense", license); //Enter 2-7 characters. Do not use blank spaces. Leave out special characters when entering a plate number. For Kids Plates, please leave out any symbols. For Vessels, the CF must be left out as part of the number.
                yield page.type("#vehicleVin", VIN); //Enter the last 5 digits of the vehicle identification number (VIN) or vessel hull identification number (HIN). For a HIN that is 2-3 digits, please enter the full number.
            }
            else {
                yield page.click("#knowLicense2");
                yield page.type("#vehicleVinFull", VINFull); //17
            }
            switch (PunchaseInfo) {
                case 'P':
                    yield page.click("#acquiredFrom0"); //Purchase 
                    yield page.type("#purchasePrice", price);
                    break;
                case 'G':
                    yield page.click("#acquiredFrom1"); //acquiredFrom1 Gift 
                    yield page.type("#purchasePrice", price);
                    break;
                case 'F':
                    yield page.click("#acquiredFrom2"); //acquiredFrom2 Family transfer
                    break;
            }
            yield page.select('#purchaseMonth', month);
            yield page.type("#purchaseDay", day);
            yield page.type("#purchaseYear", year);
            yield page.select('#countyCode', '50');
            yield page.select('#cityNameSelect', 'CERES');
            yield page.type("#zipCode", zip);
            yield page.screenshot({ path: "img.png", fullPage: true });
            yield Promise.all([
                page.waitForNavigation(),
                page.click("button[type=submit]")
            ]);
            const keys = yield page.evaluate(() => Array.from(document.querySelectorAll('dt')).map(elem => elem.textContent.replace(/[\t | \n]/g, "")));
            const values = yield page.evaluate(() => Array.from(document.querySelectorAll('dd')).map(elem => elem.textContent.replace(/[\t | \n]/g, "")));
            let result = {};
            keys.forEach((key, i) => result[key] = values[i]);
            console.log(result);
            yield page.screenshot({ path: "img2.png", fullPage: true });
            browser.close();
            return result;
        });
    }
}
exports.DMVController = DMVController;
