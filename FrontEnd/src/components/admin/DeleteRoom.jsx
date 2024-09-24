import React, { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const DeleteRoom = ({ roomId }) => {
    const { deleteRoom, isDeletingRoom } = useContext(GlobalContext);

    const handleDelete = () => {
        deleteRoom(roomId);
    };

    return (
        <button onClick={handleDelete} disabled={isDeletingRoom}>
            {isDeletingRoom ? 'Deleting Room...' : 'Delete Room'}
        </button>
    );
};

export default DeleteRoom;
