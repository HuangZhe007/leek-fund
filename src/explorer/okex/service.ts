import Axios from 'axios';
import { ExtensionContext } from 'vscode';
import { LeekTreeItem } from '../../shared/leekTreeItem';
import { LeekService } from '../leekService';
import { TreeItemType } from '../../shared/typed';
import { LeekFundConfig } from '../../shared/leekConfig';
import BigNumber from 'bignumber.js';
import { OKexData } from '../../types';
const okexUrl = 'http://www.okex.com/api/v5/';

export default class OKexService extends LeekService {
  private context: ExtensionContext;
  public okexList: Array<LeekTreeItem> = [];

  constructor(context: ExtensionContext) {
    super();
    this.context = context;
  }

  async getData(okexIds: Array<string>): Promise<Array<LeekTreeItem>> {
    if (!okexIds.length) {
      return [];
    }
    try {
      const Datas = (await OKexService.qryCoinInfo(okexIds)) || [];
      const data = Datas.map((item: any) => {
        const {
          last: price,
          volCcy24h: amount,
          instId,
          sodUtc8,
          high24h: high,
          low24h: low,
        }: OKexData = item;
        const bigPrice = new BigNumber(price);
        const updown = bigPrice.minus(sodUtc8);
        const percent = updown.div(sodUtc8).times(100).toFixed();
        const obj = {
          id: instId,
          code: instId,
          name: instId,
          percent,
          price,
          showLabel: this.showLabel,
          _itemType: TreeItemType.BINANCE,
          high,
          low,
          updown: updown.toFixed(4),
          amount,
        };
        return new LeekTreeItem(obj, this.context);
      });
      this.okexList = data;
      return this.okexList;
    } catch (err) {
      console.log(err);
      return this.okexList;
    }
  }

  static qryCoinInfo(okexIds: string[]): Promise<any> {
    return new Promise((resolve) => {
      if (!okexIds.length) {
        resolve([]);
      } else {
        const mineIds: string[] = LeekFundConfig.getOKexIds();
        Axios.get(`${okexUrl}market/tickers?instType=SPOT`)
          .then((resp) => {
            const { data } = resp;
            const ids: string[] = [];
            const mineData: string[] = [];
            if (data.code === '0') {
              for (let i = 0, j = data.data.length; i < j; i++) {
                const element = data.data[i];
                ids.push(element.instId);
                if (mineIds.includes(element.instId)) mineData.push(element);
              }
              LeekFundConfig.setOKexAllIds(ids);
              resolve(mineData);
            }
          })
          .catch((err) => {
            console.error(err);
            resolve([]);
          });
      }
    });
  }
}
