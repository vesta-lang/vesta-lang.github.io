---
summary: Informe los parámetros SMX
---

## Descripción

La instrucción GETSEC[PARAMETERS] devuelve información de parámetro específica para las características SMX apoyadas por el procesador. La información del parámetro se devuelve en EAX, EBX y ECX, con el parámetro de entrada seleccionado utilizando EBX.

El software recupera la información del parámetro buscando con un índice de entrada para EBX a partir de 0, y luego leyendo los resultados devueltos en EAX, EBX y ECX. EAX[4:0] es designado para devolver un campo tipo parámetro indicando si hay un parámetro disponible y qué tipo es. Si EAX[4:0] se devuelve con 0, esto designa un parámetro nulo e indica que no hay más parámetros disponibles.

En el cuadro 7-7 se definen los tipos de parámetro apoyados en las implementaciones actuales y futuras.

**SMX Formato de parámetros de presentación de informes**

| Tipo EAX[4:0] | Parámetro Descripción | EAX[31:5] | EBX[31:0] | ECX[31:0] |
| --- | --- | --- | --- | --- |
| 0 | NULL | Reservado (0 devuelto) | Reservado (no modificado) | Reservado (no modificado) |
| 1 | Versiones compatibles con módulos AC | Reservado (0 devuelto) | Máscara de comparación de versiones | Números de versión compatibles |
| 2 | Tamaño máximo del área de ejecución de código autenticado | Multiply por 32 para el tamaño de los bytes | Reservado (no modificado) | Reservado (no modificado) |
| 3 | Tipos de memoria externa compatibles durante el modo AC | Máscara de bit tipo memoria | Reservado (no modificado) | Reservado (no modificado) |
| 4 | Control de funcionalidad selectivo SENTER | EAX[14:8] corresponden a los controles deshabilitación de función SENTER disponibles | Reservado (no modificado) | Reservado (no modificado) |
| 5 | Apoyo a las extensiones TXT | TXT Extensiones de la naturaleza Banderas (ver Tabla ) | Reservado | Reservado |
| 6-31 | Undefinido | Reservado (no modificado) | Reservado (no modificado) | Reservado (no modificado) |

**TXT Extensiones de la fuerza Banderas**

| Bit | Definición | Descripción |
| --- | --- | --- |
| 5 | Procesador basado S-CRTM | Devuelve 1 si este procesador implementa una capacidad S-CRTM arraigada por procesador y 0 si |
|  | apoyo | no (S-CRTM está arraigado en BIOS). Esta bandera no puede utilizarse para inferir si el chipset soporta TXT o si el procesador apoya SMX. |
| 6 | Manipulación de la máquina | Devuelve 1 si se pueden conservar registros de estado de comprobación de máquina a través de ENTERACCS y SENTER. Si este bit es 1, el callador de ENTERACCS y SENTER no es necesario para limpiar bits de estado de error de la máquina de verificación antes de invocar estos GETSEC hojas. Si este bit devuelve 0, el callador de ENTERACCS y SENTER debe limpiar todos los errores del estado de error de la máquina de verificación antes de invocar estos GETSEC hojas. |
| 31:7 | Reservado | Reservado para uso futuro. Volverá 0. |

Las versiones de módulo AC compatibles (definidas por el campo de HeaderVersion del módulo AC) se pueden determinar para un procesador SMX capaz por el parámetro tipo 1. Utilizando EBX para indexar a través de los parámetros disponibles reportados por GETSEC[PARAMETERS] para cada parámetro único devuelto para el tipo 1, el software puede determinar la lista completa de la versión(s) del módulo AC soportada.

Para cada conjunto de parámetros, EBX devuelve la máscara de comparación y ECX devuelve los valores disponibles de campo HeaderVersion compatibles, después de AND'ing el objetivo HeaderVersion con la máscara de comparación. El software puede determinar si una versión del módulo AC en particular se apoya siguiendo la rutina de búsqueda de pseudo-código que se indica a continuación:

parameter_search_index= 0 do {

EBX= parameter_search_index++ EAX= 6 GETSEC if (EAX[4:0] = 1) {

if ((version_query & EBX) = ECX) { version_is_supported= 1 break

} } } while (EAX[4:0]  0)

Si sólo los módulos AC con un HeaderVersion de 0 son compatibles con el procesador, entonces sólo un parámetro de tipo 1 será devuelto, como sigue: EAX = 00000001H,

EBX = FFFFFFFFH y ECX = 00000000H.

La capacidad máxima para un área de ejecución de códigos autenticada apoyada por el procesador se reporta con el tipo de parámetro de 2. El tamaño máximo soportado en bytes se determina multiplicando el tamaño devuelto en EAX[31:5] por 32. Así, para un tamaño RAM de 32KBytes, EAX con soporte máximo, regresa con 00008002H.

