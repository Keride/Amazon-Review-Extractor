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
        private static readonly string[] Contents = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ReviewController> _logger;

        public ReviewController(ILogger<ReviewController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Review> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new Review
            {
                Date = DateTime.Now.AddDays(index),
                Title = "Test",
                Content = Contents[rng.Next(Contents.Length)],
                ASIN = "RDJDVNSDF",
                Rating = 5
            })
            .ToArray();
        }
    }
}