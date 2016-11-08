Student Model (basic management)
===================


(under construction)

----------

**GET /botbloq/v1/its/students**
-------------

Retrieve of all the students registered in the system. 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for each student.
If this action is not successful, it returns the error code. 



**POST /botbloq/v1/its/students**
-------------

The service creates a new student with  the provided values.

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
**Input**: 
A JSON student object.
**Return**:  

If successful, this action returns: "Added the student with id: " and the id of the new student.
If this action is not successful, it returns the error code. 

**DELETE /botbloq/v1/its/students**
-------------

Delete all students of the repository

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  

Number of removed students (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 3
}


**GET /botbloq/v1/its/students/:id**
------------

Retrieve the basic information of a student

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**: 
If successful, this action returns the corresponding JSON object student with id introduced.
If this action is not successful, it returns the error code. 
**PUT /botbloq/v1/its/students/:id**
-------------

Update the information of a student in  the repository.

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the information for each student.
If this action is not successful, it returns the error code. 

**PUT /botbloq/v1/its/students/:idstd/courses/:idc**
-------------

Assigns a course to a student.


**Parameters**

- idstd: Student ID
- idc: Course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, Returns the lom assigned to the student if it exists.
If there are no loms, return the student's information.
If this action is not successful, it returns the error code. 


**DELETE /botbloq/v1/its/students/:id**
-------------

Delete all the information about a student in the repository

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  

Number of removed students (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 1
}

**LOCK /botbloq/v1/its/students/:id**
-------------

Deactivate the information of a student in  the repository (logic deleted).

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the information for each student.
If this action is not successful, it returns the error code. 

**UNLOCK /botbloq/v1/its/students/:id**
-------------

Activate the information of a student in  the repository.

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the information for each student.
If this action is not successful, it returns the error code. 


