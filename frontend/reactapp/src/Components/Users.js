import User from "./User";
function Users({ users }) {
  return (
    <div>
      {users.map((user) => (
        <User key={user.id} text={user.name} />
      ))}
    </div>
  );
}

export default Users;