import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { decode, acceptInvite } from "../services/invite";

function AcceptInvite() {
  const [error, setError] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const inviteHash = queryParams.get("invite_hash");

  useEffect(() => {
    if (!user) {
      navigate(`/sign-in?from=accept-invite&invite_hash=${inviteHash}`);
      return;
    }

    if (!inviteHash) {
      setError("Invalid invitation link.");
      return;
    }

    async function decodeInviteHash() {
      setLoading(true);
      try {
        const decoded = await decode(inviteHash);
        setInviteData(decoded);
      } catch (err) {
        setError("Failed to decode invitation.");
      } finally {
        setLoading(false);
      }
    }

    decodeInviteHash();
  }, [inviteHash, navigate, user]);

  const handleAccept = async () => {
    try {
      setLoading(true);
      const res = await acceptInvite(
        inviteData.boardId,
        user._id,
        inviteData.role,
      );
      setLoading(false);
      navigate(`/board/${inviteData.boardId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to accept invitation.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
      </div>
    );
  }

  if (user?.email !== inviteData?.email) {
    return (
      <div className="flex flex-col gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
        <p className="font-bold text-red-600 dark:text-red-400 text-center">
          Not authorised to view this page.
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          This page is accessible only for the user with email:{" "}
          <strong>{inviteData?.email}</strong>. Please sign in to that account
          to access this page.
        </p>
      </div>
    );
  }

  return error ? (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
      <p className="text-sm text-red-600 dark:text-red-400 text-center">
        {error}
      </p>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          You're Invited!
        </h1>
        <p className="text-gray-700 mb-1">
          <strong>{inviteData?.senderName}</strong> has invited you to join
          board <strong>{inviteData?.boardName}</strong> as a{" "}
          <strong>{inviteData?.role}</strong>.
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Accepting this invite will add you to the board.
        </p>
        <button
          onClick={handleAccept}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Accept Invitation
        </button>
      </div>
    </div>
  );
}

export default AcceptInvite;
