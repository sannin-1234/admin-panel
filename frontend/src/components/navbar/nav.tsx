import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import NavHomeIcon from "../../assets/icons/nav-home-icon";
// import NavDashboardIcon from "../../assets/icons/nav-dashboard-icon";
import NavCalendarIcon from "../../assets/icons/nav-calendar-icon";
import NavSessionIcon from "../../assets/icons/nav-session-icon";
import NavPackageIcon from "../../assets/icons/nav-package-icon";
import NavAvailabilityIcon from "../../assets/icons/nav-availability-icon";
// import NavPaymentIcon from "../../assets/icons/nav-payment-icon";
// import NavBlogIcon from "../../assets/icons/nav-blog-icon";
import NavEventIcon from "../../assets/icons/nav-event-icon";
import NavTeamManageIcon from "../../assets/icons/nav-team-manage-icon";
import NavProfileIcon from "../../assets/icons/nav-profile-icon";
// import ArrowUp from "../../assets/icons/arrow-up";
// import ArrowDown from "../../assets/icons/arrow-down";
import WavyLines from "../../assets/icons/wavy-lines";
import ArrowLeft from "../../assets/icons/arrow-left";
import ArrowRight from "../../assets/icons/arrow-right";
import { useUser } from "../../context/user-context";
// import FeedbackCompainsIcon from "../../assets/icons/nav-feedback-&-compains-icon";
import { MENDING_MIND_ID, USER_ACCESS_KEY } from "../../utils/enum";

