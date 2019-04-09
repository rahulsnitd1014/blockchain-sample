import { EPCLIST_SSCC_CODE, SEPERATOR_DOT, EPC_CBV_SGLN } from "./gs1Constants";

export function getFormattedSSCC(sscc:string):string {
   if(sscc.length>=8){
      return EPCLIST_SSCC_CODE+sscc.substring(1,8)+SEPERATOR_DOT+sscc.substring(8,sscc.length);
   }else{
      return sscc;
   }
}

export function getFormattedGLN(gln:string):string{
   if(gln.length==13){
      return EPC_CBV_SGLN+gln.substring(0,8)+SEPERATOR_DOT+gln.substring(8,12)+SEPERATOR_DOT+gln.substring(12,13);
   }else{
      return gln;
   }
}

export function getFormattedGTIN(gtin:string):string{
   if(gtin){
      return gtin;
   }else{
      return "";
   }
}

