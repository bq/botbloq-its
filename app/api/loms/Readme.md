Learning Object Repository (basic metadata management)
===================

(under construction)

----------

**GET /botbloq/v1/its/loms/:id/download/:file**
-------------

Download the file with the specified name linked to the id lom.

**Parameters**: 

- id: LOM ID. 
- file: file to download.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**:

**Return**:  

If successful, this action returns a file specified.
If this action is not successful, it returns the error code. 



**GET /botbloq/v1/its/loms/:id**
------------

Retrieve the information of a LOM.

**Parameters**

- id: LOM ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**: 

**Return**: 

If successful, this action returns the corresponding JSON with the information of a LOM.
If this action is not successful, it returns the error code. 



**GET /botbloq/v1/its/loms**
-------------

Retrieve the information of all the Learning Object (LO) stored in the repository 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.

**Input**:

**Return**:  

If successful, this action returns a JSON data block containing the information for each LOM.
If this action is not successful, it returns the error code. 



**POST /botbloq/v1/its/loms/:id/includePhoto**
-------------

The service uploads the selected photo and links it to the lom of the indicated id.

**Parameters**: 

id: LOM ID.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**: 

A photo specidied.

**Return**:  

If successful, this action returns: Photo: <filename.ext> uploaded successfully in the lom with id: <LOM ID>.
If this action is not successful, it returns the error code.



**POST /botbloq/v1/its/loms/:id/upload**
-------------

The service uploads the selected file and links it to the lom of the indicated id.

**Parameters**: 

id: LOM ID.

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**: 

A file specidied.

**Return**:  

If successful, this action returns: File: <filename.ext> uploaded successfully in the lom with id: <LOM ID>.
If this action is not successful, it returns the error code.



**POST /botbloq/v1/its/loms**
-------------

The service creates a LO with  the provided metadata.

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.

**Input**: 

A JSON lom object.

**Return**:  

If successful, this action returns: "Added the lom with id: " and the id of the new lom.
If this action is not successful, it returns the error code.



**PUT /botbloq/v1/its/loms/:id**
-------------

Update the metadata of a LOM in  the repository.

**Parameters**

- id: LOM ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**: 

**Return**:  

If successful, this action returns a JSON data block containing the information for each LOM.
If this action is not successful, it returns the error code. 



**DELETE /botbloq/v1/its/loms/:id**
-------------

Delete all the metadata of a LO in the repository

**Parameters**

- id: LOM ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**: 

**Return**:  

Number of removed LOM (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 1
}

 

**DELETE /botbloq/v1/its/loms**
-------------

Delete all Learning Objects of the repository

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

200 OK - Action successfully attempted.
400 Bad Request - The request contains bad syntax.
404 Not Found - Resource not found.

**Input**: 

**Return**:  

Number of removed LOM (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 3
}