import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StoreOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const storesResponse = await storeAPI.getOwnerStores();
      setStores(storesResponse.data.stores || []);
      
      // Collect all ratings from all stores
      const allRatings = [];
      if (storesResponse.data.stores) {
        storesResponse.data.stores.forEach(store => {
          if (store.Ratings) {
            allRatings.push(...store.Ratings);
          }
        });
      }
      
      // Sort ratings by date (newest first)
      allRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRatings(allRatings);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching owner data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (store) => {
    if (!store.Ratings || store.Ratings.length === 0) return 'N/A';
    
    const sum = store.Ratings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / store.Ratings.length).toFixed(1);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title mb-4">Store Owner Dashboard</h2>
      
      {stores.length === 0 ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          You don't have any stores yet. Please contact an administrator to create a store for you.
        </div>
      ) : (
        <div className="row">
          {/* Store Summary Cards */}
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Your Stores</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {stores.map(store => (
                    <div key={store.id} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">{store.name}</h5>
                        </div>
                        <div className="card-body">
                          <p><strong>Email:</strong> {store.email}</p>
                          <p><strong>Address:</strong> {store.address}</p>
                          <p>
                            <strong>Average Rating:</strong> 
                            <span className="ms-2 badge bg-warning text-dark">
                              {calculateAverageRating(store)}
                            </span>
                            <span className="ms-2 text-muted">
                              ({store.Ratings ? store.Ratings.length : 0} reviews)
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Ratings */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Recent Ratings</h4>
              </div>
              <div className="card-body">
                {ratings.length === 0 ? (
                  <p className="text-center text-muted">No ratings yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Store</th>
                          <th>Rating</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratings.map(rating => {
                          // Find which store this rating belongs to
                          const store = stores.find(s => 
                            s.Ratings && s.Ratings.some(r => r.id === rating.id)
                          );
                          
                          return (
                            <tr key={rating.id}>
                              <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                              <td>{store ? store.name : 'Unknown'}</td>
                              <td>
                                <div className="rating-display">
                                  {[...Array(5)].map((_, i) => (
                                    <i 
                                      key={i} 
                                      className={`fas fa-star ${i < rating.rating ? 'text-warning' : 'text-muted'}`}
                                    ></i>
                                  ))}
                                </div>
                              </td>
                              <td>{rating.comment || <em className="text-muted">No comment</em>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;