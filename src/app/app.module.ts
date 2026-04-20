import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToDoAppComponent } from './to-do-app/to-do-app.component';
import { CardComponent } from './card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, buildInitialRootState } from './store/root.reducer';
import { localStorageMetaReducer } from './store/local-storage.metareducer';
import { SumUzsPipe } from './pipes/sum-uzs.pipe';
import { BudgetChartsComponent } from './budget-charts/budget-charts.component';

@NgModule({
  declarations: [
    AppComponent,
    ToDoAppComponent,
    CardComponent,
    ModalFormComponent,
    SumUzsPipe,
    BudgetChartsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    StoreModule.forRoot(reducers, {
      initialState: buildInitialRootState(),
      metaReducers: [localStorageMetaReducer],
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 80,
      logOnly: !isDevMode(),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
