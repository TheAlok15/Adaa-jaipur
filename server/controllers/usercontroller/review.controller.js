import { Review } from "../../models/user/review.model.js";
import { Product } from "../../models/user/product.model.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        message: "Product ID and rating are required",
        success: false,
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;

     // Only authenticated users can add reviews
     if (!authenticatedUserId) {
      return res.status(401).json({
        message: "You must be logged in to add a review",
        success: false,
      });
    }
    

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const existingReview = await Review.findOne({
      productId,
      userDetails: authenticatedUserId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product",
        success: false,
      });
    }

    const review = new Review({
      productId,
      rating,
      comment,
      userDetails: authenticatedUserId,
    });

    await review.save();

    res.status(201).json({
      message: "Review added successfully",
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error in addReview:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const editReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;

    if (!reviewId) {
      return res.status(400).json({
        message: "Review ID is required",
        success: false,
      });
    }

    const authenticatedUserId = req.id || null;
    

     // Only authenticated users can edit their reviews
     if (!authenticatedUserId) {
      return res.status(401).json({
        message: "You must be logged in to edit a review",
        success: false,
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      userDetails: authenticatedUserId, // Ensure only the user who created the review can edit it
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you do not have permission to edit this review",
        success: false,
      });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
          success: false,
        });
      }
      review.rating = rating;
    }

    if (comment) {
      review.comment = comment;
    }

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error in editReview:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const viewReviews = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
      });
    }

    // If user is authenticated, populate their details in reviews
    const authenticatedUserId = req.id || null;
    const guestId = req.guestId || null; // Check for guest ID from the request

    const reviews = await Review.find({ productId }).populate(
      authenticatedUserId ? "userDetails" : guestId ? "guestId" :null ,
      "email" // Include user information if authenticated
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for this product",
        success: false,
      });
    }

    res.status(200).json({
      message: "Reviews retrieved successfully",
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error in viewReviews:", error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
