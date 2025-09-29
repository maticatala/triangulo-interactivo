import { classifyTriangle } from './logic.js';

// Exportar funciones en lugar de ejecutar código inmediatamente
export function initTriangleApp() {
    const sideA = document.getElementById("sideA");
    const sideB = document.getElementById("sideB");
    const sideC = document.getElementById("sideC");
    const monitor = document.querySelector(".monitor");

    // --- Debounce ---
    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    const debouncedUpdate = debounce(updateTriangle, 300);

    // Es crucial que los elementos existan en el DOM simulado (JSDOM)
    [sideA, sideB, sideC].forEach(input => {
        if (input) {
            input.addEventListener("input", debouncedUpdate);
        }
    });

    function updateTriangle() {
        const a = parseFloat(sideA.value);
        const b = parseFloat(sideB.value);
        const c = parseFloat(sideC.value);

        // limpiar monitor
        monitor.innerHTML = "";

        // Si no están todos los valores numéricos, no hacer nada (este chequeo es a nivel UI)
        if (isNaN(a) || isNaN(b) || isNaN(c)) return;

        // *** Lógica unificada: Llama a la función de negocio ***
        const triangleType = classifyTriangle(a, b, c);

        if (triangleType !== 'Inválido') {
            drawTriangle(a, b, c, triangleType); // Pasa el tipo válido
            markInputsValid();
        } else {
            markInputsInvalid();
        }
    }

    function getScale(a, b, c) {
        const longest = Math.max(a, b, c);
        const margin = 0.1; // 10% de margen

        // Escala máxima según ancho y alto
        const scaleX = (monitor.clientWidth * (1 - margin)) / longest;
        const scaleY = (monitor.clientHeight * (1 - margin)) / longest;

        return Math.min(scaleX, scaleY);
    }

    let prevPoints = null; // guardamos el triángulo anterior

    // *** Función drawTriangle actualizada para recibir el tipo ***
    function drawTriangle(a, b, c, type) { 
        const scale = getScale(a, b, c);

        // --- Calcular coordenadas base ---
        let x1 = 0, y1 = 0;
        let x2 = a * scale, y2 = 0;

        // Corrección: Asegurar que cosGamma esté entre -1 y 1 para Math.acos (robustez)
        const cosGamma = (a * a + b * b - c * c) / (2 * a * b);
        const angle = Math.acos(Math.max(-1, Math.min(1, cosGamma)));

        let x3 = b * scale * Math.cos(angle);
        let y3 = -b * scale * Math.sin(angle);

        // --- Centrado --- (El resto de la lógica de dibujo es la misma)
        const minX = Math.min(x1, x2, x3);
        const maxX = Math.max(x1, x2, x3);
        const minY = Math.min(y1, y2, y3);
        const maxY = Math.max(y1, y2, y3);

        const triCenterX = (minX + maxX) / 2;
        const triCenterY = (minY + maxY) / 2;

        const offsetX = monitor.clientWidth / 2 - triCenterX;
        const offsetY = monitor.clientHeight / 2 - triCenterY;

        x1 += offsetX; y1 += offsetY;
        x2 += offsetX; y2 += offsetY;
        x3 += offsetX; y3 += offsetY;

        const nextPoints = [
            { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x: x3, y: y3 }
        ];

        if (!prevPoints) {
            prevPoints = nextPoints;
            renderTriangle(nextPoints, [a, b, c], type); // Pasa el tipo
            return;
        }

        // Animar transición
        const duration = 400; // ms
        const start = performance.now();

        function animate(now) {
            const progress = Math.min((now - start) / duration, 1);

            const currentPoints = nextPoints.map((p, i) => ({
                x: prevPoints[i].x + (p.x - prevPoints[i].x) * progress,
                y: prevPoints[i].y + (p.y - prevPoints[i].y) * progress
            }));

            renderTriangle(currentPoints, [a, b, c], type); // Pasa el tipo

            if (progress < 1) {
                // *** Solución JSDOM: requestAnimationFrame no existe en JSDOM ***
                if (typeof requestAnimationFrame === 'function') {
                    requestAnimationFrame(animate);
                } else {
                    // Para JSDOM, forzamos el fin de la animación para probar el estado final
                    renderTriangle(nextPoints, [a, b, c], type);
                    prevPoints = nextPoints; 
                }
            } else {
                prevPoints = nextPoints; // guardar estado final
            }
        }
        
        // Iniciar animación o forzar renderizado en JSDOM
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(animate);
        } else {
            // Caso instantáneo para pruebas sin navegador
            renderTriangle(nextPoints, [a, b, c], type);
            prevPoints = nextPoints;
        }
    }

    // *** Función renderTriangle actualizada para recibir el tipo ***
    function renderTriangle(points, sides, triangleType) { 
        function makeLabel(xa, ya, xb, yb, text) {
            const midX = (xa + xb) / 2;
            const midY = (ya + yb) / 2;

            const dx = xb - xa;
            const dy = yb - ya;

            const length = Math.sqrt(dx*dx + dy*dy);
            const offset = 15;
            const nx = -dy / length * offset;
            const ny = dx / length * offset;

            return `<text x="${midX + nx}" y="${midY + ny}"
                             class="primary-contrast" font-size="14"
                             text-anchor="middle" dominant-baseline="middle">
                             ${Number(text.toFixed(2))}
                         </text>`;
        }

        const [p1, p2, p3] = points;
        const [a, b, c] = sides;

        const svg = `
            <text x="${monitor.clientWidth / 2}" y="20"
                     class="label-style">
                     ${triangleType}
            </text>
            <svg width="${monitor.clientWidth}" height="${monitor.clientHeight}">
                <polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}"
                         class="line"/>

                ${makeLabel(p1.x, p1.y, p2.x, p2.y, a)}
                ${makeLabel(p2.x, p2.y, p3.x, p3.y, c)}
                ${makeLabel(p3.x, p3.y, p1.x, p1.y, b)}
            </svg>
        `;
        monitor.innerHTML = svg;
    }

    function markInputsInvalid() {
        [sideA, sideB, sideC].forEach(input => {
            input.style.border = "2px solid red";
        });
        const svg = `
            <text x="${monitor.clientWidth / 2}" y="20"
                     class="label-style center">
                     Inválido (Revisar lados)
            </text>
        `;
        monitor.innerHTML = svg;
    }

    function markInputsValid() {
        [sideA, sideB, sideC].forEach(input => {
            input.style.border = "2px solid green";
        });
    }

    // *** Se exportan los elementos para que el JSDOM Test pueda manipularlos ***
    return { updateTriangle, sideA, sideB, sideC, monitor };
}

// Solo inicializar si estamos en un entorno con DOM (navegador o JSDOM simulado con body)
if (typeof document !== 'undefined' && document.body) {
    initTriangleApp();
}