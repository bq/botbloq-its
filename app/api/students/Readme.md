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

**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the information for each student.
If this action is not successful, it returns the error code. 
**DELETE /botbloq/v1/its/students/:id**
-------------

Delete all the information about a student in the repository

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  

Number of removed students (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 1
}

