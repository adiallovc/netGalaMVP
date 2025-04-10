import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { followUser, unfollowUser } from '../services/api';

function ProfileSection({ profile, isCurrentUser, isFollowing, onFollowChange }) {
  const [followLoading, setFollowLoading] = useState(false);
  const [followState, setFollowState] = useState(isFollowing);

  const handleFollowToggle = async () => {
    if (followLoading) return;
    
    try {
      setFollowLoading(true);
      
      if (followState) {
        await unfollowUser(profile.id);
      } else {
        await followUser(profile.id);
      }
      
      setFollowState(!followState);
      if (onFollowChange) {
        onFollowChange(!followState);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="profile-section mb-5">
      <div className="row align-items-center">
        <div className="col-md-3 text-center">
          <div 
            className="profile-picture-container mx-auto mb-3" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0f0f0' }}
          >
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.username} 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                <i data-feather="user" style={{ width: '40px', height: '40px', color: '#6f42c1' }}></i>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-md-9">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">{profile.username}</h2>
            
            {!isCurrentUser && (
              <button 
                className={`btn ${followState ? 'btn-outline-primary' : 'btn-primary'}`}
                onClick={handleFollowToggle}
                disabled={followLoading}
                style={{ 
                  backgroundColor: followState ? 'transparent' : '#6f42c1', 
                  borderColor: '#6f42c1',
                  color: followState ? '#6f42c1' : 'white' 
                }}
              >
                {followLoading ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                ) : null}
                {followState ? 'Following' : 'Follow'}
              </button>
            )}
            
            {isCurrentUser && (
              <Link to="/upload" className="btn btn-outline-primary" style={{ borderColor: '#6f42c1', color: '#6f42c1' }}>
                <i data-feather="upload" className="me-1" style={{ width: '16px', height: '16px' }}></i>
                Upload New Video
              </Link>
            )}
          </div>
          
          <div className="user-stats d-flex mb-3">
            <div className="me-4">
              <span className="fw-bold">{profile.videoCount || 0}</span> videos
            </div>
            <div className="me-4">
              <span className="fw-bold">{profile.followerCount || 0}</span> followers
            </div>
            <div>
              <span className="fw-bold">{profile.followingCount || 0}</span> following
            </div>
          </div>
          
          <p className="user-bio text-muted">
            {profile.bio || 'No bio provided'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
