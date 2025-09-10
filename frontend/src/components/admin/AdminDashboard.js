import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users/dashboard-stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setStats(statsResponse.data.stats);
        setUsers(usersResponse.data.users);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="container mt-5 text-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title mb-4">Admin Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2 className="display-4">{stats?.users?.total || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Stores</h5>
              <h2 className="display-4">{stats?.stores?.total || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Ratings</h5>
              <h2 className="display-4">{stats?.ratings?.total || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h5 className="card-title">Average Rating</h5>
              <h2 className="display-4">{stats?.ratings?.average || 0}</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Distribution */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">User Distribution</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User Type</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Regular Users</td>
                      <td>{stats?.users?.regular || 0}</td>
                      <td>
                        {stats?.users?.total ? 
                          ((stats.users.regular / stats.users.total) * 100).toFixed(1) + '%' : 
                          '0%'}
                      </td>
                    </tr>
                    <tr>
                      <td>Store Owners</td>
                      <td>{stats?.users?.storeOwners || 0}</td>
                      <td>
                        {stats?.users?.total ? 
                          ((stats.users.storeOwners / stats.users.total) * 100).toFixed(1) + '%' : 
                          '0%'}
                      </td>
                    </tr>
                    <tr>
                      <td>Administrators</td>
                      <td>{stats?.users?.admins || 0}</td>
                      <td>
                        {stats?.users?.total ? 
                          ((stats.users.admins / stats.users.total) * 100).toFixed(1) + '%' : 
                          '0%'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Users */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Recent Users</h4>
              <Link to="/admin/users" className="btn btn-sm btn-light">View All</Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={
                            `badge ${
                              user.role === 'admin' ? 'bg-danger' : 
                              user.role === 'store_owner' ? 'bg-success' : 'bg-primary'
                            }`
                          }>
                            {user.role === 'store_owner' ? 'Store Owner' : 
                             user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Quick Actions</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/admin/users/create" className="btn btn-outline-primary w-100 p-3">
                    <i className="fas fa-user-plus mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                    Add New User
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/stores/create" className="btn btn-outline-success w-100 p-3">
                    <i className="fas fa-store-alt mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                    Add New Store
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/users" className="btn btn-outline-info w-100 p-3">
                    <i className="fas fa-users-cog mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                    Manage Users
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/admin/stores" className="btn btn-outline-warning w-100 p-3">
                    <i className="fas fa-store mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                    Manage Stores
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;