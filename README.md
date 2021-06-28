# Minesweeper Server

Minesweeper RESTful API Server

# Try it!

Server will start listening on port `3000`.

```
$ docker build -t ksugimori/minesweeper-server .
$ cd docker
$ docker compose up
```

# API

## **New game**

```
POST /api/games
```

### Request

```
{
  "width": 9,
  "height": 9,
  "numMines": 10
}
```

### Response

```
{
  "id": 99,
  "width": 9,
  "height": 9,
  "numMines": 10,
  "status": "INIT",
  "startTime": null,
  "endTime": null,
  "cells": [
    {
      "x": 0,
      "y": 0,
      "count": 0,
      "isMine": false,
      "isFlag": false,
      "isOpen": false
    },
    ...
  ]
}
```

***

## **Open a cell**

```
POST /api/games/{gameId}/open-cells
```

### Request

```
{
  "x": 0,
  "y": 0,
  "count": 0 // not required
}
```

### Response

```
[
  {
    "x": 0,
    "y": 0,
    "count": 0 // the number of mines arround this cell
  },
  {
    "x": 1,
    "y": 0,
    "count": 2
  },
  {
    "x": 0,
    "y": 1,
    "count": 1
  },
  {
    "x": 1,
    "y": 1,
    "count": 3
  }
]
```

***

## **Flag a cell**

```
POST /api/games/{gameId}/flags
```

### Request

```
{
  "x": 2,
  "y": 0
}
```

### Response

```
{
  "x": 2,
  "y": 0
}
```

***

## **Unflag a cell**

```
DELETE /api/games/{gameId}/flags/{flagId}
```

### Request

```
```

### Response

```
```

### Example

To unflag the cell at (2, 9).

```
DELETE /api/games/99/flags/x2y9
```

***

## **Check the status**

```
GET /api/games/{gameId}/status
```

### Request

```
```

### Response

```
{
  "status": "PLAY", // INIT, PLAY, WIN or LOSE
  "startTime": "2021-06-28T11:58:02.000Z",
  "endTime": null
}
```

***