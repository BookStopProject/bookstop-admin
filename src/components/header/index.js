import { useAuth } from "../../auth";

const Login = () => {
  const { setAuth } = useAuth();

  const onSubmit = (ev) => {
    ev.preventDefault();
    const username = ev.target.username.value;
    const password = ev.target.password.value;
    if (!username || !password) return;
    setAuth({ username, password });
  };

  return (
    <form onSubmit={onSubmit}>
      <p>Please enter your database credential.</p>
      <label for="username">Username</label>
      <input required id="username" />
      <label for="password">Password</label>
      <input required type="password" id="password" />
      <button type="submit">Login</button>
    </form>
  );
};

const Logout = () => {
  const { auth, setAuth } = useAuth();
  return (
    <div>
      <p>Logged in as {auth.username}</p>
      <button onClick={() => setAuth(null)}>Logout</button>
    </div>
  );
};

const Header = () => {
  const { auth } = useAuth();
  if (!auth) return <Login />;
  return (
    <header>
      <h1>BookStop Admin</h1>
      <nav style={{ display: "flex", gap: "12px" }}>
        <a href="/">Home</a>
        <a href="/users">Users</a>
        <a href="/tradein">Trade in</a>
        <a href="/locations">Locations</a>
        <a href="/browses">Browses</a>
      </nav>
      <Logout />
    </header>
  );
};

export default Header;
