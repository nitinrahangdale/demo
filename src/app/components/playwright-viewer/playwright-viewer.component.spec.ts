import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaywrightViewerComponent } from './playwright-viewer.component';

describe('PlaywrightViewerComponent', () => {
  let component: PlaywrightViewerComponent;
  let fixture: ComponentFixture<PlaywrightViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaywrightViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaywrightViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
