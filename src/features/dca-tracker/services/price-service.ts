import type { AssetType, ApiKeys, PriceData, PriceHistory } from "../types";

// ══════════════════════════════════════════════════════════════════════════════
// Real-Time Price Service — Multi-API Fallback
// ══════════════════════════════════════════════════════════════════════════════

const CRYPTO_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  ADA: "cardano",
  DOGE: "dogecoin",
  XRP: "ripple",
  AVAX: "avalanche-2",
  MATIC: "matic-network",
  DOT: "polkadot",
};

async function fetchYahoo(symbol: string): Promise<PriceData> {
  const cb = `&_=${Date.now()}`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=6mo${cb}`;

  // Try multiple proxies in case one is slow or down
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  let lastError: unknown = null;


  for (const proxy of proxies) {
    try {
      // Increase timeout to 12s as public proxies can be slow
      const res = await fetch(proxy, {
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) continue;

      const outer = await res.json();
      const content =
        typeof outer.contents === "string"
          ? JSON.parse(outer.contents)
          : outer; // Some proxies return raw JSON directly

      const result = content?.chart?.result?.[0];
      if (!result) continue;

      const meta = result.meta;
      const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
      const timestamps: number[] = result.timestamp ?? [];
      const history: PriceHistory[] = timestamps
        .map((t: number, i: number) => ({
          date: new Date(t * 1000).toISOString().slice(0, 10),
          close: closes[i],
        }))
        .filter((d: PriceHistory) => d.close != null)
        .slice(-90);

      return {
        symbol,
        price: meta.regularMarketPrice ?? closes.at(-1),
        previousClose: meta.previousClose ?? meta.chartPreviousClose,
        open: meta.regularMarketOpen,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        volume: meta.regularMarketVolume,
        marketCap: meta.marketCap,
        currency: meta.currency,
        exchange: meta.exchangeName,
        history,
        source: proxy.includes("allorigins") ? "Yahoo (AO)" : "Yahoo (CPIO)",
      };
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error("All Yahoo proxies failed");
}


async function fetchFinnhub(
  symbol: string,
  apiKey: string
): Promise<PriceData> {
  if (!apiKey) throw new Error("No Finnhub key");
  const from = Math.floor(Date.now() / 1000) - 7776000;
  const to = Math.floor(Date.now() / 1000);
  const [qRes, hRes] = await Promise.all([
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { signal: AbortSignal.timeout(12000) }
    ),
    fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`,
      { signal: AbortSignal.timeout(12000) }
    ),
  ]);
  if (!qRes.ok) throw new Error("Finnhub failed");
  const quote = await qRes.json();
  const hist = await hRes.json();
  if (!quote.c || quote.c === 0) throw new Error("No Finnhub price");
  const history: PriceHistory[] =
    hist.s === "ok"
      ? hist.t
          .map((t: number, i: number) => ({
            date: new Date(t * 1000).toISOString().slice(0, 10),
            close: hist.c[i],
          }))
          .slice(-90)
      : [];
  return {
    symbol,
    price: quote.c,
    previousClose: quote.pc,
    open: quote.o,
    dayHigh: quote.h,
    dayLow: quote.l,
    history,
    source: "Finnhub",
  };
}

async function fetchAlphaVantage(
  symbol: string,
  apiKey: string
): Promise<PriceData> {
  if (!apiKey) throw new Error("No AV key");
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error("AV failed");
  const data = await res.json();
  const ts = data["Time Series (Daily)"];
  if (!ts) throw new Error("No AV data");
  const entries = Object.entries(ts).sort(([a], [b]) => (a < b ? 1 : -1));
  const latest = entries[0][1] as Record<string, string>;
  const history: PriceHistory[] = entries
    .slice(0, 90)
    .reverse()
    .map(([date, d]) => ({
      date,
      close: +(d as Record<string, string>)["4. close"],
    }));
  return {
    symbol,
    price: +latest["4. close"],
    previousClose: +((entries[1]?.[1] as Record<string, string>)?.["4. close"] ?? 0),
    open: +latest["1. open"],
    dayHigh: +latest["2. high"],
    dayLow: +latest["3. low"],
    volume: +latest["5. volume"],
    history,
    source: "Alpha Vantage",
  };
}

async function fetchCrypto(symbol: string): Promise<PriceData> {
  const coinId = CRYPTO_MAP[symbol.toUpperCase()];
  if (!coinId) throw new Error("Unknown crypto symbol");
  const [qRes, hRes] = await Promise.all([
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      { signal: AbortSignal.timeout(12000) }
    ),
    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=90&interval=daily`,
      { signal: AbortSignal.timeout(12000) }
    ),
  ]);
  const quote = await qRes.json();
  const hist = await hRes.json();
  const coin = quote[coinId];
  const history: PriceHistory[] = (hist.prices ?? []).map(
    ([ts, price]: [number, number]) => ({
      date: new Date(ts).toISOString().slice(0, 10),
      close: price,
    })
  );
  return {
    symbol,
    price: coin.usd,
    previousClose: coin.usd / (1 + coin.usd_24h_change / 100),
    dayChange: coin.usd_24h_change,
    volume: coin.usd_24h_vol,
    marketCap: coin.usd_market_cap,
    history,
    source: "CoinGecko",
  };
}

export const PriceService = {
  async fetch(
    symbol: string,
    type: AssetType,
    keys: ApiKeys = { finnhub: "", alphaVantage: "" }
  ): Promise<PriceData> {
    const errors: string[] = [];
    if (type === "Crypto") {
      try {
        return await fetchCrypto(symbol);
      } catch (e) {
        errors.push(`CoinGecko: ${(e as Error).message}`);
      }
    }
    try {
      return await fetchYahoo(symbol);
    } catch (e) {
      errors.push(`Yahoo: ${(e as Error).message}`);
    }
    if (keys.finnhub) {
      try {
        return await fetchFinnhub(symbol, keys.finnhub);
      } catch (e) {
        errors.push(`Finnhub: ${(e as Error).message}`);
      }
    }
    if (keys.alphaVantage) {
      try {
        return await fetchAlphaVantage(symbol, keys.alphaVantage);
      } catch (e) {
        errors.push(`AV: ${(e as Error).message}`);
      }
    }
    throw new Error(`All APIs failed — ${errors.join(" | ")}`);
  },
};
