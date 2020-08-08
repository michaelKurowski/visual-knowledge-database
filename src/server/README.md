# About
Backend for visual knowledge database

# How to run
`npm install` and `npm start`

# Endpoints

## GET
### Endpoints
#### /ancestors

**Params**
 - `nodeId` - node id
 - `classificationId` - classification ID to search ancestors by

#### /descendants

**Params**
 - `nodeId` - node id
 - `classificationId` - classification ID to search descendants by

#### /tree-root

**Params**
 - `classificationId` - classification ID to search ancestors of the tree root by

### Schemas
#### Response schema
```
{
    nodes [...Node],
    message: "OK"/"ERROR"
}
```
#### Node object
```
{
    id: Number,
    name: String,
    description: String/Null,
    thumbnail: String/Null,
    sources: [...Source],
    children: [...NodeLink]
}
```

#### Source object
Source object represents sources where you can read more about the concept.
```
{
    url: String,
    thumbnail: String/Null,
    description: String/Null,
    type: "Wikipedia"/"YouTube"/"Stanford Encyclopedia"
}
```

#### NodeLink object
NodeLink object represents connection between two nodes
```
{
    nodeId: Number,
    classificationCode: String
}
```