/**
 * 📋 Social Proposal Queue
 * Sistema de gestión de propuestas de contenido con workflow de aprobación
 */

import { SocialContent, FrequencyType } from "../agents/socialMediaManager";

export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'published' | 'expired';

export interface ProposalRecord extends SocialContent {
  status: ProposalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  publishedAt?: Date;
  createdAt: Date;
  expiresAt: Date;
}

export class ProposalQueue {
  // Almacenamiento en memoria (en producción usar Supabase/Redis)
  private static proposals: Map<string, ProposalRecord> = new Map();
  
  // Configuración de expiración
  private static EXPIRATION_DAYS: Record<FrequencyType, number> = {
    daily: 1,      // Propuestas diarias expiran en 1 día
    weekly: 7,      // Semanales en 7 días
    monthly: 30,    // Mensuales en 30 días
    quarterly: 90,  // Trimestrales en 90 días
    yearly: 365,    // Anuales en 365 días
  };

  /**
   * Añade propuestas a la cola
   */
  static async addProposals(contents: SocialContent[]): Promise<string[]> {
    const ids: string[] = [];
    
    for (const content of contents) {
      const expirationDays = this.EXPIRATION_DAYS[content.frequency];
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      const record: ProposalRecord = {
        ...content,
        status: 'pending',
        createdAt: new Date(),
        expiresAt,
      };

      this.proposals.set(record.id, record);
      ids.push(record.id);
      console.log(`[ProposalQueue] Propuesta añadida: ${record.id} (${record.frequency})`);
    }

    return ids;
  }

  /**
   * Obtiene todas las propuestas pendientes
   */
  static async getPendingProposals(): Promise<ProposalRecord[]> {
    this.cleanExpiredProposals();
    return Array.from(this.proposals.values())
      .filter(p => p.status === 'pending')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Obtiene propuestas por frecuencia
   */
  static async getProposalsByFrequency(frequency: FrequencyType): Promise<ProposalRecord[]> {
    this.cleanExpiredProposals();
    return Array.from(this.proposals.values())
      .filter(p => p.frequency === frequency && p.status === 'pending');
  }

  /**
   * Aprueba una propuesta
   */
  static async approveProposal(proposalId: string, approvedBy: string): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);
    
    if (!proposal) {
      console.error(`[ProposalQueue] Propuesta no encontrada: ${proposalId}`);
      return false;
    }

    if (proposal.status !== 'pending') {
      console.error(`[ProposalQueue] Propuesta no está pendiente: ${proposalId} (status: ${proposal.status})`);
      return false;
    }

    proposal.status = 'approved';
    proposal.approvedBy = approvedBy;
    proposal.approvedAt = new Date();
    
    console.log(`[ProposalQueue] Propuesta aprobada: ${proposalId} por ${approvedBy}`);
    return true;
  }

  /**
   * Rechaza una propuesta
   */
  static async rejectProposal(proposalId: string, reason?: string): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);
    
    if (!proposal) {
      console.error(`[ProposalQueue] Propuesta no encontrada: ${proposalId}`);
      return false;
    }

    proposal.status = 'rejected';
    proposal.rejectedAt = new Date();
    proposal.rejectionReason = reason;
    
    console.log(`[ProposalQueue] Propuesta rechazada: ${proposalId}`);
    return true;
  }

  /**
   * Obtiene propuestas aprobadas listas para publicar
   */
  static async getApprovedProposals(): Promise<ProposalRecord[]> {
    return Array.from(this.proposals.values())
      .filter(p => p.status === 'approved')
      .sort((a, b) => (a.scheduledTime?.getTime() || 0) - (b.scheduledTime?.getTime() || 0));
  }

  /**
   * Marca una propuesta como publicada
   */
  static async markAsPublished(proposalId: string): Promise<boolean> {
    const proposal = this.proposals.get(proposalId);
    
    if (!proposal) {
      console.error(`[ProposalQueue] Propuesta no encontrada: ${proposalId}`);
      return false;
    }

    proposal.status = 'published';
    proposal.publishedAt = new Date();
    
    console.log(`[ProposalQueue] Propuesta publicada: ${proposalId}`);
    return true;
  }

  /**
   * Obtiene historial de propuestas
   */
  static async getHistory(limit: number = 50): Promise<ProposalRecord[]> {
    return Array.from(this.proposals.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Obtiene estadísticas
   */
  static getStats(): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    published: number;
    byFrequency: Record<FrequencyType, number>;
  } {
    const proposals = Array.from(this.proposals.values());
    
    return {
      total: proposals.length,
      pending: proposals.filter(p => p.status === 'pending').length,
      approved: proposals.filter(p => p.status === 'approved').length,
      rejected: proposals.filter(p => p.status === 'rejected').length,
      published: proposals.filter(p => p.status === 'published').length,
      byFrequency: {
        daily: proposals.filter(p => p.frequency === 'daily').length,
        weekly: proposals.filter(p => p.frequency === 'weekly').length,
        monthly: proposals.filter(p => p.frequency === 'monthly').length,
        quarterly: proposals.filter(p => p.frequency === 'quarterly').length,
        yearly: proposals.filter(p => p.frequency === 'yearly').length,
      },
    };
  }

  /**
   * Limpia propuestas expiradas
   */
  private static cleanExpiredProposals(): void {
    const now = new Date();
    for (const [id, proposal] of this.proposals.entries()) {
      if (proposal.status === 'pending' && proposal.expiresAt < now) {
        proposal.status = 'expired';
        console.log(`[ProposalQueue] Propuesta expirada: ${id}`);
      }
    }
  }

  /**
   * Genera un reporte de propuestas
   */
  static generateReport(): string {
    const stats = this.getStats();
    const pending = Array.from(this.proposals.values()).filter(p => p.status === 'pending');
    
    let report = `📊 **REPORTE DE PROPUESTAS SOCIAL MEDIA**
    
**ESTADÍSTICAS:**
- Total de propuestas: ${stats.total}
- Pendientes: ${stats.pending}
- Aprobadas: ${stats.approved}
- Rechazadas: ${stats.rejected}
- Publicadas: ${stats.published}

**POR FRECUENCIA:**
- Diarias: ${stats.byFrequency.daily}
- Semanales: ${stats.byFrequency.weekly}
- Mensuales: ${stats.byFrequency.monthly}
- Trimestrales: ${stats.byFrequency.quarterly}
- Anuales: ${stats.byFrequency.yearly}

**PRÓXIMAS PENDIENTES:**
`;
    
    if (pending.length === 0) {
      report += "No hay propuestas pendientes.";
    } else {
      pending.slice(0, 5).forEach(p => {
        report += `\n• [${p.platform.toUpperCase()}] ${p.frequency} - "${p.content.substring(0, 50)}..."`;
      });
    }

    return report;
  }
}
