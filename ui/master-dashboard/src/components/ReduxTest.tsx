import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserGroups } from '../store/slices/authSlice';

interface RootState {
  auth: {
    user: {
      id: string;
    } | null;
    isAuthenticated: boolean;
    userGroups: any[] | null;
  };
}

export const ReduxTest: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userGroups = useSelector((state: RootState) => state.auth.userGroups);

  const handleFetchGroups = () => {
    if (user?.id) {
      dispatch(fetchUserGroups(user.id) as any);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Redux Test</h2>
      
      <div className="space-y-2">
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user?.id || 'None'}</p>
        <p><strong>User Groups:</strong> {userGroups ? userGroups.length : 0} groups</p>
      </div>

      <div className="mt-4 space-x-2">
        <button 
          onClick={handleFetchGroups}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch User Groups
        </button>
      </div>

      {userGroups && (
        <div className="mt-4">
          <h3 className="font-bold">User Groups:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(userGroups, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
};
