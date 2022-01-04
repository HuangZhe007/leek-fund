import { Event, EventEmitter, TreeDataProvider, TreeItem } from 'vscode';
import { LeekFundConfig } from '../../shared/leekConfig';
import { LeekTreeItem } from '../../shared/leekTreeItem';
import coingeckoService from './service';

export class OKexProvider implements TreeDataProvider<LeekTreeItem> {
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();

  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  private service: coingeckoService;

  constructor(service: coingeckoService) {
    this.service = service;
  }

  refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(): LeekTreeItem[] | Thenable<LeekTreeItem[]> {
    const coinCodes = LeekFundConfig.getConfig('leek-fund.okex') || [];
    return this.service.getData(coinCodes);
  }

  getParent(element: LeekTreeItem): LeekTreeItem | null {
    return null;
  }

  getTreeItem(element: LeekTreeItem): TreeItem {
    return element;
  }
}
