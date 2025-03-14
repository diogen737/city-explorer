import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSelectComponent } from './theme-select.component';

describe('ThemeSelectComponent', () => {
  let component: ThemeSelectComponent;
  let fixture: ComponentFixture<ThemeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
