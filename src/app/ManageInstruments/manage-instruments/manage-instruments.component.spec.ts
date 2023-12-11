import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInstrumentsComponent } from './manage-instruments.component';

describe('ManageInstrumentsComponent', () => {
  let component: ManageInstrumentsComponent;
  let fixture: ComponentFixture<ManageInstrumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInstrumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInstrumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
