using CVBuilder.Contracts;
using CVBuilder.Seeder.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using System.Text.Json;
using DotNetEnv;

namespace CVBuilder.Seeder
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Enable dynamic JSON support for Npgsql
            NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

            // Load .env file
            Env.Load(".env");

            var builder = Host.CreateApplicationBuilder(args);

            // Configure services
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(GetConnectionString()));

            var host = builder.Build();
            
            // Run seeder
            using var scope = host.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            
            try
            {
                await SeedTemplatesAsync(context, logger);
                Console.WriteLine("✅ Templates seeded successfully!");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Error seeding templates");
                Console.WriteLine($"❌ Error: {ex.Message}");
            }

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }

        static string GetConnectionString()
        {
            return Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ??
                   throw new InvalidOperationException("Database connection string not found.");
        }

        static async Task SeedTemplatesAsync(AppDbContext context, ILogger logger)
        {
            // Read templates from JSON file
            var jsonFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "data", "templates.json");
            
            if (!File.Exists(jsonFilePath))
            {
                throw new FileNotFoundException($"Templates file not found at: {jsonFilePath}");
            }

            var jsonContent = await File.ReadAllTextAsync(jsonFilePath);
            var templateData = JsonSerializer.Deserialize<List<TemplateData>>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (templateData == null || templateData.Count == 0)
            {
                Console.WriteLine("⚠️ No templates found in JSON file.");
                return;
            }

            var templates = templateData.Select(data => new CvTemplate
            {
                Id = data.Id,
                Name = data.Name,
                Description = data.Description,
                Tags = data.Tags ?? new List<string>(),
                HtmlContent = data.HtmlContent,
                Category = data.Category,
                IsActive = data.IsActive,
                CreatedAt = data.CreatedAt,
                UpdatedAt = data.UpdatedAt
            }).ToList();

            foreach (var template in templates)
            {
                var efTemplate = new EfItem<CvTemplate>
                {
                    Id = template.Id,
                    Content = template
                };

                context.CvTemplates.Update(efTemplate); // Update will insert or override as needed
                logger.LogInformation("Added template: {TemplateName}", template.Name);
            }

            await context.SaveChangesAsync();
            logger.LogInformation("Seeded {Count} templates", templates.Count);
        }
    }
}