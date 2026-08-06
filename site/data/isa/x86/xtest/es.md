---
summary: Prueba si en la ejecución Transaccional
---

## Descripción

La instrucción XTEST consulta el estado de ejecución transaccional. Si la instrucción se ejecuta dentro de una región de RTM transaccionalmente ejecutando HLE, entonces la bandera ZF se pone a cero, de lo contrario se establece.

## Operación

```text
XTEST
IF (RTM_ACTIVE = 1 OR HLE_ACTIVE = 1)

    THEN
          ZF := 0

    ELSE
          ZF := 1

FI;
```

## Banderas afectadas

La bandera ZF se pone a cero si la instrucción es ejecutada transaccionalmente; de lo contrario se establece a 1. Las banderas CF, OF, SF, PF y AF se limpian.

## Intel C/C++ compilador intrínseco

```c
XTEST int _xtest( void );
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

```text
#UDCPUID.07H.00H:EBX.HLE[4] = 0 and CPUID.07H.00H:EBX.RTM[11] = 0.
```

Si LOCK prefijo es usado.

CHAPTER 7

7.1 OVERVIEW

Este capítulo describe las extensiones de modo más seguro (SMX) para las arquitecturas Intel 64 e IA-32. Las extensiones de modo más seguras (SMX) proporcionan una interfaz de programación para el software del sistema para establecer un entorno medido dentro de la plataforma para apoyar las decisiones de confianza de los usuarios finales. El entorno medido incluye:

* Lanzamiento medido de un ejecutivo del sistema, conocido como un entorno de lanzamiento medido (MLE)1. El ejecutivo del sistema puede estar basado en un Monitor Virtual Machine (VMM), un VMM medido se denomina MVMM2.

* Los mecanismos para garantizar la medición anterior están protegidos y almacenados en un lugar seguro en la plataforma. * Mecanismos de protección que permiten al VMM controlar los intentos de modificar el VMM.

Los mecanismos de medición y protección utilizados por un entorno medido están respaldados por las capacidades de una plataforma Intel(R) Trusted Execution Technology (Intel(R) TXT):

* El SMX son la interfaz de programación del procesador en una plataforma Intel TXT. * El chipset en una plataforma Intel TXT proporciona la aplicación de los mecanismos de protección. * Módulo de Plataforma Confiada (TPM) 1.2 en la plataforma proporciona registros de configuración de plataformas (PCRs) para almacenar

Valores de medición de software.

7.2 SMX FUNCTIONALITY

La funcionalidad SMX se proporciona en un procesador Intel 64 a través de la instrucción GETSEC a través de funciones hoja. La instrucción GETSEC admite múltiples funciones hoja. Las funciones hoja se seleccionan por el valor en EAX en el momento en que GETSEC se ejecuta. Cada función GETSEC hoja se documenta por separado en las páginas de referencia con una mnemónica única (aunque estos mnemonics comparten la misma código de operación, 0F 37).

7.2.1 Detectar y habilitar SMX

El software puede detectar soporte para la operación SMX utilizando la instrucción CPUID. Si el software ejecuta CPUID con 1 en EAX, un valor de 1 en bit 6 de ECX indica el soporte para la operación SMX (GETSEC está disponible), consulte la instrucción CPUID para el diseño de las banderas de características reportadas por CPUID.01H:ECX.

El software del sistema permite la operación SMX estableciendo CR4.SMXE[Bit 14] = 1 antes de intentar ejecutar GETSEC. De lo contrario, la ejecución de GETSEC resulta en la señalización del procesador una excepción de código de operación no válido (#UD).

Si la bandera característica CPUID SMX es clara (CPUID.01H:ECX[6] = 0), tratando de establecer los resultados de CR4.SMXE[Bit 14] en una excepción de protección general.

El IA32 FEATURE CONTROL MSR (en la dirección 03AH) proporciona bits de control de características que configuran el funcionamiento de VMX y SMX. Estos bits se documentan en la tabla 7-1.

Posición de bits Tabla 7-1. Diseño de IA32 FEATURE CONTROL 0 Descripción 1 Bloqueo (0 = desbloqueado, 1 = bloqueado). Cuando se establece a '1' escribe más a este MSR están bloqueados. 2 Permite VMX en SMX operación. Activar VMX fuera de la operación SMX.

1. Vea la Guía de Programación de Medio Ambiente Lanzado Medido de Intel(R).

2. Un MVMM se conoce a veces como un entorno lanzado medido (MLE). Vea la Guía de Programación de Medio Ambiente Lanzado Medido de Intel(R).

7:3 Cuadro 7-1. Diseño de IA32 FEATURE CONTROL 14:8 Función local reservada SENTER Permite: Cuando se establece, cada bit en el campo representa un control de habilitación para una función de 15 SENTER correspondiente. 16 SENTER Global Enable: Debe establecerse en `1' para permitir el funcionamiento de GETSEC[SENTER]. 17 Control de lanzamiento reservado SGX Permite: Debe establecerse en `1' para permitir la re-configuración de tiempo de ejecución de SGX Control de lanzamiento a través del 18 IA32 SGXLEPUBKEYHASHn MSR. 19 SGX Global Enable: Debe establecerse en `1' para habilitar las funciones Intel SGX hoja. 20 Reservado LMCE En: Cuando se establece, el software del sistema puede programar los MSR asociados con LMCE para configurar la entrega de unas 63:21 excepciones de comprobación de máquina a un solo procesador lógico. Reservado

* Un poco 0 es un poco de cerradura. Si el bit de bloqueo es claro, un intento de ejecutar VMXON causará una protección general

excepción. Intentar ejecutar GETSEC[SENTER] cuando el bit de bloqueo es claro también causará un general-

excepción de protección. Si el bit de bloqueo está fijado, WRMSR a la IA32 FEATURE CONTROL MSR causará un general-

excepción de protección. Una vez que se establece el bit de bloqueo, el MSR no puede ser modificado hasta un reinicio de encendido. Sistema BIOS

puede utilizar este bit para proporcionar una opción de configuración para BIOS para deshabilitar soporte para VMX, SMX o VMX y SMX.

* El bit 1 permite VMX en SMX operación (entre ejecutar el SENTER y SEXIT hojas de GETSEC). Si este poco

es claro, un intento de ejecutar VMXON en SMX causará una excepción de protección general si se ejecuta en SMX

operación. Intentos de fijar esta parte en los procesadores lógicos que no soportan tanto la operación VMX (Capítulo 7,

"Referencia de las extensiones del modo de comunicación") y la operación SMX causan excepciones de protección general.

* El bit 2 permite VMX fuera de SMX operación. Si este bit es claro, un intento de ejecutar VMXON causará un general-

excepción de protección si se ejecuta fuera de la operación SMX. Intentos de fijar esta parte en procesadores lógicos que sí

no apoyar la operación VMX causa excepciones de protección general.

* Los bits 8 a 14 especifican la funcionalidad activada de la función SENTER hoja. Cada bit en el campo representa un

habilitar el control para una función SENTER correspondiente. Solo se puede utilizar la funcionalidad SENTER hoja habilitada cuando

ejecutando SENTER.

* Los bits 15 especifican la habilitación global de todas las funcionalidades SENTER.

Resumen de la instrucción de SMX

El software del sistema debe primero consultar para las funciones GETSEC hoja disponibles ejecutando GETSEC[CAPABILITIES]. La función CAPABILITIES hoja devuelve un mapa de GETSEC hojas disponible. Un intento de ejecutar un índice hoja sin soporte resulta en una excepción código de operación indefinida (#UD).

7.2.2.1 GETSEC[CAPABILITIES]

La funcionalidad SMX proporciona una interfaz arquitectónica para las nuevas generaciones de procesadores para ampliar las capacidades SMX. Específicamente, la instrucción GETSEC proporciona una función hoja para el software del sistema para descubrir las funciones GETSEC hoja disponibles que son compatibles en un procesador. En el cuadro 7-2 se enumeran las funciones GETSEC hoja actualmente disponibles.

.             Función hoja Cuadro 7-2. Funciones GETSEC hoja

```text
              CAPABILITIES          Description
