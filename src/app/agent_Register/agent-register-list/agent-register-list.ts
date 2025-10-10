import { Component, OnInit } from '@angular/core';
import { AgentService } from '../agent-service';

import { CommonModule } from '@angular/common';
import { AgentRegister } from '../agent-register/agent-register';





@Component({
  selector: 'app-agent-register-list',
  imports: [CommonModule],
  templateUrl: './agent-register-list.html',
  styleUrl: './agent-register-list.css'
})
export class AgentRegisterList implements OnInit{
agentRegisters: AgentRegister[] = [];

constructor(private agentService: AgentService) {}

ngOnInit(): void {
  this.loadAllAgentRegisterData();
}

//=========== Get All Agent Register ====================//
loadAllAgentRegisterData(): void {
  this.agentService.getAllAgentRegisters().subscribe({
    next: (result: AgentRegister[]) => {
      this.agentRegisters = result; // assign fetched data
      console.log('All Agent Register data:', this.agentRegisters);
    },
    error: (err) => {
      console.error('Error loading agent registers:', err);
    },
  });
}


}
