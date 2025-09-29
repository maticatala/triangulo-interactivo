# Triángulo Interactivo - Proyecto JavaScript

## Descripción
Este proyecto implementa un **triángulo interactivo** en una página web, donde el usuario puede ingresar las medidas de los lados y visualizar el triángulo generado en tiempo real. El sistema valida las medidas ingresadas y ofrece retroalimentación visual:  

- **Triángulo válido:** los inputs se destacan en verde y se dibuja el triángulo.  
- **Triángulo inválido:** los inputs se destacan en rojo y no se dibuja el triángulo.  

El objetivo es combinar **interactividad** y **validación dinámica** para mejorar la experiencia del usuario en la introducción de datos geométricos.

---

## Funcionalidades principales
- Lectura de valores de los inputs correspondientes a los lados del triángulo.  
- Validación de las medidas según las reglas de existencia de un triángulo (suma de dos lados mayor al tercero).  
- Dibujo dinámico del triángulo en el `div.monitor` a medida que se ingresan los valores.  
- Indicadores visuales de validación de inputs.  

---

## Alcance de las pruebas
Las pruebas funcionales automatizadas se centran en la **lógica de validación y dibujo del triángulo**.  

> **Nota:** Existen líneas no cubiertas correspondientes a **animaciones y arranque automático**. Estas se consideran fuera del alcance de las pruebas funcionales automatizadas, dado que **no afectan la lógica central ni los criterios de aceptación**.

---

## Técnicas de prueba dinámicas basadas en especificación
# Tabla de decisión

| **Condiciones / Acciones**              | **R1** | **R2** | **R3** | **R4** | **R5** |
|-----------------------------------------|:------:|:------:|:------:|:------:|:------:|
| **Condiciones**                         |        |        |        |        |        |
| Lados son válidos (enteros, >0)         |   F    |   V    |   V    |   V    |   V    |
| Cumple Desigualdad Triangular           |   -    |   F    |   V    |   V    |   V    |
| Los 3 lados son iguales (a=b=c)         |   -    |   -    |   V    |   F    |   F    |
| Exactamente 2 lados son iguales         |   -    |   -    |   -    |   V    |   F    |
| **Acciones**                            |        |        |        |        |        |
| Retorna “Inválido”                      |   V    |   V    |   F    |   F    |   F    |
| Retorna “Equilátero”                    |   F    |   F    |   V    |   F    |   F    |
| Retorna “Isósceles”                     |   F    |   F    |   F    |   V    |   F    |
| Retorna “Escaleno”                      |   F    |   F    |   F    |   F    |   V    |

# Particiones de Equivalencia y Valores Límite


| # | **Atributo**                                   | **PV (válida)**                                                                 | **PI (inválida)**                                        |
|---|------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------|
| 1 | Valor de un lado del triángulo (entero > 0)    | **PV1:** x > 0                                                                   | **PI1:** x ≤ 0 (cero o negativo) <br> **PI2:** decimal <br> **PI3:** no numérico |
|   | Relación entre lados (desigualdad triangular)  | **PV2:** a+b>c, a+c>b, b+c>a                                                     | **PI4:** falla desigualdad triangular                    |
| 2 | Clasificación del triángulo (salida)           | **PV3:** Equilátero (a=b=c) <br> **PV4:** Isósceles (2 lados iguales) <br> **PV5:** Escaleno (0 lados iguales) | *No aplica* (todas las demás entradas válidas caen en estas PS) |



| # | **Atributo**                           | **No Válido (Límite inferior)**     | **Válido (Borde Inferior)**            | **Válido (Borde Superior)**           | **No Válido (Límite Superior)**      |
|---|-----------------------------------------|--------------------------------------|----------------------------------------|---------------------------------------|---------------------------------------|
| 1 | Lados (a,b,c) – Positivo (>0)          | 0                                    | 1                                      | M = 9007199254740991                   | M - 1                               |
| 2 | Lados (a,b,c) – Entero (x ∈ Z)         | 0.9                                  | 1                                      | M                                      | M - 0.1                            |
| 3 | Desigualdad Triangular (a+b>c)         | a=1, b=2, c=3 → (a+b=c)              | a=2, b=3, c=4 → (a+b>c por la mínima)  | a=4, b=5, c=8 → (a+b>c por poco)       | a=1, b=2, c=4 → (a+b<c)              |
| 4 | Robustez por límite superior (precisión)| –                                   | –                                      | (M,M,M) → Equilátero válido            | (M,M,M-1) → Isósceles (riesgo precisión)  |
