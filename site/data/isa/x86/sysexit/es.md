---
summary: Retorno rápido de la llamada de sistema rápido
---

## Descripción

Ejecuta un rápido retorno al nivel de privilegio 3 código de usuario. SYSEXIT es una instrucción compañera a la instrucción SYSENTER. La instrucción está optimizada para proporcionar el máximo rendimiento para los retornos de los procedimientos del sistema ejecutando a niveles de protecciones 0 a los procedimientos del usuario ejecutando a nivel de protección 3. Debe ejecutarse desde el código de ejecución a nivel de privilegios 0.

Con un tamaño de operando de 64 bits, SYSEXIT permanece en modo de 64 bits; de lo contrario, entra en modo de compatibilidad (si el procesador lógico está en modo IA-32e) o permanece en modo protegido (si no lo es).

Antes de ejecutar SYSEXIT, el software debe especificar el nivel de privilegio 3 segmento de código y punto de entrada de código, y el segmento de nivel de privilegio 3 pila y puntero de pila escribiendo valores en los siguientes MSR y registros de proposito general:

* IA32 SYSENTER CS (MSR dirección 174H) -- Contiene un valor de 32 bits que se utiliza para determinar el segmento

selectores para el nivel de privilegio 3 segmentos de código y pila (ver la sección Operación)

* RDX -- La dirección canónica en este registro se carga en RIP (por lo tanto, este valor hace referencia a la primera instrucción

para ser ejecutado en el código de usuario). Si el retorno no es al modo 64-bit, sólo se cargan los bits 31:0.

* RCX -- La dirección canónica en este registro se carga en RSP (por lo tanto, este valor contiene el puntero de pila para

el nivel de privilegio 3 pila). Si el retorno no es al modo 64-bit, sólo se cargan los bits 31:0.

El IA32 SYSENTER CS MSR se puede leer y escribir a través de RDMSR y WRMSR.

Si bien SYSEXIT carga los selectores de CS y SS con valores derivados del IA32 SYSENTER CS MSR, los caches descriptores CS y SS no se cargan de los descriptores (en GDT o LDT) referenciados por esos selectores. En cambio, los caches descriptor están cargados con valores fijos. Vea la sección Operación para más detalles. Es responsabilidad del software OS asegurar que los descriptores (en GDT o LDT) referenciados por esos valores selectores correspondan a los valores fijos cargados en los caches descriptores; la instrucción SYSEXIT no garantiza esta correspondencia.

La instrucción SYSEXIT se puede invocar de todos los modos operativos excepto modo de direccion real y modo virtual-8086.

Las instrucciones SYSENTER y SYSEXIT fueron introducidas en la arquitectura IA-32 en el procesador Pentium II. La disponibilidad de estas instrucciones en un procesador se indica con el SYSENTER/SYSEXIT presente (SEP) bandera de características devuelto al registro EDX por la instrucción CPUID. Un sistema operativo que califique la bandera SEP también debe calificar a la familia procesadora y modelo para asegurar que las instrucciones SYSENTER/SYSEXIT estén realmente presentes. Por ejemplo:

```text
IF CPUID SEP bit is set
    THEN IF (Family = 6) and (Model < 3) and (Stepping < 3)
          THEN
```

SYSENTER/SYSEXIT_Not_Supported; FI;

```text
          ELSE
```

SYSENTER/SYSEXIT_Supported; FI;

FI;

Cuando la instrucción CPUID se ejecuta en el procesador Pentium Pro (modelo 1), el procesador devuelve una bandera SEP como se establece, pero no soporta las instrucciones SYSENTER/SYSEXIT.

Cuando las pilas de sombras están habilitadas a nivel de privilegio 3 la instrucción carga SSP con valor de IA32 PL3 SSP MSR. Consulte el Capítulo 7, "Manejo de Interrupción y Excepción", y el Capítulo 18, "Tecnología de Control de Flujo de Control (CET)," en el Manual de Desarrolladores de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1, para detalles adicionales de CET.

La instrucción no se puede ejecutar cuando las transiciones FRED están habilitadas. Un sistema operativo que ha habilitado las transiciones FRED debe utilizar ERETU en su lugar.

Ordenación de instrucciones. Las instrucciones posteriores a un SYSEXIT pueden ser arrebatadas de memoria antes de la ejecución completa de instrucciones anteriores, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores al SYSEXIT hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

## Operación

```text
IF CR4.FRED = 1
    THEN #UD; FI;

IF IA32_SYSENTER_CS[15:2] = 0 OR CR0.PE = 0 OR CPL  0 THEN #GP(0); FI;

IF operand size is 64-bit
    THEN (* Return to 64-bit mode *)
          RSP := RCX;
          RIP := RDX;
    ELSE (* Return to protected mode or compatibility mode *)
          RSP := ECX;
          RIP := EDX;

FI;

IF operand size is 64-bit                   (* Operating system provides CS; RPL forced to 3 *)

     THEN CS.Selector := IA32_SYSENTER_CS[15:0] + 32;

     ELSE CS.Selector := IA32_SYSENTER_CS[15:0] + 16;

FI;

CS.Selector := CS.Selector OR 3;            (* RPL forced to 3 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                               (* Flat segment *)

CS.Limit := FFFFFH;                         (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                              (* Execute/read code, accessed *)

CS.S := 1;

CS.DPL := 3;

CS.P := 1;

IF operand size is 64-bit

     THEN (* return to 64-bit mode *)

     CS.L := 1;                             (* 64-bit code segment *)

     CS.D := 0;                             (* Required if CS.L = 1 *)

     ELSE (* return to protected mode or compatibility mode *)

     CS.L := 0;

     CS.D := 1;                             (* 32-bit code segment*)

FI;

CS.G := 1;                                  (* 4-KByte granularity *)

CPL := 3;

IF ShadowStackEnabled(CPL)                  (* SS just above CS *)
    THEN SSP := IA32_PL3_SSP;
                                            (* Flat segment *)
FI;                                         (* With 4-KByte granularity, implies a 4-GByte limit *)

SS.Selector := CS.Selector + 8;
(* Set rest of SS to a fixed value *)
SS.Base := 0;
SS.Limit := FFFFFH;


SS.Type := 3;                               (* Read/write data, accessed *)
SS.S := 1;
SS.DPL := 3;                                (* 32-bit stack segment*)
SS.P := 1;                                  (* 4-KByte granularity *)
SS.B := 1;
SS.G := 1;
```

## Banderas afectadas

None.
