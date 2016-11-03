Learning Object Repository (basic metadata management)
===================


(under construction)

----------

**GET /botbloq/v1/its/loms**
-------------

Retrieve the metadata of all the Learning Object (LO) stored in the repository 

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**:

**Return**:  
If successful, this action returns a JSON data block containing the information for each LO metadata.
If this action is not successful, it returns the error code. 



**POST /botbloq/v1/its/loms**
-------------

The service creates a LO with  the provided metadata.

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 
A JSON lom object.

**Return**:  
If successful, this action returns: "Added the lom with id: " and the id of the new lom.
If this action is not successful, it returns the error code. 

**DELETE /botbloq/v1/its/loms**
-------------

Delete all Learning Objects of the repository

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  Number of removed LOM (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 3
}


**GET /botbloq/v1/its/loms/:id**
------------

Retrieve the metadata of a LOM

**Parameters**

- id: LOM ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**: 
If successful, this action returns the corresponding JSON object LOM with id introduced.
If this action is not successful, it returns the error code. 

**PUT /botbloq/v1/its/loms/:id**
-------------

Update the metadata of a LOM in  the repository.

**Parameters**

- id: LOM ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

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

**Input**: 

**Return**:  
Number of removed LOM (N) and the success of the operation (.ok)

{
” ok ” : 1 ,
”n ” : 1
}
