@carrito
Feature: Carrito de compras
  Como cliente de Sauce Demo
  Quiero agregar productos al carrito
  Para revisar lo que voy a comprar

  @smoke
  Scenario Outline: <id> - Agregar productos al carrito desde la página de productos
    Given el caso de prueba "<id>"
    And el cliente inició sesión
    When agrega los productos al carrito
    Then el ícono del carrito muestra la cantidad de productos agregados
    And cada producto agregado puede quitarse desde la página de productos

    Examples:
      | id        |
      | TC-CAR-01 |
      | TC-CAR-02 |

  Scenario Outline: <id> - Ver los productos agregados en el carrito
    Given el caso de prueba "<id>"
    And el cliente inició sesión
    And agrega los productos al carrito
    When abre el carrito
    Then el carrito muestra los productos agregados

    Examples:
      | id        |
      | TC-CAR-03 |

  Scenario Outline: <id> - Quitar productos desde el carrito
    Given el caso de prueba "<id>"
    And el cliente inició sesión
    And agrega los productos al carrito
    And abre el carrito
    When quita los productos indicados
    Then el carrito muestra solo los productos restantes

    Examples:
      | id        |
      | TC-CAR-04 |
