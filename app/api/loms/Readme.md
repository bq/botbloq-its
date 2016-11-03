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

**Return**:  


**DELETE /botbloq/v1/its/loms**
-------------

Delete all Learning Objects of the repository

**Parameters**: None

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  Number of removed LO (N) and the success of the operation (.ok)

{
si
” ok ” : 1 ,
”n ” : 3
}


**GET /botbloq/v1/its/loms/:id**
------------

Retrieve the metadata of a LO

**Parameters**

- id: LO ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**: 


**PUT /botbloq/v1/its/loms/:id**
-------------

Update the metadata of a LO in  the repository.

**Parameters**

- id: LO ID

**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  


**DELETE /botbloq/v1/its/loms/:id**
-------------

Delete all the metadata of a LO in the repository

**Parameters**

- id: LO ID


**Query Parameters**:

**Permissions**:

**Status Codes**:

**Input**: 

**Return**:  

