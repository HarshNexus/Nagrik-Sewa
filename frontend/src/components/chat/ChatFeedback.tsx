import React, { useState } from 'react';
import { Star, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { api } from '../../lib/api';
import { toast } from '../../hooks/use-toast';

interface ChatFeedbackProps {
  sessionId: string;
  onFeedbackSubmitted: () => void;
}

export const ChatFeedback: React.FC<ChatFeedbackProps> = ({ 
  sessionId, 
  onFeedbackSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    if (rating === 0 || wasHelpful === null) {
      toast({
        title: "Please rate your experience",
        description: "Rating and helpfulness are required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/chatbot/feedback', {
        sessionId,
        rating,
        feedback,
        wasHelpful
      });

      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our AI assistant.",
      });

      setTimeout(() => {
        onFeedbackSubmitted();
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-6 text-center">
        <div className="text-green-600 mb-2">
          <ThumbsUp className="w-8 h-8 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
        <p className="text-gray-600 text-sm">
          Your feedback has been submitted successfully.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">How was your chat experience?</h3>
      
      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate your experience:
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`p-1 rounded transition-colors ${
                star <= rating 
                  ? 'text-yellow-500' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Helpfulness */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Was the AI assistant helpful?
        </label>
        <div className="flex gap-3">
          <Button
            variant={wasHelpful === true ? "default" : "outline"}
            size="sm"
            onClick={() => setWasHelpful(true)}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            Yes, helpful
          </Button>
          <Button
            variant={wasHelpful === false ? "destructive" : "outline"}
            size="sm"
            onClick={() => setWasHelpful(false)}
            className="flex items-center gap-2"
          >
            <ThumbsDown className="w-4 h-4" />
            Not helpful
          </Button>
        </div>
      </div>

      {/* Additional Feedback */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional feedback (optional):
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us how we can improve..."
          rows={3}
          className="text-sm"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmitFeedback}
        disabled={rating === 0 || wasHelpful === null || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </>
        )}
      </Button>
    </Card>
  );
};
