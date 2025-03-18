import Loader from "../../components/loader";
import useOrganizationController from "./organization-controller";

function Organization() {
  const {
    getAllOrganization,
    organizationId,
    openAddModal,
    openEditModal,
    workspaces,
    navigateHome,
    toggleDropdown,
    uiState,
    handleDeleteWorkspace,
    getTherapistNames,
    closeModal,
    activeWorkspace,
    fileInputRef,
    triggerFileInput,
    setActiveWorkspace,
    toggleTherapistDropdown,
    handleTherapistSelection,
    therapistsList,
    isTherapistSelected,
    handleSaveWorkspace,
    isCopied,
    handleCopy,
    handleFileInputChange,
    removeImage,
    setUIState,
    signOut,
  } = useOrganizationController();
  return (
    <>
      {getAllOrganization?.isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
          {/* Header */}
          {organizationId ? (
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mt-5">
                  Organization
                </h1>
                <p className="text-gray-600">Manage your organization</p>
              </div>
              <button
                onClick={openAddModal}
                title="Add organization"
                className="bg-teal-600 hover:bg-teal-700 text-white font-montserrat font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                {/* Plus icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                Add Organization
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mt-5">
                  Select Organization
                </h1>
                {/* <p className="text-gray-600">Manage your organization</p> */}
                <p className="text-gray-600">
                  Selecting an organization allows you to view and manage its
                  information efficiently.
                </p>
              </div>
              <div>
                <button
                  onClick={signOut}
                  title="Add organization"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-montserrat font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workspaces.map((workspace: any) => (
              <div
                key={workspace.id}
                title={
                  !organizationId
                    ? `Click to manage ${workspace.name} Organization`
                    : ""
                }
                onClick={() => {
                  !organizationId && navigateHome(workspace.id);
                }}
                className={`${
                  !organizationId ? "cursor-pointer" : ""
                } bg-white rounded-xl hover:shadow-xl shadow-sm border border-gray-200 overflow-hidden`}
              >
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`${
                        !workspace?.logo?.base64 ? "bg-purple" : ""
                      } text-white w-10 h-10 rounded-md flex items-center justify-center font-bold overflow-hidden`}
                    >
                      {workspace.logo ? (
                        <img
                          src={workspace.logo.base64}
                          alt={workspace.logo.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <>
                          {workspace?.name &&
                            workspace?.name?.charAt(0).toUpperCase()}
                        </>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {workspace.name}
                      </h3>
                      {workspace.location && (
                        <p className="text-xs text-gray-500">
                          Location: {workspace.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {organizationId && (
                    <div className="relative flex">
                      <button
                        title="Click to copy organization link"
                        className="flex items-center gap-2 text-white px-4 py-2 rounded-md transition"
                        onClick={() =>
                          workspace.id &&
                          workspace.code &&
                          handleCopy(workspace.id)
                        }
                      >
                        {isCopied[workspace.id] ? (
                          <svg
                            className="text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              stroke-linejoin="round"
                              d="M4.5 7.5L7 10l4.5-4.5m-9-3h11v11h-11z"
                              stroke-width="1"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <g
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                            >
                              <path d="M19.4 20H9.6a.6.6 0 0 1-.6-.6V9.6a.6.6 0 0 1 .6-.6h9.8a.6.6 0 0 1 .6.6v9.8a.6.6 0 0 1-.6.6" />
                              <path d="M15 9V4.6a.6.6 0 0 0-.6-.6H4.6a.6.6 0 0 0-.6.6v9.8a.6.6 0 0 0 .6.6H9" />
                            </g>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => toggleDropdown(workspace.id)}
                        className="p-1 rounded-md hover:bg-gray-100"
                        title="Click to manage Organization"
                      >
                        {/* More Vertical icon SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>

                      {uiState.activeDropdownId === workspace.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <div className="flex flex-between">
                              <button
                                onClick={() => openEditModal(workspace)}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                className=" text-right px-4 text-red-800"
                                onClick={() => {
                                  setUIState((prev) => ({
                                    ...prev,
                                    activeDropdownId: null,
                                  }));
                                }}
                              >
                                X
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                const isConfirmed = window.confirm(
                                  "Are you sure you want to delete this workspace?"
                                );
                                if (isConfirmed) {
                                  handleDeleteWorkspace(workspace.id);
                                }
                                setUIState((prev) => ({
                                  ...prev,
                                  activeDropdownId: null,
                                }));
                              }}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-4 py-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Description: {workspace.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Code: {workspace.code}
                  </p>
                  {workspace.therapists && workspace.therapists.length > 0 && (
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-medium">Therapists:</span>{" "}
                      {getTherapistNames(workspace.therapists)}
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 px-4 py-3 flex justify-end text-sm">
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {workspace.users}
                    </p>
                    <p className="text-gray-500">Total Users</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Combined Add/Edit Workspace Modal */}
          {uiState.showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {uiState.modalMode === "add"
                      ? "Create new organization"
                      : "Edit organization"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-300 hover:text-white"
                  >
                    {/* X icon SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div
                        className={`w-16 h-16 bg-teal-100 ${
                          activeWorkspace.logo
                            ? ""
                            : uiState.modalMode === "edit"
                        } rounded-md flex items-center justify-center border border-gray-200 ${
                          !activeWorkspace.logo && uiState.modalMode === "edit"
                            ? "text-white font-bold text-2xl"
                            : ""
                        } overflow-hidden`}
                      >
                        {activeWorkspace.logo ? (
                          <img
                            src={activeWorkspace.logo.base64}
                            alt={activeWorkspace.logo.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="3"
                              rx="2"
                              ry="2"
                            ></rect>
                            <circle cx="9" cy="9" r="2"></circle>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                          </svg>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        onClick={(e) =>
                          ((e.target as HTMLInputElement).value = "")
                        }
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={triggerFileInput}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {activeWorkspace.logo === null
                          ? "Add Image"
                          : "Change Image"}
                      </button>
                      {activeWorkspace.logo && (
                        <button
                          onClick={removeImage}
                          className="remove-button px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>

                    <div className="upload-instructions">
                      <p className="text-sm font-medium text-gray-500 ">
                        Maximum file size: 2MB
                      </p>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Supported formats: JPG, PNG, GIF
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-red-500">*</span> Organization
                        Name
                      </label>
                      <input
                        type="text"
                        value={activeWorkspace.name}
                        onChange={(e) =>
                          setActiveWorkspace({
                            ...activeWorkspace,
                            name: e.target.value,
                            code: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^a-z0-9_]/g, ""),
                          })
                        }
                        placeholder="Enter organization name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Description
                      </label>
                      <input
                        type="text"
                        value={activeWorkspace.description}
                        onChange={(e) =>
                          setActiveWorkspace({
                            ...activeWorkspace,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter organization description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={activeWorkspace.location || ""}
                        onChange={(e) =>
                          setActiveWorkspace({
                            ...activeWorkspace,
                            location: e.target.value,
                          })
                        }
                        placeholder="Enter organization location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Therapists
                      </label>
                      <div className="relative">
                        <div
                          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-10 flex flex-wrap gap-1 cursor-pointer"
                          onClick={toggleTherapistDropdown}
                        >
                          {activeWorkspace.therapists &&
                          activeWorkspace.therapists.length > 0 ? (
                            activeWorkspace.therapists.map((therapist: any) => (
                              <span
                                key={therapist._id}
                                className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full flex items-center"
                              >
                                {therapist.name}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTherapistSelection(therapist._id);
                                  }}
                                  className="ml-1 text-teal-600 hover:text-teal-800"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M18 6 6 18M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">
                              Select therapists
                            </span>
                          )}
                        </div>
                        {uiState.showTherapistDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {therapistsList.map((therapist: any) => (
                              <div
                                key={therapist._id}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() =>
                                  handleTherapistSelection(therapist._id)
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={isTherapistSelected(therapist._id)}
                                  onChange={() => {}}
                                  className="mr-2"
                                />
                                <span>{therapist.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code
                      </label>
                      <input
                        type="text"
                        value={activeWorkspace.code || ""}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWorkspace}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        !activeWorkspace.name.trim() ||
                        !activeWorkspace.code?.trim() ||
                        !activeWorkspace.location?.trim() ||
                        !activeWorkspace.therapists?.length
                      }
                    >
                      {uiState.modalMode === "add"
                        ? "Create Organization"
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Organization;
