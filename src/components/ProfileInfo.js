import React from "react";

function ProfileInfo({ email }) {
    return (
        <div className="profile-info">
            <p>Welcome, {email}!</p>
        </div>
    );
}

export default ProfileInfo;