Los tipos de memoria soportables para la memoria mapeado fuera del área de ejecución de código autenticado se reportan con el tipo de parámetro de 3. Mientras que es activo, como iniciado por las funciones GETSEC SENTER y ENTERACCS y terminado por EXITAC, hay restricciones en lo que los tipos de memoria se permiten para el resto de la memoria del sistema. Es responsabilidad del software del sistema para inicializar el registro de rango de tipo de memoria (MTRR) MSRs y/o la tabla de atributos de página (PAT) para mapear únicamente los tipos de memoria compatibles con la presentación de este parámetro. La información de los tipos de memoria soportables de memoria externa se indica utilizando un mapa de bits devuelto en EAX[31:8]. Estas posiciones de bit corresponden a las codificacións tipo memoria definidas para la programación MTRR MSR y PAT. See

Table 7-9.

El tipo de parámetro de 4 se utiliza para enumerar la disponibilidad de controles deshabilitación selectivos GETSEC[SENTER]. Si un 1 se reporta en bits 14:8 del parámetro devuelto EAX, entonces esto indica que existe una capacidad de control deshabilitado con SENTER para una función particular. El campo enumerado en bits 14:8 corresponde al uso del parámetro de entrada EDX bits 6:0 para SENTER. Si un bit de campo enumerado se establece a 1, entonces el bit de parámetro de entrada EDX correspondiente de EDX se puede establecer a 1 para desactivar esa función designada. Si el bit de campo enumerado es 0 o este parámetro no se reporta, entonces no existe capacidad deshabilitación con el parámetro de entrada EDX correspondiente para SENTER, y EDX bit(s) debe ser aclarado a 0 para permitir la ejecución de SENTER. Si no existe una capacidad deshabilitación selectiva para SENTER como se enumera, entonces los bits correspondientes en el IA32 FEATURE CONTROL MSR bits 14:8 también deben ser programados a 1 si el SENTER global permite el bit 15 del MSR se establece. Esto es necesario para permitir la futura extensibilidad de la capacidad deshabilitación selectiva SENTER con respecto a la inicialización de software potencialmente separada del MSR.

EAX Bit Position Table 7-9. Tipos de memoria externa utilizando Parámetro 3 8 Parámetro Descripción 9 Uncacheable (UC) 11:10 Escribir Combinación (WC) 12 Escribido reservado (WT)

13 SAFER MODE EXTENSIONS REFERENCE 14 31:15 Tabla 7-9. Tipos de memoria externa utilizando el parámetro 3 (Contd.) Protegido por escrito (WP) Retrocede (WB) reservado

Si el GETSEC[PARAMETERS] hoja o parámetro específico no está presente para un procesador SMX capaz dado, entonces los valores de parámetro predeterminados deben ser asumidos. Estas se definen en la tabla 7-10.

** Valores del parámetro predeterminados**

| Parámetro Tipo EAX[4:0] | Ajuste predeterminado | Parámetro Descripción |
| --- | --- | --- |
| 1 | Sólo 0,0 | Versiones del módulo AC compatibles. |
| 2 | 32 KBytes | Tamaño del área de ejecución de código autenticado. |
| 3 | UC only | Tipos de memoria externa apoyados durante el modo de ejecución AC. |
| 4 | Ninguno | Disponible SENTER controles selectivos deshabilitación. |

## Operación

```text
(* example of a processor supporting only a 0.0 HeaderVersion, 32K ACRAM size, memory types UC and WC *)
IF (CR4.SMXE=0)

    THEN #UD;
ELSE IF (in VMX non-root operation)

    THEN VM Exit (reason="GETSEC instruction");
ELSE IF (GETSEC leaf unsupported)

    THEN #UD;
    (* example of a processor supporting a 0.0 HeaderVersion *)
IF (EBX=0) THEN
    EAX := 00000001h;
    EBX := FFFFFFFFh;
    ECX := 00000000h;
ELSE IF (EBX=1)
    (* example of a processor supporting a 32K ACRAM size *)
    THEN EAX := 00008002h;
ESE IF (EBX= 2)
    (* example of a processor supporting external memory types of UC and WC *)
    THEN EAX := 00000303h;
ESE IF (EBX= other value(s) less than unsupported index value)
    (* EAX value varies. Consult Table 7-7 and Table *)
ELSE (* unsupported index*)
    EAX := 00000000h;
END;
```

## Banderas afectadas

None.

Uso de Prefijos Causas #UD. LOCK Causa #UD (incluye REPNE/REPNZ y REP/REPE/REPZ). REP* Causa #UD. Tamaño de operando

No se permiten prefijos NP 66/F2/F3.

Segment anula Ignorado.

Tamaño de la dirección Ignorado.

REX           Ignored.
