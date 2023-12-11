import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingSignalsComponent } from './trading-signals.component';

describe('TradingSignalsComponent', () => {
  let component: TradingSignalsComponent;
  let fixture: ComponentFixture<TradingSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradingSignalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
