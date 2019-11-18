import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSwitchAccountComponent } from './header-switch-account.component';

describe('HeaderSwitchAccountComponent', () => {
  let component: HeaderSwitchAccountComponent;
  let fixture: ComponentFixture<HeaderSwitchAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSwitchAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSwitchAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
