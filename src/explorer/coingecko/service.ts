import Axios from 'axios';
import { ExtensionContext } from 'vscode';
import { LeekTreeItem } from '../../shared/leekTreeItem';
import { LeekService } from '../leekService';
import { TreeItemType } from '../../shared/typed';
import { CoinGeckoData } from '../../types';

const coingeckoUrl = 'https://api.coingecko.com/api/v3/';
const defaultParameters = 'vs_currency=usd&order=market_cap_desc';

export default class CoingeckoService extends LeekService {
  private context: ExtensionContext;
  public coingeckoList: Array<LeekTreeItem> = [];

  constructor(context: ExtensionContext) {
    super();
    this.context = context;
  }

  async getData(coinCodes: Array<string>): Promise<Array<LeekTreeItem>> {
    if (!coinCodes.length) {
      return [];
    }
    try {
      const Datas = (await CoingeckoService.qryCoinInfo(coinCodes)) || [];
      const data = Datas.map((item: any) => {
        const {
          symbol,
          price_change_percentage_24h,
          current_price,
          low_24h,
          high_24h,
          price_change_24h,
          total_volume,
          id,
        }: CoinGeckoData = item;
        const obj = {
          id,
          code: symbol.toUpperCase(),
          name: symbol.toUpperCase(),
          percent: price_change_percentage_24h.toString(),
          price: current_price.toString(),
          showLabel: this.showLabel,
          _itemType: TreeItemType.BINANCE,
          high: high_24h,
          low: low_24h,
          updown: price_change_24h.toString(),
          amount: total_volume.toString(),
        };
        return new LeekTreeItem(obj, this.context);
      });
      this.coingeckoList = data;
      return this.coingeckoList;
    } catch (err) {
      console.log(err);
      return this.coingeckoList;
    }
  }

  static qryCoinInfo(coinCodes: string[]): Promise<any> {
    return new Promise((resolve) => {
      if (!coinCodes.length) {
        resolve([]);
      } else {
        const url = `${coingeckoUrl}coins/markets?${defaultParameters}&ids=${coinCodes.join(',')}`;
        Axios.get(url)
          .then((resp) => {
            resolve(resp.data);
          })
          .catch((err) => {
            console.error(err);
            resolve([]);
          });
      }
    });
  }
}
