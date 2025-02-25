export interface InventoryItem  {
    id: string;
    name: string;
    description?: string;
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
    statuses: string[];
}