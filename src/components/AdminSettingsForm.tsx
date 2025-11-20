import { useState } from 'react';

const AdminSettingsForm = () => {
   const [firstName, setFirstName] = useState('Olayimika');
  const [lastName, setLastName] = useState('Oluwasegun');
  const [email, setEmail] = useState('oluwasegunyinka.samuel@gmail.com');
  const [phone, setPhone] = useState('+2348101831001');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full">

      {/* Personal Details Box */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-purple-700 font-semibold text-lg md:text-xl">Personal Details</h2>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          If you wish to change your details, you can edit them and click on Save Changes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          <div>
            <label className="block font-medium">Firstname</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 mt-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-medium">Lastname</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 mt-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 mt-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium">
          Save Changes
        </button>
      </div>

      {/* Password Box */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-purple-700 font-semibold text-lg md:text-xl">Password</h2>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Change your account password.
        </p>

        <div className="mt-6">
          <input
            type="password"
            value="********"
            readOnly
            className="w-full px-4 py-3 mt-2 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <button
          className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
          onClick={() => setShowModal(true)}
        >
          Change Password
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-4">Change Password</h2>

            <div className="mt-6">
              <label className="block font-medium">New Password</label>
              <input type="password" className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="mt-4">
              <label className="block font-medium">Confirm New Password</label>
              <input type="password" className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-medium"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const inputs = document.querySelectorAll('input[type="password"]');
                  const newPwd = (inputs[0] as HTMLInputElement)?.value;
                  const confirmPwd = (inputs[1] as HTMLInputElement)?.value;
                  if (!newPwd || newPwd !== confirmPwd) {
                    alert('Passwords do not match');
                    return;
                  }
                  try {
                    localStorage.setItem('password_admin', newPwd);
                    localStorage.setItem('password_user', newPwd);
                  } catch (e) {
                    // ignore storage errors
                  }
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsForm;
