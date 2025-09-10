import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI, ratingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StoreDetail = () => {
  const { storeId } = useParams();
  const { currentUser } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStoreDetails();
  }, [storeId]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getStoreById(storeId);
      setStore(response.data.store);
      
      // If user is logged in, check if they have already rated this store
      if (currentUser && response.data.store.Ratings) {
        const userRating = response.data.store.Ratings.find(
          rating => rating.userId === currentUser.id
        );
        if (userRating) {
          setUserRating(userRating.rating);
          setComment(userRating.comment || '');
        }
      }
    } catch (err) {
      console.error('Error fetching store details:', err);
      setError('Failed to load store details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to submit a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      await ratingAPI.submitRating({
        storeId: parseInt(storeId),
        rating: userRating,
        comment
      });
      
      // Refresh store details to show updated ratings
      fetchStoreDetails();
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderRatingStars = (value, interactive = false) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            className={`star ${value >= star ? 'selected' : ''}`}
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              color: value >= star ? '#FFD700' : '#e4e5e9',
              fontSize: '1.5rem',
              marginRight: '5px'
            }}
          >
            <i className="fas fa-star"></i>
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading store details...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  if (!store) {
    return <div className="container mt-5 alert alert-warning">Store not found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{store.name}</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <p><strong><i className="fas fa-map-marker-alt me-2"></i>Address:</strong> {store.address}</p>
              <p><strong><i className="fas fa-envelope me-2"></i>Email:</strong> {store.email}</p>
              <div className="mb-3">
                <strong><i className="fas fa-star me-2"></i>Average Rating:</strong> 
                <span className="ms-2 badge bg-warning text-dark">
                  {store.averageRating ? store.averageRating.toFixed(1) : 'N/A'}
                </span>
                <span className="ms-2 text-muted">({store.totalRatings || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form */}
      {currentUser && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0"><i className="fas fa-star me-2"></i>Rate This Store</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitRating}>
              <div className="mb-3">
                <label className="form-label">Your Rating</label>
                <div>
                  {renderRatingStars(userRating, true)}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">Your Review (Optional)</label>
                <textarea
                  className="form-control"
                  id="comment"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this store"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting || userRating === 0}
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="card">
        <div className="card-header bg-light">
          <h4 className="mb-0"><i className="fas fa-comments me-2"></i>Customer Reviews</h4>
        </div>
        <div className="card-body">
          {store.Ratings && store.Ratings.length > 0 ? (
            <div className="reviews-list">
              {store.Ratings.map(rating => (
                <div key={rating.id} className="review-item border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{rating.User ? rating.User.name : 'Anonymous'}</strong>
                      <span className="text-muted ms-3">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      {renderRatingStars(rating.rating)}
                    </div>
                  </div>
                  {rating.comment && <p className="mb-0">{rating.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;