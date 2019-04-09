export enum ACTIONS {
    OBSERVE="OBSERVE",
    ADD="ADD",
    DELETE="DELETE"
}

export enum EVENTS{
    AGGREGATION="AggregationEvent",
    OBJECT="ObjectEvent"
} 

export enum DATE_TYPE{
    PACK_DATE="packDate",
    HARVEST_DATE="harvestDate",
    EXPIRATION_DATE="expirationDate"
}
 
export enum BUSINESS_STEPS{
    SHIPPING="shipping",
    PACKING="packing"
}
export enum DISPOSITIONS{
    IN_TRANSIT="in_transit",
    CONFIRMED="confirmed"
}