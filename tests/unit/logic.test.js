import { classifyTriangle } from '../../src/logic.js'
import { describe, it, expect } from 'vitest'

// El entero seguro máximo para probar límites de precisión
const M = Number.MAX_SAFE_INTEGER; // 9007199254740991

describe('classifyTriangle - Pruebas de Calidad (PE y VL)', () => {

    // ----------------------------------------------------------------------
    // PE VÁLIDAS: Clasificación de Triángulos
    // ----------------------------------------------------------------------
    
    // PV1: Equilátero
    it('PE1 (Equilátero): lados iguales y válidos', () => {
        expect(classifyTriangle(5, 5, 5)).toBe('Equilátero')
    });

    // PV2: Isósceles (usa it.each para probar todas las permutaciones en una sola prueba)
    // Se asegura de que la clasificación no dependa del orden de los lados
    it.each([
        [5, 5, 3], // Caso 1: a=b
        [5, 3, 5], // Caso 2: a=c
        [3, 5, 5], // Caso 3: b=c
        [10, 10, 15], // VL: Valores más grandes
    ])('PE2 (Isósceles): Prueba de permutación con (%i, %i, %i)', (a, b, c) => {
        expect(classifyTriangle(a, b, c)).toBe('Isósceles');
    });

    // PV3: Escaleno (usa it.each para probar todas las 6 permutaciones)
    it.each([
        [3, 4, 5], 
        [3, 5, 4], 
        [4, 3, 5], 
        [4, 5, 3], 
        [5, 4, 3], 
        [5, 3, 4], 
    ])('PE3 (Escaleno): Prueba de permutación con (%i, %i, %i)', (a, b, c) => {
        expect(classifyTriangle(a, b, c)).toBe('Escaleno');
    });

    // ----------------------------------------------------------------------
    // PI INVÁLIDAS: Falla de Lógica y Validación (PE y VL)
    // ----------------------------------------------------------------------

    // PI4 (VL Límite): Falla Desigualdad Triangular
    it.each([
        [1, 2, 3],   // VL: Límite exacto: a + b = c (forma una línea)
        [1, 2, 4],   // PI4: Falla fuerte: a + b < c
        [10, 1, 1],  // Permutación para falla
    ])('PI4 (Inválido): Falla Desigualdad Triangular con (%i, %i, %i)', (a, b, c) => {
        expect(classifyTriangle(a, b, c)).toBe('Inválido');
    });

    // PI1 (VL Límite): Lados no positivos o cero
    it.each([
        [0, 5, 5],  // VL: Borde inferior: 0
        [5, -1, 5], // PI1: Negativo
        [0, 0, 0],  // Combinación de ceros
    ])('PI1 (Inválido): Contiene cero o negativo (%i, %i, %i)', (a, b, c) => {
        expect(classifyTriangle(a, b, c)).toBe('Inválido');
    });

    // PI2 (VL Límite): Números No Enteros (Decimales)
    it.each([
        [1.5, 2, 2],  // PI2: Flotante
        [3, 3, 3.1],  // VL: Decimal cerca del entero
    ])('PI2 (Inválido): Contiene decimales (%i, %i, %i)', (a, b, c) => {
        // Nota: 2.0 es tratado como entero por JS, pero 1.5 y 3.1 no
        expect(classifyTriangle(a, b, c)).toBe('Inválido');
    });

    // PI3: Entradas No Numéricas
    it.each([
        ["a", 5, 5],  // PI3: Texto
        [5, null, 5], // PI3: Null (se convierte a 0, luego falla por PI1)
        [5, 5, undefined], // PI3: Undefined (falla isInteger)
    ])('PI3 (Inválido): Contiene valores no numéricos (%s, %s, %s)', (a, b, c) => {
        expect(classifyTriangle(a, b, c)).toBe('Inválido');
    });
    
    // ----------------------------------------------------------------------
    // VL DE ROBUSTEZ: Máximo Seguro de JavaScript
    // ----------------------------------------------------------------------

    // VL Borde Superior (Funciona)
    it('VL (Máximo Seguro): Caso Equilátero usando MAX_SAFE_INTEGER', () => {
        // Se espera que funcione, ya que a, b, y c no requieren sumas.
        expect(classifyTriangle(M, M, M)).toBe('Equilátero');
    });
    
    // VL NO SEGURO (Falla de Precisión)
    it('VL (No Seguro): Falla de precisión en la suma (M+1)', () => {
        // M + 1 es el primer número que puede perder precisión en la suma.
        // Lo probamos como un triángulo isósceles que debería ser válido.
        // La suma M + 1 debe fallar la verificación isInteger internamente en algunas implementaciones, o la suma dará un resultado incorrecto.
        // Dado que el código usa Number.isInteger, M+1 se evalúa como válido, pero M+M puede fallar.
        
        // El test más robusto es M/M/M (arriba) y M/M/(M-1) (abajo)
        expect(classifyTriangle(M, M, M - 1)).toBe('Isósceles');
    });
});