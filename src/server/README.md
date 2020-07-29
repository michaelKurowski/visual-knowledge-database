# About
Backend for visual knowledge database

# How to run
`npm install` and `npm start`

# Endpoints

## GET
`/ancestors`
**Params**
 - `id` - node id
 - `classification` - classification ID to search ancestors by

`/descendants`
 - `id` - node id
 - `classification` - classification ID to search descendants by

`/tree-root`
 - `classification` - classification ID to search ancestors of the tree root by