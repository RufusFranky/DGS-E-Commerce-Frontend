'use client'
 
import { Star, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/utils/api';
 
interface RatingModalProps {
  ratingModal: boolean | null; // keeps your existing type
  setRatingModal: (value: boolean | null) => void;
  productId: number; // new
  userId: string;    // new
  onReviewSubmitted: () => void; // callback to refresh reviews
}
 
const RatingModal: React.FC<RatingModalProps> = ({ ratingModal, setRatingModal, productId, userId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
 
  const handleSubmit = async () => {
    if (rating <= 0 || rating > 5) {
      toast.error('Please select a rating');
      return;
    }
    if (review.length < 5) {
      toast.error('Write a short review');
      return;
    }
 
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId,
          rating,
          review,
        }),
      });
 
      if (!res.ok) throw new Error('Failed to submit review');
 
      toast.success('Rating submitted successfully!');
      setRatingModal(false);
      setRating(0);
      setReview('');
 
      // Refresh reviews on the page
      onReviewSubmitted();
 
    } catch (err) {
      console.error(err);
      toast.error('Error submitting rating');
    }
  };
 
  if (!ratingModal) return null;
 
  return (
<div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
<div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
<button
          onClick={() => setRatingModal(false)}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
>
<XIcon size={20} />
</button>
 
        <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
 
        <div className='flex items-center justify-center mb-4'>
          {Array.from({ length: 5 }, (_, i) => (
<Star
              key={i}
              className={`size-8 cursor-pointer ${rating > i ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
              onClick={() => setRating(i + 1)}
            />
          ))}
</div>
 
        <textarea
          className='w-full p-2 border border-gray-300 text-black rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
          placeholder='Write your review'
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
 
        <button
          onClick={handleSubmit}
          className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition'
>
          Submit Rating
</button>
</div>
</div>
  );
};
 
export default RatingModal;