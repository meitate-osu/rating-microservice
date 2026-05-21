import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:4000";

export default function App() {
  const [itemId, setItemId] = useState("");
  const [rating, setRating] = useState(0);
  const [result, setResult] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const submitRating = async () => {
    if (!itemId || rating === 0) {
      setResult("Please enter item ID and select a rating.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/ratings/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      });

      const data = await res.json();

      if (!res.ok) {
        setResult(data.error || "Error submitting rating");
        return;
      }

      setResult(`Submitted: ${data.rating} ⭐ for ${itemId}`);

      setPopupMessage("Rating has been submitted! Submit another rating.");
      setShowPopup(true);

    } catch (err) {
      console.error(err);
      setResult("Server error while submitting rating.");
    }
  };

  const getAverage = async () => {
    if (!itemId) {
      setResult("Enter an item ID.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/ratings/${itemId}`);
      const data = await res.json();

      if (!res.ok) {
        setResult("No ratings found.");
        return;
      }

      setResult(
        `Average: ${data.averageRating} ⭐ (${data.totalRatings} ratings)`
      );

    } catch (err) {
      console.error(err);
      setResult("Server error while fetching average.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Rate Content</h2>

        <input
          placeholder="Item ID (e.g. img123)"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />

        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={n <= rating ? "star active" : "star"}
              onClick={() => setRating(n)}
            >
              ★
            </span>
          ))}
        </div>

        <button onClick={submitRating}>Submit Rating</button>
        <button onClick={getAverage}>View Average</button>

        <p>{result}</p>
      </div>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}