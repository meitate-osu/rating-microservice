# Rating Microservice

This project is a simple **ratings microservice** that allows applications to:

* Submit a rating (1–5) for any item (image, song, quiz, reading, etc.)
* Retrieve the average rating for that item
* Store ratings persistently in a JSON file (ratings.json)


---

# Backend Architecture

## server.js (Main Server)

The server initializes Express and attaches the ratings microservice:

```js
app.use("/api/ratings", ratingsRoutes);
```

#### What this means:

| Request                | Handled by        |
| ---------------------- | ----------------- |
| `/api/ratings/:itemId` | ratings.js router |

So the server itself does NOT contain rating logic — it delegates everything.



## routes/ratings.js (Microservice Logic)

This file is a **Router module**, not a full server.

It uses:

```js
const router = express.Router();
```

### Responsibilities:

#### POST rating

```http
POST /api/ratings/:itemId
Body: { rating: 1-5 }
```

* Adds a rating to an item
* Creates item if it doesn’t exist
* Saves to `ratings.json`


#### GET average rating

```http
GET /api/ratings/:itemId
```

Returns:

```json
{
  "itemId": "img123",
  "averageRating": 4.2,
  "totalRatings": 5
}
```

### Data Storage

Ratings are stored in:

```
ratings.json
```

Example structure:

```json
{
  "img123": {
    "ratings": [5, 4, 3]
  },
  "song42": {
    "ratings": [5, 5]
  }
}
```
Manually clear the contents of `ratings.json` to remove ratings (but make sure the contents of `ratings.json` at least has `{ }`).

---

# Example Backend Test Script (`exampleRequests.js`)

This script simulates how another service or developer would use the API.

## What it does:

* Sends multiple ratings
* Fetches average rating
* Logs results to console

### Example:

```js
await submitRating("img123", 5);
await submitRating("img123", 4);
await submitRating("img123", 3);

await getAverage("img123");
```

### Output:

```text
POST Response: { message: "Rating submitted successfully", rating: 5 }
GET Average Response: { averageRating: 4, totalRatings: 3 }
```

---

# Frontend Example (React App)

The React app demonstrates how to integrate the microservice into a real UI.

## Features:

* Enter item ID
* Click star rating (1–5)
* Submit rating to API
* View average rating
* Popup confirmation modal


## Key API Calls in React
### Submit rating:

```js
fetch(`${API_URL}/api/ratings/${itemId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ rating })
});
```

### Get average rating:

```js
fetch(`${API_URL}/api/ratings/${itemId}`);
```

### Note:
This REACT app example has an input section for the itemId, in your own app you should pass an existing itemId or generate one specifically for your object.

---

# How to Integrate into Your Own Project
## Server
If you have an exisitng express server in on own project copy the ratings.js file into your own routes folder and use the `server.js` from this repo as an example on how to mount `rating.js` onto your own project's server. Otherwise...

Copy the `backend` folder into your own project, `cd backend/` and run `npm install` and `npm run` to run the server.

Server runs on:

```
http://127.0.0.1:4000
```
Change `PORT=4000` in `server.js` if you are already using port 4000 elsewhere.

## Making Calls to the Server

Use the REACT `App.jsx` from the folder `frontendExample` as a basis on how to create a UI that integrates this microservice with the server. 

Reference `exampleRequests.js` for how to call GET and POST using fetch() for this microservice.


## Important Design Rule

When integrating into your own system:

> You MUST pass a consistent item ID for each unique object.

### ✔ Good:

* `"img123"`
* `"song_abc"`
* `"quiz_01"`

### ❌ Bad:

* random IDs every request
* missing or empty IDs

Because the microservice groups ratings by `itemId`.

### Integration ID Examples

#### 🎬 Movies app

```text
movieId = "inception_2010"
```

#### 🖼 Images app

```text
imageId = "img_8921"
```

#### 🎵 Music app

```text
songId = "track_beatles_01"
```

#### 📚 Quiz app

```text
quizId = "math_quiz_3"
```



