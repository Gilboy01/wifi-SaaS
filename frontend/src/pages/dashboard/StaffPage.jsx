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
  }, []);

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
    setLoading(true);
    try {
      await api.delete(`/users/staff/${id}`);
      toast.success("Staff Deleted successfully");
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Staff</h2>

      <form onSubmit={submit} className="grid gap-3 mb-8">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
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
        />

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
          type="submit"
        >
          {loading ? <>loading...</> : <>Add Staff</>}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className=" bg-gray-400">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>
                <button
                  onClick={() => remove(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  disabled={loading}
                >
                  {loading ? <>loading...</> : <>Delete</>}
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
