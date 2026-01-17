using CVBuilder.Contracts;
using CVBuilder.Contracts.Auth;
using CVBuilder.Server.Auth;
using Microsoft.AspNetCore.Mvc;

namespace CVBuilder.Server.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AuthenticationService _authService;
    private readonly IOAuthProviderFactory _providerFactory;

    public AuthController(AuthenticationService authService, IOAuthProviderFactory providerFactory)
    {
        _authService = authService;
        _providerFactory = providerFactory;
    }

    /// <summary>
    /// Login with OAuth provider token
    /// </summary>
    [HttpPost("{provider}")]
    public async Task<IActionResult> LoginWithProvider(string provider, [FromBody] OAuthLoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Token))
            return BadRequest(new { error = "Token is required" });

        try
        {
            // Parse provider type
            if (!Enum.TryParse<OAuthProviderType>(provider, true, out var providerType))
            {
                return BadRequest(new { error = $"Unsupported provider: {provider}" });
            }

            // Check if provider is available
            if (!_providerFactory.IsProviderAvailable(providerType))
            {
                return BadRequest(new { error = $"Provider {provider} is not configured" });
            }

            // Authenticate user
            var result = await _authService.AuthenticateAsync(providerType, request.Token);

            return Ok(new { token = result.Token, user = result.User });
        }
        catch (Exception ex)
        {
            var innerError = ex.InnerException?.Message ?? ex.Message;
            Console.WriteLine($"OAuth login error: {innerError}");

            return StatusCode(500, new { error = innerError, type = ex.GetType().Name });
        }
    }

    /// <summary>
    /// Get available OAuth providers
    /// </summary>
    [HttpGet("providers")]
    public IActionResult GetAvailableProviders()
    {
        var providers = _providerFactory.GetAvailableProviders()
            .Select(p => new { name = p.ToString(), displayName = _providerFactory.GetProvider(p).Name });

        return Ok(providers);
    }

    /// <summary>
    /// Get authorization URL for OAuth flow
    /// </summary>
    [HttpGet("{provider}/authorize")]
    public IActionResult GetAuthorizationUrl(string provider, [FromQuery] string redirectUri, [FromQuery] string state, [FromQuery] string[] scopes)
    {
        try
        {
            if (!Enum.TryParse<OAuthProviderType>(provider, true, out var providerType))
            {
                return BadRequest(new { error = $"Unsupported provider: {provider}" });
            }

            if (!_providerFactory.IsProviderAvailable(providerType))
            {
                return BadRequest(new { error = $"Provider {provider} is not configured" });
            }

            var providerInstance = _providerFactory.GetProvider(providerType);
            var authUrl = providerInstance.GetAuthorizationUrl(state, redirectUri, scopes ?? Array.Empty<string>());

            return Ok(new { authorizationUrl = authUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

/// <summary>
/// Request body for OAuth login
/// </summary>
public record OAuthLoginRequest(string Token);