import { SupervisorAgent } from "./supervisor";
import { ThreadManager } from "../memory/threadManager";
import { KnowledgeBase } from "../rag/knowledge";
import { ManusAgent } from "./manus";
import { MonetizationManager } from "../workflows/monetizationLoop"; // Importamos tu flujo freemium
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Inicializamos un modelo general para las respuestas ordinarias
const llmGeneral = new ChatGoogleGenerativeAI({
  modelName: "gemini-2.5-flash", 
  temperature: 0.7,
});

export class SwarmOrchestrator {
  /**
   * El punto de entrada único para cualquier mensaje que llegue (Telegram, Web, etc.)
   */
  static async processMessage(chatId: string, userInput: string): Promise<string> {
    console.log(`\n[Orquestador] Nueva petición en Chat: ${chatId} -> "${userInput}"`);

    // 1. Recuperar la memoria de este usuario para no perder el hilo
    const history = ThreadManager.getHistory(chatId);
    
    // Guardamos el mensaje actual del usuario en su historial
    ThreadManager.addMessage(chatId, "user", userInput);

    // 2. El Supervisor toma el control y decide la ruta estratégica
    const route = await SupervisorAgent.routeRequest(userInput);

    // =========================================================================
    // 🔏 CANDADO DE MONETIZACIÓN TIERRADA (FREEMIUM / REGISTRO / SUSCRIPCIÓN)
    // =========================================================================
    const access = await MonetizationManager.checkAccess(chatId, route);
    if (!access.allowed) {
      const rejectionMsg = access.reason || "Límite de créditos alcanzado por hoy.";
      // Registramos el aviso en la memoria del bot para que sepa por qué se detuvo
      ThreadManager.addMessage(chatId, "assistant", rejectionMsg);
      return rejectionMsg; // Frenamos la ejecución antes de llamar a los LLM caros
    }

    let finalResponse = "";

    // 3. Enrutamiento dinámico según la decisión del Supervisor
    switch (route) {
      case "RAG_PHYSICS":
      case "MARKET_DAO": {
        // Activamos el Cerebro Cuántico: Extraemos tu conocimiento del 16.18 / Tesla
        const context = await KnowledgeBase.retrieveContext(route);
        
        console.log(`[Orquestador] Generando respuesta con RAG e inyección de contexto.`);
        const response = await llmGeneral.invoke([
          { role: "system", content: `Eres AI-TOR, la inteligencia central de AlienFlowSpace DAO. Responde al usuario utilizando estrictamente este contexto fundacional:\n${context}` },
          { role: "system", content: `Historial reciente:\n${history}` },
          { role: "user", content: userInput }
        ]);
        
        finalResponse = response.content.toString();
        break;
      }

      case "TASK_MANUS": {
        // Despertamos al ejecutor técnico
        finalResponse = await ManusAgent.executeTask(userInput, history);
        break;
      }

      case "SOCIAL_MEDIA": {
        // Routing al Social Media Manager Agent (lazy import para evitar ciclos)
        const { SocialMediaManager } = await import('./socialMediaManager');
        finalResponse = await this.handleSocialMediaRequest(userInput, history);
        break;
      }

      case "SECURITY_SCAN": {
        // Routing al Security Agent
        const { SecurityAgent } = await import('./securityAgent');
        finalResponse = await this.handleSecurityRequest(userInput);
        break;
      }

      case "CHAT_GENERAL":
      default: {
        // Chat normal, soporte o saludos
        console.log(`[Orquestador] Procesando como conversación general.`);
        const response = await llmGeneral.invoke([
          { role: "system", content: "Eres AI-TOR, un aliado inteligente, directo y avanzado. Estás ayudando al usuario a gestionar su ecosistema." },
          { role: "system", content: `Historial reciente:\n${history}` },
          { role: "user", content: userInput }
        ]);
        
        finalResponse = response.content.toString();
        break;
      }
    }

    // =========================================================================
    // 💳 COBRO DEL CONSUMO DIARIO
    // =========================================================================
    // Una vez que la IA ha respondido con éxito, le cargamos el coste a su cuenta
    await MonetizationManager.deductCredits(chatId, route);

    // 4. Guardamos la respuesta del sistema en la memoria para el próximo turno
    ThreadManager.addMessage(chatId, "assistant", finalResponse);

    return finalResponse;
  }

