import React, { useState } from "react";
import { Fullscreen, Search, Bell, Home } from "lucide-react";
import { formatPath } from "../utils/stringUtils";

function Header({ pathname }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toggle functions
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleNotifications = () =>
    setIsNotificationsOpen(!isNotificationsOpen);

  const formattedPath = formatPath(pathname); // Use the utility function

  const showHeader = false;
  return (
    <>
      {showHeader && (
        <nav className="bg-white shadow-md w-full">
          <div className="flex justify-end items-center py-4 px-6">
            {/* Navbar Items */}
            <ul className="flex space-x-6">
              {/* Search Modal */}
              <li>
                <button className="cursor-pointer" onClick={toggleModal}>
                  <Search className="text-2xl" />
                </button>

                {/* Modal */}
                {isModalOpen && (
                  <div className="modal fade proclinic-modal-lg">
                    <div className="modal-dialog modal-lorvens">
                      <div className="modal-content shadow-lg">
                        <div className="modal-header flex justify-between items-center">
                          <h5 className="text-xl font-semibold">
                            Search Patient/Doctor:
                          </h5>
                          <button
                            className="text-2xl cursor-pointer"
                            onClick={toggleModal}
                          >
                            &#10005;
                          </button>
                        </div>
                        <div className="modal-body">
                          <form>
                            <div className="form-group">
                              <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-md"
                                id="search-term"
                                placeholder="Type text here"
                              />
                              <button
                                type="button"
                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                              >
                                <span className="mr-2">↗</span> Search
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Fullscreen Toggle */}
              <li>
                <button title="Fullscreen" className="text-2xl cursor-pointer">
                  <Fullscreen /> {/* Lucide Fullscreen Icon */}
                </button>
              </li>

              {/* Notifications Dropdown */}
              <li className="relative">
                <button
                  className="cursor-pointer"
                  onClick={toggleNotifications}
                >
                  <Bell className="text-2xl" /> {/* Lucide Bell Icon */}
                </button>
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="dropdown-menu absolute right-0 w-64 bg-background shadow-md mt-2 rounded-md animate__animated animate__flipInY">
                    <h5 className="font-semibold px-4 py-2">Notifications</h5>
                    <button className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30">
                      <span className="mr-2">🦽</span> New Patient Added
                    </button>
                    <button className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30">
                      <span className="mr-2">💵</span> Patient payment done
                    </button>
                    <button className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30">
                      <span className="mr-2">⏰</span> Appointment booked
                    </button>
                    <button className="w-full dropdown-item flex items-center px-4 py-2 hover:bg-side-active/30">
                      <span className="mr-2">🦽</span> New Patient Added
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </nav>
      )}

      {/* Quick Statistics Section */}
      <div className="flex justify-between items-center py-4 px-6 w-full bg-background-head">
        <div className="w-1/2">
          <h3 className="text-2xl font-semibold text-sidetext-active">
            {formattedPath}
          </h3>
        </div>
        <div className="w-1/2 ml-auto text-right">
          <ol className="inline-flex items-center space-x-2 text-sidetext-active justify-end bg-side-active px-5 py-2.5 rounded-2xl ">
            <li>
              <a href="/" className="flex items-center">
                <Home size={20} className="text-xl mr-2" />
              </a>
            </li>
            <li className="before:content-['/'] before:mr-2">
              {formattedPath}
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default Header;
