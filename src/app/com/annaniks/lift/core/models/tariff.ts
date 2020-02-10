export interface TariffOperation {
    data: string;
    operation: string;
    cost: number;
    status: string;
}

export interface Tariff {
    image: string;
    current: string;
    type: string;
    paid: string;
}