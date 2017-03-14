Domain Model - Course database (basic management)
===================


(under construction)


---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						LOMS
---------------------------------------------------------------------------------------------------------------------

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

200 OK - Action successfully attempted.
404 Not Found - course, section, lesson or LOM not found.

**Input**:

**Return**:  
If successful, this action returns the information of lom
	contained into the lesson.
If this action is not successful, it returns the error code. 

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/:section_id/lesson/:lesson_id/loms**
---------------------------------------

- list all loms from the indicated lesson

**Parameters**: 
- course_id: id of the course to be listed
- section_id: name of the section of the course to be listed
- lesson_id: name of the lesson which contains the loms

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course, section, lesson not found.

**Input**:

**Return**:  
If successful, this action returns a list with the information for each one of the loms 
	contained into the lesson.
If this action is not successful, it returns the error code. 


---------------------------------------
**POST /botbloq/v1/its/courses/:idc/section/:ids/lesson/:idle/lom/:idlo**
---------------------------------------

- assign the indicated LOM into the lesson.

**Parameters**: 

- idc: id of the course to be assigned the LOM.
- ids: name of the section to be assigned the LOM.
- idle: name of the lesson to be assigned the LOM.
- idlo: id of the LOM to be assigned.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course, section, lesson or LOM not found.
400 Bad Request - The LOM already assigned in the lesson.

**Input**:

**Return**:  
If successful, this action assign the indicated LOM into the lesson.
If this action is not successful, it returns the error code. 

---------------------------------------
**DELETE /botbloq/v1/its/courses/:idc/section/:ids/lesson/:idle/lom/:idlo**
---------------------------------------

- delete the indicated LOM from the lesson.

**Parameters**: 

- idc: id of the course to be deleted the LOM.
- ids: name of the section to be deleted the LOM.
- idle: name of the lesson to be deleted the LOM.
- idlo: id of the LOM to be deleted.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course, section, lesson or LOM not found.
400 Bad Request - The request contains bad syntax.

**Input**:

**Return**:  
If successful, this action deletes the LOM contained into the lesson.
If this action is not successful, it returns the error code. 


---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						LESSONS
---------------------------------------------------------------------------------------------------------------------

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

200 OK - Action successfully attempted.
404 Not Found - course or section not found.

**Input**:

**Return**:  
If successful, this action returns a list with the information of the lesson
	contained into the course section.
If this action is not successful, it returns the error code. 

---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/section/section_id/lessons**
---------------------------------------

- list all lessons from the indicated course section

**Parameters**: 
- course_id: name of the course to be listed
- section_id: name of the section of the course to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course or section not found.

**Input**:

**Return**:  
If successful, this action returns a list with the information for each one of the lessons 
	contained into the course section.
If this action is not successful, it returns the error code. 


---------------------------------------
**POST /botbloq/v1/its/courses/:idc/section/:ids**
---------------------------------------

- create a lesson in a section of a course. 
	It verifies if section and course exist. 
	If lesson already exist, it sets an error
	If lesson doesn't exist previously, it creates the new lesson

**Parameters**: 

- idc: id of the course to be created the lesson.
- ids: name of the section to be created the lesson.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course or section not found.
400 Bad Request - lesson already exist in the section.

**Input**: 

{
	name : 'Lesson_Name',
	summary: 'Lesson_Summary',
	loms: [],
	objectives: []
}

**Return**:  
- the new lesson is included into the sections field of the course. 
	A message with the updated list of lessons is returned


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

200 OK - Action successfully attempted.
404 Not Found - course or section not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

**Return**:  
-the indicated lesson is removed from the database 
	If lesson does not exist, it considers the section deleted (i.e. not an error)
	If the course or the section doesn't exist, it sends an error message


---------------------------------------
**PUT /botbloq/v1/its/courses/:idc/section/:ids/lesson/:idl**
---------------------------------------

- Update a particular lesson of a course section.

**Parameters**

- idc: id of the course to be updated the lesson.
- ids: name of the section to be updated the lesson.
- idl: name of lesson to be updated.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course or section not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

{
	name : 'Updated_Lesson_Name',
	summary: 'Updated_Lesson_Summary',
	loms: [],
	objectives: []
}

