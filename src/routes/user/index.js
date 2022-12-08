import { useQuery } from "react-query";
import { useAPI } from "../../util/api";

const User = () => {
  const API = useAPI();

  const { data, error } = useQuery(["users"], () => {
    return API.get("/admin/users");
  });

  return (
    <div>
      <h1>User</h1>
      {error ? (
        <div>{error.message}</div>
      ) : data ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.credit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default User;
