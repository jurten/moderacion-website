# Interfaces para una clase de usabilidad

Abrí **index.html** en un navegador. No hace falta instalar nada, iniciar un servidor ni tener conexión a Internet.

## Uso en clase

1. Abrí **materiales/guia-docente.html** en una pantalla que no se proyecte. Incluye los tres contextos listos para leer, datos ficticios, problemas deliberados, recorridos de referencia y resultados esperados.
2. Abrí una de las interfaces y proyectá solamente esa pestaña.
3. Leé el contexto. La clase propone cómo resolver la tarea y el docente opera la interfaz siguiendo esas propuestas.
4. Usá «Reiniciar ejemplo» o recargá la página para volver a empezar.

La guía permite ocultar las notas docentes e imprimir solo los contextos, o guardar el material completo como PDF desde el navegador.

## Los tres ejemplos

| Archivo | Tarea | Errores intencionales principales |
| --- | --- | --- |
| casos/compra.html | Comprar dos cuadernos y una lapicera con tarjeta | Terminología y feedback débiles; acción destructiva dominante; validación contradictoria y genérica |
| casos/acceso.html | Ingresar y encontrar un comprobante pagado | Etiqueta de usuario incorrecta; botón «Registrarme» para ingresar; error opaco que borra datos |
| casos/reserva.html | Cancelar una sola reserva y verificarlo | Cancelación bajo «Facturación»; diálogo ambiguo; estado visual desactualizado |

## Edición

Los contenidos están en los HTML; los comportamientos en assets/compra.js, assets/acceso.js y assets/reserva.js; el estilo compartido en assets/styles.css. Para adaptar una consigna, mantené sincronizados el contexto, los datos aceptados por JavaScript y el resultado esperado.

Los sitios son simulaciones. No tienen backend, analítica, persistencia, autenticación real ni llamadas de red. Los formularios no envían datos. Solo el caso de acceso ofrece descargar un comprobante ficticio de texto. No ingreses datos personales ni de pago reales.

Los errores descritos en la guía son parte del ejercicio: no corregirlos sin actualizar también la actividad. El diseño general, la navegación del índice y la guía no son parte de los errores intencionales.

## Verificación

Con Node.js disponible, `node qa/verify.mjs` comprueba enlaces locales y los recorridos de compra, acceso, recuperación y cancelación mediante un adaptador DOM mínimo. No requiere paquetes. Esta comprobación no sustituye revisar el diseño y la interacción en un navegador real.