**Return**:
If its successful, the old value of the lesson is substituted by new value received.
If this action is not successful, it returns the error code.

---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						SECTIONS
---------------------------------------------------------------------------------------------------------------------


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

200 OK - Action successfully attempted.
404 Not Found - course or section not found.
400 Bad Request - The request contains bad syntax.

**Input**:

**Return**:  
If successful, this action returns the information of the course section.
If this action is not successful, it returns the error code. 


---------------------------------------
**GET /botbloq/v1/its/courses/course/:course_id/sections**
---------------------------------------

- list all sections from the indicated course 

**Parameters**: 
- course_id: name of the course to be listed

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course not found.
400 Bad Request - The request contains bad syntax.

**Input**:

**Return**:  
If successful, this action returns a list with the information for each one of the course sections.
If this action is not successful, it returns the error code. 


---------------------------------------
**POST /botbloq/v1/its/courses/:id**
---------------------------------------

- create a section of a course. 
	It verifies if the section already exist, in which case, it sets an error
	If section doesn't exist previously, it creates the new section

**Parameters**: 

- id: id of the course to be assigned the section.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

{
	name : 'Section_Name',
	summary: 'Section_Summary',
	lessons: []
}

**Return**:  
- the new section is included into the sections field of the course.


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

200 OK - Action successfully attempted.
404 Not Found - course or section not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

**Return**:  
-the indicated section is removed from the course.


---------------------------------------
**PUT /botbloq/v1/its/courses/:idc/section/:ids**
---------------------------------------

- Update a particular section of a course.

**Parameters**

- idc: id of the course to be updated the section.
- ids: name of the section to be updated.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course or section not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

{
	name : 'Section_Name',
	summary: 'Section_Summary',
	lessons: []
}

**Return**:
The old value of the section is substituted by new value received.


---------------------------------------------------------------------------------------------------------------------
>>>>>>>>>>>>						COURSES
---------------------------------------------------------------------------------------------------------------------

---------------------------------------
**GET /botbloq/v1/its/courses/:id**
---------------------------------------

Retrieve the basic information of a course.

**Parameters**

- id: Course id

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

**Return**: 
If successful, this action returns a JSON data block containing the course information.
If this action is not successful, it returns the error code. 

---------------------------------------
**GET /botbloq/v1/its/courses/**
---------------------------------------

Retrieve of all the courses registered in the system. 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course not found.
400 Bad Request - The request contains bad syntax.

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for each course.
If this action is not successful, it returns the error code. 


---------------------------------------
**POST /botbloq/v1/its/courses**
---------------------------------------

The service creates a new course with  the provided values.

**Parameters**: None

**Query Parameters**:


**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
403 Forbidden - course with same name already exist.
400 Bad Request - The request contains bad syntax.

**Input**: 

{
	name : 'nameCourse',
	code : 'codeCourse',
	statistics: {
		std_enrolled : [],
		std_finished : [],
		std_unenrolled : []
	},
	summary : 'Default course',
	sections: []
}

**Return**:  
- the new course is included into the courses collection

---------------------------------------
**PUT /botbloq/v1/its/courses/:id**
---------------------------------------

Update the whole information of a course in  the database.

**Parameters**

- id: id of the course to be updated

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
403 Forbidden - course with same name already exist.
400 Bad Request - The request contains bad syntax.

**Input**: 

{
	name : 'UpdatedNameCourse',
	code : 'UpdatedCodeCourse',
	statistics: {
		std_enrolled : [],
		std_finished : [],
		std_unenrolled : []
	},
	summary : 'Default course',
	sections: []
}

**Return**:  
The whole description of the course is substituted by the new one


---------------------------------------
**DELETE /botbloq/v1/its/courses/:id**
---------------------------------------

Delete the course indicated by the Id from the database

**Parameters**: 
- id: id of the course to be deleted

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - course not found.
400 Bad Request - The request contains bad syntax.

**Input**: 

**Return**:  

Number of removed courses (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 3
}

---------------------------------------
**DELETE /botbloq/v1/its/courses**
---------------------------------------

Delete all courses from the database.

**Parameters**: 

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.

**Input**: 

**Return**:  
Number of removed courses (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 3
}






