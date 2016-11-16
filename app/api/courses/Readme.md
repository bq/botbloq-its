Domain Model - Course Repository (basic management)
===================


(under construction)

---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						SECTIONS
---------------------------------------------------------------------------------------------------------------------

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id**
---------------------------------------

- list all sections from the indicated course 

**Parameters**: 
- course_id: name of the course to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a list with the information for each one of the course sections.
If this action is not successful, it returns the error code. 

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/:section_id**
---------------------------------------

- list the information of the indicated section

**Parameters**: 
- course_id: name of the course to be listed
- section_id: name of the section to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns the information of the course section.
If this action is not successful, it returns the error code. 

---------------------------------------
**DELETE /botbloq/v1/its/courses/course/:course_id/section/:section_id**
---------------------------------------

- Delete the section indicated for the course received as parameter
	If either the course or the section does not exist, it considers it removed anyway

**Parameters**: 
- course_id: name of the course to be deleted
- section_id: name of the section to be deleted

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
-the indicated course is removed from the repository

---------------------------------------
**POST /botbloq/v1/its/courses/create_section**
---------------------------------------

- create a section of a course. 
	It verifies if the section already exist, in which case, it sets an error
	If section doesn't exist previously, it creates the new section

**Parameters**: Example (raw body of the request in JSON format)
{
	"course":"Course1",
	"section":{  
    		"name": "Section1.3",
       		"resume": "Section1.3 resume",
       		"lessons": [] 
	  }
}

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
- the new section is included into the sections field of the course

---------------------------------------
**PUT /botbloq/v1/its/courses/update_section**
---------------------------------------

- Update a particular section of a course

**Parameters**
It receives as the body of the request in JSON format
the name of the course where the section should be created and 
the section name to be created and the new information about the section 
If the section already exist, it updates the section
If section doesn't exist previously, it sets an error
Example: 
{
	"course":"Course1",
	"section":{  
    		"name": "Section1.3",
       		"resume": "Section1.3 resume",
       		"lessons": [] 
	  }
}

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:
The old value of the section is substituted by new value received

---------------------------------------
**PUT /botbloq/v1/its/courses/update_section_field**
---------------------------------------

- Update a particular field of a section of a course

**Parameters**
It receives as the body of the request in JSON format
the names of the course, the section and the field and 
the new value of the field 
Example: 
{ 
    "course": "Course1",
    "section": "Section1.1",
    "field":"resume",
    "value": "Section1.1 new resume"
  }

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:
The old value of the section field is substituted by new value received

---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						COURSES
---------------------------------------------------------------------------------------------------------------------

---------------------------------------
**GET /botbloq/v1/its/courses/**
---------------------------------------

Retrieve of all the courses registered in the system. 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for each course.
If this action is not successful, it returns the error code. 

---------------------------------------
**GET /botbloq/v1/its/courses/:id**
---------------------------------------

Retrieve the basic information of a course

**Parameters**

- id: Course name

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**: 
If successful, this action returns a JSON data block containing the course information.
If this action is not successful, it returns the error code. 

---------------------------------------
**POST /botbloq/v1/its/courses**
---------------------------------------

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

---------------------------------------
**DELETE /botbloq/v1/its/courses/:id**
---------------------------------------

Delete the course indicated by the Id from the repository

**Parameters**: 
- id: name of the course to be deleted

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
-the indicated course is removed from the repository

---------------------------------------
**PUT /botbloq/v1/its/courses/update_field**
---------------------------------------

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

---------------------------------------
**PUT /botbloq/v1/its/courses/:id**
---------------------------------------

Update the whole information of a course in  the repository.

**Parameters**

- id: name of the course to be updated
Using Postman, a JSON object with the new course information
should be submitted by the raw body

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
The whole description of the course is substituted by the new one



