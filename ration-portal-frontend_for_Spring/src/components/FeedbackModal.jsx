import React, { useState } from 'react';

const FeedbackModal = ({ shopkeeperId, citizenEmail, onSubmit, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        await onSubmit({
            shopkeeperId,
            citizenEmail,
            rating,
            comments: comment
        });
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">

                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Distribution Complete!</h2>
                <p className="text-gray-500 text-sm mb-6">How was your experience today?</p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-10 w-10 transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'
                                    }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Any comments? (Optional)"
                    className="w-full p-3 border-2 border-gray-100 rounded-xl mb-6 text-sm focus:border-[#003D82] focus:outline-none resize-none bg-gray-50"
                    rows="3"
                ></textarea>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || submitting}
                        className="w-full py-3 bg-[#003D82] text-white rounded-xl font-bold text-sm hover:bg-[#002A5C] transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
                    >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
