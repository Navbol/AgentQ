# Plan de prueba: agregar laptop al carrito

## Application Overview

Plan de prueba de la tienda Demoblaze para explorar la categoría de laptops, seleccionar MacBook air, agregarlo al carrito y confirmar que aparece en la lista de productos.

## Test Scenarios

### 1. Carrito de compras

**Seed:** `tests/seed.spec.ts`

#### 1.1. Agregar una laptop al carrito y verificarla en la lista

**File:** `tests/carrito.spec.ts`

**Steps:**
  1. Usar la página inicial abierta por tests/seed.spec.ts en https://www.demoblaze.com/.
    - expect: La página de la tienda se muestra correctamente.
  2. Seleccionar la categoría Laptops.
    - expect: Se muestran productos de laptop, incluyendo Sony vaio i5, Sony vaio i7 y MacBook air.
  3. Seleccionar MacBook air.
    - expect: Se abre la página de detalles del producto y se muestra el encabezado MacBook air.
  4. Seleccionar Add to cart.
    - expect: La tienda muestra una alerta con el mensaje Product added; aceptar la alerta para continuar.
  5. Abrir Cart desde la navegación.
    - expect: La tabla Products contiene una fila con MacBook air y el precio 700.
