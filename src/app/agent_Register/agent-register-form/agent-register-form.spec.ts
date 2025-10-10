import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRegisterForm } from './agent-register-form';

describe('AgentRegisterForm', () => {
  let component: AgentRegisterForm;
  let fixture: ComponentFixture<AgentRegisterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentRegisterForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentRegisterForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
