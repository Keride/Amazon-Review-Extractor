using System;

namespace AmazonReviewExtractor
{
    public class Review
    {
        public string ASIN { get; set; }
        public string Date { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public int Rating { get; set; }
    }
}
