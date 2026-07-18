import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionCell } from './grid-action-cell';

describe('GridActionCell', () => {
  let component: GridActionCell;
  let fixture: ComponentFixture<GridActionCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridActionCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridActionCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
