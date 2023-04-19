import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictorDialogComponent } from './predictor-dialog.component';

describe('PredictorDialogComponent', () => {
  let component: PredictorDialogComponent;
  let fixture: ComponentFixture<PredictorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
