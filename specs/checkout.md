# Plan de prueba: checkout completo de DemoBlaze

## Application Overview

Flujo de compra de extremo a extremo en Demoblaze: seleccionar MacBook air, agregarlo al carrito, completar el pedido con datos ficticios y verificar la confirmación de compra.

## Test Scenarios

### 1. Checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. Completar la compra de una laptop desde el carrito

**File:** `tests/checkout.spec.ts`

**Steps:**
  1. Abrir la tienda usando la página inicial de tests/seed.spec.ts y seleccionar la categoría Laptops.
    - expect: La categoría muestra laptops disponibles, incluyendo MacBook air.
  2. Abrir el producto MacBook air y pulsar Add to cart.
    - expect: Aparece la alerta Product added; aceptarla para continuar.
  3. Abrir Cart y verificar que MacBook air está en Products y que el total es 700.
    - expect: La fila del producto contiene MacBook air y 700; el total es 700.
  4. Pulsar Place Order.
    - expect: Se abre el diálogo Place order y aparecen los campos Name, Country, City, Credit card, Month y Year.
  5. Completar Name=Test Buyer, Country=Testland, City=Test City, Credit card=4111111111111111, Month=12, Year=2030 y pulsar Purchase.
    - expect: Se muestra el diálogo de confirmación con el encabezado Thank you for your purchase! y el importe 700 USD.
