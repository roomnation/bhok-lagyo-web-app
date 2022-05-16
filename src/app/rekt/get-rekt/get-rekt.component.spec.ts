import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRektComponent } from './get-rekt.component';

describe('GetRektComponent', () => {
  let component: GetRektComponent;
  let fixture: ComponentFixture<GetRektComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetRektComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRektComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
