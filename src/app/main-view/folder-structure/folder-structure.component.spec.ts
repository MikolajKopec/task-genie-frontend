import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderStructureComponent } from './folder-structure.component';

describe('FolderStructureComponent', () => {
  let component: FolderStructureComponent;
  let fixture: ComponentFixture<FolderStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FolderStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
