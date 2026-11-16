@compra
Feature: Compra de productos
  Como cliente de Sauce Demo
  Quiero completar el proceso de compra
  Para adquirir los productos que necesito

  @smoke
  Scenario Outline: <id> - Completar la compra hasta la confirmación
    Given el caso de prueba "<id>"
    And el cliente inició sesión
    And agrega los productos al carrito
    When completa la compra con sus datos de envío
    Then ve la confirmación del pedido

    Examples:
      | id           |
      | CP-COMPRA-01 |
      | CP-COMPRA-02 |

  Scenario Outline: <id> - El resumen de la compra muestra los productos y el total correcto
    Given el caso de prueba "<id>"
    And el cliente inició sesión
    And agrega los productos al carrito
    When ingresa sus datos de envío
    Then el resumen muestra los productos agregados con sus precios
    And el total es la suma de los precios más el impuesto

    Examples:
      | id           |
      | CP-COMPRA-03 |

  @negativo
  Scenario Outline: <id> - No se puede continuar la compra con datos de envío incompletos
    Given el caso de prueba "<id>"
    And el cliente inició sesión
    And agrega los productos al carrito
    When ingresa sus datos de envío
    Then ve el mensaje de error en los datos de envío
    And permanece en el formulario de datos de envío

    Examples:
      | id           |
      | CP-COMPRA-04 |
      | CP-COMPRA-05 |
      | CP-COMPRA-06 |
