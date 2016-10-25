Gestión de los estudiantes
===================

A continuación se explicarán las distintas operaciones que se permiten realizar en la primera versión del tutor inteligente. Por el momento se han desarrollado las distintas operaciones relacionadas con el tratamiento de los alumnos en la base de datos.

----------

Regresar una lista de todos los estudiantes gestionados
-------------

**GET localhost:8000/botbloq/v1/its/students**

Devuelve una lista con todos los alumnos que contiene la base de datos. El
formato de los datos retornados es una lista de objetos en JSON.

Introducir un nuevo estudiante
-------------
**POST localhost:3000/botbloq/v1/its/students**
Mediante esta función se podría introducir un nuevo alumno en la base de
datos. 

Eliminar todos los estudiantes de la base de datos
-------------
**DELETE localhost:3000/botbloq/v1/its/students**

Con esta función se suprimirán todos los alumnos que contiene la base de
datos. El sistema mostrará
 el número de alumnos eliminados (variable ”n”) y si se ha realizado con  ́exito la operación (variable .ok”).
 
{
si
” ok ” : 1 ,
”n ” : 3
}

>Funcionalidad no definitiva

Regresar un estudiante según su ID
-------------
**GET localhost:3000//botbloq/v1/its/students/:id**

Mediante esta función se podrá obtener la información de un alumno a través
unicamente de su id. 

**GET localhost:3000/5801ff06d2f6610307011209**


Actualizar un estudiante según su ID
-------------

**PUT localhost:3000/botbloq/v1/its/students:id**
Mediante esta función se podrá actualizar la información de un alumno a través unicamente de su id. 

**PUT localhost:3000/5801ff06d2f6610307011209**

Eliminar un estudiante según su ID
-------------

**DELETE localhost:3000/:id**

Mediante esta función se podrá eliminar la información de un alumno a través
unicamente de su id. 

**DELETE localhost:3000/5801ff06d2f6610307011209**





