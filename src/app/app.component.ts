import {Component, OnInit, VERSION} from '@angular/core';
import {AccountService} from './core/services/account.service';
import {Observable, Subject} from 'rxjs';
import {Account, createAccount, createParamSearch} from './core/model/account.model';
import {takeUntil} from 'rxjs/operators';
import {Accounts} from './core/data/account';
import * as faker from 'faker';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  account: Account[] = [];
  addUserForm!: FormGroup;
  getFirst = 0;
  getRow = 25;
  isCheckAddOrEdit = false;
  emitViewData: any;
  unSubscribeAll: Subject<any>;
  isOpenAddOrEditAccount = false;
  showModalViewUser = false;
  regexCharacter = /^[^-_!@#+$%^()~&*,/';<>?|:"`]*$/;
  selectedAccount: Account | undefined;
  searchStr = '';

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    // read data from file to localstorage
    this.unSubscribeAll = new Subject<any>();
    this.loadDataToLocal();
  }

  ngOnInit(): void {
    this.getAllAccount();
    this.addUserForm = this.fb.group({
      firstname: ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]],
      email: ['', [Validators.minLength(3), Validators.maxLength(100), Validators.required]],
      lastname: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(0)]],
      balance: ['', [Validators.required, Validators.min(0)]],
      state: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      employer: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }

  loadDataToLocal(): void {
    localStorage.setItem('accounts', JSON.stringify(Accounts));
  }


  getAllAccount(): void {
    this.accountService.getAccounts(createParamSearch({
      last_name: this.searchStr,
      start: 0,
      limit: 25
    }))
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.account = resp;
        console.log('this.account', this.account);
      }, (err: Error) => {
        this.account = [];
      });
  }

  openAddAccount(): void {
    this.isOpenAddOrEditAccount = true;
    this.isCheckAddOrEdit = false;
    this.addUserForm.reset();
  }

  openEdit(acc: Account): void {
    this.selectedAccount = acc;
    this.isOpenAddOrEditAccount = true;
    this.isCheckAddOrEdit = true;
    this.addUserForm.patchValue({
      firstname: acc.firstname,
      lastname: acc.lastname,
      email: acc.email,
      age: acc.age,
      address: acc.address,
      balance: acc.balance,
      state: acc.state,
      gender: acc.gender,
      employer: acc.employer,
      city: acc.city,
    });
  }

  openView(acc: Account): void {
    this.showModalViewUser = true;
    this.emitViewData = acc;
  }

  openDelete(acc: Account): void {
    const idAccount = createAccount({
      _id: acc?._id
    });
    this.accountService.deleteAccount(idAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        console.log('test');
        this.getAllAccount();
        this.messageService.add({severity: 'info', summary: 'Info', detail: 'Chỉnh sửa thành công'});
      }, (err: Error) => {
        this.account = [];
      });
    // const userIndex = [...this.account].findIndex(user => user.account_number === acc.account_number);
    // this.account.splice(userIndex, 1);
    // this.messageService.add({severity: 'info', summary: 'Info', detail: 'Xóa người dùng thành công'});
  }

  saveEdit(): void {
    console.log('this.selectedAccount', this.selectedAccount);
    const editedAccount = createAccount({
      balance: parseInt(faker.finance.amount(0, 99999), 0),
      // tslint:disable-next-line:no-non-null-assertion
      age: this.addUserForm.get('age')?.value,
      // tslint:disable-next-line:no-non-null-assertion
      lastname: this.addUserForm.get('lastname')?.value,
      // tslint:disable-next-line:no-non-null-assertion
      firstname: this.addUserForm.get('firstname')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      city: this.addUserForm.get('city')?.value ,
      account_number: this.selectedAccount?.account_number ,
      // tslint:disable-next-line:no-non-null-assertion
      address: this.addUserForm.get('address')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      email: this.addUserForm.get('email')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      employer: this.addUserForm.get('employer')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      gender: this.addUserForm.get('gender')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      state: this.addUserForm.get('state')?.value ,
      _id: this.selectedAccount?._id
    });
    console.log('editedAccount', editedAccount);

    this.accountService.editAccount(editedAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        console.log('test');
        this.getAllAccount();
        this.messageService.add({severity: 'info', summary: 'Info', detail: 'Chỉnh sửa thành công'});
        this.isOpenAddOrEditAccount = false;
      }, (err: Error) => {
        this.account = [];
      });
  }

  saveNew(): void {
    console.log('add');
    const newAccount = createAccount({
      balance: parseInt(faker.finance.amount(0, 99999), 0),
      // tslint:disable-next-line:no-non-null-assertion
      age: this.addUserForm.get('age')?.value,
      // tslint:disable-next-line:no-non-null-assertion
      lastname: this.addUserForm.get('lastname')?.value,
      // tslint:disable-next-line:no-non-null-assertion
      firstname: this.addUserForm.get('firstname')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      city: this.addUserForm.get('city')?.value ,
      account_number: this.selectedAccount?.account_number ,
      // tslint:disable-next-line:no-non-null-assertion
      address: this.addUserForm.get('address')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      email: this.addUserForm.get('email')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      employer: this.addUserForm.get('employer')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      gender: this.addUserForm.get('gender')?.value ,
      // tslint:disable-next-line:no-non-null-assertion
      state: this.addUserForm.get('state')?.value ,
      _id: this.selectedAccount?._id
    });
    console.log('newAccount', newAccount);

    this.accountService.addAccount(newAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.getAllAccount();
        this.isOpenAddOrEditAccount = false;
        this.messageService.add({severity: 'info', summary: 'Info', detail: 'Thêm mới thành công'});
      }, (err: Error) => {
        this.account = [];
      });
  }

  search(): void {
    this.getAllAccount();
  }

  paginate(event: any): any {
    this.getFirst = event.page;
    this.getRow = event.rows;
    this.getAllAccount();
  }

}
