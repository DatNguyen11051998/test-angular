import {Component, Input, OnInit} from '@angular/core';
import {Account} from '../../core/model/account.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input()account: any;

  constructor() { }

  ngOnInit(): void {
    console.log('account', this.account);
  }

}
