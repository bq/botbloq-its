Domain Model - Course Repository (basic management)
===================


(under construction)


---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						LOMS
---------------------------------------------------------------------------------------------------------------------

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/:section_id/lesson/:lesson_id**
---------------------------------------

- list all loms from the indicated lesson

**Parameters**: 
- course_id: name of the course to be listed
- section_id: name of the section of the course to be listed
- lesson_id: name of the lesson which contains the loms

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a list with the information for each one of the loms 
	contained into the lesson.
If this action is not successful, it returns the error code. 


---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/:section_id/lesson/:lesson_id/lom/:lom_id**
---------------------------------------

- list the indicated lom from the lesson

**Parameters**: 
- course_id: name of the course to be listed
- section_id: name of the section of the course to be listed
- lesson_id: name of the lesson which contains the loms
- lom_id: name of the lom to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns the information of lom
	contained into the lesson.
If this action is not successful, it returns the error code. 

---------------------------------------
**DELETE /botbloq/v1/its/courses/delete_lom**
---------------------------------------

- delete the indicated lom from the lesson

**Parameters**: 
It receives as the body of the request in JSON format the name of the course, 
section, lesson, and the lom to be deleted  
It verifies if the course, section, lesson, and lom exist.
If the course, section, or lesson does not exist, it sends an error message
If lom does not exist, it considers the lom deleted (i.e. not an error) 
Example: 
{
	"course":"Course1",
	"section":"Section2",
	"lesson":"Lesson1.2.3",
	"lom_id": "lom1.2.3.1"
}

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action deletes the lom contained into the lesson.
If this action is not successful, it returns the error code. 

---------------------------------------
**PUT /botbloq/v1/its/courses/create_lom**
---------------------------------------

- create the indicated lom into the lesson

**Parameters**: 
It receives as the body of the request in JSON format
the name of the course, section, and lesson where the new lom should be created  
and the lom_id to be created 
It verifies if the course, section, and lesson exist. 
If lom already exist, it sets an error
If lom doesn't exist previously, it creates the new lom
Example: 
{
	"course":"Course1",
	"section":"Section2",
	"lesson":"Lesson1.2.3",
	"lom_id": "lom1.2.3.1"
}

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action creates the indicated lom into the lesson.
If this action is not successful, it returns the error code. 

---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						LESSONS
---------------------------------------------------------------------------------------------------------------------

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/section_id**
---------------------------------------

- list all lessons from the indicated course section

**Parameters**: 
- course_id: name of the course to be listed
- section_id: name of the section of the course to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a list with the information for each one of the lessons 
	contained into the course section.
If this action is not successful, it returns the error code. 

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/section_id/lesson/lesson_id**
---------------------------------------

- lists the indicated lesson from a course section. 
	If some of them i.e. course, section or lesson doesn't exist, it sends an error message

**Parameters**: 
- course_id: name of the course to be listed
- section_id: name of the section of the course to be listed
- lesson_id: name of the lesson of the course section to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a list with the information of the lesson
	contained into the course section.
If this action is not successful, it returns the error code. 

---------------------------------------
**DELETE /botbloq/v1/its/courses/course/:course_id/section/:section_id/lesson/lesson_id**
---------------------------------------

- Delete the indicated lesson from a course section. 
	If lesson does not exist, it considers the section deleted (i.e. not an error)
	If the course or the section doesn't exist, it sends an error message

**Parameters**: 
- course_id: name of the course to be deleted
- section_id: name of the section to be deleted
- lesson_id: name of the lesson of the course section to be deleted

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
-the indicated lesson is removed from the repository 
	If lesson does not exist, it considers the section deleted (i.e. not an error)
	If the course or the section doesn't exist, it sends an error message

---------------------------------------
**PUT /botbloq/v1/its/courses/create_lesson**
---------------------------------------

- create a lesson in a section of a course. 
	It verifies if section and course exist. 
	If lesson already exist, it sets an error
	If lesson doesn't exist previously, it creates the new lesson

**Parameters**: Example (raw body of the request in JSON format)
{
	"course":"Course2",
	"section":"Section2.1",
	"lesson": {  
    		"name": "Lesson2.1.1",
       		"resume": "Lesson2.1.1 resume",
       		"los": [] 
	   }
}

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  
- the new section is included into the sections field of the course. 
	A message with the updated list of lessons is returned

---------------------------------------
**PUT /botbloq/v1/its/courses/update_lesson**
---------------------------------------

- Update a particular lesson of a course section

**Parameters**
It receives as the body of the request in JSON format
the name of the course and the section where the lesson should be updated and 
the name of the lesson to be updated and its information
It verifies if section and course exist. 
If lesson already exist, it updates the lesson
If lesson doesn't exist previously, it sets an error
Example: 
{
	"course":"Course1",
	"section":"Section2",
	"lesson":{  
    		"name": "Lesson1.2.3",
       		"resume": "Lesson1.2.3 resume",
       		"los": [] 
	  }
}

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:
The old value of the lesson is substituted by new value received

---------------------------------------
**PUT /botbloq/v1/its/courses/update_lesson_field**
---------------------------------------

- Update a particular field of a lesson in a course section

**Parameters**
It receives as the body of the request in JSON format
the names of the course, the section, the lesson and the field and 
the new value of the field 
Example: 
{ 
    "course": "Course1",
    "section": "Section1.1",
	"lesson": "Lesson1.1.1",
    "field":"resume",
    "value": "Lesson1.1.1 new resume"
  }

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:
The old value of the section is substituted by new value received

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
**PUT /botbloq/v1/its/courses/create_section**
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



