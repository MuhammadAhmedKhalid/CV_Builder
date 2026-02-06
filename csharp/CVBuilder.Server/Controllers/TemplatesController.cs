using CVBuilder.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CVBuilder.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TemplatesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTemplates()
        {
            var templates = await _context.CvTemplates
                .Where(t => t.Content.IsActive)
                .ToListAsync();

            return Ok(templates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTemplate(string id)
        {
            var template = await _context.CvTemplates
                .FirstOrDefaultAsync(t => t.Id == id && t.Content.IsActive);

            if (template == null)
            {
                return NotFound();
            }

            return Ok(template);
        }

        [HttpGet("preview/{id}")]
        public async Task<IActionResult> GetTemplatePreview(string id)
        {
            var template = await _context.CvTemplates
                .FirstOrDefaultAsync(t => t.Id == id && t.Content.IsActive);

            if (template == null)
            {
                return NotFound();
            }

            // Return HTML with sample data for preview
            var sampleData = new
            {
                name = "John Doe",
                email = "john.doe@example.com",
                phone = "(555) 123-4567",
                location = "New York, NY",
                linkedin = "linkedin.com/in/johndoe",
                summary = "Experienced professional with a proven track record of success.",
                experience = new[]
                {
                    new { title = "Senior Position", company = "Tech Company", period = "2020-Present", description = "Led teams and delivered results." }
                },
                education = new[]
                {
                    new { degree = "Bachelor's Degree", school = "University", period = "2016-2020" }
                },
                skills = new[] { "Leadership", "Communication", "Technical Skills" }
            };

            var processedHtml = template.Content.HtmlContent;
            
            // Replace placeholders with sample data
            processedHtml = processedHtml
                .Replace("{{name}}", sampleData.name)
                .Replace("{{email}}", sampleData.email)
                .Replace("{{phone}}", sampleData.phone)
                .Replace("{{location}}", sampleData.location)
                .Replace("{{linkedin}}", sampleData.linkedin)
                .Replace("{{summary}}", sampleData.summary);

            return Content(processedHtml, "text/html");
        }
    }
}