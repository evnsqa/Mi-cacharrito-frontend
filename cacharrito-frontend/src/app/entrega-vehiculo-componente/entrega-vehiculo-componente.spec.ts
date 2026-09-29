import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntregarVehiculoComponente } from './entrega-vehiculo-componente';

describe('EntregarVehiculoComponente', () => {
  let component: EntregarVehiculoComponente;
  let fixture: ComponentFixture<EntregarVehiculoComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregarVehiculoComponente],
    }).compileComponents();

    fixture = TestBed.createComponent(EntregarVehiculoComponente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
