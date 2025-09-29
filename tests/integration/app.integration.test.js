import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initTriangleApp } from '../../src/app.js';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// --- Configuración Inicial de JSDOM ---
// Ruta ajustada según tu estructura: '../../src/index.html'
const rootDir = path.resolve(__dirname, '..', '..');
const htmlPath = path.join(rootDir, 'src', 'index.html'); // Asume que index.html está en 'src'
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Objeto para almacenar las referencias a los elementos del DOM y la función de actualización
let appControls;

describe('B) Pruebas de Integración (UI a Lógica)', () => {

    beforeEach(() => {
        // 1. Crear un DOM simulado (JSDOM) y configurar las variables globales
        const dom = new JSDOM(htmlContent);
        
        global.document = dom.window.document;
        global.window = dom.window;
        
        // 2. Simular el debounce y la animación para hacer los tests instantáneos
        vi.useFakeTimers();
        
        // 3. Inicializar la aplicación y obtener las referencias
        appControls = initTriangleApp();
    });
    
    // --- IMPORTANTE: Corrección del error afterEach ---
    // Restaurar los timers después de cada test para evitar que Vitest falle
    afterEach(() => {
        vi.useRealTimers();
    });

    /**
     * Simula la entrada de datos en los inputs del DOM y fuerza la ejecución
     * de updateTriangle (simulando el fin del debounce de 300ms).
     */
    const simulateInput = (a, b, c) => {
        // Asigna los valores al DOM simulado
        appControls.sideA.value = a !== null ? a.toString() : '';
        appControls.sideB.value = b !== null ? b.toString() : '';
        appControls.sideC.value = c !== null ? c.toString() : '';
        
        // Llama a la función de actualización directamente para saltar eventos/debounce
        appControls.updateTriangle(); 
        
        // Avanza el tiempo para simular que el debounce ha terminado
        vi.advanceTimersByTime(300); 
    };

    // --- Caso 1: Flujo "Feliz" (Equilátero) ---
    it('Debe clasificar y dibujar un triángulo Equilátero (3, 3, 3)', () => {
        simulateInput(3, 3, 3);

        // Aserciones de Contenido (Lógica):
        expect(appControls.monitor.innerHTML).toContain('Equilátero');

        // Aserciones de Estado:
        expect(appControls.sideA.style.border).toBe('2px solid green');
        
        // Aserciones de Renderizado (UI):
        expect(appControls.monitor.querySelector('svg')).toBeTruthy();
        expect(appControls.monitor.querySelector('polygon')).toBeTruthy();
    })

        // --- Caso 2: Isósceles (Clasificación correcta) ---
    it('Debe clasificar y dibujar un Isósceles (5, 5, 8)', () => {
        simulateInput(5, 5, 8); 

        // Aserciones de Contenido (Lógica):
        expect(appControls.monitor.innerHTML).toContain('Isósceles');

        // Aserciones de Estado:
        expect(appControls.sideC.style.border).toBe('2px solid green');

        // Aserciones de Renderizado (UI):
        expect(appControls.monitor.innerHTML).toContain('<svg');
        expect(appControls.monitor.innerHTML).toContain('<polygon');
    })

    // --- Caso 3: Integración con Error de Lógica (PI4: Desigualdad Triangular) ---
    it('Debe clasificar como Inválido y mostrar error para 1, 2, 4', () => {
        simulateInput(1, 2, 4); 

        // 1. Verificar el mensaje de error de la UI
        expect(appControls.monitor.innerHTML).toContain('Inválido (Revisar lados)');
        
        // 2. El estado visual de error
        expect(appControls.sideB.style.border).toBe('2px solid red');
        
        // 3. Verificar que NO se dibujó el SVG
        expect(appControls.monitor.innerHTML).not.toContain('<svg');
    })
    
    // --- Caso 4: Integración con Error de Lógica (PI3: No Numérico - Texto) ---
    it('Debe ignorar caracteres no numéricos', () => {
        simulateInput('a', 5, 5); 

        // 1. El mensaje debe ser vacio
        expect(appControls.monitor.innerHTML).toBe('');

        // 2. No se debe cambiar el estado visual de los inputs
        expect(appControls.sideB.style.border).not.toBe('2px solid red');

        // 2. Verificar que NO se dibujó el SVG
        expect(appControls.monitor.innerHTML).not.toContain('<svg');
    })

});
