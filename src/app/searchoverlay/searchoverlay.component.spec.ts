import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchoverlayComponent } from './searchoverlay.component';

describe('SearchoverlayComponent', () => {
  let component: SearchoverlayComponent;
  let fixture: ComponentFixture<SearchoverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchoverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchoverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
