using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AmazonReviewExtractor.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(ILogger<ReviewController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{asin}")]
        public async Task<IEnumerable<Review>> GetReview(string asin)
        {
            WebScrapper scrapper = new WebScrapper(_logger);
            List<Review> reviews = await scrapper.ScrapReview(asin);
            return reviews.ToArray();
        }
    }
}