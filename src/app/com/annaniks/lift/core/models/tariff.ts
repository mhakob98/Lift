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


export interface TariffData {
    createdAt: string;
    expired: string;
    id: number;
    type: {
        accountCount: number;
        comments: number;
        createdAt: string;
        follow: number;
        id: number;
        like: number;
        mention: number;
        name: string;
        price: number;
        updatedAt: string;
    }
    typeId: number;
    updatedAt: string;
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