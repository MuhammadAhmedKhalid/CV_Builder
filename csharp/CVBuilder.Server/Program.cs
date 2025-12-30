using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using CVBuilder.Contracts;
using Npgsql;

// Load environment variables from .env file
try
{
    Env.Load("../../.env"); // Load from root directory
}
catch
{
    Console.WriteLine("Warning: Could not load .env file");
}

// Enable dynamic JSON support for Npgsql (required for System.Text.Json dynamic serialization)
try
{
    NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();
    Console.WriteLine("Npgsql dynamic JSON enabled");
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: failed to enable Npgsql dynamic JSON: {ex.Message}");
}

var builder = WebApplication.CreateBuilder(args);

// Add logging
builder.Services.AddLogging();

builder.Services.AddControllers();

// Add DbContext with PostgreSQL
var dbConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
Console.WriteLine($"Database connection string configured: {!string.IsNullOrEmpty(dbConnectionString)}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        dbConnectionString,
        b => b.MigrationsAssembly("CVBuilder.Migrations")
    ));

// Enable CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add OpenAPI/Swagger
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    // Try to apply migrations
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        try
        {
            db.Database.Migrate();
            Console.WriteLine("Database migrations applied successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error applying migrations: {ex.Message}");
            Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
        }
    }
}

// Use CORS
app.UseCors();

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", async (AppDbContext db) =>
{
    try
    {
        await db.Database.ExecuteSqlRawAsync("SELECT 1");
        return Results.Ok(new { status = "healthy", database = "connected" });
    }
    catch (Exception ex)
    {
        return Results.Json(new { status = "unhealthy", error = ex.Message }, statusCode: 503);
    }
});

// Example endpoint
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}