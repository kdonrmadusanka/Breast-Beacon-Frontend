import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologistDashboardComponent } from './dashboard';

describe('Dashboard', () => {
  let component: RadiologistDashboardComponent;
  let fixture: ComponentFixture<RadiologistDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologistDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadiologistDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
