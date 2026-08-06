---
title: "Referencia de la plataforma - Vesta"
description: "La máquina virtual de Vesta como especificación: juego de instrucciones, registros, convención de llamadas, formatos binarios y syscalls."
section: "docs"
---

# Referencia de la plataforma

La máquina virtual descrita como **especificación**, no como programa. Qué
instrucciones existen, qué hace cada una, cómo se pasan los argumentos y cómo
está construido el fichero que ejecuta.

<!-- BOOKINDEX -->

## Por qué esto no está en Interioridades

Podría parecer que la máquina virtual es la interioridad por excelencia. Pero
la separación de esta documentación no es por tema, es por el tipo de
afirmación, y estas páginas son normativas: describen un contrato que cualquier
implementación tendría que cumplir.

La diferencia se ve mejor con un ejemplo. Que una instrucción reciba sus
operandos en un orden determinado es parte del contrato, y un fichero compilado
hace años tiene que seguir ejecutándose. Que el intérprete despache esas
instrucciones con una tabla de saltos o con un `switch` no lo nota nadie desde
fuera, y por eso vive en [Interioridades](/es/internals/).

Si algún día alguien escribe otra implementación de VestaVM, esta sección es
contra lo que la escribiría.
