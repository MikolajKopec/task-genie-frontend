import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFormRecursiveComponent } from './settings-form-recursive.component';

describe('SettingsFormRecursiveComponent', () => {
  let component: SettingsFormRecursiveComponent;
  let fixture: ComponentFixture<SettingsFormRecursiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsFormRecursiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsFormRecursiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
