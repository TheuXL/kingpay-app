/**
 * Módulo: Tickets de Suporte
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";

export interface Ticket {
    id: string;
    subject: string;
    status: 'pending' | 'open' | 'closed';
    created_at: string;
}

export interface TicketMessage {
    id: string;
    message: string;
    created_at: string;
    is_admin_response: boolean;
}

const createTicket = async (subject: string, message: string) => {
    return edgeFunctionsProxy.post('support-tickets', {
        action: 'create_ticket',
        payload: { subject, message }
    });
};

const listTickets = async () => {
    return edgeFunctionsProxy.post<{ tickets: Ticket[] }>('support-tickets', {
        action: 'list_tickets'
    });
};

const listTicketMessages = async (ticketId: string) => {
    return edgeFunctionsProxy.post<{ messages: TicketMessage[] }>('support-tickets', {
        action: 'list_messages',
        payload: { ticket_id: ticketId }
    });
};

const sendTicketMessage = async (ticketId: string, message: string) => {
    return edgeFunctionsProxy.post('support-tickets', {
        action: 'send_message',
        payload: { ticket_id: ticketId, message }
    });
};

export const supportTicketService = {
    createTicket,
    listTickets,
    listTicketMessages,
    sendTicketMessage
}; 