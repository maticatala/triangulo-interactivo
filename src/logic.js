export function classifyTriangle(a, b, c) {
  const nums = [a, b, c];

  // Validar que sean enteros positivos
  if (nums.some(n => !Number.isInteger(n) || n <= 0)) {
    return "Inválido";
  }

  // Verificar desigualdad triangular
  if (a + b <= c || a + c <= b || b + c <= a) {
    return "Inválido";
  }

  // Clasificar
  if (a === b && b === c) return "Equilatero";
  if (a === b || b === c || a === c) return "Isósceles";
  return "Escaleno";
}
