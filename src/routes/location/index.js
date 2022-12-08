import { useState } from "preact/hooks";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAPI } from "../../util/api";

const LocationUpdate = ({ location, close }) => {
  const API = useAPI();

  const client = useQueryClient();

  const { mutate, isLoading } = useMutation(
    ({ name, address }) => {
      return API.put(`/admin/locations/${location.id}`, {
        name,
        address,
      });
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Location updated");
        client.invalidateQueries("locations");
        close();
      },
    }
  );

  const onUpdate = (e) => {
    e.preventDefault();
    if (isLoading) return;
    const name = document.getElementById("loc_name_update").value;
    const address = document.getElementById("loc_address_update").value;
    mutate({ name, address });
  };

  return (
    <dialog open>
      <form onSubmit={onUpdate}>
        <label>Name</label>
        <input id="loc_name_update" type="text" value={location.name} />
        <label>Address</label>
        <input id="loc_address_update" type="text" value={location.address} />
        <button disabled={isLoading}>Update</button>
      </form>
    </dialog>
  );
};

const LocationList = () => {
  const API = useAPI();

  const { data, error } = useQuery(["locations"], () => {
    return API.get("/admin/locations");
  });

  const [locationUpdate, setLocationUpdate] = useState(null);

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((location) => {
            return (
              <tr key={location.id}>
                <td>{location.id}</td>
                <td>{location.name}</td>
                <td>{location.address}</td>
                <td>
                  <button onClick={() => setLocationUpdate(location)}>
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {locationUpdate && (
        <LocationUpdate
          location={locationUpdate}
          close={() => setLocationUpdate(null)}
        />
      )}
    </>
  );
};

const CreateLocation = () => {
  const API = useAPI();

  const client = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async ({ name, address }) => {
      await API.post("/admin/locations", {
        name,
        address,
      });
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Location created");
        client.invalidateQueries("locations");
      },
    }
  );

  const doCreate = (ev) => {
    ev.preventDefault();
    if (isLoading) return;
    mutate({
      name: ev.target.loc_name.value,
      address: ev.target.loc_address.value,
    });
    ev.target.reset();
  };

  return (
    <div>
      <h2>Create Location</h2>
      <form onSubmit={doCreate}>
        <label>Name</label>
        <input required id="loc_name" type="text" />
        <label>Address</label>
        <input required id="loc_address" type="text" />
        <button disabled={isLoading} type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

const Location = () => {
  return (
    <div>
      <h1>Locations</h1>
      <LocationList />
      <CreateLocation />
    </div>
  );
};

export default Location;
