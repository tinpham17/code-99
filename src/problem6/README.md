# Scoreboard API Module Specification

## Assumptions & Context

This module is designed to be integrated into an existing backend API service built with:

- Express.js – as the application server framework
- MongoDB – as the primary database (already in use)
- JWT-based authentication – already implemented for secure user authorization
- User management system – already handles user identities (userId, username, etc.)

## What's Being Added / Modified

This module expands the existing API server by introducing new functionality related to a real-time, secure scoreboard system.

### New Additions:

**1. New API Endpoints**

- `POST /api/scores/update` – securely update a user’s score
- `GET /api/scores/top` – retrieve the top N scores
- `POST /api/scores/token` - issues one-time use JWT action tokens (newly added)

**2. WebSocket Layer**

- Adds real-time updates for leaderboard changes using Socket.IO on `/ws/scores`

**3. Redis Integration**
- Uses Redis Sorted Sets to cache and sort top scores efficiently
- Implements TTL-based caching and cache-busting on score updates

**4. One-Time JWT Action Tokens**
- Introduces new secure mechanism to validate score updates using signed action tokens
- Ensures tokens are one-time-use, expire quickly, and are linked to a user and action

**5. Rate Limiting**
- Applies user/IP-based rate limits for score updates and WebSocket connections

### No Breaking Changes

This module is fully self-contained and integrates into the existing Express app via routing and middleware layers, while leveraging existing user and auth infrastructure.

It does not modify any core user management or authentication logic — only extends functionality through well-scoped and isolated additions.

## Overview

This module is responsible for managing user scores, updating leaderboards, and broadcasting real-time score changes to connected clients. It ensures that score updates are authorized and efficiently propagated across the system.

It is a self-contained, scalable backend service module within the backend application server, built using Express.js, Redis, MongoDB, and WebSockets (Socket.IO).

### Responsibilities

- Receive and process score update requests triggered by frontend user actions.
- Verify action tokens (JWT) for authenticity, validity, and one-time usage.
- Increment user scores and maintain persistent user records in MongoDB.
- Update and cache the top N leaderboard using Redis Sorted Sets.
- Broadcast real-time leaderboard updates to WebSocket-connected clients.
- Apply rate limiting to prevent abuse.

### Execution Flow

*Please see Execution-Flow.png*

## Specifications

### API Endpoints

#### 1. Issue One-Time Action Token
- REST API: `POST /api/scores/token`

- Description: Generates a short-lived, one-time-use JWT for a user to authorize a score update.

- Request:
```json
{
  "userId": "string",
  "actionType": "complete_match"
}
```

- Response:
```json
{
  "success": true,
  "actionToken": "JWT string"
}
```

- Behavior:
    - Requires valid authenticated session.
    - Creates a signed JWT with: userId, actionType, iat, exp, and a tokenId
    - Saves the token metadata to MongoDB (with used: false)

#### 1. Update Score  
- REST API: `POST /api/scores/update`

- Description: Increment a user's score after completing a verified action using the one-time action token.

- Request:
```json
{   
  "userId": "string",
  "scoreIncrement": number,
  "actionToken": "JWT string"
}
```

- Response:
```json
{
  "success": true,
  "userId": "string",
  "newScore": number
}
```

- Behavior:
    - Validates scoreIncrement > 0
    - Validates JWT
        - JWT can be decoded and is not expired yet
        - Matching userId and make sure the user exists and in valid state in database
        - One-time use status in database
        - (Optional) Rate-limited: check max 10 updates/min/user
    - Increments score in MongoDB.
    - Clears and updates the Redis leaderboard cache to reflect the score change.
    - Triggers a WebSocket broadcast if the top scores are affected.
    - Marks token as used: true

#### 2. Get Top Scores
- REST API: `GET /api/scores/top?limit=N`

- Description: Fetches top N users sorted by score (default 10).

- Response:
```json
{
  "success": true,
  "scores": [
    {
      "userId": "string",
      "username": "string",
      "score": number
    }
  ]
}
```

- Behavior:
    - Reads scores from Redis Sorted Set
    - If cache is missing (e.g. TTL expired), rebuilds from MongoDB and repopulates Redis
    - Caching logic:
        - Redis TTL: 30–60 seconds (configurable)
        - Cache is proactively invalidated and updated during score writes

#### 3. Real-Time WebSocket
- `WebSocket /ws/scores`

- Description: Subscribe to real-time scoreboard updates.

- Client Example:
```typescript
const ws = new WebSocket('ws://localhost:3000/ws/scores');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'scoreboard_update') {
    updateScoreboard(data.scores);
  }
};
```

- Message Format:
```json
{
  "type": "scoreboard_update",
  "scores": [
    { "userId": "string", "score": number },
  ]
}
```

### Error Handling

| Scenario                | Response Code | Message                     |
| ----------------------- | ------------- | --------------------------- |
| Invalid/expired token   | `401`         | `Invalid or expired token.` |
| Token already used      | `403`         | `Token already used.`       |
| Invalid input           | `400`         | `Invalid score increment.`  |
| Rate limit exceeded     | `429`         | `Too many requests.`        |
| Server/database failure | `500`         | `Internal server error.`    |


### One-time use tokens

- JWT decoded with userId, actionType, iat, exp
- Stored in DB with used: true/false status
- Passes as `actionToken` in the request body

### Data Models

**User**

Modify this collection and add score column:

```json
{
  ...
  "score": number
}
```

**ActionToken**

Store one-time use tokens.

```json
{
  "_id": "ObjectId",
  "token": "string",
  "userId": "string",
  "used": boolean,
  "expiresAt": "string"
}
```

### Performance Targets

| Operation             | Target  |
| --------------------- | ------- |
| Score update          | < 200ms |
| Leaderboard retrieval | < 100ms |
| WebSocket broadcast   | < 50ms  |
| Concurrent users      | 1000+   |


### Future Enhancements

- The increased score should be mapped with user verified actions and determined properly
- The update score API should be called internally as a callback at the BE side for when a verified action completes
- Add unit testing
