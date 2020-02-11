export interface TariffTransaction {
    id: number;
    userId: number;
    operationName: string;
    value: number;
    status: number;
    createdAt: string;
    updatedAt: string;
    _pivot_tariff: number;
    _pivot_transaction: number;
    message: string;
    statusStr: string;
}







export interface Tariff {
    image: string;
    current: string;
    type: string;
    paid: string;
}

export interface JoinTariff {
    tariffId: number;
}