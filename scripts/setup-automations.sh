#!/bin/bash
# =============================================================================
# AiTor v.69 - OpenHands Automations Setup
# =============================================================================
# Script para configurar las automations de redes sociales y seguridad
# =============================================================================

set -e

OPENHANDS_HOST="${OPENHANDS_HOST:-https://app.all-hands.dev}"

echo "🚀 Configurando Automations para AiTor v.69"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# =============================================================================
# AUTOMATION 1: Daily Social Content Generator
# =============================================================================
echo ""
echo "📱 Creando: Daily Social Content Generator..."
curl -sS -X POST "${OPENHANDS_HOST}/api/automation/v1/preset/prompt" \
  -H "Authorization: Bearer ${OPENHANDS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Social Content - AiTor",
    "prompt": "Eres el Social Media Manager de AlienFlowSpace DAO. Ejecuta las siguientes acciones:\n\n1. Genera propuestas de contenido DIARIO usando el SocialMediaManager:\n   - Import { SocialMediaManager } from ./backend/agents/socialMediaManager\n   - Ejecuta: await SocialMediaManager.generateContent(\"daily\", { platform: \"twitter\", tone: \"technical\" })\n   - Ejecuta: await SocialMediaManager.generateContent(\"daily\", { platform: \"linkedin\", tone: \"professional\" })\n\n2. Genera el reporte:\n   const { ProposalQueue } = await import(\"./backend/workflows/socialProposalQueue\");\n   const stats = ProposalQueue.getStats();\n\n3. Reporta:\n   - Número de propuestas generadas\n   - Plataformas cubiertas\n   - Resumen de estadísticas actuales\n   - Próximas acciones recomendadas\n\nRepositorio: /workspace/project/AiTor\nStack: Node.js, TypeScript, Gemini AI",
    "trigger": {
      "type": "cron",
      "schedule": "0 9 * * *",
      "timezone": "UTC"
    },
    "timeout": 300
  }'

# =============================================================================
# AUTOMATION 2: Weekly Content Calendar
# =============================================================================
echo ""
echo "📅 Creando: Weekly Content Calendar..."
curl -sS -X POST "${OPENHANDS_HOST}/api/automation/v1/preset/prompt" \
  -H "Authorization: Bearer ${OPENHANDS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Social Calendar - AiTor",
    "prompt": "Eres el Chief Content Officer de AlienFlowSpace DAO. Genera el calendario semanal completo:\n\n1. Genera propuestas SEMANALES:\n   - Import { SocialMediaManager } from ./backend/agents/socialMediaManager\n   - await SocialMediaManager.generateContent(\"weekly\", { tone: \"mixed\" })\n\n2. Genera estrategia mensual preview:\n   - await SocialMediaManager.generateContent(\"monthly\")\n\n3. Genera reporte de estadísticas:\n   const { ProposalQueue } = await import(\"./backend/workflows/socialProposalQueue\");\n   const report = ProposalQueue.generateReport();\n\n4. Formatea el calendario semanal con:\n   - Lunes-Jueves: Contenido por día\n   - Viernes: Contenido community\n   - Weekend: Engagement\n   - Plataformas: Twitter, LinkedIn, Instagram, Discord\n\nRepositorio: /workspace/project/AiTor",
    "trigger": {
      "type": "cron",
      "schedule": "0 10 * * 1",
      "timezone": "UTC"
    },
    "timeout": 600
  }'

