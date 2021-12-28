import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {fakeBackendProvider} from './core/services/fake-backend';
import {AccountService} from './core/services/account.service';
import {HttpClientModule} from '@angular/common/http';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewComponent } from './my-datatable/view/view.component';
import { MessageService } from 'primeng/api';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule, DialogModule, ReactiveFormsModule, BrowserAnimationsModule],
  declarations: [AppComponent, ViewComponent],
  bootstrap: [AppComponent],
  providers: [
    // provider used to create fake backend,
    AccountService,
    MessageService,
    fakeBackendProvider
  ]
})
export class AppModule {
}
