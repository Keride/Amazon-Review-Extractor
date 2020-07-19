using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Html.Parser;
using Microsoft.Extensions.Logging;

namespace AmazonReviewExtractor
{
    public class WebScrapper
    {
        private readonly ILogger _logger;
        public WebScrapper(ILogger logger)
        {
            _logger = logger;
        }

        private string parseDate(string posAndDate)
        {
            CultureInfo enUS = new CultureInfo("en-US");
            var regex = new Regex(@"\b[a-zA-Z]+\b \d{1,2}, \d{4}\b");
            foreach (Match m in regex.Matches(posAndDate))
            {
                DateTime dt;
                if (DateTime.TryParseExact(m.Value, "MMMM d, yyyy", enUS, DateTimeStyles.None, out dt))
                    return dt.ToString("dd/MM/yyyy");
            }

            return "Unknown";
        }

        private int getRating(string classes)
        {
            var regex = new Regex(@"a-star-\d");
            foreach (Match m in regex.Matches(classes))
            {
                return m.Value[m.Value.Length - 1] - '0';
            }

            return 0;
        }

        public async Task<List<Review>> ScrapReview(string asin, int pageNumber = 0)
        {
            string base_url = "https://www.amazon.com/product-reviews/" + asin + "?sortBy=recent/pageNumber=" + pageNumber;

            _logger.LogInformation($"Scrapping {base_url}");

            List<Review> reviews = new List<Review>();

            var config = Configuration.Default.WithDefaultLoader();
            var context = BrowsingContext.New(config);
            var document = await context.OpenAsync(base_url);
            var reviewRows = document.QuerySelectorAll("[data-hook=review]");
            foreach (var row in reviewRows)
            {
                var review = new Review();
                review.Title = row.QuerySelector("[data-hook=review-title] span").InnerHtml;
                review.Date = parseDate(row.QuerySelector("[data-hook=review-date]").InnerHtml);
                review.Content = row.QuerySelector("[data-hook=review-body] span").InnerHtml;
                review.ASIN = asin;
                review.Rating = getRating(row.QuerySelector("[data-hook=review-star-rating]").ClassName); //a_star_X class

                reviews.Add(review);
            }

            if(reviews.Count != 0 && pageNumber < 5) //10 review per page -> we want 50
                reviews.AddRange(await ScrapReview(asin, pageNumber+1));
                
            return reviews;
        }

    }
}