/**
 * 📈 Market Knowledge Base
 * RAG especializado para análisis de mercados crypto y DeFi
 */

const marketKnowledge = {
  technicalAnalysis: `
ANÁLISIS TÉCNICO - INDICADORES CLAVE:

RSI (Relative Strength Index):
- < 30: Sobrevendido (posible compra)
- > 70: Sobrecomprado (posible venta)
- 50: Neutral

MACD (Moving Average Convergence Divergence):
- MACD > Signal: Momentum bullish
- MACD < Signal: Momentum bearish
- Histogram positivo: Aceleración alcista
- Histogram negativo: Aceleración bajista

MEDIAS MÓVILES:
- EMA 9 < EMA 21: Tendencia corta bearish
- EMA 9 > EMA 21: Tendencia corta bullish
- Precio > SMA 200: Mercado en bullish
- Precio < SMA 200: Mercado en bearish

SOPORTES Y RESISTENCIAS:
- Soporte: Zona donde compradores entran
- Resistencia: Zona donde vendedores entran
- Breakout: Rompimiento de resistencia con volumen
- Breakdown: Ruptura de soporte con volumen
`,

  defiProtocols: `
PROTOCOLOS DEFI PRINCIPALES:

LENDING:
- Aave: $15B+ TVL, prestamos entre usuarios
- Compound: Pionero en interest rates
- MakerDAO: DAI stablecoin, colateralización

DEXs (Exchange Descentralizado):
- Uniswap: AMM líder, V3 con concentrated liquidity
- SushiSwap: Fork con token SUSHI
- Curve: Stablecoins y assets correlacionados
- Balancer: pools customizables

YIELD FARMING:
- Yearn Finance: Automatización de yield
- Convex: Optimización de Curve
- Lido: Liquid staking ETH

DERIVATIVOS:
- dYdX: Perps en Layer 2
- GMX: Perp perpétuos en Avalanche/Arbitrum
- Synthetix: Synths y derivados sintéticos

CROSS-CHAIN:
- Stargate: Bridge universal
- Across: Puentes rápidos
- Socket: Aggregator de bridges
`,

  tokenomics: `
TOKENOMICS - MÉTRICAS CLAVE:

MÉTRICAS DE VALOR:
- Market Cap = Precio × Supply Circulante
- FDV (Fully Diluted) = Precio × Total Supply
- TVL (Total Value Locked): Valor depositado

SUPPLY:
- Circulating Supply: Tokens en circulación
- Total Supply: Tokens mintados (menos burns)
- Max Supply: Límite máximo hardcap

METRICAS DE DISTRIBUCIÓN:
- % en VCs/Fundadores: Ideal < 20%
- % en Comunidad: Ideal > 50%
- Vesting schedule: Cliff + linear unlock

MÉTRICAS DE UTILIDAD:
- Token Burn: Reducción de supply
- Staking Rewards: Incentivos por hold
- Governance Rights: Votos en DAO
- Fee Revenue: % para holders
`,

  riskManagement: `
GESTIÓN DE RIESGO:

RATIOS DE ASIGNACIÓN:
- Máximo 5-10% del portfolio en un solo activo
- 40% en BTC/ETH como base
- 30% en stablecoins para oportunidades
- 20% en altcoins de alta convicción
- 10% para experimentos/high risk

STOP LOSS:
- Tight stop: 5-10% para trades cortos
- Wide stop: 15-20% para tendencias largas
- Mental stop: Nivel donde tesis se invalida

POSITION SIZING:
- Riesgo por trade: Máximo 1-2% del portfolio
- Position = (Portfolio × Risk%) / StopLoss%
- Ejemplo: $10K portfolio, 1% riesgo, 10% stop = $100 position

DIVERSIFICACIÓN:
- No más de 10-15 tokens en portfolio
- Mezcla de caps: 60% large, 30% mid, 10% small
- Diversificación por chains
- Diversificación por sector (DeFi, L1, Gaming, etc.)
`,

  marketSentiment: `
SENTIMIENTO DE MERCADO:

INDICADORES ON-CHAIN:
- Exchange Flows: Entradas = bearish, Salidas = bullish
- Exchange Reserves: Supply en exchanges vs wallets
- Active Addresses: Engagement de red
- Gas Prices: Actividad de red

SENTIMENT INDICES:
- Fear & Greed Index: 0-100 (0=fear, 100=greed)
- Funding Rates: Positivo =大多数人 long (warning)
- Open Interest: Interés abierto en perpetuos
- Short Interest: Posición short abierta

CICLOS DE MERCADO:
- Accumulation: institucionales accumulan, precio lateral
- Mark-up: Precio sube con volumen
- Distribution: Tokens distribuidos a retail
- Mark-down: Precio cae, volumen baja

MACRO INDICATORS:
- DXY (Dollar Index): Inverso correlacionado con crypto
- Interest Rates: Tasas altas = bearish para risk assets
- SP500: Correlación creciente con crypto
- Gold: Safe haven, correlación variable
`,

  tradingStrategies: `
ESTRATEGIAS DE TRADING:

SWING TRADING:
- Timeframe: 1D - 1W
- Objetivos: 10-30% en semanas/meses
- Indicadores: EMA, RSI, Soportes/Resistencias
- Risk/Reward: Mínimo 1:2

DCA (Dollar Cost Averaging):
- Comprar cantidades fijas en intervalos
- Reduces impact de volatility
- Efectivo en mercados sideways
- Best para largo plazo

GRID TRADING:
- Comprar en niveles predefinidos
- Vender cuando sube
- Efectivo en ranges
- Configurar con Bot o manual

ARBITRAJE:
- Cross-exchange: Diferencias de precio
- Triangular: BTC/ETH/USDT en mismo exchange
- Statistical: Basado en histórico

OPTIONS (Avanzado):
- Covered Calls: Generar yield sobre holdings
- Protective Puts: Insurance contra caídas
- Credit Spreads: Ingreso con dirección
`,

  whaleTracking: `
SEGUIMIENTO DE WHALES:

ON-CHAIN TOOLS:
- Nansen: Wallet labels y tracking
- Arkham Intelligence: Rastreo de addresses
- Etherscan: Verificación manual
- DeBank: Portfolio aggregation

PATRONES DE WHALE:
- accumulation: Compran en dips, acumulan
- distribution: Venden en peaks, distribuyen
- pump: Movimientos coordinados
- dump: Venta masiva coordinada

SEÑALES DE ALERTA:
- Movimientos > $1M en 24h
- Transfers desde/hacia exchanges
- Nuevas wallets sin historial
- Actividad inusual en tokens illíquidos

PROTOCOLOS DE TRACKING:
- DeBank: Multi-chain portfolio
- Zapper: NFT + DeFi tracking
- Zerion: Aggregated view
- Nansen: Smart money tracking
`,
};

