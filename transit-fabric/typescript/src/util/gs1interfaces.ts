
export interface GS1XmlModel {
  schemaVersion: string;
  creationDate: string;
  EPCISBody?: EPCISBody;
}

export interface EPCISBody {
  EventList: EventList;
}

export interface EventList {
  ObjectEvent: ObjectEvent;
}

export interface ObjectEvent {
  eventTime: string;
  eventTimeZoneOffset: string;
  epcList: EpcList;
  action: string;
  bizStep: string;
  disposition: string;
  readPoint: ReadPoint;
  bizTransactionList: BizTransactionList;
  extension: Extension;
}

export interface EpcList {
  epc: string;
}

export interface ReadPoint {
  id: string;
}

export interface BizTransactionList {
  bizTransaction: string;
}

export interface Extension {
  childQuantityList?: (ChildQuantityListEntity)[] | null;
  ilmd?: (IlmdEntity)[] | null;
  sourceList: SourceList;
  destinationList: DestinationList;
}
export interface ChildQuantityListEntity {
  epcClass: string;
  quantity: string;
  uom?: string;
}

export interface IlmdEntity {
  expirationDate?: string | null;
  lot: string;
  packDate?: string | null;
}

export interface SourceList {
  source: string;
}

export interface DestinationList {
  destination: string;
}


