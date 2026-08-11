// Polymarket Gamma API integration for multi-outcome markets
import { useState, useEffect, useCallback } from "react";

export interface PolymarketOutcome {
  id: string;
  label: string;
  probability: number; // 0-1
  price: number;
  payout: number;
  volume: number;
  liquidity: number;
}

export interface PolymarketMarket {
  id: string;
  question: string;
  description: string;
  category: string;
  subcategory?: string;
  outcomes: PolymarketOutcome[];
  volume: number;
  liquidity: number;
  volatility?: number;
  startDate?: string;
  endDate?: string;
  marketMaker?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  affiliateUrl?: string;
  imageUrl?: string;
  // OHLCV data for sparklines
  ohlcv?: { timestamp: number; price: number }[];
}

export interface PolymarketCategory {
  id: string;
  name: string;
  marketCount: number;
  slug: string;
}

const POLYMARKET_API = "https://gamma-api.polymarket.com";
const AFFILIATE_ID = "ai-tor"; // Your affiliate ID

export function usePolymarket() {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [categories, setCategories] = useState<PolymarketCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMarkets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch trending markets
      const response = await fetch(
        `${POLYMARKET_API}/markets?closed=false&orderBy=volume24hr&ascending=false&limit=50`
      );

      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }

      const data = await response.json();

      const mappedMarkets: PolymarketMarket[] = data.markets
        ?.filter((m: any) => m.active && !m.closed)
        ?.map((m: any) => ({
          id: m.id,
          question: m.question,
          description: m.description || "",
          category: m.category || "General",
          subcategory: m.subcategory,
          outcomes: parseOutcomes(m),
          volume: parseFloat(m.volume || "0"),
          liquidity: parseFloat(m.liquidity || "0"),
          volatility: parseFloat(m.volatility || "0"),
          startDate: m.startDate,
          endDate: m.endDate,
          marketMaker: m.marketMaker,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
          url: `https://polymarket.com/market/${m.slug}`,
          affiliateUrl: `https://polymarket.com/market/${m.slug}?affiliate_id=${AFFILIATE_ID}`,
          imageUrl: m.imageUrl,
          ohlcv: generateSparkline(m),
        })) || [];

      setMarkets(mappedMarkets);
      setLastUpdate(new Date());

      // Extract categories
      const cats = extractCategories(mappedMarkets);
      setCategories(cats);
    } catch (err) {
      console.error("Polymarket fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch markets");
      // Use mock data on error
      setMarkets(generateMockMarkets());
      setCategories(generateMockCategories());
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByCategory = useCallback(async (categorySlug: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${POLYMARKET_API}/markets?closed=false&category=${categorySlug}&orderBy=volume24hr&ascending=false&limit=50`
      );

      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }

      const data = await response.json();
      const mappedMarkets = data.markets?.map(mapMarket).filter(Boolean) || [];
      setMarkets(mappedMarkets);
    } catch (err) {
      console.error("Polymarket category fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch category");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchMarkets = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${POLYMARKET_API}/markets?closed=false&question=${encodeURIComponent(query)}&orderBy=volume24hr&ascending=false&limit=20`
      );

      if (!response.ok) {
        throw new Error(`Polymarket API error: ${response.status}`);
      }

      const data = await response.json();
      const mappedMarkets = data.markets?.map(mapMarket).filter(Boolean) || [];
      setMarkets(mappedMarkets);
    } catch (err) {
      console.error("Polymarket search error:", err);
      setError(err instanceof Error ? err.message : "Failed to search markets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarkets, 300000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  const getMarketById = useCallback((id: string) => {
    return markets.find(m => m.id === id);
  }, [markets]);

  const getMarketsByCategory = useCallback((category: string) => {
    return markets.filter(m => m.category.toLowerCase() === category.toLowerCase());
  }, [markets]);

  const getTopMarkets = useCallback((limit: number = 10) => {
    return [...markets]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit);
  }, [markets]);

  const formatProbability = (prob: number): string => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  const formatVolume = (vol: number): string => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol.toFixed(0)}`;
  };

  return {
    markets,
    categories,
    isLoading,
    error,
    lastUpdate,
    count: markets.length,
    refresh: fetchMarkets,
    fetchByCategory,
    searchMarkets,
    getMarketById,
    getMarketsByCategory,
    getTopMarkets,
    formatProbability,
    formatVolume,
  };
}

function parseOutcomes(market: any): PolymarketOutcome[] {
  const outcomes: PolymarketOutcome[] = [];
  
  if (market.outcomes) {
    const outcomePrices = market.outcomePrices ? JSON.parse(market.outcomePrices) : [];
    
    market.outcomes.forEach((outcome: string, idx: number) => {
      const price = parseFloat(outcomePrices[idx] || "0.5");
      outcomes.push({
        id: `${market.id}-${idx}`,
        label: outcome,
        probability: price,
        price: price,
        payout: price > 0 ? 1 / price : 0,
        volume: parseFloat(market.volume || "0") * price,
        liquidity: parseFloat(market.liquidity || "0") * price,
      });
    });
  }
  
  return outcomes;
}

function mapMarket(m: any): PolymarketMarket | null {
  if (!m || !m.id) return null;
  
  return {
    id: m.id,
    question: m.question || "Unknown",
    description: m.description || "",
    category: m.category || "General",
    subcategory: m.subcategory,
    outcomes: parseOutcomes(m),
    volume: parseFloat(m.volume || "0"),
    liquidity: parseFloat(m.liquidity || "0"),
    volatility: parseFloat(m.volatility || "0"),
    startDate: m.startDate,
    endDate: m.endDate,
    marketMaker: m.marketMaker,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    url: `https://polymarket.com/market/${m.slug}`,
    affiliateUrl: `https://polymarket.com/market/${m.slug}?affiliate_id=${AFFILIATE_ID}`,
    imageUrl: m.imageUrl,
    ohlcv: generateSparkline(m),
  };
}

