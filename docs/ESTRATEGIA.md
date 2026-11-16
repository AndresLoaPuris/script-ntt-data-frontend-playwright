# Estrategia de automatización

## Objetivo

Validar que un cliente de Sauce Demo puede iniciar sesión, agregar productos al carrito y completar una compra, y que la aplicación responde correctamente ante credenciales inválidas, un usuario bloqueado y datos de envío incompletos.

## Enfoque

1. **Primero la aplicación real.** Antes de escribir los page objects recorrí el sitio con Playwright para confirmar los selectores `data-test` y los textos exactos de cada mensaje.
2. **Gherkin que describe comportamiento.** Los escenarios hablan el lenguaje del cliente ("agrega los productos al carrito", "ve la confirmación del pedido") y no mencionan botones, selectores ni URLs.
3. **Datos separados del comportamiento.** Cada `Scenario Outline` lista en sus `Examples` los IDs de los casos que ejecuta, y los datos de cada ID están en una matriz de Excel. El feature muestra qué se prueba y el Excel con qué datos.
4. **Verificar el resultado de punta a punta.** El caso de compra no solo llega a la confirmación: también compara los productos y precios del resumen con los del catálogo, y verifica que el total sea la suma de los precios más el impuesto.
5. **Escenarios independientes.** Cada escenario usa su propio contexto de navegador, sin sesión ni carrito compartidos, lo que permite ejecutarlos en paralelo.

## Arquitectura

```
features/*.feature           Qué se prueba, en Gherkin
        │
        ▼
steps/*.steps.ts             Traducen cada paso a acciones y aserciones
        │
        ├──────────────► data/TestDataRepository   Datos del caso desde el Excel
        ▼
pages/ (Page Object Model)   Cómo se interactúa con cada página
        │
        ▼
Playwright → Sauce Demo

support/   →  World (estado del escenario), hooks (navegador y capturas) y configuración
```

## Patrones utilizados

### Page Object Model

Cada página de la aplicación tiene su clase en `pages/`, que concentra sus selectores y acciones:

| Page Object | Responsabilidad |
|---|---|
| `LoginPage` | Abrir el sitio e iniciar sesión |
| `InventoryPage` | Consultar el precio de un producto y agregarlo al carrito |
| `CartPage` | Listar, quitar productos e iniciar el checkout |
| `CheckoutInformationPage` | Enviar los datos de envío |
| `CheckoutOverviewPage` | Leer el resumen del pedido y finalizar la compra |
| `CheckoutCompletePage` | Exponer el mensaje de confirmación |
| `HeaderComponent` | Título de la página, contador del carrito y acceso al carrito, comunes a varias páginas |

Reglas que se cumplen en todo el proyecto:
- **Los selectores solo existen en los page objects.** Los steps nunca usan `getByTestId` ni CSS.
- **Los page objects no hacen aserciones.** Exponen acciones y elementos; las validaciones con `expect` viven en los steps.
- **Selectores estables.** Se usa el atributo `data-test` que el sitio provee para pruebas, configurado como `testIdAttribute` de Playwright. Los productos se ubican por su nombre visible, no por identificadores derivados.

### Componentes reutilizables

El encabezado aparece en todas las páginas internas, así que se modela una sola vez como `HeaderComponent`, en lugar de repetir sus selectores en cada page object.

### World de Cucumber

`SauceDemoWorld` guarda el estado de cada escenario: el contexto del navegador, los page objects, el caso de prueba cargado y los productos agregados con sus precios. Cucumber crea un World nuevo por escenario, lo que garantiza que ningún escenario vea datos de otro.

`SauceDemoPages` agrupa todos los page objects en un solo punto de acceso (`this.pages.cart`, `this.pages.checkoutOverview`…), así los steps no tienen que construirlos.

### Repositorio de datos de prueba

`TestDataRepository` es el único que conoce el Excel: sabe en qué hoja buscar a partir del prefijo del ID y devuelve un `TestCase`. Si un ID, una hoja o una columna no existen, el error lo dice con exactitud, por ejemplo `No existe el caso CP-COMPRA-09 en la hoja "compra"`. Las credenciales se centralizan en la hoja `usuarios`.

### Hooks

`hooks.ts` abre el navegador una vez por proceso, crea un contexto nuevo por escenario y lo cierra al final. Si un escenario falla, adjunta una captura de pantalla de página completa al reporte HTML.

## Principios de diseño

| Principio | Aplicación |
|---|---|
| Responsabilidad única | Features describen, steps orquestan y validan, page objects interactúan, el repositorio lee datos, los hooks gestionan el navegador |
| Abierto/cerrado | Un caso nuevo es una fila en el Excel y un ID en los `Examples`; una página nueva es una clase más en `pages/` |
| Inversión de dependencias | Los steps dependen de los page objects y del repositorio, no de selectores ni del formato del archivo de datos |
| DRY | Los pasos de login, carrito y checkout se reutilizan entre features; el encabezado es un único componente |
| KISS / YAGNI | Node ejecuta TypeScript de forma nativa, sin compilador ni loaders; solo las dependencias imprescindibles |

## Manejo de usuarios

| Usuario | Comportamiento esperado | Caso |
|---|---|---|
| `standard_user` | Inicia sesión, compra y completa el pedido | `CP-LOGIN-01`, `CP-CARRITO-xx`, `CP-COMPRA-xx` |
| `locked_out_user` | No puede iniciar sesión y ve el mensaje de usuario bloqueado | `CP-LOGIN-02` |
| Credenciales inválidas | Contraseña incorrecta, usuario inexistente o campos vacíos muestran el error correspondiente | `CP-LOGIN-03` a `CP-LOGIN-06` |

## Decisiones técnicas

- **TypeScript nativo de Node 24:** Node elimina los tipos al cargar los archivos, así que no hace falta compilar ni usar loaders. `erasableSyntaxOnly` en el `tsconfig` asegura que el código solo use sintaxis compatible, y `npm run typecheck` verifica los tipos en modo `strict`.
- **`expect` de Playwright:** las aserciones web-first esperan automáticamente a que la página alcance el estado esperado, lo que evita esperas fijas y pruebas inestables.
- **Navegador configurable:** la suite corre en Chromium por defecto y en Firefox o WebKit con la variable `BROWSER`.
- **Ejecución en paralelo (2 procesos):** es posible porque cada escenario es independiente.
- **CI en GitHub Actions:** cada push verifica los tipos, ejecuta la suite y publica el reporte con las capturas de los fallos.
