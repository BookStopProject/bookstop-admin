import { useState } from "preact/hooks";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAPI } from "../../util/api";

const BrowseUpdate = ({ browse, close }) => {
  const API = useAPI();

  const client = useQueryClient();

  const { data } = useQuery(["browses", browse.id], () => {
    return API.get(`/admin/browses/${browse.id}/books`);
  });

  const { mutate, isLoading } = useMutation(
    ({ name, description }) => {
      return API.put(`/admin/browses/${browse.id}`, {
        name,
        description,
      });
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Browse updated");
        client.invalidateQueries("browses");
        close();
      },
    }
  );

  const { mutate: mutateAddBook, isLoading: isLoadingAddBook } = useMutation(
    ({ book_id }) => {
      return API.post(`/admin/browses/${browse.id}/books/${book_id}`, {});
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Book added");
        client.invalidateQueries(["browses", browse.id]);
      },
    }
  );

  const { mutate: mutateRemoveBook } = useMutation(
    (bookId) => {
      return API.delete(`/admin/browses/${browse.id}/books/${bookId}`, {});
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Book removed");
        client.invalidateQueries(["browses", browse.id]);
      },
    }
  );

  const onUpdate = (e) => {
    e.preventDefault();
    if (isLoading) return;
    const name = document.getElementById("browse_name_update").value;
    const description = document.getElementById(
      "browse_description_update"
    ).value;
    mutate({ name, description });
  };

  const onAddBook = (e) => {
    e.preventDefault();
    if (isLoadingAddBook) return;
    const book_id = document.getElementById("browse_book_id").value;
    mutateAddBook({ book_id });
  };

  const onRemoveBook = (bookId) => {
    mutateRemoveBook(bookId);
  };

  return (
    <dialog open style={{ top: 0, left: 0, width: "100%", height: "100%" }}>
      <form onSubmit={onUpdate}>
        <label>Name</label>
        <input id="browse_name_update" type="text" value={browse.name} />
        <label>Description</label>
        <input
          id="browse_description_update"
          type="text"
          value={browse.description}
        />
        <button disabled={isLoading}>Update</button>
      </form>
      <h2>Books</h2>
      <form onSubmit={onAddBook}>
        <label>Book ID</label>
        <input id="browse_book_id" type="text" />
        <button disabled={isLoadingAddBook}>Add Book</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((book) => {
            return (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author?.name}</td>
                <td>
                  <button onClick={() => onRemoveBook(book.id)}>Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </dialog>
  );
};

const BrowseList = () => {
  const API = useAPI();

  const { data, error } = useQuery(["browses"], () => {
    return API.get("/admin/browses");
  });

  const [browseUpdate, setBrowseUpdate] = useState(null);

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((browse) => {
            return (
              <tr key={browse.id}>
                <td>{browse.id}</td>
                <td>{browse.name}</td>
                <td>{browse.description}</td>
                <td>
                  <button onClick={() => setBrowseUpdate(browse)}>Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {browseUpdate && (
        <BrowseUpdate
          browse={browseUpdate}
          close={() => setBrowseUpdate(null)}
        />
      )}
    </>
  );
};

const BrowseCreate = () => {
  const API = useAPI();

  const client = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async ({ name, description }) => {
      return API.post("/admin/browses", {
        name,
        description,
      });
    },
    {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("Browse created");
        client.invalidateQueries("browses");
      },
    }
  );

  const doCreate = (ev) => {
    ev.preventDefault();
    if (isLoading) return;
    mutate({
      name: ev.target.b_name.value,
      description: ev.target.b_description.value,
    });
  };

  return (
    <div>
      <h2>Create Browse</h2>
      <form onSubmit={doCreate}>
        <label>Name</label>
        <input required id="b_name" type="text" />
        <label>Description</label>
        <input required id="b_description" type="text" />
        <button disabled={isLoading} type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

const Browse = () => {
  return (
    <div>
      <h1>Browse</h1>
      <BrowseList />
      <BrowseCreate />
    </div>
  );
};

export default Browse;