```

ÍndiceEAX) Devuelve el disponiblehojafunciones de lasGETSECinstrucción. 0ENTERACCSReservado 1EXITACEntra 2SENTERSal 3SEXITInicie un lanzamientoMLE. 4 PARAMETERSExit theMLE. 5 SMCTRLRegresoSMXinformación relativa al parámetro 6WAKEUP SMXControl de modo. 7 Indefinido Desperta los procesadores de sueño en modo más seguro. 8 Reservado 9 - (4G-1)

7.2.2.2 GETSEC[ENTERACCS]

El GETSEC[ENTERACCS] hoja permite el modo de ejecución de código autenticado. La función ENTERACCS hoja realiza una carga de módulo de código autenticado utilizando el chipset public clave como verificación de firmas. ENTERACCS requiere la existencia de un chipset Intel(R) Trusted Execution Technology capaz ya que desbloquea el espacio de registro de configuración privada chipset después de la autenticación exitosa del módulo cargado. La dirección de base física y el tamaño del módulo de código autenticado se especifican como valores de registro de entrada en EBX y ECX, respectivamente.

Mientras que en el modo de ejecución de código autenticado, ciertas propiedades del estado procesador cambian. Por esta razón, el tiempo en que el procesador opera en modo de ejecución de códigos autenticado debe limitarse a minimizar el impacto en los eventos del sistema externo.

Al entrar, el contexto de paging anterior está deshabilitado (ya que la imagen del módulo de código autenticado se especifica con direcciones físicas y ya no puede depender de estructuras de página basadas en memoria externa).

Antes de ejecutar el GETSEC[ENTERACCS] hoja, el software del sistema debe asegurar que el procesador lógico que emite GETSEC[ENTERACCS] es el procesador de arranque (BSP), como indica IA32_APIC_BASE.BSP = 1. El software del sistema debe asegurar que otros procesadores lógicos están en un estado de ocio adecuado y no marcado como BSP.

El GETSEC[ENTERACCS] hoja puede ser utilizado por diferentes agentes para cargar diferentes módulos de código autenticados para realizar funciones relacionadas con diferentes aspectos de un entorno medido, por ejemplo software del sistema e Intel(R) TXT habilitado BIOS puede utilizar más de un módulo de código autenticado.

7.2.2.3 GETSEC[EXITAC]

GETSEC[EXITAC] saca al procesador del modo de ejecución de código autenticado. Cuando se ejecuta esta instrucción hoja, los contenidos del área de ejecución de códigos autenticados son escrubidos y el control se transfiere al contexto no autenticado definido por un puntero cercano aprobado con la instrucción GETSEC[EXITAC].

El área de ejecución de códigos autenticados ya no es accesible después de la terminación de GETSEC[EXITAC]. RBX (o EBX) tiene la dirección del objetivo indirecto casi absoluto a tomar.

7.2.2.4 GETSEC[SENTER]

La función GETSEC[SENTER] hoja es utilizada por el procesador lógico iniciador (ILP) para lanzar un MLE. GETSEC[SENTER] se puede considerar un superset del ENTERACCS hoja, ya que entra como parte del lanzamiento del medio ambiente medido. La puesta en marcha de un entorno seguro consiste en los siguientes pasos:

* el ILP cita a los procesadores lógicos que responden (RLPs) en la plataforma en un estado controlado (En el

finalización de este apretón de manos, todos los RLP excepto para el ILP iniciando el lanzamiento del medio ambiente medido se colocan en un estado de sueño SENTER recién definido.

* Cargar y autenticar el módulo de código autenticado requerido por el entorno medido, e introducir

modo de ejecución de código autenticado.

* Verificar y bloquear ciertos parámetros de configuración del sistema. * Medir la raíz dinámica de la confianza y almacenar en los PCRs en TPM. * Control de transferencia al MLE con interrupciones deshabilitadas.

Antes de ejecutar el GETSEC[SENTER] hoja, el software del sistema debe asegurar que el TPM de la plataforma esté listo para el acceso y el ILP es el procesador de arranque (BSP), como indica IA32_APIC_BASE.BSP. El software del sistema debe garantizar que otros procesadores lógicos (RLPs) están en un estado de ocio adecuado y no marcados como BSP. El software del sistema que lanza un entorno de medición es responsable de proporcionar una dirección correcta del módulo de código autenticado al ejecutar GETSEC[SENTER]. El módulo AC responsable del lanzamiento de un entorno medido y cargado por GETSEC[SENTER] se denomina SINIT. See Intel(R) Trusted Execution Technology Measured Launched Environment Programming Guide for additional information on system software requirements prior to executing GETSEC[SENTER].

7.2.2.5 GETSEC[SEXIT]

El software del sistema sale del entorno medido ejecutando la instrucción GETSEC[SEXIT] en el ILP. Esta instrucción reúne a los procesadores lógicos que responden en la plataforma para salir del entorno medido. Los eventos externos (si la izquierda enmascarada) son desenmascarados e Intel(R) TXT-capable espacio de configuración privada de chipset es re-bloqueado.

7.2.2.6 GETSEC[PARAMETERS]

La función GETSEC[PARAMETERS] hoja se utiliza para reportar atributos, opciones y limitaciones de la operación SMX. El software utiliza este hoja para identificar límites operativos o opciones adicionales. La información reportada por GETSEC[PARAMETERS] puede requerir ejecutar la hoja varias veces utilizando EBX como índice. Si la instrucción GETSEC[PARAMETERS] hoja o si un campo de parámetro específico no está disponible, entonces la operación SMX debe interpretarse para utilizar los límites predeterminados de los respectivos GETSEC hojas o campos de parámetro definidos en el GETSEC[PARAMETERS] hoja.

7.2.2.7 GETSEC[SMCTRL]

La función GETSEC[SMCTRL] hoja se utiliza para proporcionar control adicional sobre condiciones específicas asociadas con la arquitectura SMX. Se admite un registro de entrada para seleccionar la operación de control. Vea la descripción hoja específica para detalles sobre el tipo de control proporcionado.

7.2.2.8 GETSEC[WAKEUP]

Respondiendo a procesadores lógicos (RLPs) se colocan en el estado de sueño SENTER después de que el procesador lógico iniciado ejecuta GETSEC[SENTER]. El ILP puede despertar RLPs para unirse al entorno medido utilizando GETSEC[WAKEUP]. Cuando los RLPs de SENTER estado de sueño despiertan, estos procesadores lógicos comienzan la ejecución en el punto de entrada definido en una estructura de datos que se mantiene en la memoria del sistema (nombrada por un registro de chipset LT.MLE.JOIN) en el espacio de configuración TXT.

7.2.3 Medio ambiente y SMX

Esta sección ofrece una visión simplificada de un ciclo de vida representativo de un entorno medido que es lanzado por un ejecutivo del sistema utilizando funciones SMX hoja. La Guía de Programación de Medio Ambiente Lanzada Medida Intel(R) Trusted Execution Technology ofrece ejemplos más detallados de utilización de recursos SMX y chipset (incluyendo registros de chipsets, Módulo de Plataforma Confiada) para lanzar un MVMM.

El ciclo de vida comienza con el ejecutivo del sistema (un sistema operativo, un cargador de sistema operativo, etc.) cargando el módulo MLE y SINIT AC en la memoria del sistema disponible. El ejecutivo del sistema debe validar y preparar la plataforma para el lanzamiento medido. Cuando la plataforma está correctamente configurada, el ejecutivo del sistema ejecuta GETSEC[SENTER] en el procesador lógico iniciador (ILP) para reunir a los procesadores lógicos respondiendo en un estado de sueño SENTER, el ILP entra en el uso del módulo SINIT AC. En un entorno multi-treaded o multi-procesador, el ejecutivo del sistema debe asegurarse de que otros procesadores lógicos ya están en un bucle o dormido (como después de ejecutar HLT) antes de ejecutar GETSEC[SENTER].

Después de la GETSEC[SENTER] cita el apretón de manos se realiza entre todos los procesadores lógicos en la plataforma, el ILP carga el módulo de código autenticado del chipset (SINIT) y realiza un cheque de autenticación. Si el cheque pasa, el procesador tiene el módulo SINIT AC y almacena el resultado en TPM PCR 17. Luego cambia el contexto de ejecución al módulo SINIT AC. El módulo SINIT AC realizará una serie de operaciones de plataforma, incluyendo: verificar la configuración del sistema, protegiendo la memoria del sistema utilizada por los dispositivos MLE de I/O capaces de DMA, produciendo un hash del MLE, almacenando el valor de hash en TPM PCR 18, y varias otras operaciones. Cuando SINIT completa la ejecución, ejecuta la instrucción GETSEC[EXITAC] y las transferencias controlan el MLE en el punto de entrada designado.

Al recibir el control del módulo SINIT AC, el MLE debe establecer sus controles de protección y aislamiento antes de habilitar DMA e interrumpir y transferir el control a otros módulos de software. También debe despertar los RLP de su estado de sueño SENTER utilizando la instrucción GETSEC[WAKEUP] y llevarlos a su entorno de protección y aislamiento.

Mientras se ejecuta en un entorno medido, el MVMM puede acceder al Módulo de Plataforma Confiada (TPM) en la localidad 2. El MVMM tiene acceso completo a todos los comandos TPM y puede utilizar el TPM para informar de los valores de medición actuales o utilizar los valores de medición para proteger la información que sólo cuando las configuraciones de la plataforma registran el mismo valor es la información publicada desde el TPM. Este mecanismo de protección se conoce como sellado.

En última instancia, una desactivación del entorno medida se completa ejecutando GETSEC[SEXIT]. Antes de este software del sistema de pasos es responsable de escanear información sensible que queda en los caches del procesador, memoria del sistema.

7.3 GETSEC hoja FUNCTIONS

Esta sección proporciona descripciones detalladas de cada función hoja de la instrucción GETSEC. GETSEC está disponible sólo si CPUID.01H:ECX[6] = 1. Esto indica la disponibilidad de SMX y la instrucción GETSEC. Antes de que GETSEC pueda ser ejecutado, SMX debe ser habilitado estableciendo CR4.SMXE[Bit 14] = 1.

A GETSEC hoja sólo se puede utilizar si se muestra disponible según lo reportado por la función GETSEC[CAPABILITIES]. Los intentos de acceder a un índice GETSEC hoja no compatible con el procesador, o si CR4.SMXE es 0, resulta en la señalización de una excepción código de operación indefinida.

Todas las funciones GETSEC hoja están disponibles en modo protegido, incluyendo el submodo de compatibilidad del modo IA-32e y el submodo de 64 bits del modo IA-32e. A menos que se indique lo contrario, el comportamiento de todas las funciones e interacciones de GETSEC relacionadas con el entorno medido son independientes del modo IA-32e. Esto también se aplica a la interpretación de anchos de registro1 pasados como parámetros de entrada a las funciones GETSEC y para registrar los resultados devueltos como parámetros de salida.

1. Este capítulo utiliza la notación de 64 bits RAX, RIP, RSP, RFLAGS, etc. para los registros de procesadores porque los procesadores que soportan SMX también soportan Intel 64 Architecture. El MVMM se puede lanzar en modo IA-32e o fuera del modo IA-32e. La notación de 64 bits de los registros de procesadores también se refieren a sus formas de 32 bits si SMX se utiliza en entornos de 32 bits. En algunos lugares, la notación como EAX se utiliza para referirse específicamente a los 32 bits inferiores del registro indicado.

Las funciones de GETSEC ENTERACCS, SENTER, SEXIT y WAKEUP requieren un chip Intel(R) TXT capaz de estar presente en la plataforma. El GETSEC[CAPABILITIES] vector de bit devuelto en posición 0 indica un chipset Intel(R) TXTcapable ha sido muestreado presente1 por el procesador. El modo operativo del procesador también afecta la ejecución de las siguientes funciones GETSEC hoja: SMCTRL, ENTER- ACCS, EXITAC, SENTER, SEXIT y WAKEUP. Estas funciones sólo se permiten en modo protegido en CPL = 0. No se les permite, mientras que en SMM para prevenir posibles conflictos intramodo. Existen otras calificaciones de ejecución para prevenir posibles conflictos arquitectónicos (por ejemplo: anidación del entorno medido o modo de ejecución de códigos autenticado). Vea las definiciones de las funciones GETSEC hoja para requisitos específicos. Con el fin de contar con monitores de desempeño, la ejecución de funciones GETSEC se contabiliza como una sola instrucción con respecto a las instrucciones retiradas. La respuesta de un procesador lógico que responde (RLP) a los mensajes asociados con GETSEC[SENTER] o GTSEC[SEXIT] es transparente a la instrucción retirada con el ILP.

1. El presente muestreado significa que el procesador envió un mensaje al chipset y el chipset respondió que (a) sabe sobre el mensaje y (b) es capaz de ejecutar SENTER. Esto significa que el chipset CAN admite Intel(R) TXT, y está configurado y WILLING para apoyarlo.
