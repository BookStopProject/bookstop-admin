import { useQuery } from "react-query";
import { useAPI } from "../../util/api";

const Profit = () => {
  const API = useAPI();
  const { data, error } = useQuery(["profit"], () => {
    return API.get("/admin/profit");
  });
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <table>
      <thead>
        <tr>
          <th>Book ID</th>
          <th>Profit</th>
          <th>Total trade in</th>
          <th>Total exchange</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.book_id}</td>
              <td style={{ color: item.profit < 0 ? "red" : "green" }}>
                {item.profit}
              </td>
              <td>{item.trade_in_count}</td>
              <td>{item.invoice_count}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <h2>Profit</h2>
      <Profit />
    </div>
  );
};

export default Home;
