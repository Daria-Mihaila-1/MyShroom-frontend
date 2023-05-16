import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsDialogComponent } from './avatars-dialog.component';

describe('AvatarsDialogComponent', () => {
  let component: AvatarsDialogComponent;
  let fixture: ComponentFixture<AvatarsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
