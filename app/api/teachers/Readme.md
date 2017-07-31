Teacher Model (basic management)
===================


(under construction)

----------


**GET /botbloq/v1/its/teachers/:id**
------------

Retrieve the basic information of a teacher

**Parameters**

- id: teacher ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**: 
If successful, this action returns the corresponding JSON object teacher with id introduced.
If this action is not successful, it returns the error code. 



**GET /botbloq/v1/its/teachers**
-------------

Retrieve of all the teachers registered in the system. 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.

**Input**:

**Return**:  
This action returns a JSON data block containing the information for each teacher.



**POST /botbloq/v1/its/teachers**
-------------

The service creates a new teacher with  the provided values.

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - A teacher with the same email already exists.

**Input**: 

A survey.

**Return**:  

If successful, this action returns: "Added the teacher with id: " and the id of the new teacher.
If this action is not successful, it returns the error code. 



**PUT /botbloq/v1/its/teachers/:id**
-------------

Update the information of a teacher in  the database.

**Parameters**

- id: teacher ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The teacher is not activated.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the updated teacher information.
If this action is not successful, it returns the error code. 



**DELETE /botbloq/v1/its/teachers/:id**
-------------

Delete all the information about a teacher in the database

**Parameters**

- id: teacher ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  

Number of removed teachers (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 1
}



**DELETE /botbloq/v1/its/teachers**
-------------

Delete all teachers of the database

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.
**Input**: 

**Return**:  

Number of removed teachers (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 3
}