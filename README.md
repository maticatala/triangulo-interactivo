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

## Estructura del proyecto
