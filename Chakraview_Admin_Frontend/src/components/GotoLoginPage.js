import React from 'react';

function GotoLoginPage({ pageLink }) {
    return (
        <>
            <div className="card-footer text-center py-3">
                <div className="small"><a href={pageLink}>Have an account? Go to login</a></div>
            </div>
        </>
    );
}

export default GotoLoginPage;