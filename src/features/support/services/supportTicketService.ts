/**
 * Serviço para tickets de suporte
 */
import { edgeFunctionsProxy } from "../../../services/api/EdgeFunctionsProxy";
import { CreateTicketPayload, SendMessagePayload, Ticket, TicketMessage } from "../types";

class SupportTicketService {
    async createTicket(payload: CreateTicketPayload): Promise<Ticket> {
        const response = await edgeFunctionsProxy.invoke('support-tickets', 'POST', {
            action: 'create_ticket',
            payload,
        });
        if (response.success && response.data?.ticket) {
            return response.data.ticket as Ticket;
        }
        throw new Error(response.error || 'Erro ao criar ticket de suporte.');
    }

    async getTickets(): Promise<Ticket[]> {
        const response = await edgeFunctionsProxy.invoke('support-tickets', 'POST', {
            action: 'list_tickets',
        });
        if (response.success && response.data) {
            return response.data as Ticket[];
        }
        throw new Error(response.error || 'Erro ao listar tickets de suporte.');
    }

    async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
        const response = await edgeFunctionsProxy.invoke('support-tickets', 'POST', {
            action: 'list_messages',
            payload: { ticket_id: ticketId },
        });
        if (response.success && response.data) {
            return response.data as TicketMessage[];
        }
        throw new Error(response.error || `Erro ao buscar mensagens para o ticket ${ticketId}.`);
    }

    async sendMessage(payload: SendMessagePayload): Promise<void> {
        const response = await edgeFunctionsProxy.invoke('support-tickets', 'POST', {
            action: 'send_message',
            payload,
        });
        if (!response.success) {
            throw new Error(response.error || 'Erro ao enviar mensagem no ticket.');
        }
    }
}

export const supportTicketService = new SupportTicketService(); 