// import React, { useEffect, useState } from "react";
// import api from "../../api";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [form, setForm] = useState({ name: "", email: "" });
//   const [profilePreview, setProfilePreview] = useState("");
//   const [profileFile, setProfileFile] = useState(null);
//   const navigate = useNavigate();

//   const fetchProfile = async () => {
//     try {
//       const { data } = await api.get("/user/getProfile");
//       setUser(data.data);
//       setForm({
//         name: data.data.name || "",
//         email: data.data.email || "",
//       });
//       setProfilePreview(data.data.profilePicture || "");
//     } catch (error) {
//       console.error("Failed to load profile", error);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileFile(file);
//       setProfilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("email", form.email); // in case needed
//       if (profileFile) {
//         formData.append("profilePicture", profileFile);
//       }

//       await api.put("/user/updateProfile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       fetchProfile(); // refresh after update
//     } catch (error) {
//       console.error("Failed to update profile", error);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Profile</h2>

//       {user && (
//         <>
//           {profilePreview && (
//             <img
//               src={profilePreview}
//               alt="Profile"
//               className="w-24 h-24 rounded-full object-cover mb-4"
//             />
//           )}

//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded mt-1"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 disabled
//                 value={form.email}
//                 className="w-full border p-2 rounded mt-1 bg-gray-100"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600">Change Profile Picture</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="w-full mt-1"
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button
//               onClick={() => navigate("/")}
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
//             >
//               Back to Board
//             </button>

//             <button
//               onClick={handleUpdate}
//               className="px-4 py-2 rounded bg-blue-600 text-black text-sm"
//             >
//               Save Changes
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", profilePicture: "" });
  const [file, setFile] = useState(null); // for file upload
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/user/getProfile");
      setUser(data.data);
      setForm({
        name: data.data.name || "",
        email: data.data.email || "",
        profilePicture: data.data.profilePicture || "",
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      const preview = URL.createObjectURL(uploadedFile);
      setForm({ ...form, profilePicture: preview });
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      await api.put("/user/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchProfile();
      toast.success("profile updated successfully")
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {user && (
        <>
          {/* Profile Image with Edit Button */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <img
              src={form.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            />
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 16H9v-3z" />
              </svg>
            </label>
          </div>

          {/* Profile Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                disabled
                value={form.email}
                className="w-full border p-2 rounded mt-1 bg-gray-100"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Back to Board
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded bg-blue-600 text-black text-sm"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
