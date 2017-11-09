Student Model (basic management)
===================


(under construction)

----------


**GET /botbloq/v1/its/students/:idstd/course/:idc/section/:ids/lesson/:idl**
-------------

Returns the lesson assigned to id selected.

**Parameters**: 

- idstd: student ID
- idc: course ID
- ids: section ID
- idl: lesson ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for the lesson selected.
If this action is not successful, it returns the error code. 

----------


**GET /botbloq/v1/its/students/:idstd/course/:idc/isEnrolled**
-------------

Returns true or false if the student is or is not enrolled in the course.

**Parameters**: 

- idstd: student ID
- idc: course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.

**Input**:

**Return**:  
If successful, this action returns true or false if the student is or is not enrolled in the course 
If this action is not successful, it returns the error code. 

----------

**GET /botbloq/v1/its/students/:idstd/course/:idc**
-------------

Returns a new activity for the enrolled course.

**Parameters**: 

- idstd: student ID
- idc: course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for the new activity.
If this action is not successful, it returns the error code. 



**GET /botbloq/v1/its/students/:id/:data**
------------

Returns a list with finished courses, unfinished courses, active courses, last included courses
or related courses of a student according to the variable data inserted in the request.

**Parameters**

- id: Student ID

- data: 4 options:
	- courses-done : retrieve a list with finished courses
	- courses-not-done : retrieve a list with unfinished courses
	- active-courses : retrieve a list with active courses
	- last-included : retrieve a list with last included courses
	- related-courses : retrieve a list with related courses
	- all : retrieve all lists

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.
**Input**: 

**Return**: 
If successful, this action returns the corresponding list selected.
If this action is not successful, it returns the error code. 



**GET /botbloq/v1/its/students/:id/knowledge**
------------

Retrieve the knowledge level of a student

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
If successful, this action returns the corresponding knowledge level of a student with id introduced.
If this action is not successful, it returns the error code. 



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



**GET /botbloq/v1/its/students**
-------------

Retrieve of all the students registered in the system. 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.

**Input**:

**Return**:  
This action returns a JSON data block containing the information for each student.



**POST /botbloq/v1/its/students/:id/init**
-------------

The service includes learning style in a student.

**Parameters**: 

- id: student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.

**Input**: 

A JSON with survey answers.

**Return**:  

If successful, this action returns the information of  student with the learning style updated.
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
403 Forbidden - A student with the same email already exists.

**Input**: 

A survey.

**Return**:  

If successful, this action returns: "Added the student with id: " and the id of the new student.
If this action is not successful, it returns the error code. 



**LOCK /botbloq/v1/its/students/:idstc/course/:idc **
-------------

unenrollments a student in a course (logic deleted).

**Parameters**

- idstd: Student ID
- idc: course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the information for each course.
If this action is not successful, it returns the error code. 



**LOCK /botbloq/v1/its/students/:id **
-------------

Deactivate the information of a student in  the database (logic deleted).

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
404 Not Found - Resource not found.

**Input**: 

**Return**:  

If successful, this action returns a JSON data block containing the student information.
If this action is not successful, it returns the error code. 

**UNLOCK /botbloq/v1/its/students/:id**
-------------

Activate the information of a student in  the database.

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



**PUT /botbloq/v1/its/students/:idstd/course/:idc/lom/:idl/:status **
-------------

Finalize an activity and send the solution to correct it. Also pauses activity.

**Parameters**

- idstd: Student ID
- idc: Course ID
- idl: Lom ID
- status: finalize or idle

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.

**Input**: 

**Return**:  
If successful, returns a message to verify he action.
If this action is not successful, it returns the error code. 



**PUT /botbloq/v1/its/students/:idstd/course/:idc**
-------------

Enrollments a student in a course.

**Parameters**

- idstd: Student ID
- idc: Course ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.

**Input**: 

**Return**:  

If successful, Returns the lom assigned to the student if it exists.
If there are no loms, return the student's information.
If this action is not successful, it returns the error code. 



**PUT /botbloq/v1/its/students/:id/group**
-------------

Assigns the student to a group of students according to his results.

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the information for each student.
If this action is not successful, it returns the error code. 



**PUT /botbloq/v1/its/students/:id**
-------------

Update the information of a student in  the database.

**Parameters**

- id: Student ID

**Query Parameters**:

**Permissions**:

**Status Codes**:
200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
403 Forbidden - The student is not activated.
404 Not Found - Resource not found.
**Input**: 

**Return**:  
If successful, this action returns a JSON data block containing the updated student information.
If this action is not successful, it returns the error code. 



**DELETE /botbloq/v1/its/students/:id**
-------------

Delete all the information about a student in the database

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



**DELETE /botbloq/v1/its/students**
-------------

Delete all students of the database

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