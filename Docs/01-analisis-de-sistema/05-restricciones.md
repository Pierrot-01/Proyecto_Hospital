# Restricciones

Identificar las **restricciones** que condicionan las decisiones de diseño y arquitectura del sistema.

| ID | Restricción | Descripción |
|---|---|---|
| RC01 | **Aplicación web** | El sistema debe desarrollarse como una aplicación accesible mediante navegadores modernos. |
| RC02 | **Control de versiones** | El código fuente debe gestionarse con Git y mantenerse en un repositorio compartido con documentación. |
| RC03 | **Protección de datos** | El sistema debe cumplir con la legislación peruana aplicable de protección de datos personales. |
| RC04 | **Sin HCE integral** | No comprende historia clínica electrónica completa ni diagnóstico automático. |
| RC05 | **Estudios iniciales** | El alcance cubre laboratorio, radiografía, ecografía y tomografía como estudios diagnósticos iniciales. |
| RC06 | **Sin PACS/DICOM completo** | Los informes se manejan como PDF e imágenes optimizadas, no como integración PACS/DICOM. |
| RC07 | **Sin integraciones externas reales** | No se requiere integración real obligatoria con RENIEC, SIS, HIS u otros sistemas externos en esta versión. |
| RC08 | **Atención presencial** | Se mantiene la atención presencial como alternativa para personas sin conectividad. |
