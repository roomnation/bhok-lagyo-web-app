import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Message } from './message';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  message = new FormControl('')
  messages$?: Observable<Message[]>;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messages$ = this.messageService.getMessages$();
  }

  onSubmit() {
    if(this.message.valid) {
      this.messageService.sendMessage(this.message.value);
      this.message.reset();
    }
  }
}
