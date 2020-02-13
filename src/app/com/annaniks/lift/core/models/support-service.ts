export interface CreateTicketData {
    title: string;
    files?: File[]
    message: string;
    categoryId: string;
}

export interface AllTicketsResponse {
    openTickets: Ticket[];
    closeTickets: Ticket[];
}

export interface Ticket {
    id: number;
    title: string;
    statusId: number;
    statusName: string;
    categoryId: number;
    categoryName?: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    firstMessage: {
        id: number;
        message: string;
        userId: number;
        ticketId: number;
        seen: boolean;
        createdAt: string;
        updatedAt: string;
    }
    user: {
        id: number;
        name: string;
    }
    category: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    }
    status: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    }
}