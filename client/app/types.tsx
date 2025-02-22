export interface InventoryItem  {
    id: string;
    name: string;
    description?: string;
}

export interface PartyMember {
    id: string;
    name: string;
    hp: number;
    init: number;
    statuses: string[];
}