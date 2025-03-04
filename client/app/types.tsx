export interface InventoryItem  {
    id: string;
    name: string;
    description?: string;
    quantity: number
    amountToTrade: number
}

export interface Status {
    id: string;
    status: string;
    option?: string
}

export interface PartyMember {
    id: string;
    name: string;
    hp: number;
    init: number;
    statuses: Status[];
}