import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterGrid } from './master-grid';

describe('MasterGrid', () => {
  let component: MasterGrid;
  let fixture: ComponentFixture<MasterGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
