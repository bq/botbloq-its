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

**GET /botbloq/v1/its/courses/:name**
------------

Retrieve the basic information of a course

**Parameters**

- id: Course name

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**: 
- the course information


**POST /botbloq/v1/its/courses**
-------------

The service creates a new course with  the provided values.

**Parameters**: None

**Query Parameters**:
Using Postman, a JSON object with the new course information
should be submitted by the raw body

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
- the new course is included into the courses collection


**DELETE /botbloq/v1/its/courses/:id**
-------------

Delete the course indicated by the Id from the repository

**Parameters**: 
- id: of the course to be deleted

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
-the indicated course is removed from the repository

**PUT /botbloq/v1/its/courses/update**
-------------

Update just one field  of a course in  the repository.

**Parameters**
Using Postman, a JSON object should be submitted 
by the raw body with the following format:
name: the name of the course to be updated
field: the name of the field to be updated
value: the new content of that field
Example: 
{ 
    "name": "Course2",
    "field":"content",
    "value": "content2.2"
  }

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:
The old value of the field is substituted by new value received


**PUT /botbloq/v1/its/courses/:id**
-------------

Update the whole information of a course in  the repository.

**Parameters**

- id: ID of the course to be updated
Using Postman, a JSON object with the new course information
should be submitted by the raw body

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
The whole description of the course is substituted by the new one

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
The course is deleted from the collection 