export class MarketKnowledge {
  /**
   * Recupera conocimiento específico de mercado
   */
  static async retrieveContext(category: keyof typeof marketKnowledge): Promise<string> {
    console.log(`[MarketKnowledge] Retrieving: ${category}`);
    return marketKnowledge[category] || "No hay conocimiento disponible para esta categoría.";
  }

  /**
   * Recupera múltiples contextos
   */
  static async retrieveForAnalysis(type: 'technical' | 'fundamental' | 'risk'): Promise<string> {
    const contexts: Record<string, string[]> = {
      technical: ['technicalAnalysis', 'tradingStrategies'],
      fundamental: ['defiProtocols', 'tokenomics'],
      risk: ['riskManagement', 'whaleTracking'],
    };

    const selected = contexts[type] || contexts.risk;
    return selected.map(cat => marketKnowledge[cat as keyof typeof marketKnowledge]).join('\n\n');
  }

  /**
   * Obtiene información de un protocolo DeFi específico
   */
  static getDeFiProtocolInfo(protocol: string): string | null {
    const protocols: Record<string, string> = {
      aave: 'Aave: Lending protocol con $15B+ TVL. Soporta ETH, BTC, stablecoins. Interest rate variable.',
      uniswap: 'Uniswap: DEX AMM líder. V3 introduce concentrated liquidity para mejor capital efficiency.',
      curve: 'Curve: AMM optimizado para stablecoins y assets correlacionados. CRV token para governance.',
      compound: 'Compound: Pionero en interest rates algorithmicos. COMP token para governance.',
      makerdao: 'MakerDAO: Creador de DAI stablecoin. Colateralización excesiva (150%+).',
      lido: 'Lido: Liquid staking para ETH, SOL, etc. Genera yield mientras mantienes liquidity.',
      yearn: 'Yearn Finance: Automatiza yield farming. Vaults optimizan estrategias automáticamente.',
    };

    return protocols[protocol.toLowerCase()] || null;
  }

  /**
   * Genera checklist de análisis
   */
  static getAnalysisChecklist(): string {
    return `
ANÁLISIS PRE-TRADE CHECKLIST:

FUNDAMENTAL:
□ ¿Qué problema resuelve el proyecto?
□ ¿El equipo es reputable y verificable?
□ ¿Tokenomics razonable? (supply, vesting)
□ ¿Tvl y usage growth?
□ ¿Competitors y diferenciación?

TÉCNICO:
□ ¿Trend general? (higher highs/lows vs lower)
□ ¿RSI en zona de sobrecompra/sobrevenda?
□ ¿Volume confirmando movimiento?
□ ¿Soportes y resistencias claros?
□ ¿EMA alignment?

SENTIMENT:
□ ¿Fear & Greed index?
□ ¿Funding rates?
□ ¿Social volume y trend?

GESTIÓN DE RIESGO:
□ ¿Position sizing correcto?
□ ¿Stop loss definido?
□ ¿R/R ratio mínimo 1:2?
□ ¿Múltiples puntos de entrada?
`;
  }
}
