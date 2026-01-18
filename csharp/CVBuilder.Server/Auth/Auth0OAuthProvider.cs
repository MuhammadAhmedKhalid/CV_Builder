using CVBuilder.Contracts;
using CVBuilder.Contracts.Auth;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace CVBuilder.Server.Auth;

public class Auth0OAuthProvider : IOAuthProvider
{
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _domain;

    public OAuthProviderType ProviderType => OAuthProviderType.Auth0;
    public string Name => "Auth0";

    public Auth0OAuthProvider(IConfiguration configuration)
    {
        _clientId = configuration["OAuth:Auth0:ClientId"] ??
                   Environment.GetEnvironmentVariable("AUTH0_CLIENT_ID") ??
                   throw new InvalidOperationException("Auth0 Client ID is not configured");

        _clientSecret = Environment.GetEnvironmentVariable("AUTH0_CLIENT_SECRET") ??
                       throw new InvalidOperationException("Auth0 Client Secret is not configured in environment variables");

        _domain = configuration["OAuth:Auth0:Domain"] ??
                 Environment.GetEnvironmentVariable("AUTH0_DOMAIN") ??
                 throw new InvalidOperationException("Auth0 Domain is not configured");
    }

    public async Task<OAuthUserInfo> ValidateTokenAsync(string token)
    {
        using var httpClient = new HttpClient();
        
        // Set authorization header with the access token
        httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        
        // Validate token with Auth0 userinfo endpoint
        var response = await httpClient.GetAsync($"https://{_domain}/userinfo");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Auth0 userinfo response: {content}");
        var userInfo = JsonDocument.Parse(content).RootElement;

        // Helper method to safely get property values
        string GetPropertySafely(string propertyName)
        {
            return userInfo.TryGetProperty(propertyName, out var property) 
                ? property.GetString() ?? string.Empty 
                : string.Empty;
        }

        bool GetBooleanPropertySafely(string propertyName)
        {
            return userInfo.TryGetProperty(propertyName, out var property) 
                && property.GetBoolean();
        }

        return new OAuthUserInfo
        {
            ProviderUserId = GetPropertySafely("sub"),
            Email = GetPropertySafely("email"),
            Name = GetPropertySafely("name"),
            Picture = GetPropertySafely("picture"),
            EmailVerified = GetBooleanPropertySafely("email_verified"),
            RawClaims = new Dictionary<string, object>
            {
                ["sub"] = GetPropertySafely("sub"),
                ["aud"] = GetPropertySafely("aud"),
                ["iss"] = GetPropertySafely("iss")
            }
        };
    }

    public string GetAuthorizationUrl(string state, string redirectUri, string[] scopes)
    {
        var defaultScopes = new[] { "openid", "profile", "email" };
        var allScopes = scopes.Length > 0 ? scopes.Concat(defaultScopes).Distinct() : defaultScopes;

        var parameters = new List<string>
        {
            $"client_id={Uri.EscapeDataString(_clientId)}",
            $"redirect_uri={Uri.EscapeDataString(redirectUri)}",
            $"response_type=code",
            $"scope={Uri.EscapeDataString(string.Join(" ", allScopes))}",
            $"state={Uri.EscapeDataString(state)}",
            $"prompt=login"
        };

        return $"https://{_domain}/authorize?{string.Join("&", parameters)}";
    }

    public async Task<string> ExchangeCodeForTokenAsync(string code, string redirectUri)
    {
        using var httpClient = new HttpClient();
        
        var parameters = new Dictionary<string, string>
        {
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["code"] = code,
            ["grant_type"] = "authorization_code",
            ["redirect_uri"] = redirectUri
        };

        var response = await httpClient.PostAsync(
            $"https://{_domain}/oauth/token",
            new FormUrlEncodedContent(parameters));

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var tokenResponse = JsonDocument.Parse(content);
        
        return tokenResponse.RootElement.GetProperty("access_token").GetString()
               ?? throw new InvalidOperationException("Failed to obtain access token");
    }
}