import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api/api";
import { updateUser } from "@/store/User";


const ProfileEdit = () => {
  const dispatch = useDispatch();
  const { user} = useSelector((s) => s.User);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ================= Load Redux user =================
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      setPreview(user.profilePic || null);
    }
  }, [user]);

  // ================= Handle Input =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= Handle Image =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      if (imageFile) formData.append("profilePic", imageFile);

      const res = await api.put(
        "/user/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      

      if (res.data?.success) {
        dispatch(updateUser(res.data.user));
        setMsg("Profile updated successfully ✅");
        
      }
    } catch (err) {
      console.error(err);
      setMsg("Update failed ❌");
    }

    setLoading(false);
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={preview || "/default-avatar.png"}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />

              <label className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* FIRST NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* LAST NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* EMAIL (LOCKED) */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full border rounded-lg p-2.5 mt-1 bg-gray-100 text-gray-500"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* MESSAGE */}
          {msg && (
            <div className="text-sm font-medium text-center text-green-600">
              {msg}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg font-medium"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
