"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL } from "@/utils/api";
import Rating from "@/app/componets/Rating";
import RatingModal from "@/app/componets/RatingModal";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  part_number: string;
  averageRating?: number;
  totalReviews?: number;
}

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  review: string;
}

interface OrderItem {
  productId: number;
}

interface Order {
  id: number;
  items: OrderItem[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const { addToCart } = useCart();
  const { user } = useUser();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [ratingModal, setRatingModal] = useState<boolean | null>(null);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        const res = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Fetch Reviews + Check Purchase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!productId) return;
        const res = await fetch(`${API_BASE_URL}/reviews/${productId}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    const checkPurchase = async () => {
      if (!user || !productId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/orders/user/${user.id}`);
        const orders = await res.json();

        const purchased = (orders as Order[]).some((order: Order) =>
          order.items.some(
            (item: OrderItem) => item.productId === Number(productId)
          )
        );

        setHasPurchased(purchased);
      } catch (err) {
        console.error("Error checking purchase:", err);
      }
    };

    fetchReviews();
    checkPurchase();
  }, [productId, user]);

  // Ask for review automatically after purchase
  useEffect(() => {
    if (!productId) return;
    const justPurchased = localStorage.getItem("justPurchasedProduct");
    if (justPurchased && Number(justPurchased) === Number(productId)) {
      setHasPurchased(true);
      toast.success("Please rate and review this product!");
      localStorage.removeItem("justPurchasedProduct");
    }
  }, [productId]);

  // Cart
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      part_number: product.part_number,
      quantity: 1,
    });

    toast.success("Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!product || !productId) return;

    addToCart({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      part_number: product.part_number,
      quantity: 1,
    });

    localStorage.setItem("justPurchasedProduct", productId.toString());
    router.push("/checkout");
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <main className="min-h-screen bg-gray-50 text-black py-10 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDE */}
          <div className="md:w-1/2 flex flex-col items-center">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />

            <div className="mt-4 flex gap-4 w-full">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:w-1/2 flex flex-col mt-3">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-2">Part No: {product.part_number}</p>
            <p className="text-gray-500 mb-2">{product.category}</p>
            <p className="text-blue-600 font-bold mb-4">₹{product.price}</p>
            <p className="text-gray-700 mb-4">{product.description}</p>

            <h2 className="text-xl font-semibold mb-3">Ratings & Reviews</h2>

            <div className="flex items-center gap-2 mb-4">
              <Rating value={product.averageRating || 0} />
              <span className="text-gray-600">
                ({product.totalReviews || reviews.length} reviews)
              </span>
            </div>

            <button
              onClick={() => setRatingModal(true)}
              disabled={!hasPurchased}
              className={`px-4 py-2 rounded-lg text-white transition ${
                hasPurchased
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Write a Review
            </button>

            {!hasPurchased && (
              <p className="text-red-500 text-sm mt-2">
                You must purchase this product to write a review.
              </p>
            )}

            <div className="mt-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b py-3">
                    <Rating value={review.rating} />
                    <p className="text-gray-700 mt-1">{review.review}</p>
                    <p className="text-sm text-gray-500">— {review.userName}</p>
                  </div>
                ))
              )}
            </div>

            <RatingModal
              ratingModal={ratingModal}
              setRatingModal={setRatingModal}
              productId={Number(productId)}
              userId={user?.id || ""}
              onReviewSubmitted={() => {
                fetch(`${API_BASE_URL}/reviews/${productId}`)
                  .then((res) => res.json())
                  .then((data) => setReviews(data))
                  .catch((err) => console.error(err));
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
