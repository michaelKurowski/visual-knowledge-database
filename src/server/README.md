# About
Backend for visual knowledge database

# How to run
`npm install` and `npm start`

# Endpoints

## GET
`/ancestors`

**Params**
 - `nodeId` - node id
 - `classificationId` - classification ID to search ancestors by

`/descendants`

**Params**
 - `nodeId` - node id
 - `classificationId` - classification ID to search descendants by

`/tree-root`

**Params**
 - `classificationId` - classification ID to search ancestors of the tree root by