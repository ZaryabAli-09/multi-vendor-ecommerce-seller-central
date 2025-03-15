import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Reviews = () => {
  const { user } = useSelector((state) => state.auth);
  const [isFetching, setIsFetching] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoader, setReplyLoader] = useState(false);

  const fetchSellerReviews = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/review/seller/${user._id}`
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setReviews(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSellerReviews();
  }, [user._id]);
  console.log(reviews);
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openReplyModal = (review) => {
    setCurrentReview(review);
    setReplyText(review.sellerReply?.text || "");
    setModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (replyText.length < 10) {
      toast.error("Reply must be at least 10 characters long.");
      return;
    }
    try {
      setReplyLoader(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/review/seller/reply/${
          currentReview._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: replyText }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      fetchSellerReviews();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setReplyLoader(false);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <TableContainer className="p-4" component={Paper}>
        <h2 className="text-xl md:text-2xl mb-6">Manage your Reviews</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Review User</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Reply Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isFetching ? (
              <TableRow>
                {[...Array(4)].map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review, i) => {
                const hasReply = review.sellerReply?.text;
                return (
                  <React.Fragment key={review._id}>
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{review.user?.name}</TableCell>
                      <TableCell>{review.product?.name}</TableCell>

                      <TableCell>{review.rating}/5</TableCell>
                      {review.sellerReply?.text ? (
                        <TableCell>
                          <span className="bg-green-500 rounded-md font-semibold text-sm text-white p-2">
                            replied
                          </span>
                        </TableCell>
                      ) : (
                        <TableCell>
                          <span className="bg-yellow-500 text-xs line-clamp-none rounded-md font-semibold md:text-sm text-white p-2">
                            not replied
                          </span>
                        </TableCell>
                      )}

                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => toggleExpand(review._id)}
                        >
                          {expandedRows[review._id] ? "Collapse" : "Expand"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    <TableRow>
                      <TableCell colSpan={4} style={{ padding: 0 }}>
                        <Collapse
                          in={expandedRows[review._id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              margin: 2,
                              padding: 2,
                              border: "1px solid #ddd",
                              borderRadius: "10px",
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                            }}
                          >
                            <p>
                              <strong>User Comment:</strong> {review.comment}
                            </p>
                            <p>
                              <strong>Review At:</strong>{" "}
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            {!hasReply && (
                              <Button
                                variant="contained"
                                color={hasReply ? "secondary" : "primary"}
                                size="small"
                                sx={{ marginTop: 1 }}
                                onClick={() => openReplyModal(review)}
                              >
                                Reply
                              </Button>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reply Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <h3 className="text-lg mb-4">Reply to Review</h3>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Your Reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleReplySubmit}
            disabled={replyLoader}
          >
            {replyLoader ? "Processing..." : "Submit Reply"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Reviews;
