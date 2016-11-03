Domain Model - Course Repository (basic management)
===================


(under construction)

----------

**GET /botbloq/v1/its/courses**
-------------

Retrieve of all the courses registered in the system. 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for each course.
If this action is not successful, it returns the error code. 



**POST /botbloq/v1/its/courses**
-------------

The service creates a new course with  the provided values.

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  


**DELETE /botbloq/v1/its/courses**
-------------

Delete all courses of the repository

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  Number of removed courses (N) and the success of the operation (.ok)

{
si
” ok ” : 1 ,
”n ” : 3
}


**GET /botbloq/v1/its/courses/:id**
------------

Retrieve the basic information of a course

**Parameters**

- id: Course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**: 


**PUT /botbloq/v1/its/courses/:id**
-------------

Update the information of a course in  the repository.

**Parameters**

- id: Course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  

**DELETE /botbloq/v1/its/courses/:id**
-------------

Delete all the information about a course in the repository

**Parameters**

- id: Course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  


