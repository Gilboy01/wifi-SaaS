import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const StaffPage = () => {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    const res = await api.get("/users/staff");
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchStaff();
  }, [loading]);

  // create staff
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/staff", form);
      toast.success("Staff added successfully");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/users/staff/${id}`);
      toast.success("Staff Deleted successfully");
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Staff</h1>

      <div className="flex items-center justify-center">
        <form
          onSubmit={submit}
          className="grid gap-3 mb-8 p-6
          rounded-xl
          shadow-md w-96"
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-fit"
            disabled={loading}
            type="submit"
          >
            {loading ? <>loading...</> : <>Add Staff</>}
          </button>
        </form>
      </div>
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-bold mb-6">Available staff</h2>
      </div>
      <table className="w-full border">
        <thead>
          <tr className=" bg-gray-400">
            <th className="w-1/4 px-4 py-2 text-left border">Name</th>
            <th className="w-1/4 px-4 py-2 text-left border">Email</th>
            <th className="w-1/4 px-4 py-2 text-left border">Role</th>
            <th className="w-1/4 px-4 py-2 text-left border">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="w-1/4 px-4 py-2 border">{user.name}</td>
              <td className="w-1/4 px-4 py-2 border">{user.email}</td>
              <td className="w-1/4 px-4 py-2 border">{user.role}</td>
              <td className="w-1/4 px-4 py-2 border">
                <button
                  onClick={() => remove(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffPage;