function generateSparkline(market: any): { timestamp: number; price: number }[] {
  // Generate mock OHLCV data for sparkline
  const data: { timestamp: number; price: number }[] = [];
  let price = 0.5;
  const now = Date.now();
  
  for (let i = 30; i >= 0; i--) {
    price = Math.max(0.01, Math.min(0.99, price + (Math.random() - 0.5) * 0.05));
    data.push({
      timestamp: now - i * 3600000,
      price,
    });
  }
  
  return data;
}

function extractCategories(markets: PolymarketMarket[]): PolymarketCategory[] {
  const categoryMap = new Map<string, { count: number; name: string }>();
  
  markets.forEach(m => {
    const existing = categoryMap.get(m.category);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(m.category, { count: 1, name: m.category });
    }
  });
  
  return Array.from(categoryMap.entries()).map(([slug, data]) => ({
    id: slug,
    name: data.name,
    marketCount: data.count,
    slug: slug.toLowerCase().replace(/\s+/g, "-"),
  }));
}

function generateMockMarkets(): PolymarketMarket[] {
  return [
    {
      id: "mock-1",
      question: "Will Bitcoin exceed $100,000 by end of 2025?",
      description: "This market resolves YES if BTC/USD exceeds $100,000 on any major exchange.",
      category: "Crypto",
      outcomes: [
        { id: "yes-1", label: "Yes", probability: 0.65, price: 0.65, payout: 1.54, volume: 2500000, liquidity: 1800000 },
        { id: "no-1", label: "No", probability: 0.35, price: 0.35, payout: 2.86, volume: 1350000, liquidity: 970000 },
      ],
      volume: 3850000,
      liquidity: 2770000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: "https://polymarket.com/market/btc-100k-2025",
      affiliateUrl: "https://polymarket.com/market/btc-100k-2025?affiliate_id=ai-tor",
    },
    {
      id: "mock-2",
      question: "Will SpaceX land humans on Mars before 2030?",
      description: "This market resolves YES if SpaceX lands at least 2 humans on Mars.",
      category: "Science",
      outcomes: [
        { id: "yes-2", label: "Yes", probability: 0.15, price: 0.15, payout: 6.67, volume: 450000, liquidity: 320000 },
        { id: "no-2", label: "No", probability: 0.85, price: 0.85, payout: 1.18, volume: 2550000, liquidity: 1820000 },
      ],
      volume: 3000000,
      liquidity: 2140000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: "https://polymarket.com/market/spacex-mars-2030",
      affiliateUrl: "https://polymarket.com/market/spacex-mars-2030?affiliate_id=ai-tor",
    },
    {
      id: "mock-3",
      question: "Will ETH flip BTC market cap in 2025?",
      description: "This market resolves YES if Ethereum's market cap exceeds Bitcoin's.",
      category: "Crypto",
      outcomes: [
        { id: "yes-3", label: "Yes", probability: 0.08, price: 0.08, payout: 12.5, volume: 180000, liquidity: 125000 },
        { id: "no-3", label: "No", probability: 0.92, price: 0.92, payout: 1.09, volume: 2020000, liquidity: 1385000 },
      ],
      volume: 2200000,
      liquidity: 1510000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: "https://polymarket.com/market/eth-flip-btc",
      affiliateUrl: "https://polymarket.com/market/eth-flip-btc?affiliate_id=ai-tor",
    },
    {
      id: "mock-4",
      question: "Will AGI be achieved in 2025?",
      description: "This market resolves YES if AGI is demonstrated and widely accepted by experts.",
      category: "Tech",
      outcomes: [
        { id: "yes-4", label: "Yes", probability: 0.12, price: 0.12, payout: 8.33, volume: 890000, liquidity: 620000 },
        { id: "no-4", label: "No", probability: 0.88, price: 0.88, payout: 1.14, volume: 6540000, liquidity: 4550000 },
      ],
      volume: 7430000,
      liquidity: 5170000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: "https://polymarket.com/market/agi-2025",
      affiliateUrl: "https://polymarket.com/market/agi-2025?affiliate_id=ai-tor",
    },
    {
      id: "mock-5",
      question: "Will Fed cut rates 3+ times in 2025?",
      description: "This market resolves YES if Fed cuts rates at least 3 times.",
      category: "Economics",
      outcomes: [
        { id: "yes-5", label: "Yes", probability: 0.42, price: 0.42, payout: 2.38, volume: 1200000, liquidity: 840000 },
        { id: "no-5", label: "No", probability: 0.58, price: 0.58, payout: 1.72, volume: 1656000, liquidity: 1158000 },
      ],
      volume: 2856000,
      liquidity: 1998000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: "https://polymarket.com/market/fed-rates-2025",
      affiliateUrl: "https://polymarket.com/market/fed-rates-2025?affiliate_id=ai-tor",
    },
  ];
}

function generateMockCategories(): PolymarketCategory[] {
  return [
    { id: "crypto", name: "Crypto", marketCount: 1250, slug: "crypto" },
    { id: "politics", name: "Politics", marketCount: 890, slug: "politics" },
    { id: "economics", name: "Economics", marketCount: 650, slug: "economics" },
    { id: "science", name: "Science", marketCount: 420, slug: "science" },
    { id: "tech", name: "Tech", marketCount: 380, slug: "tech" },
    { id: "sports", name: "Sports", marketCount: 2100, slug: "sports" },
    { id: "entertainment", name: "Entertainment", marketCount: 560, slug: "entertainment" },
  ];
}
