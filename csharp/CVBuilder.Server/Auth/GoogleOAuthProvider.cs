using CVBuilder.Contracts;
using CVBuilder.Contracts.Auth;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace CVBuilder.Server.Auth;

public class GoogleOAuthProvider : IOAuthProvider
{
    private readonly string _clientId;
    private readonly string _clientSecret;

    public OAuthProviderType ProviderType => OAuthProviderType.Google;
    public string Name => "Google";

    public GoogleOAuthProvider(IConfiguration configuration)
    {
        _clientId = configuration["OAuth:Google:ClientId"] ?? 
                   Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? 
                   throw new InvalidOperationException("Google Client ID is not configured");

        _clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ??
                       throw new InvalidOperationException("Google Client Secret is not configured in environment variables");
    }

    public async Task<OAuthUserInfo> ValidateTokenAsync(string accessToken)
    {
        using var httpClient = new HttpClient();
        
        // Set authorization header with the access token
        httpClient.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
        
        // Get user info with access token
        var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var userInfo = JsonDocument.Parse(content).RootElement;

        // Helper method to safely get property values
        string GetPropertySafely(string propertyName)
        {
            var value = userInfo.TryGetProperty(propertyName, out var property) 
                ? property.GetString() ?? string.Empty 
                : string.Empty;
            Console.WriteLine($"Google OAuth property {propertyName}: '{value}' (type: {value?.GetType()})");
            return value;
        }

        // Handle verified_email which can be boolean or string
        bool GetEmailVerified()
        {
            if (userInfo.TryGetProperty("verified_email", out var verifiedProp))
            {
                if (verifiedProp.ValueKind == JsonValueKind.True || verifiedProp.ValueKind == JsonValueKind.False)
                    return verifiedProp.GetBoolean();
                else if (verifiedProp.ValueKind == JsonValueKind.String)
                    return verifiedProp.GetString()?.ToLower() == "true";
            }
            return false;
        }

        return new OAuthUserInfo
        {
            ProviderUserId = GetPropertySafely("id"),
            Email = GetPropertySafely("email"),
            Name = GetPropertySafely("name"),
            Picture = GetPropertySafely("picture"),
            EmailVerified = GetEmailVerified(),
            RawClaims = new Dictionary<string, object>()
        };
    }

    public string GetAuthorizationUrl(string state, string redirectUri, string[] scopes)
    {
        var defaultScopes = new[] { "openid", "email", "profile" };
        var allScopes = scopes.Length > 0 ? scopes.Concat(defaultScopes).Distinct() : defaultScopes;
        
        var parameters = new List<string>
        {
            $"client_id={Uri.EscapeDataString(_clientId)}",
            $"redirect_uri={Uri.EscapeDataString(redirectUri)}",
            $"response_type=code",
            $"scope={Uri.EscapeDataString(string.Join(" ", allScopes))}",
            $"state={Uri.EscapeDataString(state)}",
            "access_type=offline",
            "prompt=consent"
        };

        var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth?{string.Join("&", parameters)}";
        Console.WriteLine($"Google OAuth redirect URI: {redirectUri}");
        Console.WriteLine($"Google OAuth auth URL: {authUrl}");
        
        return authUrl;
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
            "https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(parameters));

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var tokenResponse = System.Text.Json.JsonDocument.Parse(content);
        
        return tokenResponse.RootElement.GetProperty("access_token").GetString() 
               ?? throw new InvalidOperationException("Failed to obtain access token");
    }
}