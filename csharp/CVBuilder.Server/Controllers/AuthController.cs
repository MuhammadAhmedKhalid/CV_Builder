using CVBuilder.Contracts;           
using CVBuilder.Server.Auth;
using Microsoft.AspNetCore.Mvc;

namespace CVBuilder.Server.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly GoogleTokenValidator _googleValidator;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        var googleClientId = config["GOOGLE_CLIENT_ID"] ?? Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
        if (string.IsNullOrEmpty(googleClientId))
        {
            throw new InvalidOperationException("GOOGLE_CLIENT_ID is not configured");
        }
        _googleValidator = new GoogleTokenValidator(googleClientId);
        _jwtService = new JwtService(config);
    }

    /// <summary>
    /// Login with Google ID token
    /// </summary>
    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequest request)
    {
        if (string.IsNullOrEmpty(request.IdToken))
            return BadRequest(new { error = "IdToken is required" });

        try
        {
            // 1️ Validate Google ID token
            var payload = await _googleValidator.ValidateAsync(request.IdToken);

            // 2️ Upsert user in database
            var efTable = new EfTable<User>(_db);
            var user = await efTable.GetItemOrDefaultAsync(u => u.GoogleId == payload.Subject);

            if (user == null)
            {
                user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = Guid.NewGuid().ToString(),
                    Email = payload.Email!,
                    Name = payload.Name!,
                    Picture = payload.Picture ?? "",
                    GoogleId = payload.Subject,
                    CreatedAt = DateTime.UtcNow,
                    LastLoginAt = DateTime.UtcNow
                };
                await efTable.CreateItemAsync(user);
            }
            else
            {
                user.LastLoginAt = DateTime.UtcNow;
                await efTable.ReplaceItemAsync(user);
            }

            // 3️ Generate JWT token
            var token = _jwtService.GenerateToken(user.Id, user.Email, user.Name);

            // 4️ Convert DB user to API contract
            var userContract = user.ToContract();

            // 5️ Return token and user
            return Ok(new { token, user = userContract });
        }
        catch (Exception ex)
        {
            // Log the error server-side for debugging
            var innerError = ex.InnerException?.Message ?? ex.Message;
            Console.WriteLine($"Google login error: {innerError}");

            // Return JSON error to frontend
            return StatusCode(500, new { error = innerError, type = ex.GetType().Name });
        }
    }

}

/// <summary>
/// Request body for Google login
/// </summary>
public record GoogleLoginRequest(string IdToken);