import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRegisterList } from './agent-register-list';

describe('AgentRegisterList', () => {
  let component: AgentRegisterList;
  let fixture: ComponentFixture<AgentRegisterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentRegisterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentRegisterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
