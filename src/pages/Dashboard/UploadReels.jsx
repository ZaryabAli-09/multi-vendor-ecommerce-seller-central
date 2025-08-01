import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
const UploadReel = () => {
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reels, setReels] = useState([]);
  const [link, setLink] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4); // Number of reels initially shown
  const observer = useRef();

  const handleDelete = async (reelId) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/reels/${reelId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete reel");
      setDeleteLoading(false);
      toast.success(data.message);
      setReels((prev) => prev.filter((r) => r._id !== reelId));
    } catch (err) {
      setDeleteLoading(false);
      toast.error(err.message);
    }
  };

  const fetchReels = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/reels/get`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load reels");
      setReels(data.data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation checks
    if (!video) return;
    if (!link) {
      setMessage("Please enter a product ID to link reel with product.");
      return;
    }
    link.trim();
    const isValidObjectId = /^[a-f\d]{24}$/i.test(link);
    if (!isValidObjectId) {
      setMessage("Invalid Product ID format. Please enter a valid ObjectId.");
      return;
    }

    // formdata appending
    const formData = new FormData();
    formData.append("video", video);
    formData.append("caption", link);

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/reels/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMessage(data.message);
      toast.success(data.message);
      setVideo(null);
      fetchReels(); // Refresh reels list
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const lastReelRef = useRef();

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + 4);
        }
      },
      { threshold: 1.0 }
    );
    if (lastReelRef.current) {
      observer.current.observe(lastReelRef.current);
    }
  }, [reels, visibleCount]);
  {
    deleteLoading ? toast.loading("Deleting reel...") : toast.dismiss();
  }
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upload a Product Reel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 mb-6"
      >
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
          className="mb-4 w-full border p-2 rounded"
        />

        <div className="flex flex-col mb-4">
          <label htmlFor="">Enter the Product Id</label>
          <input
            className="border p-2 rounded"
            type="text"
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter the product "
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 px-4 text-center rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin text-center rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          ) : (
            "Upload"
          )}{" "}
        </button>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Uploaded Reels
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {reels.slice(0, visibleCount).map((reel, idx) => (
          <div
            key={reel._id}
            className="relative rounded shadow bg-white overflow-hidden group"
            ref={idx === visibleCount - 1 ? lastReelRef : null}
          >
            <video
              src={reel.videoUrl}
              controls
              className="w-full h-64 object-cover"
            />
            <button
              onClick={() => handleDelete(reel._id)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 px-3 text-sm rounded hidden group-hover:block"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {visibleCount < reels.length && (
        <div className="text-center mt-4 text-gray-500">
          Loading more reels...
        </div>
      )}
    </div>
  );
};

export default UploadReel;