  /**
   * Maneja requests de redes sociales
   */
  private static async handleSocialMediaRequest(userInput: string, history: string): Promise<string> {
    const { SocialMediaManager, FrequencyType } = await import('./socialMediaManager');
    const { ProposalQueue } = await import('../workflows/socialProposalQueue');

    const input = userInput.toLowerCase();

    // Detectar tipo de frecuencia
    let frequency: FrequencyType = 'daily';
    if (input.includes('semanal')) frequency = 'weekly';
    else if (input.includes('mensual')) frequency = 'monthly';
    else if (input.includes('trimestral')) frequency = 'quarterly';
    else if (input.includes('anual')) frequency = 'yearly';

    // Detectar plataforma
    let platform: any = undefined;
    if (input.includes('twitter')) platform = 'twitter';
    else if (input.includes('linkedin')) platform = 'linkedin';
    else if (input.includes('instagram')) platform = 'instagram';
    else if (input.includes('discord')) platform = 'discord';
    else if (input.includes('telegram')) platform = 'telegram';

    // Acciones específicas
    if (input.includes('ver propuestas') || input.includes('ver pendientes')) {
      const pending = await ProposalQueue.getPendingProposals();
      if (pending.length === 0) return "📭 No hay propuestas pendientes de aprobación.";
      
      let response = `📋 **PROPUESTAS PENDIENTES** (${pending.length}):\n\n`;
      pending.slice(0, 5).forEach(p => {
        response += `🔹 [${p.platform.toUpperCase()}] ${p.frequency}\n`;
        response += `   "${p.content.substring(0, 80)}..."\n\n`;
      });
      response += `\n**Comandos:**\n`;
      response += `• "aprobar [id]" - Aprobar propuesta\n`;
      response += `• "rechazar [id]" - Rechazar propuesta\n`;
      response += `• "generar ${frequency}" - Generar nuevas propuestas`;
      
      return response;
    }

    if (input.includes('aprobar')) {
      const idMatch = userInput.match(/aprobar\s+([\w_]+)/i);
      if (idMatch) {
        const approved = await ProposalQueue.approveProposal(idMatch[1], 'user');
        return approved ? `✅ Propuesta ${idMatch[1]} aprobada. Se programará para publicación.` 
                       : `❌ No se pudo aprobar la propuesta. Verifica el ID.`;
      }
      return "⚠️ Indica el ID de la propuesta a aprobar. Ej: 'aprobar daily_twitter_123'";
    }

    if (input.includes('rechazar') || input.includes('rechazar')) {
      const idMatch = userInput.match(/rechazar\s+([\w_]+)/i);
      if (idMatch) {
        const rejected = await ProposalQueue.rejectProposal(idMatch[1]);
        return rejected ? `❌ Propuesta ${idMatch[1]} rechazada.` 
                       : `❌ No se pudo rechazar. Verifica el ID.`;
      }
      return "⚠️ Indica el ID de la propuesta a rechazar.";
    }

    if (input.includes('estadísticas') || input.includes('stats')) {
      return ProposalQueue.generateReport();
    }

    // Generar nuevas propuestas
    const { proposals, summary } = await SocialMediaManager.generateContent(frequency, {
      platform,
      tone: 'technical',
    });

    let response = `🐦 **CONTENIDO ${frequency.toUpperCase()} GENERADO**\n\n`;
    response += `✅ ${summary}\n\n`;
    response += `**PLATAFORMAS:** ${platform || 'todas'}\n\n`;
    
    response += `📋 **PRÓXIMOS PASOS:**\n`;
    response += `1. Revisa las propuestas generadas\n`;
    response += `2. Usa "ver propuestas" para ver los detalles\n`;
    response += `3. Aprueba con "aprobar [id]" para programar publicación\n`;
    response += `4. El contenido se publicará automáticamente en el horario óptimo\n\n`;
    response += `⚡ **NOTA:** El contenido NO se publica automáticamente. Requiere tu aprobación explícita.`;

    return response;
  }

  /**
   * Maneja requests de seguridad
   */
  private static async handleSecurityRequest(userInput: string): Promise<string> {
    const { SecurityAgent } = await import('./securityAgent');
    const input = userInput.toLowerCase();

    if (input.includes('escaneo completo') || input.includes('full scan')) {
      const report = await SecurityAgent.fullScan();
      return SecurityAgent.formatReport(report);
    }

    // Por defecto, escaneo rápido
    const report = await SecurityAgent.quickScan();
    return SecurityAgent.formatReport(report);
  }
}