const Nav = ({ setIsCollapsed, isCollapsed }: any) => {
  const { organizationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine active menu item based on URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("/dashboard/overall")) return "OverAll";
    if (path.includes("/dashboard/therapist")) return "Therapist";
    if (path.includes("/dashboard/client")) return "Client";
    if (path.includes("/dashboard/products")) return "Product";
    if (path.includes("/calendar")) return "Calender";
    if (path.includes("/session")) return "Session";
    if (path.includes("/package")) return "Package";
    if (path.includes("/availability")) return "Availability";
    if (path.includes("/payment")) return "Payment";
    if (path.includes("/blog")) return "blog";
    if (path.includes("/event")) return "Event";
    if (path.includes("/team")) return "Team";
    if (path.includes("/profile")) return "Profile";
    if (path.includes("/f&c")) return "f&c";
    if (path.includes("/organization") && !path.endsWith(`/${organizationId}`))
      return "Organization";
    if (path === `/organization`) return "switch";
    if (path === "/signin") return "logout";

    return "Home";
  };

  // Set active tab based on current URL path
  const [isActive, setIsActive] = useState(() => getActiveTabFromPath());

  // Update active tab when location changes
  useEffect(() => {
    setIsActive(getActiveTabFromPath());
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Helper function for active class styling
  const getActiveClass = (menuItem: string) =>
    isActive === menuItem
      ? "text-black bg-mint/20"
      : "text-black/70 hover:text-black hover:bg-mint/10";

  // Common nav item class
  const navItemClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors";

  return (
    user && (
      <aside
        className={`group h-screen fixed left-0 top-0 bg-mint/10 border-r border-mint/25 transition-all
      ${isCollapsed ? "w-[5.5rem]" : "w-64"} flex flex-col`}
      >
        {isCollapsed ? (
          <div className="flex justify-center items-center w-20 h-[8rem]">
            <WavyLines />
          </div>
        ) : (
          <div className="p-6 flex items-center">
            <img
              onClick={() => {
                navigate(`/${organizationId}`);
                setIsActive("Home");
              }}
              src={logo}
              className="h-20 cursor-pointer"
              alt="logo"
              title="Mending Mind"
            />
          </div>
        )}

        <nav className="px-4 font-montserrat flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {user && user.role !== "client" && (
            <Link
              to={`/${organizationId}`}
              onClick={() => setIsActive("Home")}
              className={`${navItemClass} ${getActiveClass("Home")}`}
              title="Home"
            >
              <NavHomeIcon />
              {!isCollapsed && <span className="font-medium">Home</span>}
            </Link>
          )}

          {user && user.role === "client" && (
            <Link
              to={`/${organizationId}/new`}
              onClick={() => setIsActive("Home")}
              className={`${navItemClass} ${getActiveClass("Home")}`}
              title="Home"
            >
              <NavHomeIcon />
              {!isCollapsed && <span className="font-medium">Home</span>}
            </Link>
          )}

          <div className="space-y-1.5">
            {/* {user && user.role === "admin" && (
            <>
              <Link
                to={`/${organizationId}/dashboard/overall`}
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsActive("OverAll");
                }}
                className={`${navItemClass} ${
                  isActive === "OverAll" && !isDropdownOpen
                    ? "text-black bg-mint/20"
                    : "text-black/70 hover:text-black hover:bg-mint/10"
                }`}
              >
                <NavDashboardIcon />
                {!isCollapsed && <span>Dashboard</span>}
                {!isCollapsed && (
                  <span>{isDropdownOpen ? <ArrowUp /> : <ArrowDown />}</span>
                )}
              </Link>

              {isDropdownOpen && !isCollapsed && (
                <div className="pl-10 space-y-2 mt-2">
                  <Link
                    to={`/${organizationId}/dashboard/overall`}
                    onClick={() => setIsActive("OverAll")}
                    className={`${navItemClass} ${getActiveClass("OverAll")}`}
                  >
                    <span>Overall</span>
                  </Link>
                  <Link
                    to={`/${organizationId}/dashboard/therapist`}
                    onClick={() => setIsActive("Therapist")}
                    className={`${navItemClass} ${getActiveClass("Therapist")}`}
                  >
                    Therapist
                  </Link>
                  <Link
                    to={`/${organizationId}/dashboard/client`}
                    onClick={() => setIsActive("Client")}
                    className={`${navItemClass} ${getActiveClass("Client")}`}
                  >
                    Client
                  </Link>
                  <Link
                    to={`/${organizationId}/dashboard/products`}
                    onClick={() => setIsActive("Product")}
                    className={`${navItemClass} ${getActiveClass("Product")}`}
                  >
                    Product
                  </Link>
                </div>
              )}
            </>
          )} */}

            {user && user.role === "admin" && (
              <Link
                to={`/${organizationId}/organization`}
                onClick={() => setIsActive("Organization")}
                className={`${navItemClass} ${getActiveClass("Organization")}`}
                title="Organization"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M16 17v8H6v-8zm0-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2m11-9v5H17V6zm0-2H17a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 13v5h-5v-5zm0-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2M11 6v5H6V6zm0-2H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
                    strokeWidth="0.3"
                    stroke="currentColor"
                  />
                </svg>
                {!isCollapsed && <span>Organization</span>}
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                to={`/${organizationId}/calendar`}
                onClick={() => setIsActive("Calender")}
                title="Calendar"
                className={`${navItemClass} ${getActiveClass("Calender")}`}
              >
                <NavCalendarIcon />
                {!isCollapsed && <span>Calendar</span>}
              </Link>
            )}

            <Link
              to={`/${organizationId}/session`}
              onClick={() => setIsActive("Session")}
              className={`${navItemClass} ${getActiveClass("Session")}`}
              title="Session"
            >
              <NavSessionIcon />
              {!isCollapsed && <span>Session</span>}
            </Link>

            {user &&
              organizationId === MENDING_MIND_ID &&
              user.role !== "client" && (
                <Link
                  to={`/${organizationId}/package`}
                  onClick={() => setIsActive("Package")}
                  className={`${navItemClass} ${getActiveClass("Package")}`}
                  title="Package"
                >
                  <NavPackageIcon />
                  {!isCollapsed && <span>Package</span>}
                </Link>
              )}

            {(user?.role === "therapist" &&
              Cookies.get(USER_ACCESS_KEY.ORGANIZATION_ID) ===
                MENDING_MIND_ID) ||
            (user?.role === "admin" &&
              Cookies.get(USER_ACCESS_KEY.ORGANIZATION_ID) !==
                MENDING_MIND_ID) ? (
              <Link
                to={`/${organizationId}/availability`}
                onClick={() => setIsActive("Availability")}
                className={`${navItemClass} ${getActiveClass("Availability")}`}
                title="Availability"
              >
                <NavAvailabilityIcon />
                {!isCollapsed && <span>Availability</span>}
              </Link>
            ) : null}

            {/* {user &&
            ((user.role === "client" && organizationId === MENDING_MIND_ID) ||
              user.role === "admin" ||
              user.role === "therapist") && (
              <Link
                to="#"
                onClick={() => setIsActive("Payment")}
                className={`${navItemClass} ${getActiveClass("Payment")}`}
                title="Payment"
              >
                <NavPaymentIcon />
                {!isCollapsed && <span>Payment</span>}
              </Link>
            )}

          {user &&
            ((user.role === "client" && organizationId === MENDING_MIND_ID) ||
              user.role === "admin" ||
              user.role === "therapist") && (
              <Link
                to={`/${organizationId}/blog`}
                onClick={() => setIsActive("blog")}
                className={`${navItemClass} ${getActiveClass("blog")}`}
                title="Blog"
              >
                <NavBlogIcon />
                {!isCollapsed && <span>Blog</span>}
              </Link>
            )} */}

            {user && (user.role === "admin" || user.role === "client") && (
              <Link
                to={`/${organizationId}/event`}
                onClick={() => setIsActive("Event")}
                className={`${navItemClass} ${getActiveClass("Event")}`}
                title="Event"
              >
                <NavEventIcon />
                {!isCollapsed && <span>Event</span>}
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                to={`/${organizationId}/team`}
                onClick={() => setIsActive("Team")}
                className={`${navItemClass} ${getActiveClass("Team")}`}
                title="Team Management"
              >
                <NavTeamManageIcon />
                {!isCollapsed && <span>Team Management</span>}
              </Link>
            )}

            <Link
              to={`/${organizationId}/profile`}
              onClick={() => setIsActive("Profile")}
              className={`${navItemClass} ${getActiveClass("Profile")}`}
              title="Profile"
            >
              <NavProfileIcon />
              {!isCollapsed && <span>Profile</span>}
            </Link>

            {/* {user && user.role !== "therapist" && (
            <Link
              to={`/${organizationId}/f&c`}
              onClick={() => setIsActive("f&c")}
              className={`${navItemClass} ${getActiveClass("f&c")}`}
            >
              <FeedbackCompainsIcon />
              {!isCollapsed && <span>Feedback & Complains</span>}
            </Link>
          )} */}

            <div className="mt-auto">
              {user && user.role !== "client" && (
                <Link
                  to={"/organization"}
                  onClick={() => setIsActive("switch")}
                  title="Switch Organization"
                  className={`${navItemClass} ${getActiveClass("switch")}`}
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M42 19H6M30 7l12 12M6.799 29h36m-36 0l12 12"
                    />
                  </svg>
                  {!isCollapsed && (
                    <span>
                      {Cookies.get(USER_ACCESS_KEY.ORGANIZATION_NAME)}
                    </span>
                  )}
                </Link>
              )}

              <Link
                to={"/signin"}
                onClick={() => {
                  setIsActive("logout");
                  toast.success("Signout successfully");
                  logout();
                }}
                className={`${navItemClass} ${getActiveClass("logout")}`}
                title="Signout"
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
                {!isCollapsed && <span>Signout</span>}
              </Link>
            </div>
          </div>
        </nav>

        <button
          className="absolute right-[-16px] top-3/4 transform -translate-y-1/2
        w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 shadow-md 
        opacity-0 group-hover:opacity-100 transition-all bg-white/80
        hover:w-12 hover:h-12 hover:border-gray-600"
          title={isCollapsed ? "Click to expand" : "Click to collapse"}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
        </button>
      </aside>
    )
  );
};

export default Nav;
