import { AdvanceShipNotice, LotDetail } from "./interfaces";
import { GS1XmlModel, EPCISBody, EventList, ObjectEvent, ReadPoint,Extension, SourceList, DestinationList, EpcList, BizTransactionList, ChildQuantityListEntity, IlmdEntity } from "./gs1interfaces";
import { ACTIONS, BUSINESS_STEPS, DISPOSITIONS } from "./gs1Enums";
import { EPC_CBV_BUSINESS_STEP, XML_VERSION, EPC_CBV_DISPOSITION, EPC_CLASS_LGTIN } from "./gs1Constants";
import { getFormattedSSCC, getFormattedGLN, getFormattedGTIN } from "./gs1DataFormatter";


let standardObj:AdvanceShipNotice;

async function convertStringToJasonObject(){
    const fs = require('fs');
    let rawdata = fs.readFileSync('./asnData.json');  
    return JSON.parse(rawdata);  
}

async function gs1ObjectMapper(objASN:AdvanceShipNotice){
    console.log("converting ans to gs1 model data");
    standardObj = Object.create(objASN);
    let gsModel:GS1XmlModel={schemaVersion:getXmlVerison(),creationDate:getDateString(),EPCISBody:getEPCISBody()};
    console.log("date added:"+JSON.stringify(gsModel));
}

function getEPCISBody():EPCISBody{
   let epcisBody:EPCISBody={EventList:getEventList()};
   return epcisBody;
}

function getEventList():EventList{
   let eventList:EventList={ObjectEvent:getObjectEvent()};
   return eventList;
}

function getObjectEvent():ObjectEvent{
   let objectEvent:ObjectEvent={
       eventTime:getEventTime(),
       eventTimeZoneOffset:getTimeZoneOffset(),
       epcList:getEpcList(),
       action:getAction(),
       bizStep:getBizStep(),
       disposition:getDisposition(),
       readPoint:getReadPoint(),
       bizTransactionList:getbizTransactionList(),
       extension:getExtension()
   };
   return objectEvent;
}


function getEventTime():string{
    return standardObj.Header.HeaderRecordShipmentInfo.TransactionDate;
}

function getTimeZoneOffset():string{
    return String(((new Date().getTimezoneOffset())/60));
}

function getEpcList():EpcList{
    let epcList:EpcList={epc:getEpc()};
    return epcList;
}

function getEpc():string{
    const palletId=standardObj.Header.HeaderRecordShipmentInfo.OrderDetail.PalletDetail.PalletLicensePlateNumber;
    return getFormattedSSCC(palletId);
}

function getAction():string{
    return ACTIONS.OBSERVE;
}

function getBizStep():string{
    return EPC_CBV_BUSINESS_STEP+BUSINESS_STEPS.SHIPPING;
}

function getDisposition():string{
    return EPC_CBV_DISPOSITION+DISPOSITIONS.IN_TRANSIT;
}

function getReadPoint():ReadPoint{
    let readPoint:ReadPoint={id:getReadPointId()};
    return readPoint;
}

function getReadPointId():string{
     return getFormattedGLN(standardObj.Header.HeaderRecordShipmentInfo.HDRShipFromLocationInfo.HDRShipFromLocationID);
}

function getbizTransactionList():BizTransactionList{
   let bizTransactionList:BizTransactionList={bizTransaction:getBizTransaction()};
   return bizTransactionList;
}

function getBizTransaction():string{
    return "";
}


function getExtension():Extension{
    let extension:Extension={
        childQuantityList:getClildQuantityList(),
        ilmd:getIlmd(),
        sourceList:getSourceList(),
        destinationList:getDestinationList()
    };
    return extension;
}

function getSourceList():SourceList{
    let sourceList:SourceList={source:getSource()};
    return sourceList;
}

function getSource():string{
    return getFormattedGLN(standardObj.Header.HeaderRecordShipmentInfo.HDRShipFromLocationInfo.HDRShipFromLocationID);
}

function getDestinationList():DestinationList{
    let destinationList:DestinationList={destination:getDestination()};
    return destinationList;
}

function getDestination():string{
    return getFormattedGLN(standardObj.Header.HeaderRecordShipmentInfo.HDRShipToLocationInfo.HDRShipToLocationID);
}


function getClildQuantityList():(ChildQuantityListEntity)[]{
    let childQuantityList:(ChildQuantityListEntity)[];
    let lotDetail:LotDetail=standardObj.Header.HeaderRecordShipmentInfo.OrderDetail.PalletDetail.ItemCaseDetail.LotDetail;
    let childQuantityListEntity:ChildQuantityListEntity={
        epcClass:getEpcClass(lotDetail.LotGtin),
        quantity:getQuantity(lotDetail.LotQty),
        uom:getUOM(lotDetail.LotQtyUOM)
    }
    childQuantityList=[childQuantityListEntity,childQuantityListEntity];  
    return childQuantityList;
}

function getEpcClass(lgtin:string):string{
    return EPC_CLASS_LGTIN+getFormattedGTIN(lgtin);
}

function getQuantity(qty:string):string{
    return qty;
}

function getUOM(uom:string):string{
    return uom;
}

function getIlmd():(IlmdEntity)[]{
    let imld:(IlmdEntity)[];
    let lotDetail:LotDetail=standardObj.Header.HeaderRecordShipmentInfo.OrderDetail.PalletDetail.ItemCaseDetail.LotDetail;
    let ilmdEntity:IlmdEntity={
       expirationDate:getExpirationDate(lotDetail.LotExpirationDate),
       lot:getLotNumber(lotDetail.LotNum),
       packDate:getPackDate(lotDetail.LotManufactureDate)
    }
    
    imld=[ilmdEntity,ilmdEntity];
    return imld;
}

function getExpirationDate(expDate:string):string{
   if(expDate){
       return expDate;
   }else{
       return null;
   }
}

function getLotNumber(lotNum:string):string{
    return lotNum;
}

function getPackDate(packDate:string):string{
    if(packDate){
        return packDate;
    }else{
        return null;
    }
}

function getXmlVerison():string{
  return XML_VERSION;
}

function getDate():Date{
  return new Date();
}

function getDateString():string{
  return new Date().toDateString();
}

export{
    gs1ObjectMapper,convertStringToJasonObject,
};