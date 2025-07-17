import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectViewComponent } from './list-select-view.component';

describe('ListSelectViewComponent', () => {
  let component: ListSelectViewComponent;
  let fixture: ComponentFixture<ListSelectViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSelectViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSelectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
