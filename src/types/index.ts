export type CoinGeckoData = {
  id: string;
  name: string;
  symbol: string;
  price_change_percentage_24h: number;
  current_price: number;
  low_24h: number;
  high_24h: number;
  price_change_24h: number;
  total_volume: number;
};

export type OKexData = {
  instId: string;
  last: string;
  volCcy24h: string;
  sodUtc8: string;
  high24h: string;
  low24h: string;
};
