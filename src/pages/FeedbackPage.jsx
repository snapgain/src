import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MessageSquare, Lightbulb, Bug, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const feedbackTypes = [
  { value: 'general', label: 'General Feedback', icon: MessageSquare },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb },
  { value: 'bug', label: 'Bug Report', icon: Bug },
  { value: 'praise', label: 'Compliment', icon: Heart }
];

function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    rating: 0,
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for your feedback! We appreciate your input.');
      setFormData({ name: '', email: '', type: '', rating: 0, feedback: '' });
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>feedback - SnapGain</title>
        <meta name="description" content="Share your feedback with SnapGain. Help us improve your cashback experience." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Feedback
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your feedback helps us build a better cashback experience. Share your thoughts, ideas, and suggestions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feedback Form */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-[#7D4DFB]" />
                    <span>Share Your Feedback</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name (Optional)</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Feedback Type</Label>
                      <Select value={formData.type} onValueChange={handleTypeChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                        <SelectContent>
                          {feedbackTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <type.icon className="h-4 w-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Overall Rating</Label>
                      <div className="flex items-center space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className={`p-1 transition-colors ${
                              star <= formData.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                        {formData.rating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {formData.rating} out of 5 stars
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="feedback">Your Feedback</Label>
                      <Textarea
                        id="feedback"
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="mt-1"
                        placeholder="Tell us what you think about SnapGain. What's working well? What could be improved? Any feature ideas?"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-600"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4" />
                          <span>Submit Feedback</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feedback Categories */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feedback Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedbackTypes.map((type) => (
                    <div key={type.value} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                        <type.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{type.label}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.value === 'general' && 'General thoughts and suggestions'}
                          {type.value === 'feature' && 'Ideas for new features'}
                          {type.value === 'bug' && 'Report issues or bugs'}
                          {type.value === 'praise' && 'Share what you love'}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Why Your Feedback Matters</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Every piece of feedback helps us understand how to make SnapGain better for you and all our users.
                    </p>
                    <p>
                      We read every submission and use your insights to prioritize improvements and new features.
                    </p>
                    <p>
                      Thank you for helping us build the best cashback comparison platform in the UK! 🇬🇧
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default FeedbackPage;