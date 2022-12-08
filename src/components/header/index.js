import { Link } from "preact-router/match";
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
        <Link href="/">Home</Link>
        <Link href="/users">Users</Link>
        <Link href="/tradein">Trade in</Link>
        <Link href="/locations">Locations</Link>
        <Link href="/browses">Browses</Link>
      </nav>
      <Logout />
    </header>
  );
};

export default Header;
