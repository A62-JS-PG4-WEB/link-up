import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../state/app.context";
import { updateProfilePicture, updateUserEmail, updateUserPassword, updateUserPhoneNumber, updateAccountInfoDB } from "../../services/users.service";
import { auth } from "../../config/firebase-config";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";

const storage = getStorage();

export default function Profile() {
  const { userData, user, setAppState } = useContext(AppContext);
  const [username, setUsername,] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setImagePreview(user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp");
    }
  }, [user, userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (profileImage) {
      const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`);
      try {
        await uploadBytes(storageRef, profileImage);
        const photoURL = await getDownloadURL(storageRef);

        await updateProfilePicture(userData.username, photoURL);

        setAppState((prevState) => ({
          ...prevState,
          userData: { ...prevState.userData, photoURL },
        }));
        setMessage("Profile image updated successfully!");
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const user = auth.currentUser;
  
      if (email && email !== user.email) {
        if (!oldPassword) {
          setMessage("Old password is required to update email.");
          setLoading(false);
          return;
        }

        await updateAccountInfoDB(userData.username, email);

        const successMessage = await updateUserEmail(email, oldPassword);
        setMessage(successMessage);
  
        setAppState((prevState) => ({
          ...prevState,
          userData: { ...prevState.userData, email },
        }));
      }
  
      if (oldPassword && newPassword) {
        await updateUserPassword(oldPassword, newPassword);
      }
  
      if (phoneNumber && phoneNumber !== user.phoneNumber) {
        await updateUserPhoneNumber(userData, phoneNumber);
      }
  
      setAppState((prevState) => ({
        ...prevState,
        user: { ...prevState.userData, email, phoneNumber },
      }));
  
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="flex flex-col bg-gray-800 p-6 rounded-lg w-full h-full overflow-y-auto">
      {/* <h1 className="text-2xl font-bold text-white mb-6">Profile</h1> */}

      <div className="mb-6">
        <p className="text-lg font-semibold text-white">Username: {userData?.username || "User"}</p>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="avatar">
          <div className="w-32 rounded-full ring ring-gray-500 ring-offset-base-100 ring-offset-2">
            <img src={imagePreview} alt="User avatar" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full max-w-xs mb-4 text-gray-800" 
        />
        {profileImage && (
          <button
            onClick={handleImageUpload}
            className="btn bg-gray-600 hover:bg-gray-700 text-white mt-2"
          >
            Upload Photo
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-4 text-white">

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Phone Number</span>
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Old Password</span>
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">New Password</span>
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <button
            onClick={handleSave}
            className={`btn bg-gray-300 hover:bg-gray-400 text-gray-800 mt-4 ${loading ? "loading" : ""}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {message && (
            <div className="mt-4 text-center">
              <p className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}