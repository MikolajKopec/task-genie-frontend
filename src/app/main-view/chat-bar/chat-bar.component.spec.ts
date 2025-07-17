import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBarComponent } from './chat-bar.component';

describe('ChatBarComponent', () => {
  let component: ChatBarComponent;
  let fixture: ComponentFixture<ChatBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
