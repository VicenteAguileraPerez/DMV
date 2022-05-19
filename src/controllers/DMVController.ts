import { Request, Response } from "express";
import puppeteer  from 'puppeteer';

export class DMVController {
  constructor() {}
  getDMVINFO(req:Request, res:Response) 
  {
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

    this.DMVFunction(isKnowLicense,vinfull,license,vin,punchaseInfo,price,month,day,year,zip).then(result => 
    {
        res.status(200).json({
            "result":result
        }); 
    })
    .catch(err => {
        res.status(500).json({"message": "Internal Error",err})
    });
    
  }
  async DMVFunction(isKnowLicense,VINFull,license,
  VIN,PunchaseInfo, price, month,day,year,zip)
  {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.dmv.ca.gov/wasapp/FeeCalculatorWeb/usedVehicleForm.do', {waitUntil: 'load'});
    await page.screenshot({path:"img.png",fullPage: true});
    if(isKnowLicense=="Y")
    {
        await page.click("#knowLicense1");
        await page.type("#vehicleLicense",license);//Enter 2-7 characters. Do not use blank spaces. Leave out special characters when entering a plate number. For Kids Plates, please leave out any symbols. For Vessels, the CF must be left out as part of the number.
        await page.type("#vehicleVin",VIN);//Enter the last 5 digits of the vehicle identification number (VIN) or vessel hull identification number (HIN). For a HIN that is 2-3 digits, please enter the full number.
    }
    else{
         await page.click("#knowLicense2");
         await page.type("#vehicleVinFull",VINFull);//17
    }
    
    switch (PunchaseInfo) {
        case 'P':
            await page.click("#acquiredFrom0");//Purchase 
            await page.type("#purchasePrice",price);
          break;
        case 'G':
            await page.click("#acquiredFrom1");//acquiredFrom1 Gift 
             await page.type("#purchasePrice",price);
          break;
        case 'F':
            await page.click("#acquiredFrom2");//acquiredFrom2 Family transfer
          break;
    }
    await page.select('#purchaseMonth', month);
    await page.type("#purchaseDay",day);
    await page.type("#purchaseYear",year);
    await page.select('#countyCode', '50');
    await page.select('#cityNameSelect', 'CERES');
    await page.type("#zipCode",zip);
    await page.screenshot({path:"img.png",fullPage: true});
    await Promise.all([
        page.waitForNavigation(),
        page.click("button[type=submit]")
      ]);
    const keys  = await page.evaluate(() => Array.from(document.querySelectorAll('dt')).map(elem => 
        elem.textContent!.replace(/[\t | \n]/g, "")));
    const values  = await page.evaluate(() => Array.from(document.querySelectorAll('dd')).map(elem => 
            elem.textContent!.replace(/[\t | \n]/g, "")));
    let  result = {};
    keys.forEach((key, i) => result[key] = values[i]);
    console.log(result);
    await page.screenshot({path:"img2.png",fullPage: true});
    
    browser.close();
    return result;
  }
}