# =============================================================================
# AUTOMATION 3: Daily Security Scan
# =============================================================================
echo ""
echo "🔐 Creando: Daily Security Scan..."
curl -sS -X POST "${OPENHANDS_HOST}/api/automation/v1/preset/prompt" \
  -H "Authorization: Bearer ${OPENHANDS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Security Scan - AiTor",
    "prompt": "Eres el Security Agent de AlienFlowSpace DAO. Ejecuta escaneo de seguridad:\n\n1. Ejecuta escaneo RAPIDO:\n   - cd /workspace/project/AiTor\n   - npm audit --json > /tmp/npm-audit.json 2>/dev/null || true\n   - npm outdated --json > /tmp/npm-outdated.json 2>/dev/null || true\n\n2. Analiza resultados:\n   - Import { SecurityAgent } from ./backend/agents/securityAgent\n   - const report = await SecurityAgent.quickScan();\n\n3. Formatea reporte:\n   - Si hay critical/high: Alertar con emojis\n   - Si todo OK: Confirmar\n   - Incluir recomendaciones\n\n4. Si hay vulnerabilidades criticas:\n   - Crear issue en GitHub con label \"security\"\n   - Sugerir comando de fix\n\nRepositorio: /workspace/project/AiTor\nRepo de GitHub: Alien69Flow/AiTor",
    "trigger": {
      "type": "cron",
      "schedule": "0 8 * * *",
      "timezone": "UTC"
    },
    "timeout": 300
  }'

# =============================================================================
# AUTOMATION 4: Weekly Security Audit
# =============================================================================
echo ""
echo "🛡️ Creando: Weekly Security Audit..."
curl -sS -X POST "${OPENHANDS_HOST}/api/automation/v1/preset/prompt" \
  -H "Authorization: Bearer ${OPENHANDS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Security Audit - AiTor",
    "prompt": "Eres el Security Agent de AlienFlowSpace DAO. Ejecuta auditoria completa:\n\n1. Ejecuta ESCANEO COMPLETO:\n   - cd /workspace/project/AiTor\n   - npm audit --json\n   - npm outdated --json\n   - Buscar patrones de secretos hardcoded\n\n2. Genera reporte detallado:\n   - Import { SecurityAgent } from ./backend/agents/securityAgent\n   - const report = await SecurityAgent.fullScan();\n   - const formatted = SecurityAgent.formatReport(report);\n\n3. Incluye:\n   - Resumen ejecutivo\n   - Todos los hallazgos por severidad\n   - Recomendaciones priorizadas\n   - Dependencias a actualizar\n   - Proximo escaneo\n\n4. Si hay issues:\n   - Crear PR con updates si es seguro\n   - Documentar en reporte\n\nRepositorio: /workspace/project/AiTor",
    "trigger": {
      "type": "cron",
      "schedule": "0 9 * * 1",
      "timezone": "UTC"
    },
    "timeout": 600
  }'

# =============================================================================
# AUTOMATION 5: Monthly Strategy Review
# =============================================================================
echo ""
echo "📊 Creando: Monthly Strategy Review..."
curl -sS -X POST "${OPENHANDS_HOST}/api/automation/v1/preset/prompt" \
  -H "Authorization: Bearer ${OPENHANDS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Strategy Review - AiTor",
    "prompt": "Eres el Strategic Planner de AlienFlowSpace DAO. Ejecuta revision mensual:\n\n1. Genera estrategia MENSUAL:\n   - Import { SocialMediaManager } from ./backend/agents/socialMediaManager\n   - await SocialMediaManager.generateContent(\"monthly\", { theme: \"Growth & Community\" })\n\n2. Genera analisis TRIMESTRAL preview:\n   - await SocialMediaManager.generateContent(\"quarterly\")\n\n3. Analiza metricas:\n   const { ProposalQueue } = await require(\"./backend/workflows/socialProposalQueue\");\n   const stats = ProposalQueue.getStats();\n\n4. Incluye:\n   - Performance del mes\n   - Top contenidos\n   - Recomendaciones para siguiente mes\n   - ROI estimado\n   - Proximos eventos/hitos\n\n5. Genera documento en formato:\n   - Resumen ejecutivo\n   - Metricas detalladas\n   - Estrategia del mes\n   - Budget recommendations\n\nRepositorio: /workspace/project/AiTor",
    "trigger": {
      "type": "cron",
      "schedule": "0 9 1 * *",
      "timezone": "UTC"
    },
    "timeout": 900
  }'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Configuracion completada!"
