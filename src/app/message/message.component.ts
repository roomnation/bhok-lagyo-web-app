import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Message } from './message';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  messageForm = new FormControl('')
  messages?: Message[];
  subscription?: Subscription;

  constructor(private messageService: MessageService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.messageService.getMessages$().subscribe({
      next: (messages) => {
        this.messages = messages.reverse();
      }
    });
  }

  groupTogether(i: number): boolean {
    return i == (this.messages?.length ?? 0) - 1 ||
      (i > 0 &&
        (this.messages ?? [])[i + 1]?.from != (this.messages ?? [])[i].from)
  }

  onSubmit() {
    if (this.messageForm.valid) {
      this.messageService.sendMessage(this.messageForm.value);
      this.messageForm.reset();
    }
  }
}
