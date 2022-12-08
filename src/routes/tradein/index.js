import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "preact/hooks";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useAPI } from "../../util/api";

// Note: `user` comes from the URL, courtesy of our router
const TradeIn = () => {
  const [userBookId, setUserBookId] = useState("");
  const [condition, setCondition] = useState("");
  const [locationId, setLocationId] = useState("");

  const API = useAPI();

  const { error, data } = useQuery(
    ["tradein", { userBookId, condition }],
    () => {
      if (!userBookId)
        throw new Error(
          `Missing userBookId. Use the scanner to scan the QR code on the book the user want to trade in.`
        );
      if (!condition)
        throw new Error(
          `Missing condition. Select the condition of the book the user want to trade in.`
        );
      return API.get(`/admin/tradein/${userBookId}?condition=${condition}`);
    }
  );
  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    function onScanSuccess(decodedText) {
      setUserBookId(decodedText);
    }
    html5QrcodeScanner.render(onScanSuccess);
  }, []);

  const { mutate, reset: resetMutate } = useMutation(
    () => {
      return API.post(`/admin/tradein/${userBookId}`, {
        condition,
        location_id: parseInt(locationId),
      });
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Trade in successful");
        reset();
      },
    }
  );

  const { data: dataLocation } = useQuery(["locations"], () => {
    return API.get("/admin/locations");
  });

  const confirmTradein = () => {
    mutate();
  };

  function reset() {
    setUserBookId("");
    setCondition("");
    resetMutate();
  }

  return (
    <div>
      <h1>Trade in</h1>
      <div id="reader" />
      <div>
        <label for="condition">User Book ID</label>
        <input
          value={userBookId}
          onChange={(e) => setUserBookId(e.target.value)}
        />
      </div>
      <label for="condition">Condition</label>
      <select
        id="condition"
        value={condition}
        onChange={(e) => {
          setCondition(e.target.value);
        }}
      >
        <option value="new">New</option>
        <option value="like_new">Like new</option>
        <option value="good">Good</option>
        <option value="acceptable">Acceptable</option>
      </select>
      <div
        style={{
          border: "1px solid black",
          margin: "2rem 0px",
          padding: "2rem",
        }}
      >
        {error ? (
          <div>{error.message}</div>
        ) : data ? (
          <div>
            <ul>
              <li>Book: {data?.userBook?.book?.title}</li>
              <li>Credit: {data?.credit}</li>
            </ul>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <label for="location">Location</label>
      <select
        id="location"
        value={locationId}
        onChange={(e) => {
          setLocationId(e.target.value);
        }}
      >
        {dataLocation?.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
      <button disabled={!location || !data} onClick={confirmTradein}>
        Confirm Trade In
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default TradeIn;
