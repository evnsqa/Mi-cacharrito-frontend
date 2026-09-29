import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevolucionesComponente } from './devoluciones-componente';

describe('DevolucionesComponente', () => {
  let component: DevolucionesComponente;
  let fixture: ComponentFixture<DevolucionesComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucionesComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(DevolucionesComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
